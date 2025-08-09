export {Command};
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';


// Define command properties.
const ID:string = 'up';
const Description:string = 'Teleport up.';
const MandatoryParameters:Array<MC.CustomCommandParameter> = [
    {name:'amount', type:MC.CustomCommandParamType.Integer},
];
const OptionalParameters:Array<MC.CustomCommandParameter> = [];
const PermissionLevel:MC.CommandPermissionLevel = MC.CommandPermissionLevel.Admin;
const RequiredTags:Array<string> = [];
const Lang = {
    success: 'Woosh!',
    onlyEntity: 'Can only execute on an entity.',
    outOfBounds: 'Target location is out of bounds.',
    obstructed: 'Target location is obstructed.',
};




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    // Return error invalid target.
    if (Context.targetType !== ShardCommandContext.SourceTypes.entity && Context.targetType !== ShardCommandContext.SourceTypes.player) {
        return {message:Lang.onlyEntity, status:MC.CustomCommandStatus.Failure};
    };

    // Get target block & location. Return error if out of bounds.
    let amount:number = Options[0];
    let target_location = Context.target.location; target_location.y += amount;
    if (target_location.y > 256 || target_location.y < -64) {return {message:Lang.outOfBounds, status:MC.CustomCommandStatus.Failure}}
    let target_block = Context.target.dimension.getBlock(target_location);
    if (target_block == undefined) {return {message:Lang.outOfBounds, status:MC.CustomCommandStatus.Failure}};
    // Return error if obstructed.
    if (target_block.isAir == false || target_block.above(1).isAir == false || target_block.above(2).isAir == false) {return {message:Lang.obstructed, status:MC.CustomCommandStatus.Failure}};
    
    // 1 tick later... Set support block & teleport target.
    MC.system.run(()=>{
        target_block.setType('glass');
        let teleport_location = Context.target.location; teleport_location.y = target_block.above().location.y;
        Context.target.teleport(teleport_location);
    });

    return {message:Lang.success, status:MC.CustomCommandStatus.Success};
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