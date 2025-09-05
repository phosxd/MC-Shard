import {Dictionary} from '../../Shard/CONST';
import {ShardModule} from '../../Shard/module';
import {ShardListener} from '../../Shard/listener';
import {ShardCommand} from '../../Shard/command';
import {ShardForm} from '../../Shard/form';

import CommandEnums from './commandEnums';
import * as mainForm from './forms/main';


// Init callback.
function Init() {};





// Instantiate Module.
export const Module:ShardModule = new ShardModule(
    {
        id: 'core',
        displayName: {translate:'shard.core.displayName'},
        brief: {translate:'shard.core.brief'},
    },
    {
        init: Init,
        childPaths: [
            'events/playerSpawn',
            'commands/discord',
            'commands/eval',
            'commands/module',
            'commands/shard',
            'commands/shardmemory',
            'forms/module_command_settings',
            'forms/module_commands',
            'forms/module',
            'forms/shard',
        ],
        commandEnums: CommandEnums,
        mainForm: mainForm.MAIN,
    },
);