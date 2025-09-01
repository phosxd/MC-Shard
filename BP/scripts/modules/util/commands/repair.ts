import {system, Player, Entity, Container, ItemStack, ItemDurabilityComponent, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../ShardAPI/command';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    if (Context.targetType !== 'player') {return undefined};
    const player:Player = Context.target as Player;

    // Get player inventory & item durability component.
    let invContainer:Container = Context.target.getComponent('inventory').container;
    let stack:ItemStack = invContainer.getSlot(player.selectedSlotIndex).getItem();
    // Return error if no item stack in slot.
    if (stack == undefined) {return {message:{translate:'shard.util.cmd.repair.noItem'}, status:1}};
    let durability:ItemDurabilityComponent = stack.getComponent('durability');
    // Return error if no durability component.
    if (durability == undefined) {return {message:{translate:'shard.util.cmd.repair.failure', with:[stack.typeId.split(':')[1]]}, status:1}};
    // Replace slot with repaired clone.
    system.run(()=>{
        durability.damage = 0;
        invContainer.setItem(player.selectedSlotIndex, stack);
    });

    return {message:{translate:'shard.util.cmd.repair.success', with:[stack.typeId.split(':')[1]]}, status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'repair',
    'Repair the item in your hand.',
    [],
    [],
    CommandPermissionLevel.GameDirectors,
    [],
    Callback,
);