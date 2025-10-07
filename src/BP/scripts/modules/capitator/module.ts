// Copyright (c) 2025 PhosXD

import {ShardModule} from '../../Shard/module';


// Instantiate Module.
export const Module = new ShardModule(
    {
        id: 'capitator',
        displayName: {translate:'shard.capitator.displayName'},
        brief: {translate:'shard.capitator.brief'},
        description: {translate:'shard.capitator.description'},
    },
    {
        enabledByDefault: false,
        childPaths: [
            'event/playerBreakBlock',
        ],
        settingElements: [
            {type:'toggle', id:'requireSneak', data:{display:{translate:'shard.capitator.setting.requireSneak'}, defaultValue:true}},
            {type:'toggle', id:'doTrees', data:{display:{translate:'shard.capitator.setting.doTrees'}, defaultValue:true}},
            {type:'toggle', id:'doOres', data:{display:{translate:'shard.capitator.setting.doOres'}, defaultValue:true}},
        ],
    },
);