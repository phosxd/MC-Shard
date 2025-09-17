import {CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {Module} from '../module';


function Callback(context:ShardCommandContext, args:Array<any>) {
    Module.forms.items.show(context);
    return undefined;
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'blacklist',
        brief: 'shard.blacklist.cmd.blacklist.brief',
        permissionLevel: CommandPermissionLevel.Admin,
    },
    {callback: Callback},
);