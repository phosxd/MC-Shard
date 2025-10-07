import {PlayerSpawnAfterEvent} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';


function Callback(event:PlayerSpawnAfterEvent) {
    event.player.runCommand('say Example');
};


// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'after', eventId:'playerSpawn'},
    {callback: Callback},
);