import {world, system, Player} from '@minecraft/server';
import ShardEventListener from '../../../ShardAPI/event_listener';
import {VersionString} from '../../../ShardAPI/CONST';




function Callback(event:{player:Player}) {
    event.player.sendMessage({translate:'shard.misc.welcomeMessage', with:[event.player.name, VersionString]});
};




// Initialize event listener.
export const EventListener:ShardEventListener = new ShardEventListener(
    'shard',
    'after',
    'playerLoad',
    Callback,
);