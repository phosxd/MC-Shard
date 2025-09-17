import {PlayerPlaceBlockAfterEvent} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {StringifyVector3} from '../../../Shard/util';
import {StringFormat} from '../../../util/string';
import {Module, Event} from '../module';


function Callback(event:PlayerPlaceBlockAfterEvent) {
    const player = event.player;
    const block = event.block;
    const env = {player:player, block:block};
    (Object.values(Module.persisData.events) as Array<Event>).forEach(event => {
        if (event.eventId != 'playerInteractWithBlock') {return};
        const playerActor = event.actors.player;
        const blockActor = event.actors.block;
        if (playerActor) {
            try {player.runCommand(StringFormat(playerActor.command, env))} catch {};
        };
        if (playerActor) {
            try {block.dimension.runCommand(`execute positioned ${StringifyVector3(block.location)} run ${StringFormat(blockActor.command, env)}`)} catch {};
        };
    });
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'after', eventId:'playerInteractWithBlock'},
    {callback: Callback},
);