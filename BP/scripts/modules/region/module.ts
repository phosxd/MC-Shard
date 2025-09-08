import {Dictionary, AlignedArea} from '../../Shard/CONST';
import {ShardModule} from '../../Shard/module';


export interface Region {
    name: string,
    dimensionId: string,
    area: AlignedArea,
    inverted: boolean,
    commands: Dictionary<RegionCommand>,
};

export interface RegionCommand {
    event: string,
    command: string,
};

export const commandEventIndexMap = [
    'tick',
    'tickEntity',
    'onEnter',
    'onExit',
];




// Instantiate Module.
export const Module = new ShardModule(
    {
        id: 'region',
        displayName: {translate:'shard.region.displayName'},
        brief: {translate:'shard.region.brief'},
    },
    {
        childPaths: [
            'event/tick',
            'cmd/addRegion',
            'cmd/editRegion',
            'cmd/listRegions',
            'cmd/removeRegion',
            'form/addCommand',
            'form/commands',
            'form/edit',
            'form/editCommand',
            'form/editGeneral',
        ],
        extraDefaultPersisData: {
            regions: {},
        },
    },
);