import {system, world, Player, Entity} from '@minecraft/server';
import {Dictionary} from './CONST';
import {GetAllEntities} from './util';


export class EventSignal {
    /**Database for listeners to share data & communicate with each other.*/
    sharedData: Dictionary<any>;
    /**All listeners for this event.*/
    _listeners: Array<any>;
    constructor() {
        this._listeners = [];
        this.sharedData = {};
    };

    _subscribe(callback): void {
        this._listeners.push(callback);
    };
    _unsubscribe(callback): void {
        this._listeners.splice(this._listeners.indexOf(callback), 1);
    };
    subscribe(callback:()=>void): void {
        this._subscribe(callback);
    };
    unsubscribe(callback:Function): void {
        this._unsubscribe(callback);
    };

    /**
     * Call all listeners for this event.
     * If a return value is expected, do not use this.
    */
    call(...args): void {
        // Reset `sharedData`.
        Object.keys(this.sharedData).forEach(key => {
            delete this.sharedData[key];
        });
        // Call listeners.
        this._listeners.forEach(listener => {
            listener(...args);
        });
    };
};


export class TickEventSignal extends EventSignal {};


export interface EntityTickEvent {
    entity: Entity,
};

export class EntityTickEventSignal extends EventSignal {
    subscribe(callback:(event:EntityTickEvent)=>void): void {
        this._subscribe(callback);
    };
};


export interface PlayerDropItemEvent {
    player: Player,
    droppedItem: Entity,
};

export class PlayerDropItemEventSignal extends EventSignal {
    subscribe(callback:(event:PlayerDropItemEvent)=>void): void {
        this._subscribe(callback);
    };
};




// All Shard after events.
export const afterEvents = {
    /**Runs every server tick.*/
    tick: new TickEventSignal(),
    /**Runs every server tick for each entity.*/
    entityTick: new EntityTickEventSignal(),
    /**
     * Runs when a player drops an item from their inventory.
     * *Can produce false positives.*
    */
    playerDropItem: new PlayerDropItemEventSignal(),
};




// Tick loop.
function tick() {
    // Run tick listeners.
    afterEvents.tick.call();
    // Run entity tick listeners.
    if (afterEvents.entityTick._listeners.length > 0) {
        const allEntities = GetAllEntities();
        allEntities.forEach(entity => {
            if (!entity.isValid) {return};
            afterEvents.entityTick.call(entity);
        });
    };
};

// Start loop.
system.runInterval(tick, 1);


// Player drop item event.
// I dont like using this method of checking for dropped items, it allows the possibility to attribute the item to other players.
// So I am keeping the old logic until I find a way to detect dropping items from cursor inventory.
world.afterEvents.entitySpawn.subscribe(event => {
    if (event.entity.typeId != 'minecraft:item') return;
    if (!event.entity.isValid) {return};
    // Get player that dropped.
    const player = event.entity.dimension.getEntities({type:'minecraft:player', location:event.entity.location, maxDistance:2.5, closest:1})[0];
    if (!player) return;
    // Run listeners.
    afterEvents.playerDropItem._listeners.forEach(listener => {
        if (!event.entity.isValid) {return};
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