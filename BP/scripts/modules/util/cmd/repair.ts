import {system, Container, ItemStack, ItemDurabilityComponent, CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';




function Callback(context:ShardCommandContext, _args:Array<any>) {
    const player = context.sourcePlayer;
    if (!player) {return};
    // Get player inventory & item durability component.
    let invContainer:Container = player.getComponent('inventory').container;
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
export const MAIN = new ShardCommand(
    {
        id: 'repair',
        brief: 'shard.util.cmd.repair.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
    },
    {callback: Callback}
);