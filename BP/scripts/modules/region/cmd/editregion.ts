import {CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {Module} from '../module';




function Callback(context:ShardCommandContext, args:Array<any>) {
    const name:string = args[0];
    if (!Module.persisData.regions[name]) {return {message:{translate:'shard.region.cmd.editRegion.doesNotExist'}, status:1}};
    // Show edit form.
    Module.forms.edit.show(context, [name]);
};




// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'editregion',
        brief: 'shard.region.cmd.editRegion.brief',
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
            {name:'name', type:CustomCommandParamType.String},
        ],
    },
    {callback: Callback},
);