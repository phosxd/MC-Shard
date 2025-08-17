import {EntityRemoveAfterEvent} from '@minecraft/server';
import ShardEventListener from '../../../ShardAPI/event_listener';
import {Module} from '../module';




function removeFrozenEntityEntry(entityId:string) {
    delete Module.persisData.frozenEntities[entityId];
};


function Callback(event:EntityRemoveAfterEvent) {
    if (event.typeId !== 'minecraft:player') {
        removeFrozenEntityEntry(event.removedEntityId);
    };
};




// Initialize event listener.
export const EventListener:ShardEventListener = new ShardEventListener(
    'world',
    'after',
    'entityRemove',
    Callback,
);