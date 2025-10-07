// Copyright (c) 2025 PhosXD

import {ShardModule} from '../../Shard/module';
import CommandEnums from './commandEnums';

export interface BlacklistItem {
    typeId: string,
    enchantments?: Array<string>,
};


// Instantiate Module.
export const Module = new ShardModule(
    {
        id: 'blacklist',
        displayName: {translate:'shard.blacklist.displayName'},
        brief: {translate:'shard.blacklist.brief'},
    },
    {
        childPaths: [
            'event/playerInventoryItemChange',
            'cmd/blacklist',
            'cmd/blacklistPreset',
            'form/editItem',
            'form/items',
        ],
        commandEnums: CommandEnums,
        extraDefaultPersisData: {
            items: {},
        },
    },
);