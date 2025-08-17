import {CommandPermissionLevel} from '@minecraft/server';
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    return {message:{translate:'shard.core.cmd.discord.success'}, status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'discord',
    'Get link to the Discord server.',
    [],
    [],
    CommandPermissionLevel.Any,
    [],
    Callback,
);