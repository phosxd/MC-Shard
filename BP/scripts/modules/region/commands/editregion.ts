import {CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {} from '../../../ShardAPI/CONST';
import {} from '../../../ShardAPI/util';
import {Module} from '../module';




function Callback(context:ShardCommandContext, args:Array<any>) {
    const name:string = args[0];
    if (!Module.persisData.regions[name]) {return {message:{translate:'shard.region.cmd.editRegion.doesNotExist'}, status:1}};

    // Show edit form.
    Module.forms.edit.show(context, name);

    return undefined;
};




// Initialize Command.
export const Command = new ShardCommand(
    'editregion',
    'Edit a region.',
    [
        {name:'name', type:CustomCommandParamType.String},
    ],
    [],
    CommandPermissionLevel.Admin,
    [],
    Callback,
);