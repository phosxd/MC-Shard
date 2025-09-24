import {RGBA} from '@minecraft/server';
import {Dictionary, AlignedArea} from '../../Shard/CONST';
import {ShardModule} from '../../Shard/module';


export interface Border {
    name: string,
    dimensionId: string,
    area: AlignedArea,
    inverted: boolean,
    styleId: string,
    damage: number, // How much damage entities take when outside the border.
};


// Instantiate Module.
export const Module = new ShardModule(
    {
        id: 'border',
        displayName: {translate:'shard.border.displayName'},
        brief: {translate:'shard.border.brief'},
    },
    {
        enabledByDefault: false,
        childPaths: [
            'event/tick',
            'cmd/addBorder',
            'cmd/listBorders',
            'cmd/removeBorder',
        ],
        extraDefaultPersisData: {
            borders: {},
        },
    },
);