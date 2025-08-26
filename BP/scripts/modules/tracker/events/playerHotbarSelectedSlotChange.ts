import {world, system, PlayerHotbarSelectedSlotChangeAfterEvent, Player} from '@minecraft/server';
import ShardEventListener from '../../../ShardAPI/event_listener';
import {Scoreboards} from '../module';




function Callback(event:PlayerHotbarSelectedSlotChangeAfterEvent) {
    if (event.player.typeId !== 'minecraft:player') {return};
    if (!event.player.hasTag('sh.tk.holdingSlot')) {return};

    Scoreboards['sh.tk.holdingSlot'].setScore(event.player, event.newSlotSelected);
};




// Initialize event listener.
export const EventListener:ShardEventListener = new ShardEventListener(
    'world',
    'after',
    'playerHotbarSelectedSlotChange',
    Callback,
);