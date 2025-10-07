import {PlayerSpawnAfterEvent} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {VersionString} from '../../../Shard/CONST';
import {Module} from '../module';


function Callback(event:PlayerSpawnAfterEvent) {
    if (!event.initialSpawn) {return};
    if (!Module.persisData.settings.sendWelcomeMessage) {return};
    event.player.sendMessage({translate:'shard.core.welcomeMessage', with:[event.player.name, VersionString]});
};


// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'after', eventId:'playerSpawn'},
    {callback: Callback},
);