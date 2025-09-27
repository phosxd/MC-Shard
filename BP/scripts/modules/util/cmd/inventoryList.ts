import {CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {Module} from '../module';


function Callback(_context:ShardCommandContext, _args:Array<any>) {
    const list:Array<string> = [];
    Object.keys(Module.persisData.inventoryIds).sort().forEach(key => {
        const inventoryIds = Module.persisData.inventoryIds[key];
        inventoryIds.forEach(id => {
            list.push(`${key}.${id}`);
        });
    });
    return {message:{translate:'shard.util.cmd.inventoryList.success', with:[list.join(', ')]}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'inventory.list',
        brief: 'shard.util.cmd.inventoryList.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
    },
    {callback: Callback},
);