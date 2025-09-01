import {CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../ShardAPI/command';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    if (Context.targetType !== 'player') {return undefined};
    return {message:'\n'.repeat(80), status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'pushchat',
    'Pushes all previous chat messages off-screen.',
    [],
    [],
    CommandPermissionLevel.Any,
    [],
    Callback,
);