// Copyright (c) 2025 PhosXD

import {ShardModule} from '../../Shard/module';
import CommandEnums from './commandEnums';


// Instantiate Module.
export const Module = new ShardModule(
    {
        id: 'util',
        displayName: {translate:'shard.util.displayName'},
        brief: {translate:'shard.util.brief'},
    },
    {
        childPaths: [
            'event/entityDie',
            'event/tick',
            'cmd/a',
            'cmd/c',
            'cmd/despawn',
            'cmd/disenchant',
            'cmd/drain',
            'cmd/dupe',
            'cmd/durability',
            'cmd/eat',
            'cmd/enflame',
            'cmd/explode',
            'cmd/freeze',
            'cmd/heal',
            'cmd/inventory',
            'cmd/inventoryList',
            'cmd/push',
            'cmd/pushchat',
            'cmd/rename',
            'cmd/repair',
            'cmd/s',
            'cmd/setslot',
            'cmd/p',
            'cmd/thru',
            'cmd/up',
            'cmd/top',
        ],
        commandEnums: CommandEnums,
        extraDefaultPersisData: {
            frozenEntities: {},
            inventoryIds: {},
        },
    },
);
