import {system, CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';


function Callback(context:ShardCommandContext, _args:Array<any>) {
    const entity = context.sourceEntity;
    if (!entity) {return};
    // Get target block & location. Return error if out of bounds.
    let targetLocation = entity.dimension.getTopmostBlock({x:entity.location.x, z:entity.location.z});
    // 1 tick later... teleport target.
    system.run(()=>{
        if (!entity.isValid) {return};
        entity.teleport({x:targetLocation.x, y:targetLocation.y+1, z:targetLocation.z});
    });

    return {message:{translate:'shard.misc.woosh'}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'top',
        brief: 'shard.util.cmd.top.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
    },
    {callback: Callback},
);