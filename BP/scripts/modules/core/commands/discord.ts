import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';


// Define command properties.
const ID:string = 'discord';
const Description:string = 'Get link to the Shard Discord server.';
const MandatoryParameters:Array<MC.CustomCommandParameter> = [];
const OptionalParameters:Array<MC.CustomCommandParameter> = [];
const PermissionLevel:MC.CommandPermissionLevel = MC.CommandPermissionLevel.Any;
const RequiredTags:Array<string> = [];




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    return {message:'§9dsc.gg/mc-shard', status:MC.CustomCommandStatus.Success};
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