import {CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const exampleParameter1:string = args[0];
    const exampleParameter2:number = args[1];
    return {message:'Example response.', status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'example',
        brief: 'Example command.',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'exampleMandatoryParameter', type:CustomCommandParamType.String},
        ],
        optionalParameters: [
            {name:'exampleOptionalParameter', type:CustomCommandParamType.Integer},
        ],
        important: false,
    },
    {callback: Callback},
);