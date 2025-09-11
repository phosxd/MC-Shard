import {system, world, Player, Entity} from '@minecraft/server';
import {Dictionary} from './CONST';


export class TickEventSignal {
    _listeners:Array<(data:Dictionary<any>)=>Dictionary<any>>;

    constructor() {
        this._listeners = [];
    };
    subscribe(callback:(data:Dictionary<any>)=>Dictionary<any>):void {
        this._listeners.push(callback);
    };
    unsubscribe(callback:(data:Dictionary<any>)=>Dictionary<any>):void {
        this._listeners.splice(this._listeners.indexOf(callback), 1);
    };
};


export interface PlayerDropItemEvent {
    player: Player,
    droppedItem: Entity,
};
export class PlayerDropItemEventSignal {
    _listeners:Array<(event:PlayerDropItemEvent)=>void>;

    constructor() {
        this._listeners = [];
    };
    subscribe(callback:(event:PlayerDropItemEvent)=>void):void {
        this._listeners.push(callback);
    };
    unsubscribe(callback:(event:PlayerDropItemEvent)=>void):void {
        this._listeners.splice(this._listeners.indexOf(callback), 1);
    };
};




// All Shard after events.
export const afterEvents = {
    /**Runs every server tick (1/20th seconds).
     * 
     * `data` is the data passed onto the next listener, this exists for separate listeners to be able to share resources to save performance.
    */
    tick: new TickEventSignal(),
    /**Runs when a player drops an item from their inventory.*/
    playerDropItem: new PlayerDropItemEventSignal(),
};




// Tick loop.
function tick() {
    let data:Dictionary<any> = {};
    afterEvents.tick._listeners.forEach(listener => {
        data = listener(data);
    });
    
    system.run(tick);
};
system.run(tick);


// Player drop item event.
// I dont like using this method of checking for dropped items, it allows the possibility to attribute the item to other players.
// So I am keeping the old logic until I find a way to detect dropping items from cursor inventory.
world.afterEvents.entitySpawn.subscribe(event => {
    if (event.entity.typeId != 'minecraft:item') return;
    // Get dropped item.
    const player = event.entity.dimension.getEntities({type:'minecraft:player', location:event.entity.location, maxDistance:3, closest:1})[0];
    if (!player) return;
    // Run listeners.
    afterEvents.playerDropItem._listeners.forEach(listener => {
        listener({
            player: player,
            droppedItem: event.entity,
        } as PlayerDropItemEvent);
    });
})
// Old logic for drop event. Cannot be used because dropping items from the cursor inventory is not detected.
/**
// Player drop item event.
world.afterEvents.playerInventoryItemChange.subscribe(event => {
    const cursorInventory = event.player.getComponent('cursor_inventory');
    console.warn('test');
    if (!event.beforeItemStack) {return};
    
    // If item stack moved to cursor inventory, cancel event.
    if (cursorInventory.item) {
        console.warn(cursorInventory.item.amount <= event.beforeItemStack.amount);
        if (cursorInventory.item.typeId == event.beforeItemStack.typeId
        && cursorInventory.item.nameTag == event.beforeItemStack.nameTag
        && cursorInventory.item.amount <= event.beforeItemStack.amount) {
            return;
        };
    };
    let dropped:boolean = false;
    // If item stack still present in inventory, check if amount is lower than before, if not cancel event.
    if (event.itemStack) {
        if (event.beforeItemStack.typeId == event.itemStack.typeId
        && event.beforeItemStack.nameTag == event.itemStack.nameTag
        && event.beforeItemStack.amount > event.itemStack.amount) {
            dropped = true;
        };
    }
    else {dropped = true};
    if (!dropped) {return};

    // Get dropped item entity.
    const droppedItem = event.player.dimension.getEntities({type:'minecraft:item', location:event.player.location, maxDistance:5, closest:1})[0];
    // Run listeners.
    afterEvents.playerDropItem._listeners.forEach(listener => {
        listener({
            player: event.player,
            droppedItem: droppedItem,
        } as PlayerDropItemEvent);
    });
});
*/