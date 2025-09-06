import {system, Entity, Vector3, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';




function Callback(context:ShardCommandContext, args:Array<any>) {
    let location:Vector3 = args[1];
    let targets:Array<Entity> = args[0];
    let count = 0;
    // Apply to targets.
    targets.forEach(entity => {
        if (entity.typeId == 'minecraft:item') {return};
        // Calculate vector.
        let vector:Vector3 = {x:location.x-entity.location.x, y:location.y-entity.location.y, z:location.z-entity.location.z};
        // Apply.
        system.run(()=>{
            if (entity.typeId == 'minecraft:player') {entity.applyKnockback({x:vector.x, z:vector.z}, vector.y)}
            else {entity.applyImpulse(vector)};
        });
        count += 1;
    });

    return {message:{translate:'shard.util.cmd.push.success', with:[String(count)]}, status:0};
};




// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'push',
        brief: 'shard.util.cmd.push.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'targets', type:CustomCommandParamType.EntitySelector},
            {name:'location', type:CustomCommandParamType.Location},
        ],
    },
    {callback: Callback},
);