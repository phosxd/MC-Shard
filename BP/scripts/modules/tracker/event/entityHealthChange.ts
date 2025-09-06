import {world, system, EntityHealthChangedAfterEvent, Player} from '@minecraft/server';
import ShardEventListener from '../../../ShardAPI/event_listener';
import {Scoreboards} from '../module';




function Callback(event:EntityHealthChangedAfterEvent) {
    if (!event.entity.hasTag('sh.tk.health')) {return};

    Scoreboards['sh.tk.health'].setScore(event.entity, event.newValue);
};




// Initialize event listener.
export const EventListener:ShardEventListener = new ShardEventListener(
    'world',
    'after',
    'entityHealthChanged',
    Callback,
);