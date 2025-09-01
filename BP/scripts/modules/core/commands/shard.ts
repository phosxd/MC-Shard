import {CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../ShardAPI/command';
import {Module} from '../module';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    Module.forms.shard.show(Context);
    return undefined;
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