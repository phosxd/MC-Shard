/**
 * Event IDs & their actors/variables.
*/
export default {
    playerPlaceBlock: [
        '@player: Player',
        '@block: Block',
    ],
    playerBreakBlock: [
        '@player: Player',
        '@block: Block',
    ],
    playerInteractWithBlock: [
        '@player: Player',
        '@block: Block',
    ],
    playerUseItem: [
        '@player: Player',
        'item: ItemStack',
    ],
    playerDropItem: [
        '@player: Player',
        '@droppedItem: Entity',
        'item: ItemStack',
    ],
    playerSpawn: [
        '@player: Player',
        'initialSpawn: boolean'
    ],
    entityDie: [
        '@deadEntity: Entity',
        '@damagingEntity: Entity',
        'damageSource: EntityDamageSource',
    ],
    explosion: [
        '@source: Entity',
    ],
    buttonPush: [
        '@source: Entity',
        '@block: Block',
    ],
} as {
    [key:string]: Array<string>,
};
