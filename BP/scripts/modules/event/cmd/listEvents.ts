import {CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {Module, Event} from '../module';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const eventKeys:Array<string> = Object.keys(Module.persisData.events);
    if (eventKeys.length == 0) {return {message:{translate:'shard.event.cmd.listEvents.none'}, status:1}};

    let list:string = '';
    eventKeys.forEach(key => {
        const event:Event = Module.persisData.events[key];
        list += '\n§r- §5Name: §7'+event.name+' §5EventID: §7'+event.eventId;
    });

    return {message:{translate:'shard.event.cmd.listEvents.success', with:[list]}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'listevents',
        brief: 'shard.event.cmd.listEvents.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
    },
    {callback: Callback},
);