import {PlayerInventoryItemChangeAfterEvent, CommandPermissionLevel} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {CompareCommandPermissionLevel} from '../../../Shard/util'
import {Module, BlacklistItem} from '../module';


function Callback(event:PlayerInventoryItemChangeAfterEvent) {
    if (!event.itemStack) {return};
    if (CompareCommandPermissionLevel(event.player.commandPermissionLevel, CommandPermissionLevel.GameDirectors)) {
        return;
    };

    // Remove item from inventory if matches a blacklisted item.
    const inventory = event.player.getComponent('inventory').container;
    for (const key in Module.persisData.items) {
        const value:BlacklistItem = Module.persisData.items[key];
        let typeId = value.typeId;
        if (!value.typeId.includes(':')) {
            typeId = 'minecraft:'+value.typeId;
        };
        let remove:boolean = false;
        if (event.itemStack.typeId == typeId) {remove = true}
        else if (event.itemStack.typeId.includes('spawn_egg') && typeId == 'minecraft:spawn_egg') {remove = true};
        if (remove) {
            inventory.getSlot(event.slot).setItem(undefined);
        };
    };
};


// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'after', eventId:'playerInventoryItemChange'},
    {callback: Callback},
);