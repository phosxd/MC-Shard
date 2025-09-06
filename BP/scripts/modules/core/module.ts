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
            'event/playerSpawn',
            'cmd/discord',
            'cmd/eval',
            'cmd/module',
            'cmd/repeat',
            'cmd/shard',
            'cmd/shardmemory',
            'form/module_command_settings',
            'form/module_commands',
            'form/module',
            'form/shard',
        ],
        commandEnums: CommandEnums,
        //mainForm: mainForm.MAIN,
    },
);