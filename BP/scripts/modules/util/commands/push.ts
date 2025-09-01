import {system, Entity, Vector3, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../ShardAPI/command';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    let location:Vector3 = Options[1];
    let targets:Array<Entity> = Options[0];
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
export const Command = new ShardCommand(
    'push',
    'Pushes an entity towards the location. Cannot be applied to items. May be unreliable when applied to players.',
    [
        {name:'targets', type:CustomCommandParamType.EntitySelector},
        {name:'location', type:CustomCommandParamType.Location},
    ],
    [],
    CommandPermissionLevel.GameDirectors,
    [],
    Callback,
);