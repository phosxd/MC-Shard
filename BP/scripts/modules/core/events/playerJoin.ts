// This event handles sending players the Shard welcome message.


import {world, system, PlayerJoinAfterEvent, Player} from '@minecraft/server';
import ShardEventListener from '../../../ShardAPI/event_listener';
import {VersionString} from '../../../ShardAPI/CONST';


const attempts:number = 10; // How many times it attempts to find the player.
const attempt_interval:number = 20; // Ticks between each attempt.

let attempt_count:number = 0;




function Attempt(event:PlayerJoinAfterEvent) {
    attempt_count += 1;
    // Quit if used all attempts.
    if (attempt_count > attempts) {return};
    const players:Array<Player> = world.getPlayers({name:event.playerName});
    const player = players[0];
    // If no player, try again.
    if (player == undefined) {
        system.runTimeout(Attempt.bind(this,event), attempt_interval);
        return;
    };

    // If player found, send message.
    player.sendMessage({translate:'shard.misc.welcomeMessage', with:[player.name, VersionString]});
};


function Callback(event:PlayerJoinAfterEvent) {
    attempt_count = 0; // Reset attempt count.
    system.runTimeout(Attempt.bind(this,event), attempt_interval);
};




// Initialize event listener.
export const EventListener:ShardEventListener = new ShardEventListener(
    'world',
    'after',
    'playerJoin',
    Callback,
);