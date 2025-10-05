import {Dimension, Vector3, BlockVolume} from '@minecraft/server';
import {Dictionary} from '../../Shard/CONST';
import {ShardModule} from '../../Shard/module';
import CommandEnums from './commandEnums';
import {mulberry32, Seed, RandomNoise, PerlinNoise, SimplexNoise} from './noise';
import {Blend, AssumeNamespace} from '../../Shard/util';


export interface TerrainReference {
    id: string,
};


export interface HeightmapNoise {
    /**
     * Noise method used. Values are shared between noise using the same `type` & `layer`.
     * 
     * random:
     * - Random noise values, randomly selects a point between min/max height.
     * 
     * perlin:
     * - Smooth-like noise, more isolated islands & noticeable patterns.
     * 
     * simplex:
     * - Continuous smooth noise.
    */
    type: 'random'|'perlin'|'simplex',
    /**
     * Noise layer.
     * By default `0`.
    */
    layer?: number,
    /**
     * How exagerated the noise values are.
     * Keep in mind noise values range from 0 to 1, amplitude multiplies those values value.
     * By default `1`.
    */
    amplitude?: number,
    /**
     * The scale of the noise image. The lower this value is, the more that smaller details become large.
     * The higher this value is, the more details that are packed into a smaller area.
     * By default `1`.
    */
    scale?: number,
    /**
     * Noise values (before amplification) below this value are set to 0.
    */
    threshold?: number,
    /**
     * Isolates higher values by making lower values exponentially lower.
     * As a side effect, overall value is lowered.
     * By default `0`.
    */
    flooring?: number,
    /**
     * The same as `flooring`, but also takes in account direct neighbor values.
     * By default `0`.
    */
    neighborizedFlooring?: number,
};


export interface Heightmap {
    /**
     * Layer name. Used for referencing in merge layers.
     * If undefined, layer index is used as name.
    */
    name?: string,
    /**
     * Noise images that are applied one after another.
     * This affects the shape & pattern of the generated terrain.
     * If unspecifed, blocks are generated to `maxHeight`.
    */
    noiseArray?: Array<{
        /**How much to blend this noise value with the currently constructed noise.
         * `1` means this noise value is fully preserved, `0` means this noise value will match the currently constructed noise.
         * By default `1`.
        */
        blendRatio?: number,
        noise: HeightmapNoise,
    }>,
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
     * The value this heightmap's value will add.
     * By default "none".
     * 
     * previousLayer:
     * - Minimum height is snapped to the previous layer.
     * - Does not snap to blocks not placed by the previous layer.
     * 
     * previousLayerExposed:
     * - Same as "previousLayer" except only places on blocks that are top exposed.
     * 
     * previousLayerNotExposed:
     * - Same as "previousLayer" except only places on blocks that are not top exposed.
     * 
     * highestPoint:
     * - Minimum height is snapped to the highest block currently placed.
     * - This ensures this layer fits nicely on top of previous layers.
    */
    mergeMode?: 'none'|'previousLayer'|'previousLayerExposed'|'previousLayerNotExposed'|'highestPoint',
    /**
     * Works in conjunction with `mergeMode`. Only applicable when `mergeMode` is a "previousLayer" mode.
    */
    mergeLayer?: string,
    /**
     * Starting height. Min/max height build from this value.
     * By default `1`.
    */
    startHeight?: number,
    /**
     * The maximum height. If `noiseArray` returns a value too high, it is capped to `maxHeight` blocks.
    */
    maxHeight: number,
    /**
     * The minimum height. If 0 no blocks are placed.
     * By default `1`.
    */
    minHeight?: number,
    /**
     * Block types this heightmap's blocks can be placed on.
    */
    canPlaceOn?: Array<string>,
    /**
     * Block types this heightmap's blocks can be replace.
    */
    canReplace?: Array<string>,
    /**Block type placed on the surface.*/
    surfaceBlock?: string,
    /**Block type placed from the bottom to the surface.*/
    fillBlock?: string,
};


export function GetTerrain(id:string): Array<Heightmap|TerrainReference> {
    const allCustomTerrain = Module.getProperty('terrain');
    let terrain = allCustomTerrain[id];
    if (!allCustomTerrain[id]) {terrain = terrainPresets[id]};
    return Object.assign([],terrain);
};


