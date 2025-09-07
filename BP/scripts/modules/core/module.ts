import {world, Dimension, Entity, ItemStack, Vector2, Vector3, ItemLockMode, Enchantment, EnchantmentType} from '@minecraft/server';
import {Dictionary} from '../../Shard/CONST';
import {ShardModule} from '../../Shard/module';
import CommandEnums from './commandEnums';
//import * as mainForm from './forms/main';




/**Utility for compiling & decompiling hard-copies.*/
export const Hardcopy = {
    /**Compiles an `Entity` into an Object.*/
    compileEntity(entity:Entity):{type:'entity', data:HardEntity} {
        const result:HardEntity = {
            typeId: entity.typeId,
            rotation: entity.getRotation(),
            nameTag: entity.nameTag,
            effects: [],
            tags: entity.getTags(),
            dynamicProperties: {},
        };
        // Effects.
        entity.getEffects().forEach(effect => {
            result.effects.push({
                typeId: effect.typeId,
                duration: effect.duration,
                amplifier: effect.amplifier,
            });
        });
        // Dynamic properties.
        entity.getDynamicPropertyIds().forEach(id => {
            result.dynamicProperties[id] = entity.getDynamicProperty(id);
        });
        // Health.
        const health = entity.getComponent('minecraft:health');
        if (health) {result.health = health.currentValue};
        // On Fire.
        const onFire = entity.getComponent('minecraft:onfire');
        if (onFire) {result.onFire = onFire.onFireTicksRemaining};
        // Other components.
        if (entity.getComponent('minecraft:is_baby')) {result.isBaby = true};
        if (entity.getComponent('minecraft:is_charged')) {result.isCharged = true};
        if (entity.getComponent('minecraft:is_saddled')) {result.isSaddled = true};
        if (entity.getComponent('minecraft:is_chested')) {result.isChested = true};
        if (entity.getComponent('minecraft:is_tamed')) {result.isChested = true};
        if (entity.getComponent('minecraft:is_sheared')) {result.isSheared = true};
        // Return.
        return {type:'entity', data:result};
    },


    /**Compiles an `ItemStack` into an Object.*/
    compileItem(item:ItemStack):{type:'item', data:HardItemStack} {
        const result:HardItemStack = {
            typeId: item.typeId,
            amount: item.amount,
            nameTag: item.nameTag,
            lore: item.getLore(),
            enchants: [],
            lockMode: item.lockMode,
            keepOnDeath: item.keepOnDeath,
            dynamicProperties: {},
        };
        // Dynamic properties.
        item.getDynamicPropertyIds().forEach(id => {
            result.dynamicProperties[id] = item.getDynamicProperty(id);
        });
        // Enchants.
        const enchantable = item.getComponent('minecraft:enchantable')
        if (enchantable) {
            enchantable.getEnchantments().forEach(enchant => {
                result.enchants.push({
                    typeId: enchant.type.id,
                    level: enchant.level,
                });
            });
        };
        // Return.
        return {type:'item', data:result};
    },


    /**Decompiles `HardEntity` back into `Entity`.
     * Creates the entity in the world.
    */
    decompileEntity(data:HardEntity, dimension:Dimension, location:Vector3):Entity {
        const entity = dimension.spawnEntity(data.typeId, location);
        const events:Array<string> = [];
        entity.setRotation(data.rotation);
        entity.nameTag = data.nameTag;
        // Effects.
        data.effects.forEach(effect => {
            entity.addEffect(effect.typeId, effect.duration, {amplifier:effect.amplifier, showParticles:true}); // `HardEntityEffect` does not store `showParticles` flag, defaults to true.
        });
        // Tags.
        data.tags.forEach(tag => {
            entity.addTag(tag);
        });
        // Dynamic properties.
        Object.keys(data.dynamicProperties).forEach(key => {
            const value = data.dynamicProperties[key];
            entity.setDynamicProperty(key, value);
        });
        // Health.
        const health = entity.getComponent('minecraft:health');
        if (health) {health.setCurrentValue(Math.min(data.health, health.effectiveMax))};
        // Other components.
        if (data.onFire) {entity.setOnFire(data.onFire/20)};
        if (data.isBaby) {events.push('minecraft:entity_born')}
        else {events.push('minecraft:spawn_adult')};
        if (data.isCharged) {events.push('minecraft:become_charged')};
        if (data.isSaddled) {
            switch (entity.typeId) {
                case 'minecraft:donkey': {events.push('minecraft:donkey_saddled'); break};
                case 'minecraft:horse': {events.push('minecraft:horse_saddled'); break};
                case 'minecraft:mule': {events.push('minecraft:mule_saddled'); break};
                case 'minecraft:pig': {events.push('minecraft:on_saddled'); break};
            };
        };
        if (data.isChested) {events.push('minecraft:on_chest')};
        if (data.isTamed) {events.push('minecraft:on_tame')};
        if (data.isSheared) {events.push('minecraft:on_sheared')};
        // Trigger events.
        events.forEach(event => {
            // Some entities may not have the event, so try-catch is used a a safeguard to prevent destructive errors.
            try {entity.triggerEvent(event)} catch {};
        });
        // Return.
        return entity;
    },


    /**Decompiles `HardItemStack` back into `ItemStack`.
     * Creates the dropped item in the world.
    */
    decompileItem(data:HardItemStack, dimension:Dimension, location:Vector3) {
        const item = new ItemStack(data.typeId, data.amount);
        item.nameTag = data.nameTag;
        item.lockMode = data.lockMode;
        item.keepOnDeath = data.keepOnDeath;
        item.setLore(data.lore);
        // Enchants.
        const enchantable = item.getComponent('minecraft:enchantable');
        if (enchantable) {
            data.enchants.forEach(enchant => {
                const type = new EnchantmentType(enchant.typeId);
                enchantable.addEnchantment({type:type, level:enchant.level});
            });
        };
        // Dynamic properties.
        Object.keys(data.dynamicProperties).forEach(key => {
            const value = data.dynamicProperties[key];
            item.setDynamicProperty(key, value);
        });
        // Create in world then return.
        dimension.spawnItem(item, location);
        return item;
    },
};


