import {CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {Module, GetTerrain} from '../module';


function Callback(_context:ShardCommandContext, args:Array<any>) {
    const id = args[0] as string;
    const json = (args[1] as string);
    const allTerrain = Module.getProperty('terrain');
    // Return error if name taken.
    if (GetTerrain(id)) {return {message:{translate:'shard.error.duplicateName'}, status:1}};
    // Add terrain.
    allTerrain[id] = JSON.parse(json);
    Module.setProperty('terrain', allTerrain);
    return {message:{translate:'shard.generator.cmd.addTerrain.success', with:[id]}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'addterrain',
        brief: 'shard.generator.cmd.addTerrain.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'id', type:CustomCommandParamType.String},
            {name:'json', type:CustomCommandParamType.String},
        ],
        important: false,
    },
    {callback: Callback},
);