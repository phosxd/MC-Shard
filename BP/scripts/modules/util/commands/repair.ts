export {Command};
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC, Dictionary} from '../../../ShardAPI/CONST';


// Define command properties.
const ID:string = 'repair';
const Description:string = 'Repair the item in your hand.';
const MandatoryParameters:Array<MC.CustomCommandParameter> = [];
const OptionalParameters:Array<MC.CustomCommandParameter> = [];
const PermissionLevel:MC.CommandPermissionLevel = MC.CommandPermissionLevel.GameDirectors;
const RequiredTags:Array<string> = [];

const Lang:Dictionary<string> = {
    success: 'Repaired §e{item}§r.',
    failure: '§e{item}§c cannot be repaired.',
    noItem: '§cYou need to be holding an item.',
}




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    if (Context.targetType !== 'player') {return undefined};

    // Get player inventory & item durability component.
    let invContainer:MC.Container = Context.target.getComponent('inventory').container;
    let stack:MC.ItemStack = invContainer.getSlot(Context.target.selectedSlotIndex).getItem();
    // Return error if no item stack in slot.
    if (stack == undefined) {return {message:Lang.noItem, status:MC.CustomCommandStatus.Failure}};
    let durability:MC.ItemDurabilityComponent = stack.getComponent('durability');
    // Return error if no durability component.
    if (durability == undefined) {return {message:Lang.failure.replace('{item}',stack.typeId.split(':')[1]), status:MC.CustomCommandStatus.Failure}};
    // Replace slot with repaired clone.
    MC.system.run(()=>{
        durability.damage = 0;
        invContainer.setItem(Context.target.selectedSlotIndex, stack);
    });

    return {message:Lang.success.replace('{item}',stack.typeId.split(':')[1]), status:MC.CustomCommandStatus.Success};
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