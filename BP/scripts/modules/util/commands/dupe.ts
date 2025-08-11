export {Command};
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC, Dictionary} from '../../../ShardAPI/CONST';


// Define command properties.
const MandatoryParameters:Array<MC.CustomCommandParameter> = [];
const OptionalParameters:Array<MC.CustomCommandParameter> = [];
const PermissionLevel:MC.CommandPermissionLevel = MC.CommandPermissionLevel.GameDirectors;
const RequiredTags:Array<string> = [];




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
var Command = new ShardCommand(
    'dupe',
    'Duplicate the item in your hand.',
    MandatoryParameters,
    OptionalParameters,
    PermissionLevel,
    RequiredTags,
    Callback,
);