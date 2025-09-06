import {EntityRemoveAfterEvent} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
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
export const MAIN = new ShardListener(
    {
        source: 'world',
        type: 'after',
        eventId: 'entityRemove',
    },
    {callback: Callback},
);