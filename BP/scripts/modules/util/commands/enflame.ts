export {Command};
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';


// Define command properties.
const MandatoryParameters:Array<MC.CustomCommandParameter> = [];
const OptionalParameters:Array<MC.CustomCommandParameter> = [
    {name:'targets', type:MC.CustomCommandParamType.EntitySelector},
    {name:'time', type:MC.CustomCommandParamType.Float},
];
const PermissionLevel:MC.CommandPermissionLevel = MC.CommandPermissionLevel.GameDirectors;
const RequiredTags:Array<string> = [];

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
        MC.system.run(()=>{
            if (time == 0) {entity.extinguishFire()}
            else {entity.setOnFire(time)};
        });
        count += 1;
    });

    if (time == 0) {return {message:{translate:'shard.util.cmd.enflame.extinguish', with:[String(count)]}, status:0}}
    else {return {message:{translate:'shard.util.cmd.enflame.success', with:[String(count), String(time)]}, status:0}};
};




// Initialize Command.
var Command = new ShardCommand(
    'enflame',
    'Set entities on fire. Enflame with 0 time to remove fire.',
    MandatoryParameters,
    OptionalParameters,
    PermissionLevel,
    RequiredTags,
    Callback,
);