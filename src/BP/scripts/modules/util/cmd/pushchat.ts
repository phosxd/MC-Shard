import {CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';


function Callback(_context:ShardCommandContext, _args:Array<any>) {
    return {message:'\n'.repeat(80), status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'pushchat',
        brief: 'shard.util.cmd.pushChat.brief',
        permissionLevel: CommandPermissionLevel.Any,
    },
    {callback: Callback},
);