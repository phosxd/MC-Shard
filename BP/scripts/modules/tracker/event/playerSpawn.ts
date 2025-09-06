import {world, system, Player, PlayerSpawnAfterEvent} from '@minecraft/server';
import ShardEventListener from '../../../ShardAPI/event_listener';
import {Scoreboards} from '../module';




function Callback(event:PlayerSpawnAfterEvent) {
    if (!event.initialSpawn) {return};
    if (!event.player.hasTag('sh.tk.playerJoins')) {return};

    Scoreboards['sh.tk.playerJoins'].addScore(event.player, 1);
};




// Initialize event listener.
export const EventListener:ShardEventListener = new ShardEventListener(
    'world',
    'after',
    'playerSpawn',
    Callback,
);