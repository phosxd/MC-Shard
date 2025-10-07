// Copyright (c) 2025 PhosXD

import {ShardModule} from '../../Shard/module';
import CommandEnums from './commandEnums';


// Instantiate Module.
export const Module = new ShardModule(
    {
        id: 'template',
        displayName: {text:'[Template]'},
        brief: {text:'Module template.'},
        description: {text:'Detailed information about this module template. It\'s a template for a module. Who would have guessed?'}
    },
    {
        childPaths: [
            'event/example',
            'cmd/example',
            'form/example',
        ],
        commandEnums: CommandEnums,
        settingElements: [
            {type:'toggle', id:'exampleSetting', data:{display:'Example Setting', defaultValue:true}},
        ],
    },
);