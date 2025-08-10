export {Command};
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC, Dictionary} from '../../../ShardAPI/CONST';


// Define command properties.
const ID:string = 'dupe';
const Description:string = 'Duplicate the item in your hand.';
const MandatoryParameters:Array<MC.CustomCommandParameter> = [];
const OptionalParameters:Array<MC.CustomCommandParameter> = [];
const PermissionLevel:MC.CommandPermissionLevel = MC.CommandPermissionLevel.GameDirectors;
const RequiredTags:Array<string> = [];

const Lang:Dictionary<string> = {
    success: 'Duplicated {count} §e{item}§r.',
    noItem: '§cYou need to be holding an item.',
}




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    if (Context.targetType !== 'player') {return undefined};

    // Get player inventory & clone held item stack.
    let invContainer:MC.Container = Context.target.getComponent('inventory').container;
    let stack:MC.ItemStack = invContainer.getSlot(Context.target.selectedSlotIndex).getItem();
    // Return error if no item stack in slot.
    if (stack == undefined) {return {message:Lang.noItem, status:MC.CustomCommandStatus.Failure}};
    // Clone item stack.
    MC.system.run(()=>{
        invContainer.addItem(stack.clone());
    });

    return {message:Lang.success.replace('{count}',String(stack.amount)).replace('{item}',stack.typeId.split(':')[1]), status:MC.CustomCommandStatus.Success};
};




// Initialize Command.
var Command = new ShardCommand(
    ID,
    Description,
    MandatoryParameters,
    OptionalParameters,
    PermissionLevel,
    RequiredTags,
    Callback,
);