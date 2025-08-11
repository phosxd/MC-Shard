import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC, Dictionary} from '../../../ShardAPI/CONST';


// Define command properties.
const MandatoryParameters:Array<MC.CustomCommandParameter> = [];
const OptionalParameters:Array<MC.CustomCommandParameter> = [];
const PermissionLevel:MC.CommandPermissionLevel = MC.CommandPermissionLevel.Any;
const RequiredTags:Array<string> = [];




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    return {message:{translate:'shard.core.cmd.discord.success'}, status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'discord',
    'Get link to the Shard Discord server.',
    MandatoryParameters,
    OptionalParameters,
    PermissionLevel,
    RequiredTags,
    Callback,
);