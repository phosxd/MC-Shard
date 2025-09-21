import {system, Entity, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const entity = context.sourceEntity;
    if (!entity) {return};
    // Get target block & location. Return error if out of bounds.
    let amount:number = args[0];
    let target_location = entity.location; target_location.y += amount;
    if (target_location.y > 256 || target_location.y < -64) {return {message:{translate:'shard.misc.targetLocationOutOfBounds'}, status:1}}
    let target_block = entity.dimension.getBlock(target_location);
    if (target_block == undefined) {return {message:{translate:'shard.misc.targetLocationOutOfBounds'}, status:1}};
    // Return error if obstructed.
    if (target_block.isAir == false || target_block.above(1).isAir == false || target_block.above(2).isAir == false) {return {message:{translate:'shard.misc.targetLocationObstructed'}, status:1}};
    
    // 1 tick later... Set support block & teleport target.
    system.run(()=>{
        if (!entity.isValid) {return};
        target_block.setType('glass');
        let teleport_location = entity.location; teleport_location.y = target_block.above().location.y;
        entity.teleport(teleport_location);
    });

    return {message:{translate:'shard.misc.woosh'}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'up',
        brief: 'shard.util.cmd.up.brief',
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
            {name:'distance', type:CustomCommandParamType.Integer},
        ],
    },
    {callback: Callback},
);