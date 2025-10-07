import {CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {Module} from '../module';


function Callback(_context:ShardCommandContext, args:Array<any>) {
    const name:string = args[0];
    const currentRegion = Module.persisData.regions[name];
    if (!currentRegion) {return {message:{translate:'shard.region.cmd.removeRegion.doesNotExist'}, status:1}};
    // Delete region.
    delete Module.persisData.regions[name];
    Module.saveData();
    // Return.
    return {message:{translate:'shard.region.cmd.removeRegion.success', with:[name]}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'removeregion',
        brief: 'shard.region.cmd.removeRegion.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'name', type:CustomCommandParamType.String},
        ],
    },
    {callback: Callback},
);