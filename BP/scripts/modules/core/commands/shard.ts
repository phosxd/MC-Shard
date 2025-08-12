import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    return {message:{translate:'shard.misc.commandUnavailable'}, status:1};
};




// Initialize Command.
export const Command = new ShardCommand(
    'shard',
    'Open the Shard menu.',
    [],
    [],
    MC.CommandPermissionLevel.Any,
    [],
    Callback,
);