export const terrainPresets: Dictionary<Array<Heightmap|TerrainReference>> = {
    plainsOverlay: [
        // Surface.
        {
            name: 'plainsOverlay-1',
            mergeMode: 'highestPoint',
            maxHeight: 4,
            fillBlock: 'dirt',
            surfaceBlock: 'grass_block',
            canReplace: ['air'],
        },
        // Grass decoration.
        {
            mergeMode: 'previousLayer',
            mergeLayer: 'plainsOverlay-1',
            integrity: 0.1,
            maxHeight: 1,
            minHeight: 1,
            surfaceBlock: 'short_grass',
            canPlaceOn: ['grass_block'],
        },
        {
            mergeMode: 'previousLayer',
            mergeLayer: 'plainsOverlay-1',
            integrity: 0.02,
            maxHeight: 1,
            minHeight: 1,
            surfaceBlock: 'tall_grass',
            canPlaceOn: ['grass_block'],
        },
        // Flowers.
        {
            mergeMode: 'previousLayer',
            mergeLayer: 'plainsOverlay-1',
            integrity: 0.005,
            maxHeight: 1,
            surfaceBlock: 'dandelion',
            canPlaceOn: ['grass_block'],
        },
        // Place air over the flower (to remove any tall grass).
        {
            mergeMode: 'previousLayer',
            mergeLayer: 'plainsOverlay-1',
            integrity: 0.005,
            maxHeight: 1,
            minHeight: 1,
            startHeight: 2,
            surfaceBlock: 'air',
            canPlaceOn: ['dandelion'],
        },
    ],
    desertOverlay: [
        // Surface.
        {
            mergeMode: 'highestPoint',
            maxHeight: 2,
            fillBlock: 'sandstone',
        },
        {
            mergeMode: 'highestPoint',
            maxHeight: 3,
            fillBlock: 'sand',
        },
        // Dead bushes.
        {
            integrity: 0.01,
            integrityLayer: 1,
            mergeMode: 'highestPoint',
            maxHeight: 1,
            minHeight: 1,
            surfaceBlock: 'deadbush',
            canPlaceOn: ['sand'],
        },
        // Cacti.
        {
            noiseArray: [
                {noise: {
                    type: 'random',
                    amplitude: 4,
                }},
            ],
            integrity: 0.006,
            integrityLayer: 2,
            clearanceArea: {
                from: {x:-1,y:0,z:-1},
                to: {x:1,y:0,z:1},
            },
            mergeMode: 'highestPoint',
            maxHeight: 4,
            minHeight: 2,
            startHeight: 1,
            fillBlock: 'cactus',
            canPlaceOn: ['sand'],
        },
        // Cactus flowers.
        {
            integrity: 0.003,
            integrityLayer: 2,
            clearanceArea: {
                from: {x:-1,y:0,z:-1},
                to: {x:1,y:0,z:1},
            },
            mergeMode: 'highestPoint',
            maxHeight: 1,
            minHeight: 1,
            startHeight: 1,
            surfaceBlock: 'cactus_flower',
            canPlaceOn: ['cactus'],
        },
    ],
    snowOverlay: [
        // Surface.
        {
            mergeMode: 'highestPoint',
            maxHeight: 4,
            fillBlock: 'dirt',
            surfaceBlock: 'grass_block',
        },
        // Snow decoration.
        {
            mergeMode: 'highestPoint',
            maxHeight: 1,
            surfaceBlock: 'snow',
            canPlaceOn: ['grass_block'],
        },
        {
            mergeMode: 'highestPoint',
            integrity: 0.02,
            maxHeight: 1,
            surfaceBlock: 'snow_layer',
            canPlaceOn: ['snow', 'grass_block'],
        },
    ],
    desert: [
        // Base.
        {
            noiseArray: [
                {noise: {
                    type: 'simplex',
                    amplitude: 8,
                    scale: 0.009,
                }},
            ],
            maxHeight: 10,
            minHeight: 2,
            startHeight: 0,
            fillBlock: 'stone',
        },
        {id: 'desertOverlay'},
    ],
    hills: [
        // Ground level.
        {
            noiseArray: [
                {noise: {
                    type: 'simplex',
                    amplitude: 20,
                    scale: 0.009,
                    neighborizedFlooring: 0.5,
                }},
            ],
            maxHeight: 20,
            minHeight: 3,
            startHeight: 0,
            fillBlock: 'stone',
        },
        {id: 'plainsOverlay'},
    ],
    extremeHills: [
        // Ground level.
        {
            noiseArray: [
                {noise: {
                    type: 'simplex',
                    amplitude: 30,
                    scale: 0.009,
                    neighborizedFlooring: 0.6,
                }},
            ],
            maxHeight: 30,
            minHeight: 3,
            startHeight: 0,
            fillBlock: 'stone',
        },
        {id: 'plainsOverlay'},
    ],
    divots: [
        // Ground level.
        {
            noiseArray: [
                {noise: {
                    type: 'simplex',
                    amplitude: 25,
                    scale: 0.009,
                    neighborizedFlooring: 0.5,
                }},
            ],
            maxHeight: 12,
            minHeight: 3,
            startHeight: 0,
            fillBlock: 'stone',
        },
        {id: 'plainsOverlay'},
    ],
    deadlySpikes: [
        // Base.
        {
            noiseArray: [
                // Ground.
                {noise: {
                    type: 'perlin',
                    amplitude: 50,
                    scale: 0.05,
                }},
                // Spikes.
                {blendRatio:0.75, noise: {
                    type: 'perlin',
                    amplitude: 100,
                    scale: 0.09,
                    neighborizedFlooring: 0.6,
                }},
            ],
            maxHeight: 100,
            minHeight: 1,
            startHeight: 0,
            fillBlock: 'stone',
        },
        // Overlay
        {id: 'plainsOverlay'},
    ],
    sparseRocks: [
        // Ground.
        {
            name: 'sr-ground',
            noiseArray: [
                {noise: {
                    type: 'simplex',
                    amplitude: 8,
                    scale: 0.015,
                }},
            ],
            maxHeight: 10,
            startHeight: 0,
            fillBlock: 'stone',
        },
        {id: 'plainsOverlay'},
        // Rocks.
        {
            noiseArray: [
                {noise: {
                    type: 'perlin',
                    amplitude: 100,
                    scale: 0.03,
                    threshold: 0.72,
                }},
            ],
            mergeMode: 'previousLayer',
            mergeLayer: 'sr-ground',
            maxHeight: 90,
            startHeight: 1,
            fillBlock: 'stone',
        },
    ],
};




