import {CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {Module} from '../module';


function Callback(_context:ShardCommandContext, args:Array<any>) {
    const name:string = args[0];
    const currentBorder = Module.persisData.borders[name];
    if (!currentBorder) {return {message:{translate:'shard.border.cmd.removeBorder.doesNotExist'}, status:1}};
    // Delete border.
    delete Module.persisData.borders[name];
    Module.saveData();
    // Return.
    return {message:{translate:'shard.border.cmd.removeBorder.success', with:[name]}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'removeborder',
        brief: 'shard.border.cmd.removeBorder.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'name', type:CustomCommandParamType.String},
        ],
    },
    {callback: Callback},
);