import {world, system, Player} from '@minecraft/server';
import ShardEventListener from '../../../ShardAPI/event_listener';
import {Scoreboards} from '../module';




function Callback(event:{player:Player}) {
    Scoreboards['sh.tk.playerJoins'].addScore(event.player, 1);
};




// Initialize event listener.
export const EventListener:ShardEventListener = new ShardEventListener(
    'shard',
    'after',
    'playerLoad',
    Callback,
);