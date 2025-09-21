import {CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {Module} from '../module';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const name:string = args[0];
    if (!Module.persisData.events[name]) {return {message:{translate:'shard.event.cmd.editEvent.doesNotExist'}, status:1}};
    // Show edit form.
    Module.forms.edit.show(context, [name]);
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'editevent',
        brief: 'shard.event.cmd.editEvent.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'name', type:CustomCommandParamType.String},
        ],
    },
    {callback: Callback},
);