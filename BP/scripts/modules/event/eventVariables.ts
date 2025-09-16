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
    // playerUseItem: [
    //     '@player: Player',
    //     'item: ItemStack',
    // ],
    playerDropItem: [
        '@player: Player',
        '@droppedItem: Entity',
        'item: ItemStack',
    ],
    // playerSpawn: [
    //     '@player: Player',
    //     'initialSpawn: boolean'
    // ],
    explosion: [
        '@source: Entity',
    ],
} as {
    [key:string]: Array<string>,
};
