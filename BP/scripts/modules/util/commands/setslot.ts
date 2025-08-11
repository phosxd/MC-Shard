export {Command};
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC, Dictionary, CommandNamespace} from '../../../ShardAPI/CONST';
import {Module} from '../module';


// Define command properties.
const MandatoryParameters:Array<MC.CustomCommandParameter> = [
    {name:'targets', type:MC.CustomCommandParamType.EntitySelector},
    {name:'slotIndex', type:MC.CustomCommandParamType.Integer},
];
const OptionalParameters:Array<MC.CustomCommandParameter> = [];
const PermissionLevel:MC.CommandPermissionLevel = MC.CommandPermissionLevel.GameDirectors;
const RequiredTags:Array<string> = [];

const min_slot:number = 0;
const max_slot:number = 8;




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    let targets:Array<MC.Entity> = Options[0];
    let slot:number = Number(Options[1]);
    // Return error if slot index is out of range.
    if (slot > max_slot || slot < min_slot) {
        return {message:{translate:'shard.util.cmd.setslot.slotIndexOutOfRange'}, status:1};
    };
    // Apply to targets.
    let count:number = 0;
    targets.forEach(entity => {
        if (entity.typeId !== 'minecraft:player') {return};
        MC.system.run(()=>{
            entity.selectedSlotIndex = slot;
        });
        count += 1;
    });

    return {message:{translate:'shard.util.cmd.setslot.success', with:[String(count), String(slot)]}, status:0};
};




// Initialize Command.
var Command = new ShardCommand(
    'setslot',
    'Set the selected hotbar slot.',
    MandatoryParameters,
    OptionalParameters,
    PermissionLevel,
    RequiredTags,
    Callback,
);