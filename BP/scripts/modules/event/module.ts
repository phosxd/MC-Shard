import {} from '@minecraft/server';
import {Dictionary} from '../../Shard/CONST';
import {ShardModule} from '../../Shard/module';
import CommandEnums from './commandEnums';


export interface Event {
    name: string,
    eventId: string,
    actorCommands: Dictionary<{
        actorId: string,
        command: string,
    }>,
};




// Instantiate Module.
export const Module = new ShardModule(
    {id:'event', displayName:{translate:'shard.event.displayName'}, brief:{translate:'shard.event.brief'}},
    {
        childPaths: [
            'cmd/addEvent',
            'cmd/listEvents',
            'cmd/removeEvent',
        ],
        commandEnums: CommandEnums,
        extraDefaultPersisData: {
            events: {},
        },
    },
);