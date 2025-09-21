import {} from '@minecraft/server';
import {Dictionary} from '../../Shard/CONST';
import {ShardModule} from '../../Shard/module';
import CommandEnums from './commandEnums';


export interface Event {
    name: string,
    eventId: string,
    actors: Dictionary<{
        command: string,
    }>,
};




// Instantiate Module.
export const Module = new ShardModule(
    {id:'event', displayName:{translate:'shard.event.displayName'}, brief:{translate:'shard.event.brief'}},
    {
        childPaths: [
            'event/buttonPush',
            'event/entityDie',
            'event/explosion',
            'event/playerBreakBlock',
            'event/playerDropItem',
            'event/playerInteractWithBlock',
            'event/playerPlaceBlock',
            'event/playerSpawn',
            'event/playerUseItem',
            'cmd/addEvent',
            'cmd/editEvent',
            'cmd/eventVariables',
            'cmd/listEvents',
            'cmd/removeEvent',
            'form/edit',
        ],
        commandEnums: CommandEnums,
        extraDefaultPersisData: {
            events: {},
        },
    },
);