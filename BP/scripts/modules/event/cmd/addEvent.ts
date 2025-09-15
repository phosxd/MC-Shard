import {CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {Module, Event} from '../module';
import EventVariables from '../eventVariables';
import CommandEnums from '../commandEnums';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const name:string = args[0];
    const eventId:string = args[1];
    if (!Object.keys(EventVariables).includes(eventId)) {return};

    const currentEvent = Module.persisData.events[name];
    if (currentEvent) {return {message:{translate:'shard.misc.createDuplicateName'}, status:1}};
    if (!CommandEnums.eventId.includes(eventId)) {return {message:{translate:'shard.misc.createInvalidParam', with:['eventId']}, status:1}};

    const newEvent:Event = {
        name: name,
        eventId: eventId,
        actors: {},
    };
    Module.persisData.events[name] = newEvent;
    Module.saveData();

    return {message:{translate:'shard.event.cmd.addEvent.success', with:[name]}, status:0};
};




// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'addevent',
        brief: 'shard.event.cmd.addEvent.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'name', type:CustomCommandParamType.String},
            {name:'sh:eventId', type:CustomCommandParamType.Enum},
        ],
    },
    {callback: Callback},
);