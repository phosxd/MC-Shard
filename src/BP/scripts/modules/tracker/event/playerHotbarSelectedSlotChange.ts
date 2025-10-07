import {PlayerHotbarSelectedSlotChangeAfterEvent} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {Scoreboards} from '../module';


function Callback(event:PlayerHotbarSelectedSlotChangeAfterEvent) {
    if (event.player.typeId !== 'minecraft:player') {return};
    if (!event.player.hasTag('sh.tk.holdingSlot')) {return};
    Scoreboards['sh.tk.holdingSlot'].setScore(event.player, event.newSlotSelected);
};


// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'after', eventId:'playerHotbarSelectedSlotChange'},
    {callback: Callback},
);