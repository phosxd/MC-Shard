import {world, CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';


function Callback(context:ShardCommandContext, ...args) {
    const diskBytes = world.getDynamicPropertyTotalByteCount();
    const diskMegabytes = (diskBytes/1000)/1000;
    return {message:{translate:'shard.core.cmd.shardMemory.success', with:[String(diskMegabytes), String(diskBytes)]}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'shardmemory',
        brief: 'shard.core.cmd.shardMemory.brief',
        permissionLevel: CommandPermissionLevel.Admin
    },
    {callback: Callback},
);