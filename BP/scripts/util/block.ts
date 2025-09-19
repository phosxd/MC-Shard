import {Block, Vector3} from '@minecraft/server';


/**
 * Returns all the block's neighboring blocks.
 * 
 * @returns {Array<Block>} [north, east, south, west, above?, below?]
*/
export function GetBlockNeighbors(block:Block):Array<Block> {
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