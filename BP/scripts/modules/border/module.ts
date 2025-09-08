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


export interface BorderStyle {
    type: 'none',//|'flat'|'particle'|'physical',
    name: string,
    styleFlat?: {
        color: RGBA,
    },
    styleParticle?: {
        particle: string,
    },
    stylePhysical?: {
        block: string,
        thickness: number,
    }
    renderOptions?: {
        visibleDistance: number, // "-1" is unlimited.
    },
};


// Default border styles.
export const defaultBorderStyles:Dictionary<BorderStyle> = {
    hidden: {
        type: 'none',
        name: 'hidden',
    },
};




// Instantiate Module.
export const Module = new ShardModule(
    {id:'border', displayName:{translate:'shard.border.displayName'}, brief:{translate:'shard.border.brief'}},
    {
        childPaths: [
            'event/tick',
            'cmd/addBorder',
            'cmd/listBorders',
            'cmd/removeBorder',
        ],
        extraDefaultPersisData: {
            borders: {},
            borderStyles: defaultBorderStyles,
        },
    },
);