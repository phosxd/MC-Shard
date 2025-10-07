import {system, Player, Entity, EntityInventoryComponent, ItemStack, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';


function Callback(_context:ShardCommandContext, args:Array<any>) {
    const item_or_entity:'item'|'entity' = args[0];
    const targets:Array<Entity> = args[1];
    const name:string = args[2];
    let count = 0;

    // Apply to targets.
    targets.forEach(entity => {
        // Rename held items.
        if (item_or_entity == 'item') {
            const inv:EntityInventoryComponent = entity.getComponent('inventory');
            if (inv == undefined) {return};
            let targetSlotIndex:number = 0;
            if (entity.typeId == 'minecraft:player') {
                const player:Player = entity as Player;
                targetSlotIndex = player.selectedSlotIndex};
            let stack:ItemStack = inv.container.getSlot(targetSlotIndex).getItem();
            if (stack == undefined) {return};
            system.run(()=>{
                stack.nameTag = name;
                inv.container.getSlot(targetSlotIndex).setItem(stack);
            });
        };
        // Rename entity.
        if (item_or_entity == 'entity') {
            system.run(()=>{
                if (!entity.isValid) {return};
                entity.nameTag = name;
            });
        };
        count += 1;
    });

    if (item_or_entity == 'item') {return {message:{translate:'shard.util.cmd.rename.successItem', with:[String(count), name]}, status:0}};
    if (item_or_entity == 'entity') {return {message:{translate:'shard.util.cmd.rename.successEntity', with:[String(count), name]}, status:0}};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'rename',
        brief: 'shard.util.cmd.rename.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'sh:renameOption', type:CustomCommandParamType.Enum},
            {name:'targets', type:CustomCommandParamType.EntitySelector},
            {name:'name', type:CustomCommandParamType.String},
        ],
    },
    {callback: Callback},
);