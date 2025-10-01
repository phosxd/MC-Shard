import {Dimension, Vector3, BlockVolume} from '@minecraft/server';
import {Dictionary} from '../../Shard/CONST';
import {ShardModule} from '../../Shard/module';
import CommandEnums from './commandEnums';
import {mulberry32, Seed, RandomNoise, PerlinNoise, SimplexNoise} from './noise';


export interface Terrain {
    heightmaps: Array<TerrainHeightmap>,
};


export interface TerrainHeightmap {
    /**Noise method used to generate blocks. Noise values are shared between layers using the same `noiseLayer`.*/
    noiseType: 'solid'|'random'|'perlin'|'simplex',
    /**Noise layer. By default `0`.*/
    noiseLayer?: number,
    /**Percentage of blocks to place (0-1). Placement positions are shared between layers using the same `integrityLayer`.*/
    integrity?: number,
    /**Integrity layer. By default `0`.*/
    integrityLayer?: number,
    /**
     * Clearance area to check for blocks. If a block is found in the clearance area, will not place blocks.
    */
    clearanceArea?: {
        from: Vector3,
        to: Vector3,
    },
    /**
     * If true, minimum height is snapped to the highest block currently placed.
     * This ensures this layer fits nicely on top of previous layers.
    */
    snapToPreviousLayer?: boolean,
    /**Starting height override. By default `0`.*/
    startHeight?: number,
    /**The maximum height, or noise amplitude. Higher values return more exagerated terrain, lower values return more tame terrain.*/
    maxHeight: number,
    /**The minimum height.*/
    minHeight?: number,
    /**Block type placed on the surface.*/
    surfaceBlock?: string,
    /**Block type placed from the bottom to the surface.*/
    fillBlock?: string,

    /**Additional noise options.*/
    options?: {
        /**
         * The scale of the noise image. Lower values usually return smoother terrain.
         * By default `1`.
         * 
         * Applicable to:
         * - `perlin`
         * - `simplex`
        */
        scale?: number,
        /**
         * Determines whether or not to apply smoothing on the noise.
         * By default `0`.
         * 
         * Applicable to:
         * - all
        */
        smoothing?: number,
        /**
         * Filters out lower noise values by smoothing peaks.
         * By default `0`.
         * 
         * Applicable to:
         * - all
        */
        peakSmoothing?: number,
    },
};

