import {CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    return {message:{translate:'shard.core.cmd.discord.success'}, status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    {
        id: 'discord',
        brief: 'Get link to the Discord server.',
        permissionLevel: CommandPermissionLevel.Any,
    },
    {
        callback: Callback,
    }
);