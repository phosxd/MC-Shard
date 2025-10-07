import {system, PlayerSpawnAfterEvent} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {StringFormat} from '../../../util/string';
import {Module, Event} from '../module';


function Callback(event:PlayerSpawnAfterEvent) {
    const player = event.player;
    const initialSpawn = event.initialSpawn;
    const env = {player:player, initialSpawn:initialSpawn};
    system.run(()=>{
        (Object.values(Module.persisData.events) as Array<Event>).forEach(event => {
            if (event.eventId != 'playerSpawn') {return};
            const playerActor = event.actors.player;
            if (playerActor) {
                try {player.runCommand(StringFormat(playerActor.command, env))} catch {};
            };
        });
    });
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'after', eventId:'playerSpawn'},
    {callback: Callback},
);