export const terrainPresets: Dictionary<Terrain> = {
    desert: {
        heightmaps: [
            // Base.
            {
                noiseType: 'perlin',
                maxHeight: 10,
                minHeight: 2,
                fillBlock: 'stone',
                options: {
                    scale: 0.025,
                    smoothing: 1,
                }
            },
            // Surface.
            {
                noiseType: 'solid',
                snapToPreviousLayer: true,
                maxHeight: 1,
                fillBlock: 'sandstone',
            },
            {
                noiseType: 'solid',
                snapToPreviousLayer: true,
                maxHeight: 2,
                fillBlock: 'sand',
            },
            // Dead bushes.
            {
                noiseType: 'random',
                integrity: 0.01,
                integrityLayer: 1,
                snapToPreviousLayer: true,
                maxHeight: 1,
                minHeight: 1,
                fillBlock: 'deadbush',
            },
            // Cacti.
            {
                noiseType: 'random',
                integrity: 0.005,
                integrityLayer: 2,
                clearanceArea: {
                    from: {x:-1,y:0,z:-1},
                    to: {x:1,y:0,z:1},
                },
                snapToPreviousLayer: true,
                maxHeight: 4,
                minHeight: 2,
                fillBlock: 'cactus',
            },
            // Cactus flowers.
            {
                noiseType: 'random',
                integrity: 0.002,
                integrityLayer: 2,
                clearanceArea: {
                    from: {x:-1,y:0,z:-1},
                    to: {x:1,y:0,z:1},
                },
                snapToPreviousLayer: true,
                maxHeight: 1,
                minHeight: 1,
                fillBlock: 'cactus_flower',
            },
        ],
    },
    hills: {
        heightmaps: [
            // Base.
            {
                noiseType: 'simplex',
                maxHeight: 20,
                minHeight: 3,
                fillBlock: 'stone',
                options: {
                    scale: 0.009,
                    peakSmoothing: 0.5,
                },
            },
            // Surface.
            {
                noiseType: 'solid',
                snapToPreviousLayer: true,
                maxHeight: 4,
                fillBlock: 'dirt',
                surfaceBlock: 'grass_block',
            },
            // Grass decoration.
            {
                noiseType: 'solid',
                snapToPreviousLayer: true,
                integrity: 0.1,
                maxHeight: 0,
                minHeight: 0,
                surfaceBlock: 'short_grass',
            },
            {
                noiseType: 'solid',
                snapToPreviousLayer: true,
                integrity: 0.02,
                maxHeight: 0,
                minHeight: 0,
                surfaceBlock: 'tall_grass',
            },
            // Flowers.
            {
                noiseType: 'solid',
                snapToPreviousLayer: true,
                integrity: 0.005,
                maxHeight: 0,
                minHeight: 0,
                surfaceBlock: 'dandelion',
            },
            // Place air over the flower (to remove any tall grass).
            {
                noiseType: 'solid',
                snapToPreviousLayer: true,
                integrity: 0.005,
                maxHeight: 1,
                minHeight: 1,
                surfaceBlock: 'air',
            },
        ],
    },
    deadlySpikes: {
        heightmaps: [
            {
                noiseType: 'perlin',
                maxHeight: 100,
                minHeight: 2,
                startHeight: 6,
                fillBlock: 'dirt',
                surfaceBlock: 'grass_block',
                options: {
                    scale: 0.09,
                    peakSmoothing: 0.6,
                },
            },
            {
                noiseType: 'perlin',
                maxHeight: 6,
                minHeight: 2,
                startHeight: 7,
                fillBlock: 'dirt',
                surfaceBlock: 'grass_block',
                options: {
                    scale: 0.04,
                },
            },
            {
                noiseType: 'perlin',
                maxHeight: 100,
                minHeight: 6,
                fillBlock: 'stone',
                options: {
                    scale: 0.09,
                    peakSmoothing: 0.6,
                },
            },
        ],
    },
};




export function* generateTerrain(dimension:Dimension, volume:BlockVolume, terrain:Terrain, seed:number=0, speed:number=1) {
    const iterationsPerTick:number = speed*10;
    const flatVolume = new BlockVolume(volume.from, {x:volume.to.x, y:volume.from.y, z:volume.to.z});
    // Iterate on all bottom layer locations.
    let iter = 0;
    for (const location of flatVolume.getBlockLocationIterator()) {
        iter += 1;
        if (iter%iterationsPerTick == 0) {yield};
        const integrityLayers = {};
        // Remove all blocks in this column.
        dimension.fillBlocks(new BlockVolume(location, {x:location.x, y:volume.to.y, z:location.z}), 'air', {ignoreChunkBoundErrors:true});
        // Run each terrain heightmap.
        terrain.heightmaps.forEach(map => {
            const startHeight = (map.startHeight != undefined ? map.startHeight : 0);
            const minHeight = (map.minHeight != undefined ? map.minHeight : 0);
            const integrity = (map.integrity != undefined ? map.integrity : 1);
            const integrityLayer = (map.integrityLayer != undefined ? map.integrityLayer : 0);
            const noiseLayer = (map.noiseLayer != undefined ? map.noiseLayer : 0);

            // Integrity.
            if (integrityLayers[integrityLayer] == undefined) {
                const random = mulberry32(Seed(location.x, location.z, seed)+integrityLayer)();
                integrityLayers[integrityLayer] = random;
            };
            if (integrityLayers[integrityLayer] > integrity) {return};

            // Calculate height to place block with noise.
            let valueY = Math.max(
                (getNoiseValue(map.noiseType, volume, location, seed+noiseLayer, map.options) * map.maxHeight),
                 minHeight-1,
            );
            valueY = valueY + startHeight;
            // If snap mode on, merge with top block location.
            let baseY = startHeight;
            if (map.snapToPreviousLayer) {
                const top = dimension.getTopmostBlock({x:location.x, z:location.z}, volume.to.y);
                baseY += top.location.y+1;
            }
            // Otherwise, use volume bottom location.
            else {
                baseY += location.y;
            };
            // Finalize location.
            const newLocation = {
                x: location.x,
                y: Math.min(baseY+valueY, volume.to.y), // Snap to highest allowed height if larger.
                z: location.z
            };

            // Check clearance.
            if (map.clearanceArea) {
                const from = map.clearanceArea.from;
                const to = map.clearanceArea.to;
                const clearanceVolume = new BlockVolume(
                    {x:newLocation.x+from.x, y:baseY+from.y, z:newLocation.z+from.z},
                    {x:newLocation.x+to.x, y:newLocation.y+to.y, z:newLocation.z+to.z},
                );
                const areaObstructed = dimension.containsBlock(clearanceVolume, {excludeTypes:['air']}, true);
                if (areaObstructed) {return};
            };
            // Set fill blocks.
            if (map.fillBlock) {
                dimension.fillBlocks(
                    new BlockVolume({x:location.x, y:baseY, z:location.z}, newLocation),
                    map.fillBlock,
                    {ignoreChunkBoundErrors:true},
                );
            };
            // Set surface block.
            if (map.surfaceBlock && dimension.getBlock(newLocation) != undefined) {
                dimension.setBlockType(newLocation, map.surfaceBlock);
            };
        });
    };
};


