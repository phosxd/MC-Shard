import {CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {Module} from '../module';


function Callback(_context:ShardCommandContext, args:Array<any>) {
    const id = args[0] as string;
    const allTerrain = Module.getProperty('terrain');
    // Return error if does not exist.
    if (allTerrain[id] == undefined) {return {message:{translate:'shard.error.invalidOption', with:[id]}, status:1}};
    // Delete terrain.
    delete allTerrain[id];
    Module.setProperty('terrain', allTerrain);
    //return {message:{translate:'shard.generator.cmd.removeTerrain.success'}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'removeterrain',
        brief: 'shard.generator.cmd.removeTerrain.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'id', type:CustomCommandParamType.String},
        ],
        important: false,
    },
    {callback: Callback},
);