export function* generateTerrain(dimension:Dimension, volume:BlockVolume, terrain:Array<any>, seed:number=0, speed:number=1) {
    const iterationsPerTick:number = speed*10;
    const flatVolume = new BlockVolume(volume.from, {x:volume.to.x, y:volume.from.y, z:volume.to.z});
    // Iterate on all bottom layer locations.
    let iter = 0;
    for (const location of flatVolume.getBlockLocationIterator()) {
        iter += 1;
        if (iter%iterationsPerTick == 0) {yield};
        // Remove all blocks in this column.
        dimension.fillBlocks(new BlockVolume(location, {x:location.x, y:volume.to.y, z:location.z}), 'air', {ignoreChunkBoundErrors:true});
        // Set up data.
        const terrainBuffer = Object.assign([],terrain);
        const integrityLayers = {};
        const heightmapValues = {};
        // Run each terrain item.
        let index = -1;
        while (terrainBuffer.length > 0) {
            index += 1;
            const map = terrainBuffer[0];
            terrainBuffer.shift();
            // If is a reference, add the referenced objects to the buffer.
            if (map.id) {
                const itemsToAdd = GetTerrain(map.id);
                let i = 0;
                itemsToAdd.forEach(item => {
                    terrainBuffer.splice(i, 0, item);
                    i += 1;
                });
                continue;
            };
            const name = (map.name != undefined ? map.name : String(index));
            const startHeight = (map.startHeight != undefined ? map.startHeight : 1);
            const minHeight = (map.minHeight != undefined ? map.minHeight : 1);
            const integrity = (map.integrity != undefined ? map.integrity : 1);
            const integrityLayer = (map.integrityLayer != undefined ? map.integrityLayer : 0);
            const mergeLayer = (map.mergeLayer != undefined ? map.mergeLayer : index);

            // Integrity.
            if (integrityLayers[integrityLayer] == undefined) {
                const random = mulberry32(Seed(location.x, location.z, seed)+integrityLayer)();
                integrityLayers[integrityLayer] = random;
            };
            if (integrityLayers[integrityLayer] > integrity) {continue};

            // Calculate height to place block with noise.
            let valueY:number = 0;
            if (map.noiseArray) {
                // Add all noise images.
                map.noiseArray.forEach(item => {
                    const noise = item.noise;
                    const noiseLayer = (noise.layer != undefined ? noise.layer : 0);
                    const blendRatio = item.blendRatio != undefined ? item.blendRatio : 1;
                    const options = {
                        scale: noise.scale,
                        threshold: noise.threshold,
                        flooring: noise.flooring,
                        neighborizedFlooring: noise.neighborizedFlooring,
                    };
                    let value = Math.max(
                        (getNoiseValue(noise.type, volume, location, mulberry32(seed+(noiseLayer*4))(), options) * noise.amplitude),
                        minHeight,
                    );
                    valueY = Blend(value, valueY, blendRatio); // Blend with `valueY`.
                });
            }
            else {valueY = map.maxHeight};
            if (valueY <= 0) {continue};
            valueY = Math.min(valueY, map.maxHeight);
            let baseY = startHeight;
            // Location merge modes.
            if (map.mergeMode == 'highestPoint') {
                const top = dimension.getTopmostBlock({x:location.x, z:location.z}, volume.to.y);
                baseY += top.location.y;
            }
            else if (map.mergeMode == 'previousLayer' && Object.keys(heightmapValues).length > 0) {
                baseY += heightmapValues[mergeLayer];
            }
            else if ((map.mergeMode == 'previousLayerExposed' || map.mergeMode == 'previousLayerNotExposed') && Object.keys(heightmapValues).length > 0) {
                let top = heightmapValues[mergeLayer];
                if (dimension.getBlock({x:location.x, y:top, z:location.z})?.above()?.isAir == (map.mergeMode == 'previousLayerNotExposed')) {top = location.y};
                baseY += top;
            }
            // Otherwise, use volume bottom location.
            else {
                baseY += location.y;
            };
            // Finalize location.
            const newLocation = {
                x: location.x,
                y: Math.min(baseY+(valueY-1), volume.to.y), // Snap to highest allowed height if larger.
                z: location.z
            };
            heightmapValues[name] = newLocation.y;

            // Check clearance.
            if (map.clearanceArea) {
                const from = map.clearanceArea.from;
                const to = map.clearanceArea.to;
                const clearanceVolume = new BlockVolume(
                    {x:newLocation.x+from.x, y:baseY, z:newLocation.z+from.z},
                    {x:newLocation.x+to.x, y:newLocation.y+to.y, z:newLocation.z+to.z},
                );
                const areaObstructed = dimension.containsBlock(clearanceVolume, {excludeTypes:['air']}, true);
                if (areaObstructed) {continue};
            };
            // Check placeable blocks.
            if (map.canPlaceOn) {
                let matched = false;
                const blockPlacingOn = dimension.getBlock({x:location.x, y:baseY-1, z:location.z});
                if (blockPlacingOn != undefined) {
                    map.canPlaceOn.forEach(blockType => {
                        blockType = AssumeNamespace(blockType);
                        if (blockType == blockPlacingOn.typeId) {matched = true};
                    });
                    if (!matched) {continue};
                };
            };
            // Set fill blocks.
            if (map.fillBlock) {
                dimension.fillBlocks(
                    new BlockVolume({x:location.x, y:baseY, z:location.z}, newLocation),
                    map.fillBlock,
                    {
                        ignoreChunkBoundErrors: true,
                        blockFilter: {
                            includeTypes: map.canReplace,
                        },
                    },
                );
            };
            const currentBlock = dimension.getBlock(newLocation);
            // Set surface block.
            if (map.surfaceBlock && currentBlock != undefined) {
                let canPlace = true;
                // Check replaceable blocks.
                if (map.canReplace && !map.fillBlock) {
                    if (!map.canReplace.includes(AssumeNamespace(currentBlock.typeId))) {canPlace = false};
                };
                if (canPlace) {dimension.setBlockType(newLocation, map.surfaceBlock)};
            };
        };
    };
};


