import {CustomCommandParameter, CommandPermissionLevel, Block, Entity, Player} from '@minecraft/server';
import {Dictionary} from './CONST';
import {CompareCommandPermissionLevel} from './util';
import ShardCommandContext from './command_context';
import ShardCommandResult from './command_result';


// Class for Shard Commands.
export default class ShardCommand {
    id: string;
    description: string;
    mandatoryParameters: Array<CustomCommandParameter>;
    optionalParameters: Array<CustomCommandParameter>;
    permissionLevel: CommandPermissionLevel;
    requiredTags: Array<string>;
    callback: (Context:ShardCommandContext, Options) => ShardCommandResult|undefined;
    registerEnums:Dictionary<Array<string>>;


    /**Called when command is run without proper permissions.*/
    illegal_callback(context:ShardCommandContext, options:Array<any>): ShardCommandResult {
        return {message:{translate:'shard.misc.missingPermission'}, status:1};
    };


    constructor(id:string, description:string, mandatoryParameters:Array<CustomCommandParameter>, optionalParameters:Array<CustomCommandParameter>, permissionLevel:CommandPermissionLevel, requiredTags:Array<string>, callback:(Context:ShardCommandContext, Options) => ShardCommandResult|undefined, registerEnums?:Dictionary<Array<string>>) {
        this.id = id;
        this.description = description;
        this.mandatoryParameters = mandatoryParameters;
        this.optionalParameters = optionalParameters;
        this.permissionLevel = permissionLevel;
        this.requiredTags = requiredTags;
        this.callback = callback;
        this.registerEnums = registerEnums;
    };


    /**Executes the command after checking player permissions.*/
    execute(context:ShardCommandContext, options:Array<any>): ShardCommandResult|undefined {
        switch (context.targetType) {
            case 'entity': {
                if (this.permissionLevel !== CommandPermissionLevel.Any) {
                    return this.illegal_callback(context, options);
                };
                break;
            };
            case 'player': {
                const target = context.target as Player;
                if (CompareCommandPermissionLevel(target.commandPermissionLevel, this.permissionLevel) == false) {
                    return this.illegal_callback(context, options)
                };
                break;
            };
            case 'block': {
                if (this.permissionLevel !== CommandPermissionLevel.GameDirectors) {
                    return this.illegal_callback(context, options);
                };
                break;
            };
        };
        
        return this.callback(context, options);
    };
};