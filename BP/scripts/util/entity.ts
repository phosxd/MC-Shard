import {Dictionary} from '../Shard/CONST';
import {system, Dimension, Entity, Vector2, Vector3} from '@minecraft/server';
import {ItemStackObject, ItemStackToObject, ObjectToItemStack} from './item';

const equipmentSlots = ['head','chest','legs','feet','offhand'];


/**
 * `Object` representation of an `Entity`.
*/
export interface EntityObject {
    typeId: string,
    rotation: Vector2,
    velocity?: Vector3,
    nameTag?: string,
    effects?: Array<MobEffectObject>,
    tags?: Array<string>,
    health?: number,
    onFire?: number,
    isBaby?: boolean,
    isCharged?: boolean,
    isChested?: boolean,
    isSaddled?: boolean,
    isTamed?: boolean,
    isSheared?: boolean,
    inventoryContainer?: Array<ItemStackObject|0>,
    equipmentContainer?: Dictionary<ItemStackObject>,
    dynamicProperties?: Dictionary<any>,
};


/**
 * `Object` representation of an `Entity` mob effect.
*/
export interface MobEffectObject {
    typeId: string,
    duration: number,
    amplifier: number,
};


/**
 * Convert `Entity` class instance into an `Object`.
 * 
 * @param {Entity} entity Item stack to convert.
 * 
 * Cannot preserve:
 * - Most components.
 * - Mob equipment. Can preserve mob inventories though.
 * - Mob variants.
*/
export function EntityToObject(entity:Entity):EntityObject {
    const result:EntityObject = {
        typeId: entity.typeId,
        rotation: entity.getRotation(),
        velocity: entity.getVelocity(),
    };
    // Tags.
    if (entity.getTags().length != 0) {result.tags = entity.getTags()};
    // Name tag.
    if (entity.nameTag.length != 0) {result.nameTag = entity.nameTag};
    // Effects.
    if (entity.getEffects().length != 0) {result.effects = []};
    entity.getEffects().forEach(effect => {
        result.effects.push({
            typeId: effect.typeId,
            duration: effect.duration,
            amplifier: effect.amplifier,
        } as MobEffectObject);
    });
    // Health.
    const health = entity.getComponent('health');
    if (health) {result.health = health.currentValue};
    // On Fire.
    const onFire = entity.getComponent('onfire');
    if (onFire) {result.onFire = onFire.onFireTicksRemaining};
    // Inventory.
    const inventory = entity.getComponent('inventory');
    if (inventory) {
        const container = inventory.container;
        result.inventoryContainer = [];
        for (let i:number=0; i < container.size-1; i++) {
            const item = container.getItem(i);
            if (!item) {
                result.inventoryContainer.push(0);
                continue;
            };
            result.inventoryContainer.push(ItemStackToObject(item));
        };
    };
    const equip = entity.getComponent('equippable');
    if (equip) {
        result.equipmentContainer = {};
        equipmentSlots.forEach(slot => {
            const item = equip.getEquipment(slot as any);
            if (!item) {return};
            result.equipmentContainer[slot] = ItemStackToObject(item);
        });
    };
    // Other components.
    if (entity.getComponent('is_baby')) {result.isBaby = true};
    if (entity.getComponent('is_charged')) {result.isCharged = true};
    if (entity.getComponent('is_saddled')) {result.isSaddled = true};
    if (entity.getComponent('is_chested')) {result.isChested = true};
    if (entity.getComponent('is_tamed')) {result.isTamed = true};
    if (entity.getComponent('is_sheared')) {result.isSheared = true};
    // Dynamic properties.
    if (entity.getDynamicPropertyIds().length != 0) {result.dynamicProperties = {}};
    entity.getDynamicPropertyIds().forEach(id => {
        result.dynamicProperties[id] = entity.getDynamicProperty(id);
    });

    // Return.
    return result;
};


