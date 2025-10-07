// Copyright (c) 2025 PhosXD

import {Dictionary, AlignedArea} from '../../Shard/CONST';
import {ShardModule} from '../../Shard/module';


export interface Region {
    name: string,
    dimensionId: string,
    area: AlignedArea,
    inverted: boolean,
    rules: Dictionary<RegionRule>,
};

export interface RegionRule {
    /**Event ID this rule acts upon.*/
    eventId: string,
    /**Entity tags to determine which entities this rule will affect.*/
    tags: {
        anyOf: Array<string>,
        allOf: Array<string>,
    },
    /**Block types this rule will affect.*/
    blockTypes: {
        anyOf: Array<string>,
        allOf: Array<string>,
    },
    /**Item types this rule will affect.*/
    itemTypes: {
        anyOf: Array<string>,
        allOf: Array<string>,
    },
    /**Command run when event is triggered.*/
    command: string,
    /**If true, will try to revert actions caused by the event. Not applicable to all events.*/
    revert: boolean,
};

export const commandEventIndexMap = [
    'tick',
    'entityTick',
    'entityEnter',
    'entityExit',
    'playerPlaceBlock',
    'playerBreakBlock',
    'playerInteractWithBlock',
    'playerDropItem',
    'playerUseItem',
    'explosion',
];




// Instantiate Module.
export const Module = new ShardModule(
    {
        id: 'region',
        displayName: {translate:'shard.region.displayName'},
        brief: {translate:'shard.region.brief'},
    },
    {
        enabledByDefault: false,
        childPaths: [
            'event/entityTick',
            'event/explosion',
            'event/itemUse',
            'event/playerBreakBlock',
            'event/playerInteractWithBlock',
            'event/playerPlaceBlock',
            'event/playerDropItem',
            'event/tick',
            'cmd/addRegion',
            'cmd/editRegion',
            'cmd/listRegions',
            'cmd/removeRegion',
            'form/edit',
            'form/editGeneral',
            'form/editRule',
            'form/rules',
        ],
        extraDefaultPersisData: {
            regions: {},
        },
    },
);