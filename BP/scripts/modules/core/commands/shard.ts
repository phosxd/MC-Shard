import {CommandPermissionLevel} from '@minecraft/server';
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    return {message:{translate:'shard.misc.commandUnavailable'}, status:1};
};




// Initialize Command.
export const Command = new ShardCommand(
    'shard',
    'Open the Shard menu.',
    [],
    [],
    CommandPermissionLevel.Any,
    [],
    Callback,
);