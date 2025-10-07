import {} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {PlayerDropItemEvent} from '../../../Shard/event_server';
import {StringFormat} from '../../../util/string';
import {Module, Event} from '../module';


function Callback(event:PlayerDropItemEvent) {
    const player = event.player;
    const droppedItem = event.droppedItem;
    const env = {player:player, droppedItem:droppedItem, item:droppedItem.getComponent('item').itemStack};
    (Object.values(Module.persisData.events) as Array<Event>).forEach(event => {
        if (event.eventId != 'playerDropItem') {return};
        const playerActor = event.actors.player;
        const droppedItemActor = event.actors.droppedItem;
        if (playerActor) {
            try {player.runCommand(StringFormat(playerActor.command, env))} catch {};
        };
        if (droppedItemActor) {
            try {droppedItem.runCommand(StringFormat(droppedItemActor.command, env))} catch {};
        };
    });
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'shard', type:'after', eventId:'playerDropItem'},
    {callback: Callback},
);