import {Dictionary} from '../Shard/CONST';
import {ItemStack, ItemLockMode, EnchantmentType} from '@minecraft/server';


/**
 * `Object` representation of an `ItemStack`.
*/
export interface ItemStackObject {
    typeId: string,
    amount: number,
    nameTag?: string,
    lore?: Array<string>,
    durabilityDamage?: number,
    enchants?: Array<{
        typeId: string,
        level: number,
    }>,
    lockMode?: ItemLockMode,
    keepOnDeath?: boolean,
    canDestroy?: Array<string>,
    canPlaceOn?: Array<string>,
    dynamicProperties?: Dictionary<any>,
};


/**
 * Convert `ItemStack` class instance into an `Object`.
 * 
 * @param {ItemStack} itemStack Item stack to convert.
 * 
 * Cannot preserve:
 * - Item inventories.
 * - Metadata. For example, command block data.
 * - Dynamic properties (from other add-ons).
*/
export function ItemStackToObject(itemStack:ItemStack):ItemStackObject {
    const result:ItemStackObject = {
        typeId: itemStack.typeId,
        amount: itemStack.amount,
    };
    // Lock mode.
    if (itemStack.lockMode != 'none') {result.lockMode = itemStack.lockMode};
    // Keep on death.
    if (itemStack.keepOnDeath) {result.keepOnDeath = true};
    // Lore.
    if (itemStack.getLore().length != 0) {result.lore = itemStack.getLore()};
    // Name tag.
    if (itemStack.nameTag && itemStack.nameTag.length != 0) {result.nameTag = itemStack.nameTag};
    // Durability.
    const durability = itemStack.getComponent('durability');
    if (durability) {
        result.durabilityDamage = durability.damage;
    };
    // Enchants.
    const enchantable = itemStack.getComponent('enchantable');
    if (enchantable) {
        result.enchants = [];
        enchantable.getEnchantments().forEach(enchant => {
            result.enchants.push({
                typeId: enchant.type.id,
                level: enchant.level,
            });
        });
    };
    // Can destroy.
    const canDestroy = itemStack.getCanDestroy();
    if (canDestroy.length != 0) {
        result.canDestroy = canDestroy;
    };
    // Can place on.
    const canPlaceOn = itemStack.getCanPlaceOn();
    if (canPlaceOn.length != 0) {
        result.canPlaceOn = canPlaceOn;
    };
    // Dynamic properties.
    if (itemStack.getDynamicPropertyIds().length != 0) {result.dynamicProperties = {}};
    itemStack.getDynamicPropertyIds().forEach(id => {
        result.dynamicProperties[id] = itemStack.getDynamicProperty(id);
    });

    // Return.
    return result;
};


/**
 * Convert `Object` back into an `ItemStack`.
 * 
 * @param {ItemStackObject} data Object to convert.
*/
export function ObjectToItemStack(data:ItemStackObject) {
    const itemStack = new ItemStack(data.typeId, data.amount);
    if (data.nameTag) {itemStack.nameTag = data.nameTag};
    if (data.lockMode) {itemStack.lockMode = data.lockMode};
    if (data.keepOnDeath) {itemStack.keepOnDeath = data.keepOnDeath};
    if (data.lore) {itemStack.setLore(data.lore)};
    // Durability.
    const durability = itemStack.getComponent('minecraft:durability');
    if (data.durabilityDamage && durability) {
        durability.damage = data.durabilityDamage;
    };
    // Enchants.
    const enchantable = itemStack.getComponent('minecraft:enchantable');
    if (data.enchants && enchantable) {
        data.enchants.forEach(enchant => {
            const type = new EnchantmentType(enchant.typeId);
            enchantable.addEnchantment({type:type, level:enchant.level});
        });
    };
    // Can destroy & can place on.
    if (data.canDestroy) {itemStack.setCanDestroy(data.canDestroy)};
    if (data.canPlaceOn) {itemStack.setCanPlaceOn(data.canPlaceOn)};
    // Dynamic properties.
    if (data.dynamicProperties) {
        Object.keys(data.dynamicProperties).forEach(key => {
            const value = data.dynamicProperties[key];
            itemStack.setDynamicProperty(key, value);
        });
    };

    // Return.
    return itemStack;
};