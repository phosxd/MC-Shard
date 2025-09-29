import {Vector3, BlockVolume} from '@minecraft/server';
import {Dictionary} from '../../Shard/CONST';
import {ShardModule} from '../../Shard/module';
import CommandEnums from './commandEnums';
import {ValueNoise} from './noise';


export interface Terrain {
    heighmaps: Array<TerrainHeightmap>,
};


export interface TerrainHeightmap {
    noiseType: string,
    minHeight: number,
    maxHeight: number,
    blockType: string,
};

const defaultTerrain: Dictionary<Terrain> = {
    test: {
        heighmaps: [
            {
                noiseType: 'value',
                minHeight: 2,
                maxHeight: 2,
                blockType: 'cobblestone',
            },
        ],
    },
};


export function generateTerrain(volume:BlockVolume, terrain:Terrain=defaultTerrain.test, seed:number=0) {
    for (const location of volume.getBlockLocationIterator()) {
        terrain.heighmaps.forEach(map => {
            const value = getNoiseValue(map.noiseType);
        })
    };
};


export function getNoiseValue(type:string,): number {
    switch (type)
}




// Instantiate Module.
export const Module = new ShardModule(
    {
        id: 'template',
        displayName: {translate:'shard.generator.displayName'},
        brief: {translate:'shard.generator.brief'},
        description: {translate:'shard.generator.description'},
    },
    {
        childPaths: [
            'cmd/generate',
        ],
        commandEnums: CommandEnums,
        settingElements: [
        ],
        extraDefaultPersisData: {}, // not ready
    },
);