export {Command};
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';


// Define command properties.
const ID:string = 'thru';
const Description:string = 'Teleport through a wall 3 blocks or less thick.';
const MandatoryParameters:Array<MC.CustomCommandParameter> = [];
const OptionalParameters:Array<MC.CustomCommandParameter> = [];
const PermissionLevel:MC.CommandPermissionLevel = MC.CommandPermissionLevel.Admin;
const RequiredTags:Array<string> = [];
const Lang = {
    success: 'Woosh!',
    onlyEntity: 'Can only execute on an entity.',
    noBlocks: 'No blocks in range to teleport through.',
    outOfBounds: 'Target location is out of bounds.',
    obstructed: 'Wall is too thick to teleport through.',
};

const MaxWallDistance:number = 10;
const MaxWallThickness:number = 3;




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    // Return error invalid target.
    if (Context.targetType !== ShardCommandContext.SourceTypes.entity && Context.targetType !== ShardCommandContext.SourceTypes.player) {
        return {message:Lang.onlyEntity, status:MC.CustomCommandStatus.Failure};
    };
    
    let raycast = Context.target.getBlockFromViewDirection({maxDistance:MaxWallDistance, includeLiquidBlocks:false});
    if (raycast === undefined) {return {message:Lang.noBlocks, status:MC.CustomCommandStatus.Failure}};
    let direction = Context.target.getViewDirection();
    let checkLocation:MC.Vector3 = raycast.block.location;
    // Search for other side of the wall.
    for (let i = 0; i < MaxWallThickness; i++) {
        checkLocation.x += direction.x; checkLocation.y += direction.y; checkLocation.z += direction.z;
        // Return error if out of bounds.
        if (checkLocation.y > 256 || checkLocation.y < -64) {return {message:Lang.outOfBounds, status:MC.CustomCommandStatus.Failure}};
        // Check block.
        let checkBlock = Context.target.dimension.getBlock(checkLocation);
        if (checkBlock.isAir === true || checkBlock.isLiquid === true) {
            // 1 tick later... Teleport target.
            MC.system.run(()=>{
                Context.source.teleport(checkLocation);
            });
            return {message:Lang.success, status:MC.CustomCommandStatus.Success};
        };
    };

    return {message:Lang.obstructed, status:MC.CustomCommandStatus.Success};
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