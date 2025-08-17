import {system, Entity, Vector3, CommandPermissionLevel} from '@minecraft/server';
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';

const Lang = {
    noBlocks: 'No blocks in range to teleport through.',
    obstructed: 'Wall is too thick to teleport through.',
};

const MaxWallDistance:number = 10;
const MaxWallThickness:number = 3;




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    const entity:Entity = Context.target as Entity;
    let raycast = entity.getBlockFromViewDirection({maxDistance:MaxWallDistance, includeLiquidBlocks:false});
    if (raycast === undefined) {return {message:Lang.noBlocks, status:1}};
    let direction = entity.getViewDirection();
    let checkLocation:Vector3 = raycast.block.location;
    // Search for other side of the wall.
    for (let i = 0; i < MaxWallThickness; i++) {
        checkLocation.x += direction.x; checkLocation.y += direction.y; checkLocation.z += direction.z;
        // Return error if out of bounds.
        if (checkLocation.y > 256 || checkLocation.y < -64) {return {message:{translate:'shard.misc.targetLocationOutOfBounds'}, status:1}};
        
        // Check block.
        let checkBlock = Context.target.dimension.getBlock(checkLocation);
        if (checkBlock.isAir === true || checkBlock.isLiquid === true) {
            // 1 tick later... Teleport target.
            system.run(()=>{
                entity.teleport(checkLocation);
            });
            return {message:{translate:'shard.misc.woosh'}, status:0};
        };
    };

    return {message:Lang.obstructed, status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'thru',
    'Teleport through a wall 3 blocks thick or less.',
    [],
    [],
    CommandPermissionLevel.Admin,
    [],
    Callback,
);