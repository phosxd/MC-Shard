import {system, world, CommandPermissionLevel} from '@minecraft/server';
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';




function Callback(context:ShardCommandContext, args:Array<any>) {
    // Crash after 3 seconds.
    system.runTimeout(()=>{
        while (true) {
            // Just loops forever...
        };
    }, 60);

    return {message:{translate:'shard.fun.cmd.crash.success'}, status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'crash',
    'Hehehe...',
    [],
    [],
    CommandPermissionLevel.Admin,
    [],
    Callback,
);