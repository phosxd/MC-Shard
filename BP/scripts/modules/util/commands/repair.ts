import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    if (Context.targetType !== 'player') {return undefined};

    // Get player inventory & item durability component.
    let invContainer:MC.Container = Context.target.getComponent('inventory').container;
    let stack:MC.ItemStack = invContainer.getSlot(Context.target.selectedSlotIndex).getItem();
    // Return error if no item stack in slot.
    if (stack == undefined) {return {message:{translate:'shard.util.cmd.repair.noItem'}, status:1}};
    let durability:MC.ItemDurabilityComponent = stack.getComponent('durability');
    // Return error if no durability component.
    if (durability == undefined) {return {message:{translate:'shard.util.cmd.repair.failure', with:[stack.typeId.split(':')[1]]}, status:1}};
    // Replace slot with repaired clone.
    MC.system.run(()=>{
        durability.damage = 0;
        invContainer.setItem(Context.target.selectedSlotIndex, stack);
    });

    return {message:{translate:'shard.util.cmd.repair.success', with:[stack.typeId.split(':')[1]]}, status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'repair',
    'Repair the item in your hand.',
    [],
    [],
    MC.CommandPermissionLevel.GameDirectors,
    [],
    Callback,
);