import {system, Container, ItemStack, ItemDurabilityComponent, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {Lerp} from '../../../Shard/util';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const player = context.sourcePlayer;
    if (!player) {return};
    const percentage:number = args[0];
    // Return error if percentage not within 0 & 100.
    if (percentage > 100 || percentage < 0) {
        return {message:{translate:'shard.error.outOfRange', with:['value', String(0), String(100)]}, status:1};
    };
    // Get player inventory & item durability component.
    let invContainer:Container = player.getComponent('inventory').container;
    let stack:ItemStack = invContainer.getSlot(player.selectedSlotIndex).getItem();
    // Return error if no item stack in slot.
    if (stack == undefined) {return {message:{translate:'shard.util.cmd.durability.noItem'}, status:1}};
    let durability:ItemDurabilityComponent = stack.getComponent('durability');
    // Return error if no durability component.
    if (durability == undefined) {return {message:{translate:'shard.util.cmd.durability.noDurability', with:[stack.typeId.split(':')[1]]}, status:1}};
    // Replace slot with repaired clone.
    const newValue = Math.floor(durability.maxDurability-Lerp({min:0,max:100}, {min:0,max:durability.maxDurability}, percentage));
    system.run(()=>{
        durability.damage = newValue;
        invContainer.setItem(player.selectedSlotIndex, stack);
    });

    return {message:{translate:'shard.util.cmd.durability.success', with:[String(newValue), String(durability.maxDurability)]}, status:0};
};




// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'durability',
        brief: 'shard.util.cmd.durability.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'value', type:CustomCommandParamType.Float},
        ],
    },
    {callback: Callback}
);