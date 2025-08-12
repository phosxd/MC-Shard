import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    if (Context.targetType !== 'player') {return undefined};

    // Get player inventory & clone held item stack.
    let invContainer:MC.Container = Context.target.getComponent('inventory').container;
    let stack:MC.ItemStack = invContainer.getSlot(Context.target.selectedSlotIndex).getItem();
    // Return error if no item stack in slot.
    if (stack == undefined) {return {message:{translate:'shard.util.cmd.dupe.noItem'}, status:1}};
    // Clone item stack.
    MC.system.run(()=>{
        invContainer.addItem(stack.clone());
    });

    return {message:{translate:'shard.util.cmd.dupe.success', with:[String(stack.amount), stack.typeId.split(':')[1]]}, status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'dupe',
    'Duplicate the item in your hand.',
    [],
    [],
    MC.CommandPermissionLevel.GameDirectors,
    [],
    Callback,
);