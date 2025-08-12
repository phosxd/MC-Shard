import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    return {message:{translate:'shard.core.cmd.discord.success'}, status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'discord',
    'Get link to the Discord server.',
    [],
    [],
    MC.CommandPermissionLevel.Any,
    [],
    Callback,
);