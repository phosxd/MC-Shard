import {CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {Module} from '../module';


function Callback(_context:ShardCommandContext, args:Array<any>) {
    const name:string = args[0];
    const currentEvent = Module.persisData.events[name];
    if (!currentEvent) {return {message:{translate:'shard.event.cmd.removeEvent.doesNotExist'}, status:1}};
    // Delete border.
    delete Module.persisData.events[name];
    Module.saveData();
    // Return.
    return {message:{translate:'shard.event.cmd.removeEvent.success', with:[name]}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'removeevent',
        brief: 'shard.event.cmd.removeEvent.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'name', type:CustomCommandParamType.String},
        ],
    },
    {callback: Callback},
);