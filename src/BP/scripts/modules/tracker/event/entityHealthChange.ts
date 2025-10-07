import {EntityHealthChangedAfterEvent} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {Scoreboards} from '../module';


function Callback(event:EntityHealthChangedAfterEvent) {
    if (!event.entity.isValid) {return};
    if (!event.entity.hasTag('sh.tk.health')) {return};
    Scoreboards['sh.tk.health'].setScore(event.entity, event.newValue);
};


// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'after', eventId:'entityHealthChanged'},
    {callback: Callback},
);