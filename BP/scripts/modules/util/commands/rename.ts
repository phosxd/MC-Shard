import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    const item_or_entity:'item'|'entity' = Options[0];
    const targets:Array<MC.Entity> = Options[1];
    const name:string = Options[2];
    let count = 0;

    // Apply to targets.
    targets.forEach(entity => {
        // Rename held items.
        if (item_or_entity == 'item') {
            const inv:MC.EntityInventoryComponent = entity.getComponent('inventory');
            if (inv == undefined) {return};
            let targetSlotIndex:number = 0;
            if (entity.typeId == 'minecraft:player') {targetSlotIndex = entity.selectedSlotIndex};
            let stack:MC.ItemStack = inv.container.getSlot(targetSlotIndex).getItem();
            if (stack == undefined) {return};
            MC.system.run(()=>{
                stack.nameTag = name;
                inv.container.getSlot(targetSlotIndex).setItem(stack);
            });
        };
        // Rename entity.
        if (item_or_entity == 'entity') {
            MC.system.run(()=>{
                entity.nameTag = name;
            });
        };
        count += 1;
    });

    if (item_or_entity == 'item') {return {message:{translate:'shard.util.cmd.rename.successItem', with:[String(count), name]}, status:0}};
    if (item_or_entity == 'entity') {return {message:{translate:'shard.util.cmd.rename.successEntity', with:[String(count), name]}, status:0}};
};




// Initialize Command.
export const Command = new ShardCommand(
    'rename',
    'Rename entities or held items.',
    [
        {name:'sh:renameOption', type:MC.CustomCommandParamType.Enum},
        {name:'targets', type:MC.CustomCommandParamType.EntitySelector},
        {name:'name', type:MC.CustomCommandParamType.String},
    ],
    [],
    MC.CommandPermissionLevel.GameDirectors,
    [],
    Callback,
    {
        renameOption: [
            'item',
            'entity',
        ],
    },
);