import {EntityDieAfterEvent} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {Scoreboards} from '../module';


function Callback(event:EntityDieAfterEvent) {
    if (event.deadEntity.typeId !== 'minecraft:player') {return};
    if (!event.deadEntity.hasTag('sh.tk.playerDeaths')) {return};
    Scoreboards['sh.tk.playerDeaths'].addScore(event.deadEntity, 1);
};


// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'after', eventId:'entityDie'},
    {callback: Callback},
);