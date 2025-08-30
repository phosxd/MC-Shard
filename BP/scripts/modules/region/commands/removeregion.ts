import {CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {} from '../../../ShardAPI/CONST';
import {} from '../../../ShardAPI/util';
import {Module} from '../module';




function Callback(context:ShardCommandContext, args:Array<any>) {
    const name:string = args[0];

    const currentRegion = Module.persisData.regions[name];
    if (!currentRegion) {return {message:{translate:'shard.region.cmd.removeRegion.doesNotExist'}, status:1}};

    delete Module.persisData.regions[name];
    Module.saveData();

    return {message:{translate:'shard.region.cmd.removeRegion.success', with:[name]}, status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'removeregion',
    'Remove a region.',
    [
        {name:'name', type:CustomCommandParamType.String},
    ],
    [],
    CommandPermissionLevel.GameDirectors,
    [],
    Callback,
);