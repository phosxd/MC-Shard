import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';


// Define command properties.
const MandatoryParameters:Array<MC.CustomCommandParameter> = [];
const OptionalParameters:Array<MC.CustomCommandParameter> = [];
const PermissionLevel:MC.CommandPermissionLevel = MC.CommandPermissionLevel.Any;
const RequiredTags:Array<string> = [];




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    return {message:{translate:'shard.misc.commandUnavailable'}, status:1};
};




// Initialize Command.
export const Command = new ShardCommand(
    'shard',
    'Open the Shard menu.',
    MandatoryParameters,
    OptionalParameters,
    PermissionLevel,
    RequiredTags,
    Callback,
);