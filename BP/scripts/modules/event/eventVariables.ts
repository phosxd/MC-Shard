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
    // playerDropItem: [
    //     '@player: Player',
    //     'item: ItemStack',
    // ],
    // playerSpawn: [
    //     '@player: Player',
    //     'initialSpawn: boolean'
    // ],
} as {
    [key:string]: Array<string>,
};
