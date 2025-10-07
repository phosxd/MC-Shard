import {system, Container, ItemStack, ItemEnchantableComponent, EnchantmentTypes, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const player = context.sourcePlayer;
    if (!player) {return};
    const enchantmentName:string = args[0];
    // Return error if invalid enchantment name.
    if (enchantmentName && !EnchantmentTypes.get(enchantmentName)) {return {message:{translate:'shard.util.cmd.disenchant.invalidEnchantment', with:[enchantmentName]}, status:1}};
    // Get player inventory & item enchantable component.
    let invContainer:Container = player.getComponent('inventory').container;
    let stack:ItemStack = invContainer.getSlot(player.selectedSlotIndex).getItem();
    // Return error if no item stack in slot.
    if (stack == undefined) {return {message:{translate:'shard.util.common.noItem'}, status:1}};
    let enchantable:ItemEnchantableComponent = stack.getComponent('enchantable');
    // Return error if no enchantable component.
    if (enchantable == undefined) {return {message:{translate:'shard.util.cmd.disenchant.noEnchantable', with:[stack.typeId.split(':')[1]]}, status:1}};
    // Replace slot with disenchanted clone.
    system.run(()=>{
        if (enchantmentName) {enchantable.removeEnchantment(enchantmentName)}
        else {enchantable.removeAllEnchantments()};
        invContainer.setItem(player.selectedSlotIndex, stack);
    });

    return {message:{translate:'shard.util.cmd.disenchant.success', with:[stack.typeId.split(':')[1]]}, status:0};
};




// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'disenchant',
        brief: 'shard.util.cmd.disenchant.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            {name:'enchantmentName', type:CustomCommandParamType.String}
        ],
    },
    {callback: Callback}
);