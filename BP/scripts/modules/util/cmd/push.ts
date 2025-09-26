import {system, Entity, Vector3, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {NormalizeVector, MultiplyVector} from '../../../util/vector';


function Callback(_context:ShardCommandContext, args:Array<any>) {
    const location:Vector3 = args[1];
    const targets:Array<Entity> = args[0];
    const force:Vector3 = args[2];
    let count = 0;
    // Apply to targets.
    targets.forEach(entity => {
        if (entity.typeId == 'minecraft:item') {return};
        // Calculate vector.
        let vector:Vector3 = {x:location.x-entity.location.x, y:(location.y-entity.location.y)/1.5, z:location.z-entity.location.z};
        if (force) {
            vector = MultiplyVector(NormalizeVector(vector), force) as Vector3; // Normalize so location doesn't impact force.
        };
        // Apply.
        system.run(()=>{
            if (!entity.isValid) {return};
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
        optionalParameters: [
            {name:'force', type:CustomCommandParamType.Location},
        ],
    },
    {callback: Callback},
);