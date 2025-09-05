import {world, system, Player, PlayerSpawnAfterEvent} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {VersionString} from '../../../Shard/CONST';




function Callback(event:PlayerSpawnAfterEvent) {
    if (!event.initialSpawn) {return};
    event.player.sendMessage({translate:'shard.misc.welcomeMessage', with:[event.player.name, VersionString]});
};




// Initialize event listener.
export const MAIN:ShardListener = new ShardListener(
    {
        source: 'world',
        type: 'after',
        eventId: 'playerSpawn',
    },
    {
        callback: Callback,
    },
);