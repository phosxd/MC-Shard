import ShardEventListener from '../../../ShardAPI/event_listener';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';
import {Module} from '../module';




function Callback(event:MC.PlayerInteractWithEntityAfterEvent) {
    if (event.target.typeId !== 'shard:text_display') {return};
    // Open form UI to edit text display.
    Module.forms.edit.show(ShardCommandContext.generate(event.player), event.target);
};




// Initialize event listener.
export const EventListener:ShardEventListener = new ShardEventListener(
    'world',
    'after',
    'playerInteractWithEntity',
    Callback,
);