export const relativeNeighbors2d = Object.freeze([
    {x:1,y:0}, {x:0,y:1},
    {x:1,y:1}, {x:-1,y:1},
    {x:-1,y:0}, {x:0, y:-1},
    {x:-1, y:-1}, {x:1,y:-1},
]);
export function getNoiseValue(type:string, operatingArea:BlockVolume, location:Vector3, seed:number, options:Dictionary<any>): number {
    const threshold = (options?.threshold != undefined ? options.threshold : 0);
    const flooring = (options?.flooring != undefined ? options.flooring : 0);
    const neighborizedFlooring = (options?.neighborizedFlooring != undefined ? options.neighborizedFlooring : 0);
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
                location.x,
                location.z,
                seed,
                options.scale?options.scale:undefined,
            );
            break;
        };
        case 'simplex': {
            value = SimplexNoise.get(
                location.x,
                location.z,
                seed,
                options.scale?options.scale:undefined,
            );
            break;
        };
        default: {return 0};
    };

    // Flooring.
    if (flooring > 0) {
        value -= value*flooring;
    };

    // Neighborized flooring.
    if (neighborizedFlooring > 0) {
        let newOptions = Object.assign({}, options);
        newOptions.neighborizedFlooring = 0;
        // Iterate on all neighbors.
        relativeNeighbors2d.forEach(vector => {
            const neighborValue = getNoiseValue(type, operatingArea, {x:location.x+vector.x, y:location.y, z:location.z+vector.y}, seed, newOptions);
            value -= Math.abs(value-neighborValue)*neighborizedFlooring;
        });
    };

    // Threshold.
    if (value < threshold) {return 0};

    return value-threshold;
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