/**
 * Convert `Object` back into an `Entity`. Spawns the entity in the world.
 * 
 * @param {EntityObject} data Object to convert.
*/
export function ObjectToEntity(data:EntityObject, dimension:Dimension, location:Vector3) {
    const entity = dimension.spawnEntity(data.typeId, location);
    const events:Array<string> = [];
    entity.setRotation(data.rotation);
    // Velocity.
    if (data.velocity) {
        try {entity.applyImpulse(data.velocity)} catch {};
    };
    if (data.nameTag) {entity.nameTag = data.nameTag};
    // Effects.
    if (data.effects) {
        data.effects.forEach(effect => {
            entity.addEffect(effect.typeId, effect.duration, {amplifier:effect.amplifier, showParticles:true}); // `HardEntityEffect` does not store `showParticles` flag, defaults to true.
        });
    };
    // Tags.
    if (data.tags) {
        data.tags.forEach(tag => {
            entity.addTag(tag);
        });
    };
    // Run after mob events.
    system.run(()=>{
        // Health.
        const health = entity.getComponent('health');
        if (data.health && health) {health.setCurrentValue(Math.min(data.health, health.effectiveMax))};
        // Inventory.
        const inventory = entity.getComponent('inventory');
        if (inventory) {
            const container = inventory.container;
            container.clearAll();
            // Add items.
            if (data.inventoryContainer) {
                let index:number = -1;
                data.inventoryContainer.forEach(item => {
                    index += 1;
                    if (item == 0) {return};
                    container.setItem(index, ObjectToItemStack(item));
                });
            };
        };
        // Equippable.
        const equip = entity.getComponent('equippable');
        if (equip) {
            // Clear equipment.
            equipmentSlots.forEach(slot => {
                equip.setEquipment(slot as any);
            });
            // Add items.
            if (data.equipmentContainer) {
                for (const slot in data.equipmentContainer) {
                    equip.setEquipment(slot as any, ObjectToItemStack(data.equipmentContainer[slot]));
                };
            };
        };
    });
    // Other components.
    if (data.onFire) {entity.setOnFire(data.onFire/20)};
    if (data.isBaby) {events.push('minecraft:entity_born')}
    else {events.push('minecraft:spawn_adult')};
    if (data.isCharged) {events.push('minecraft:become_charged')};
    if (data.isTamed) {events.push('minecraft:on_tame')};
    if (data.isSaddled) {
        switch (entity.typeId) {
            case 'minecraft:donkey': {events.push('minecraft:donkey_saddled'); break};
            case 'minecraft:horse': {events.push('minecraft:horse_saddled'); break};
            case 'minecraft:mule': {events.push('minecraft:mule_saddled'); break};
            case 'minecraft:pig': {events.push('minecraft:on_saddled'); break};
        };
    };
    if (data.isChested) {events.push('minecraft:on_chest')};
    if (data.isSheared) {events.push('minecraft:on_sheared')};
    // Dynamic properties.
    if (data.dynamicProperties) {
        Object.keys(data.dynamicProperties).forEach(key => {
            const value = data.dynamicProperties[key];
            entity.setDynamicProperty(key, value);
        });
    };
    // Trigger events.
    events.forEach(event => {
        // Some entities may not have the event, so try-catch is used a a safeguard to prevent destructive errors.
        try {entity.triggerEvent(event)} catch {};
    });

    // Return.
    return entity;
};




/**
 * Tests if the Entity Selector applies to the `Entity`.
 * Selector example: `type=cow,r=5,c=1`.
 * 
 * Cannot be called in `read-only` mode.
*/
export function SelectorApplies(entity:Entity, selector:string):boolean {
    const testTag = `sh:selectorTest`;
    entity.removeTag(testTag); // Just in case the entity somehow has the tag already.
    entity.runCommand(`tag @s[${selector}] add ${testTag}`); // Add tag if selector selects the entity.
    // Return true if entity has tag.
    if (entity.hasTag(testTag)) {
        entity.removeTag(testTag);
        return true;
    };
    // Otherwise return false.
    return false;
};