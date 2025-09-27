import {system, Vector3, CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';

const MaxWallDistance:number = 10;
const MaxWallThickness:number = 4;


function Callback(context:ShardCommandContext, _args:Array<any>) {
    const entity = context.sourceEntity;
    if (!entity) {return};
    const raycast = entity.getBlockFromViewDirection({maxDistance:MaxWallDistance, includeLiquidBlocks:false});
    if (raycast === undefined) {return {message:{translate:'shard.util.cmd.thru.noBlocks'}, status:1}};
    const direction = entity.getViewDirection();
    const checkLocation:Vector3 = raycast.block.location;
    // Search for other side of the wall.
    for (let i = 0; i < MaxWallThickness; i++) {
        checkLocation.x += direction.x; checkLocation.y += direction.y; checkLocation.z += direction.z;
        // Return error if out of bounds.
        if (checkLocation.y > 256 || checkLocation.y < -64) {return {message:{translate:'shard.misc.targetLocationOutOfBounds'}, status:1}};
        
        // Check block.
        const checkBlock = context.target.dimension.getBlock(checkLocation);
        if (checkBlock.isAir === true || checkBlock.isLiquid === true) {
            // 1 tick later... Teleport target.
            system.run(()=>{
                if (!entity.isValid) {return};
                entity.teleport(checkLocation);
            });
            return {message:{translate:'shard.misc.woosh'}, status:0};
        };
    };

    return {message:{translate:'shard.util.cmd.thru.tooThick'}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'thru',
        brief: 'shard.util.cmd.thru.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
    },
    {callback: Callback},
);