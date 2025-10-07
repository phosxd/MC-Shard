import {Block} from '@minecraft/server';


/**
 * Returns all the block's neighboring blocks.
 * 
 * @returns {Array<Block>} [north, east, south, west, above?, below?]
*/
export function GetBlockNeighbors(block:Block):Array<Block> {
    if (!block) {return []};
    const neighbors:Array<Block> = [
        block.north(),
        block.east(),
        block.south(),
        block.west(),
    ];
    if (block.location.y+1 < block.dimension.heightRange.max) {
        neighbors.push(block.above());
    };
    if (block.location.y-1 > block.dimension.heightRange.min) {
        neighbors.push(block.below());
    };
    return neighbors;
};


/**
 * Returns `true` if the block is an ore.
*/
export function IsOre(block:Block):boolean {
    if (block.typeId.endsWith('_ore')) {return true};
    return ['minecraft:ancient_debris'].includes(block.typeId);
};