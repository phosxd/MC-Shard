import {MC, Dictionary} from './CONST';
import ShardCommandContext from './command_context';


// Class for Shard Commands.
export default class ShardCommand {
    id: string;
    description: string;
    mandatoryParameters: Array<MC.CustomCommandParameter>;
    optionalParameters: Array<MC.CustomCommandParameter>;
    permissionLevel: MC.CommandPermissionLevel;
    requiredTags: Array<string>;
    callback: (Context:ShardCommandContext, Options) => MC.CustomCommandResult;
    registerEnums:Dictionary<Array<string>>;
    disabled:boolean = false;


    disabled_callback(Context:ShardCommandContext, Options:Array<any>) {
        return {message:'This command is disabled.', status:MC.CustomCommandStatus.Failure};
    };


    constructor(id:string, description:string, mandatoryParameters:Array<MC.CustomCommandParameter>, optionalParameters:Array<MC.CustomCommandParameter>, permissionLevel:MC.CommandPermissionLevel, requiredTags:Array<string>, callback:(Context:ShardCommandContext, Options) => MC.CustomCommandResult, registerEnums?:Dictionary<Array<string>>) {
        this.id = id;
        this.description = description;
        this.mandatoryParameters = mandatoryParameters;
        this.optionalParameters = optionalParameters;
        this.permissionLevel = permissionLevel;
        this.requiredTags = requiredTags;
        this.callback = callback;
        this.registerEnums = registerEnums;
    };


    execute(Context:ShardCommandContext, Options:Array<any>) {
        if (this.disabled == true) {return this.disabled_callback(Context, Options)}
        else {return this.callback(Context, Options)};
    };
};