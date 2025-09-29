import {CommandPermissionLevel, CustomCommandParamType, Vector3} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {} from '../module';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const from = args[0] as Vector3;
    const to = args[1] as Vector3;

};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'generate',
        brief: 'shard.generator.cmd.generate.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'from', type:CustomCommandParamType.Location},
            {name:'to', type:CustomCommandParamType.Location},
            {name:'terrainId', type:CustomCommandParamType.String},
        ],
        optionalParameters: [
            {name:'seed', type:CustomCommandParamType.Integer},
        ],
        important: false,
    },
    {callback: Callback},
);