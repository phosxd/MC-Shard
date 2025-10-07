import {system, CommandPermissionLevel, Container, ItemStack, Player} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';




function Callback(context:ShardCommandContext, _args:Array<any>) {
    const player = context.sourcePlayer;
    if (!player) {return};

    // Get player inventory & clone held item stack.
    const invContainer:Container = player.getComponent('inventory').container;
    const stack:ItemStack = invContainer.getSlot(player.selectedSlotIndex).getItem();
    // Return error if no item stack in slot.
    if (stack == undefined) {return {message:{translate:'shard.util.cmd.dupe.noItem'}, status:1}};
    // Clone item stack.
    system.run(()=>{
        invContainer.addItem(stack.clone());
    });

    return {message:{translate:'shard.util.cmd.dupe.success', with:[String(stack.amount), stack.typeId.split(':')[1]]}, status:0};
};




// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'dupe',
        brief: 'shard.util.cmd.dupe.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
    },
    {callback:Callback},
);