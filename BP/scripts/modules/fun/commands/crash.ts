import {system, world, CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';




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
export const MAIN = new ShardCommand(
    {
        id: 'crash',
        brief: 'Hehehe...',
        permissionLevel: CommandPermissionLevel.Admin,
    },
    {
        callback: Callback,
    },
);