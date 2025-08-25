import {Vector3, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {AlignedArea} from '../../../ShardAPI/CONST';
import {AlignArea, LocationToString} from '../../../ShardAPI/util';
import {Module} from '../module';




function Callback(context:ShardCommandContext, args:Array<any>) {
    const name:string = args[0];

    const currentBorder = Module.persisData.borders[name];
    if (!currentBorder) {return {message:{translate:'shard.border.cmd.removeBorder.doesNotExist'}, status:1}};

    delete Module.persisData.borders[name];
    Module.saveData();

    return {message:{translate:'shard.border.cmd.removeBorder.success', with:[name]}, status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'removeborder',
    'Remove a border.',
    [
        {name:'name', type:CustomCommandParamType.String},
    ],
    [],
    CommandPermissionLevel.GameDirectors,
    [],
    Callback,
);