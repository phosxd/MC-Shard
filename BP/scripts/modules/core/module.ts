import {ShardModule} from '../../Shard/module';
import CommandEnums from './commandEnums';
//import * as mainForm from './forms/main';


// Instantiate Module.
export const Module = new ShardModule(
    {
        id: 'core',
        displayName: {translate:'shard.core.displayName'},
        brief: {translate:'shard.core.brief'},
    },
    {
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
        //mainForm: mainForm.MAIN,
    },
);