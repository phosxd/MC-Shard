import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';

const Lang = {
    success: 'Woosh!',
    noBlocks: 'No blocks in range to teleport through.',
    outOfBounds: 'Target location is out of bounds.',
    obstructed: 'Wall is too thick to teleport through.',
};

const MaxWallDistance:number = 10;
const MaxWallThickness:number = 3;




function Callback(Context:ShardCommandContext, Options:Array<any>) {
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
                Context.target.teleport(checkLocation);
            });
            return {message:Lang.success, status:MC.CustomCommandStatus.Success};
        };
    };

    return {message:Lang.obstructed, status:MC.CustomCommandStatus.Success};
};




// Initialize Command.
export const Command = new ShardCommand(
    'thru',
    'Teleport through a wall 3 blocks thick or less.',
    [],
    [],
    MC.CommandPermissionLevel.Admin,
    [],
    Callback,
);