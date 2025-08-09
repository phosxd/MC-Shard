export {Command};
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';


// Define command properties.
const ID:string = 'enflame';
const Description:string = 'Set entities on fire.';
const MandatoryParameters:Array<MC.CustomCommandParameter> = [];
const OptionalParameters:Array<MC.CustomCommandParameter> = [
    {name:'targets', type:MC.CustomCommandParamType.EntitySelector},
    {name:'time', type:MC.CustomCommandParamType.Float},
];
const PermissionLevel:MC.CommandPermissionLevel = MC.CommandPermissionLevel.GameDirectors;
const RequiredTags:Array<string> = [];
const Lang = {
    success: 'Set {count} entities on fire for {time} seconds.',
};

const default_time:number = 5;




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    let targets:Array<MC.Entity> = Options[0];
    let time:number = Options[1];
    // If no specified targets, set the user as the target & if the user is not an entity or player, then return.
    if (targets == undefined) {
        if (Context.targetType !== 'entity' && Context.targetType !== 'player') {return};
        targets = [Context.target];
    };
    // If no specified time, set default time.
    if (time == undefined) {
        time = default_time;
    };
    // Apply to targets.
    let count:number = 0;
    targets.forEach(entity => {
        MC.system.run(()=>{entity.setOnFire(time)});
        count += 1;
    });

    return {message:Lang.success.replace('{count}',String(count)).replace('{time}',String(time)), status:MC.CustomCommandStatus.Success};
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