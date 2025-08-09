export {Command};
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';


// Define command properties.
const ID:string = 'push';
const Description:string = 'Pushes an entity towards the location. Cannot be applied to items. May be unreliable when applied to players.';
const MandatoryParameters:Array<MC.CustomCommandParameter> = [
    {name:'location', type:MC.CustomCommandParamType.Location},
    {name:'targets', type:MC.CustomCommandParamType.EntitySelector},
];
const OptionalParameters:Array<MC.CustomCommandParameter> = [];
const PermissionLevel:MC.CommandPermissionLevel = MC.CommandPermissionLevel.GameDirectors;
const RequiredTags:Array<string> = [];
const Lang = {
    success: 'Applied an impulse to {count} entities.',
};




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    let location:MC.Vector3 = Options[0];
    let targets:Array<MC.Entity> = Options[1];
    let count = 0;
    // Apply to targets.
    targets.forEach(entity => {
        if (entity.typeId == 'minecraft:item') {return};
        // Calculate vector.
        let vector:MC.Vector3 = {x:location.x-entity.location.x, y:location.y-entity.location.y, z:location.z-entity.location.z};
        // Apply.
        MC.system.run(()=>{
            if (entity.typeId == 'minecraft:player') {entity.applyKnockback({x:vector.x, z:vector.z}, vector.y)}
            else {entity.applyImpulse(vector)};
        });
        count += 1;
    });

    return {message:Lang.success.replace('{count}',String(count)), status:MC.CustomCommandStatus.Success};
};




// Initialize Command.
var Command = new ShardCommand(
    ID,
    Description,
    MandatoryParameters,
    OptionalParameters,
    PermissionLevel,
    RequiredTags,
    Callback,
);