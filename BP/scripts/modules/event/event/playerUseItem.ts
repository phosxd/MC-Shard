import {ItemUseAfterEvent} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {Format} from '../../../util/string';
import {Module, Event} from '../module';


function Callback(event:ItemUseAfterEvent) {
    const player = event.source;
    const item = event.itemStack;
    const env = {player:player, item:item};
    (Object.values(Module.persisData.events) as Array<Event>).forEach(event => {
        if (event.eventId != 'playerUseItem') {return};
        const playerActor = event.actors.player;
        if (playerActor) {
            try {player.runCommand(Format(playerActor.command, env))} catch {};
        };
    });
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'after', eventId:'itemUse'},
    {callback: Callback},
);