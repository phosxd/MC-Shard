import {system, Entity, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    const entity:Entity = Context.target as Entity;
    // Get target block & location. Return error if out of bounds.
    let amount:number = Options[0];
    let target_location = entity.location; target_location.y += amount;
    if (target_location.y > 256 || target_location.y < -64) {return {message:{translate:'shard.misc.targetLocationOutOfBounds'}, status:1}}
    let target_block = entity.dimension.getBlock(target_location);
    if (target_block == undefined) {return {message:{translate:'shard.misc.targetLocationOutOfBounds'}, status:1}};
    // Return error if obstructed.
    if (target_block.isAir == false || target_block.above(1).isAir == false || target_block.above(2).isAir == false) {return {message:{translate:'shard.misc.targetLocationObstructed'}, status:1}};
    
    // 1 tick later... Set support block & teleport target.
    system.run(()=>{
        target_block.setType('glass');
        let teleport_location = entity.location; teleport_location.y = target_block.above().location.y;
        entity.teleport(teleport_location);
    });

    return {message:{translate:'shard.misc.woosh'}, status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'up',
    'Teleport up with a platform.',
    [
        {name:'amount', type:CustomCommandParamType.Integer},
    ],
    [],
    CommandPermissionLevel.Admin,
    [],
    Callback,
);