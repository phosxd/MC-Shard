import {world, Entity} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {Dictionary} from '../../../Shard/CONST';
import {Module} from '../module';


// Apply frozen entity functions. Frozen entities are added via "/freeze".
function runFrozenEntityEffects() {
    for (let key in Module.persisData.frozenEntities) {
        const entry:Dictionary<any> = Module.persisData.frozenEntities[key];
        const entity:Entity = world.getEntity(key);
        // Apply frozen effects if entity found.
        if (entity !== undefined) {
            entity.teleport(entry.location);
            entity.setRotation(entry.rotation);
        };
        entry.time -= 1/20; // Count down the timer.
        entry.time = entry.time.toFixed(3);
        // Delete frozen entity entry if time is up.
        if (entry.time <= 0) {delete Module.persisData.frozenEntities[key]};
    };
};


function Callback(data:Dictionary<any>) {
    if (Module.persisDataReady == false || Module.worldReady == false) {return data};
    
    runFrozenEntityEffects();
    Module.saveData();

    return data;
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {
        source: 'shard',
        type: 'after',
        eventId: 'tick',
    },
    {callback: Callback},
);