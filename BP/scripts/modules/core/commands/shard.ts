import {CommandPermissionLevel} from '@minecraft/server';
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {Module} from '../module';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    Module.forms.shard.show(Context);
    return {status:0};
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