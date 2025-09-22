import {CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {Module} from '../module';


function Callback(context:ShardCommandContext, _args:Array<any>) {
    Module.forms.popup.show(context, [{translate:'shard.core.form.shard.title'}, {translate:'shard.core.form.shard.body'}]);
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'shard',
        brief: 'shard.core.cmd.shard.brief',
        permissionLevel: CommandPermissionLevel.Any
    },
    {callback: Callback},
);