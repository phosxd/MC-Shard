import {system, Entity, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const entity = context.sourceEntity;
    if (!entity) {return};
    // Get target block & location. Return error if out of bounds.
    let amount:number = args[0];
    const targetLocation = entity.location; targetLocation.y += amount;
    if (targetLocation.y > 256 || targetLocation.y < -64) {return {message:{translate:'shard.misc.targetLocationOutOfBounds'}, status:1}}
    const targetBlock = entity.dimension.getBlock(targetLocation);
    if (targetBlock == undefined) {return {message:{translate:'shard.misc.targetLocationOutOfBounds'}, status:1}};
    // Return error if obstructed.
    if (targetBlock.isAir == false || targetBlock.above(1).isAir == false || targetBlock.above(2).isAir == false) {return {message:{translate:'shard.misc.targetLocationObstructed'}, status:1}};
    
    // 1 tick later... Set support block & teleport target.
    system.run(()=>{
        if (!entity.isValid) {return};
        targetBlock.setType('glass');
        const teleportLocation = entity.location; teleportLocation.y = targetBlock.above().location.y;
        entity.teleport(teleportLocation);
    });

    return {message:{translate:'shard.misc.woosh'}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'up',
        brief: 'shard.util.cmd.up.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'distance', type:CustomCommandParamType.Integer},
        ],
    },
    {callback: Callback},
);