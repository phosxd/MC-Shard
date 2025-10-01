import {system, BlockVolume, Vector3, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {Module, generateTerrain, terrainPresets} from '../module';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const from = args[0] as Vector3;
    const to = args[1] as Vector3;
    const terrainId = args[2] as string;
    const seed = args[3] as number;
    const speed = args[4] as number;
    let terrain;
    const allTerrain = Module.getProperty('terrain');
    if (allTerrain[terrainId]) {terrain = allTerrain[terrainId]}
    else {terrain = terrainPresets[terrainId]};
    system.runJob(generateTerrain(context.dimension, new BlockVolume(from, to), terrain, seed, speed));
    return {message:{translate:'shard.generator.cmd.generate.success'}, status:0};
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
            {name:'seed', type:CustomCommandParamType.Float},
            {name:'speed', type:CustomCommandParamType.Integer},
        ],
        important: false,
    },
    {callback: Callback},
);