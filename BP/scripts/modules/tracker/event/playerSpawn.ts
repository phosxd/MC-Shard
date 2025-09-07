import {PlayerSpawnAfterEvent} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {Scoreboards} from '../module';


function Callback(event:PlayerSpawnAfterEvent) {
    if (!event.initialSpawn) {return};
    if (!event.player.hasTag('sh.tk.playerJoins')) {return};
    Scoreboards['sh.tk.playerJoins'].addScore(event.player, 1);
};


// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'after', eventId:'playerSpawn'},
    {callback: Callback},
);