import ShardEventListener from '../../../ShardAPI/event_listener';
import {MC, Dictionary} from '../../../ShardAPI/CONST';
import {Module} from '../module';


const Source = 'shard';
const Type = 'after';
const EventId:string = 'tick';




// Apply frozen entity functions. Frozen entities are added via "/freeze".
function runFrozenEntityEffects() {
    for (let key in Module.persisData.frozenEntities) {
        let entry:Dictionary<any> = Module.persisData.frozenEntities[key];
        let entity:MC.Entity = MC.world.getEntity(key);
        if (entity !== undefined) {
            entity.teleport(entry.location);
            entity.setRotation(entry.rotation);
        };
        entry.time -= 1/20;
        if (entry.time <= 0) {delete Module.persisData.frozenEntities[key]};
    };
};


function Callback() {
    if (Module.persisDataReady == false) {return};
    
    runFrozenEntityEffects();
    Module.saveData();
};




// Initialize event listener.
export const EventListener:ShardEventListener = new ShardEventListener(
    Source,
    Type,
    EventId,
    Callback,
);