export {Command};
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC, Dictionary} from '../../../ShardAPI/CONST';


// Define command properties.
const ID:string = 'rename';
const Description:string = 'Rename entities or held items.';
const MandatoryParameters:Array<MC.CustomCommandParameter> = [
    {name:'sh:renameOption', type:MC.CustomCommandParamType.Enum},
    {name:'targets', type:MC.CustomCommandParamType.EntitySelector},
    {name:'name', type:MC.CustomCommandParamType.String},
];
const OptionalParameters:Array<MC.CustomCommandParameter> = [];
const PermissionLevel:MC.CommandPermissionLevel = MC.CommandPermissionLevel.GameDirectors;
const RequiredTags:Array<string> = [];
const RegisterEnums:Dictionary<Array<string>> = {
    renameOption: [
        'item',
        'entity',
    ],
};

const Lang = {
    successEntity: 'Renamed {count} entities to "{name}".',
    successItem: 'Renamed items held by {count} entities to "{name}".',
};




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

    if (item_or_entity == 'item') {return {message:Lang.successItem.replace('{count}',String(count)).replace('{name}',name), status:MC.CustomCommandStatus.Success}};
    if (item_or_entity == 'entity') {return {message:Lang.successEntity.replace('{count}',String(count)).replace('{name}',name), status:MC.CustomCommandStatus.Success}};
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
    RegisterEnums,
);