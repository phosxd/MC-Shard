import {Dimension, Vector3, BlockVolume} from '@minecraft/server';
import {Dictionary} from '../../Shard/CONST';
import {ShardModule} from '../../Shard/module';
import {AddVector} from '../../util/vector';
import CommandEnums from './commandEnums';
import {mulberry32, Seed, RandomNoise, PerlinNoise} from './noise';


export interface Terrain {
    heightmaps: Array<TerrainHeightmap>,
};


export interface TerrainHeightmap {
    /**Noise method used to generate blocks.*/
    noiseType: string,
    /**Percentage of blocks to place (0-1). Placement positions are shared between all terrain layers using the same `integrityLayer`.*/
    integrity?: number,
    /**Integrity layer. By default `0`.*/
    integrityLayer?: number,
    /**Starting height override. By default `0`.*/
    startHeight?: number,
    /**The highest blocks can be placed.*/
    maxHeight: number,
    /**The minimum height.*/
    minHeight: number,
    /**Block type placed on the surface.*/
    surfaceBlock?: string,
    /**Block type placed from the bottom to the surface.*/
    fillBlock?: string,
    options?: {
        scale?: number,
    },
};

export const terrainPresets: Dictionary<Terrain> = {
    desertTest: {
        heightmaps: [
            {
                noiseType: 'random',
                integrity: 0.025,
                integrityLayer: 1, // cactus layer.
                startHeight: 4,
                maxHeight: 5,
                minHeight: 0,
                fillBlock: 'green_wool',
            },
            {
                noiseType: 'perlin',
                maxHeight: 8,
                minHeight: 2,
                startHeight: 3,
                surfaceBlock: 'sand',
                fillBlock: 'end_stone',
                options: {
                    scale: 0.05,
                },
            },
            {
                noiseType: 'random',
                maxHeight: 5,
                minHeight: 3,
                fillBlock: 'stone',
            },
        ],
    },
    hillTest: {
        heightmaps: [
            {
                noiseType: 'perlin',
                maxHeight: 20,
                minHeight: 0,
                startHeight: 4,
                fillBlock: 'dirt',
                surfaceBlock: 'grass_block',
                options: {
                    scale: 0.08,
                },
            },
            {
                noiseType: 'perlin',
                maxHeight: 20,
                minHeight: 0,
                fillBlock: 'stone',
                options: {
                    scale: 0.08,
                },
            },
            {
                noiseType: 'random',
                integrity: 0.4,
                maxHeight: 15,
                minHeight: 0,
                fillBlock: 'granite',
            },
        ],
    },
    deadlySpikes: {
        heightmaps: [
            {
                noiseType: 'perlin',
                maxHeight: 100,
                minHeight: 0,
                startHeight: 4,
                fillBlock: 'dirt',
                surfaceBlock: 'grass_block',
                options: {
                    scale: 0.09,
                },
            },
            {
                noiseType: 'perlin',
                maxHeight: 100,
                minHeight: 0,
                fillBlock: 'stone',
                options: {
                    scale: 0.09,
                },
            },
        ],
    },
};


export function* generateTerrain(dimension:Dimension, volume:BlockVolume, terrain:Terrain, seed:number=0) {
    const flatVolume = new BlockVolume(volume.from, {x:volume.to.x, y:volume.from.y, z:volume.to.z});
    // Iterate on all bottom layer locations.
    let iter = 0;
    for (const location of flatVolume.getBlockLocationIterator()) {
        iter += 1;
        const integrityLayers = {};
        // Remove all blocks in this column.
        dimension.fillBlocks(new BlockVolume(location, {x:location.x, y:volume.to.y, z:location.z}), 'air', {ignoreChunkBoundErrors:true});
        // Run each terrain heightmap.
        terrain.heightmaps.forEach(map => {
            const startHeight = (map.startHeight != undefined ? map.startHeight : 0);
            const integrity = (map.integrity != undefined ? map.integrity : 1);
            const integrityLayer = (map.integrityLayer != undefined ? map.integrityLayer : 0);
            const random = mulberry32(Seed(location.x, location.z, seed)+integrityLayer)();
            // Integrity.
            if (integrityLayers[integrityLayer] == undefined) {
                integrityLayers[integrityLayer] = random;
            };
            if (integrityLayers[integrityLayer] > integrity) {return};
            // Calculate height to place blocks at.
            const valueY = Math.max(
                (getNoiseValue(map.noiseType, location, seed, map.options) * map.maxHeight),
                map.minHeight-1,
            );
            const newLocation = {
                x: location.x,
                y: location.y + valueY + startHeight,
                z: location.z
            };
            if (newLocation.y > volume.to.y) {return};
            // Fill blocks in column.
            if (map.fillBlock) {
                dimension.fillBlocks(
                    new BlockVolume({x:location.x, y:volume.from.y +startHeight, z:location.z}, newLocation),
                    map.fillBlock,
                    {ignoreChunkBoundErrors:true},
                );
            };
            // Set surface block.
            if (map.surfaceBlock && dimension.getBlock(newLocation) != undefined) {
                dimension.setBlockType(newLocation, map.surfaceBlock);
            };
        });
        yield;
    };
};


export function getNoiseValue(type:string, location:Vector3, seed:number, options:Dictionary<any>): number {
    switch (type) {
        case 'random': {
            return RandomNoise.get(location.x, location.z, seed);
            break;
        };
        case 'perlin': {
            return PerlinNoise.get(location.x, location.z, seed, options.scale?options.scale:undefined);
            break;
        };
        default: {return 0};
    };
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
        ],
        commandEnums: CommandEnums,
        settingElements: [
        ],
        extraDefaultPersisData: {}, // not ready
    },
);