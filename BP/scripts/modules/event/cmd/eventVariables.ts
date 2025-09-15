import {CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {Module, Event} from '../module';
import EventVariables from '../eventVariables';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const eventId:string = args[0];
    if (!Object.keys(EventVariables).includes(eventId)) {return};

    let list:string = '';
    EventVariables[eventId].forEach(item => {
        list += '\n§r- §7'+item;
    });

    return {message:{translate:'shard.event.cmd.eventVariables.success', with:[eventId, list]}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'eventvariables',
        brief: 'shard.event.cmd.eventVariables.brief',
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
            {name:'sh:eventId', type:CustomCommandParamType.Enum},
        ],
    },
    {callback: Callback},
);