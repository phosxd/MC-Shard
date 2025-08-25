import {world, system, Player, PlayerSpawnAfterEvent} from '@minecraft/server';
import ShardEventListener from '../../../ShardAPI/event_listener';
import {VersionString} from '../../../ShardAPI/CONST';




function Callback(event:PlayerSpawnAfterEvent) {
    if (!event.initialSpawn) {return};
    event.player.sendMessage({translate:'shard.misc.welcomeMessage', with:[event.player.name, VersionString]});
};




// Initialize event listener.
export const EventListener:ShardEventListener = new ShardEventListener(
    'world',
    'after',
    'playerSpawn',
    Callback,
);