/**Entity hard-copy.*/
export interface HardEntity {
    typeId: string,
    rotation: Vector2,
    nameTag: string,
    effects: Array<HardEntityEffect>,
    tags: Array<string>,
    health?: number,
    onFire?: number,
    isBaby?: boolean,
    isCharged?: boolean,
    isChested?: boolean,
    isSaddled?: boolean,
    isTamed?: boolean,
    isSheared?: boolean,
    dynamicProperties: Dictionary<any>,
};


export interface HardEntityEffect {
    typeId: string,
    duration: number,
    amplifier: number,
};


/**Item stack hard-copy.*/
export interface HardItemStack {
    typeId: string,
    amount: number,
    nameTag: string,
    lore: Array<string>,
    enchants: Array<{
        typeId: string,
        level: number,
    }>,
    lockMode: ItemLockMode,
    keepOnDeath: boolean,
    dynamicProperties: Dictionary<any>,
};




// Instantiate Module.
export const Module = new ShardModule(
    {
        id: 'core',
        displayName: {translate:'shard.core.displayName'},
        brief: {translate:'shard.core.brief'},
    },
    {
        childPaths: [
            'event/playerSpawn',
            'cmd/discord',
            'cmd/eval',
            'cmd/hcLoad',
            'cmd/hcPrintEntity',
            'cmd/module',
            'cmd/repeat',
            'cmd/shard',
            'cmd/shardMemory',
            'form/module_command_settings',
            'form/module_commands',
            'form/module',
            'form/shard',
        ],
        commandEnums: CommandEnums,
        //mainForm: mainForm.MAIN,
    },
);