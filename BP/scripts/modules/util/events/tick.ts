import ShardEventListener from '../../../ShardAPI/event_listener';
import {MC, Dictionary} from '../../../ShardAPI/CONST';
import {Module} from '../module';




// Apply frozen entity functions. Frozen entities are added via "/freeze".
function runFrozenEntityEffects() {
    for (let key in Module.persisData.frozenEntities) {
        const entry:Dictionary<any> = Module.persisData.frozenEntities[key];
        const entity:MC.Entity = MC.world.getEntity(key);
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


function Callback() {
    if (Module.persisDataReady == false || Module.worldReady == false) {return};
    
    runFrozenEntityEffects();
    Module.saveData();
};




// Initialize event listener.
export const EventListener:ShardEventListener = new ShardEventListener(
    'shard',
    'after',
    'tick',
    Callback,
);