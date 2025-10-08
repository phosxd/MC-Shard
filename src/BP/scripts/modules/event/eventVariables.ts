/**
 * Event IDs & their actors/variables.
*/
export default {
    playerDimensionChange: [
        '@player: Player',
        'fromDimension: Dimension',
        'toDimension: Dimension',
        'fromLocation: Vector3',
        'toLocation: Vector3',
    ],
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
        "blockFace: 'Up'|'Down'|'North'|'East'|'South'|'West'",
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
    playerInteractWithEntity: [
        '@player: Player',
        '@targetEntity: Entity',
        'item: ItemStack',
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
