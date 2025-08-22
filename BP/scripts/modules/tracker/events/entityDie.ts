import {world, system, EntityDieAfterEvent, Player} from '@minecraft/server';
import ShardEventListener from '../../../ShardAPI/event_listener';
import {Scoreboards} from '../module';




function Callback(event:EntityDieAfterEvent) {
    if (event.deadEntity.typeId !== 'minecraft:player') {return};

    Scoreboards['sh.tk.playerDeaths'].addScore(event.deadEntity, 1);
};




// Initialize event listener.
export const EventListener:ShardEventListener = new ShardEventListener(
    'world',
    'after',
    'entityDie',
    Callback,
);