export const relativeNeighbors2d = Object.freeze([
    {x:1,y:0}, {x:0,y:1},
    {x:1,y:1}, {x:-1,y:1},
    {x:-1,y:0}, {x:0, y:-1},
    {x:-1, y:-1}, {x:1,y:-1},
]);
export function getNoiseValue(type:string, operatingArea:BlockVolume, location:Vector3, seed:number, options:Dictionary<any>): number {
    const smoothing = (options?.smoothing != undefined ? options.smoothing : 0);
    const peakSmoothing = (options?.peakSmoothing != undefined ? options.peakSmoothing : 0);
    let value: number;
    
    switch (type) {
        case 'solid': {
            return 1;
        };
        case 'random': {
            value = RandomNoise.get(location.x, location.z, seed);
            break;
        };
        case 'perlin': {
            value = PerlinNoise.get(
                location.x + Math.abs(operatingArea.from.x),
                location.z + Math.abs(operatingArea.from.z),
                seed,
                options.scale?options.scale:undefined,
            );
            break;
        };
        case 'simplex': {
            value = SimplexNoise.get(
                location.x + Math.abs(operatingArea.from.x),
                location.z + Math.abs(operatingArea.from.z),
                seed,
                options.scale?options.scale:undefined,
            );
            break;
        };
        default: {return 0};
    };

    // Smoothing.
    if (smoothing > 0) {
        let newOptions = Object.assign({}, options);
        newOptions.smoothing = 0;
        let sum = value;
        // Iterate on all neighbors
        relativeNeighbors2d.forEach(vector => {
            const neighborValue = getNoiseValue(type, operatingArea, {x:location.x+vector.x, y:location.y, z:location.z+vector.y}, seed, newOptions);
            sum += neighborValue;
        });
        value = sum / (relativeNeighbors2d.length+1);
    };

    // Peak smoothing.
    if (peakSmoothing > 0) {
        let newOptions = Object.assign({}, options);
        newOptions.peakSmoothing = 0;
        // Iterate on cardinal neighbors.
        relativeNeighbors2d.forEach(vector => {
            const neighborValue = getNoiseValue(type, operatingArea, {x:location.x+vector.x, y:location.y, z:location.z+vector.y}, seed, newOptions);
            value -= Math.abs(value-neighborValue)*peakSmoothing;
        });
    };

    return value;
};




// Instantiate Module.
export const Module = new ShardModule(
    {
        id: 'generator',
        displayName: {translate:'shard.generator.displayName'},
        brief: {translate:'shard.generator.brief'},
        description: {translate:'shard.generator.description'},
    },
    {
        childPaths: [
            'cmd/forEachBlock',
            'cmd/generate',
            'cmd/addTerrain',
            'cmd/removeTerrain',
        ],
        commandEnums: CommandEnums,
        settingElements: [
        ],
        defaultProperties: {
            terrain: {},
        },
    },
);