export {Command};
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';


// Define command properties.
const ID:string = 'eat';
const Description:string = 'Replenishes all hunger bars.';
const MandatoryParameters:Array<MC.CustomCommandParameter> = [];
const OptionalParameters:Array<MC.CustomCommandParameter> = [
    {name:'targets', type:MC.CustomCommandParamType.EntitySelector},
];
const PermissionLevel:MC.CommandPermissionLevel = MC.CommandPermissionLevel.GameDirectors;
const RequiredTags:Array<string> = [];
const Lang = {
    success: 'Replenished {count} entities.',
};




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    let targets:Array<MC.Entity> = Options[0];
    // If no specified targets, set the user as the target & if the user is not an entity or player, then return.
    if (targets == undefined) {
        if (Context.targetType !== 'entity' && Context.targetType !== 'player') {return};
        targets = [Context.target];
    };
    // Apply to targets.
    let count:number = 0;
    targets.forEach(entity => {
        MC.system.run(()=>{entity.runCommand('effect @s saturation 1 200 true')});
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