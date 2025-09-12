import {PlayerInteractWithEntityAfterEvent} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {ShardCommandContext} from '../../../Shard/command';
import {Module} from '../module';


function Callback(event:PlayerInteractWithEntityAfterEvent) {
    if (event.target.typeId != 'shard:display') {return};
    // Open form UI to edit text display.
    Module.forms.edit.show(ShardCommandContext.generate(event.player), [event.target]);
};


// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'after', eventId:'playerInteractWithEntity'},
    {callback: Callback},
);