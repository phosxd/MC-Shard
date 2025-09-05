import {CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {Module} from '../module';




function Callback(context:ShardCommandContext, ...args) {
    Module.forms.shard.show(context);
    return undefined;
};




// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'shard',
        brief: 'Shard info.',
        permissionLevel: CommandPermissionLevel.Any
    },
    {
        callback: Callback,
    }
);