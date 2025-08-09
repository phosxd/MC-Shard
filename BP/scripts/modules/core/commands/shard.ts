import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';


// Define command properties.
const ID:string = 'shard';
const Description:string = 'Open the Shard menu.';
const MandatoryParameters:Array<MC.CustomCommandParameter> = [];
const OptionalParameters:Array<MC.CustomCommandParameter> = [];
const PermissionLevel:MC.CommandPermissionLevel = MC.CommandPermissionLevel.Any;
const RequiredTags:Array<string> = [];

const Lang = {
    message: 'This is currently unavailable.',
};




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    return {message:Lang.message, status:MC.CustomCommandStatus.Failure};
};




// Initialize Command.
export const Command = new ShardCommand(
    ID,
    Description,
    MandatoryParameters,
    OptionalParameters,
    PermissionLevel,
    RequiredTags,
    Callback,
);