import {system, world, Dimension, Block, BlockVolume, Vector3} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {RoundVector3} from '../../../Shard/util';
import {GetBlockNeighbors} from '../../../util/block';
import {Module, TickCosts, GetDmk, SpoofBlock, ReplaceableBlocks, SolidBlocks} from '../module';

const playersRunningJob = new Set();


function Callback() {
    if (system.currentTick%(Module.persisData.settings.spoofInterval*20) == 0) {
        world.getAllPlayers().forEach(player => {
            if (playersRunningJob.has(player.id)) {return};
            playersRunningJob.add(player.id);
            system.runJob(spoofArea(RoundVector3(player.location), player.dimension, player.id));
        });
    };
};


function* spoofArea(originLocation:Vector3, dimension:Dimension, ownerId:string) {
    const spoofDistance:number = Module.persisData.settings.spoofRadius;
    let costPerTick:number = 50 * Module.persisData.settings.spoofSpeed;
    // const volume = new BlockVolume(AddVector3(originLocation, -spoofDistance), AddVector3(originLocation, spoofDistance));
    // const blocksToReplace = dimension.getBlocks(volume, {includeTypes:ReplaceableBlocks}, true);
    // for (const location of blocksToReplace.getBlockLocationIterator()) {
    let cost = 0;
    for (let x:number = originLocation.x-spoofDistance; x < originLocation.x+spoofDistance; x++) {
    for (let y:number = originLocation.y-spoofDistance; y < originLocation.y+spoofDistance; y++) {
    for (let z:number = originLocation.z-spoofDistance; z < originLocation.z+spoofDistance; z++) {
        if (cost >= costPerTick) {cost = 0; yield};
        cost += TickCosts.base;
        const location:Vector3 = {x:x,y:y,z:z};
        if (location.y > dimension.heightRange.max || location.y < dimension.heightRange.min) {continue};
        cost += TickCosts.checkExists;
        const block = dimension.getBlock(location);
        if (!block) {continue};
        cost += TickCosts.checkType;
        if (!ReplaceableBlocks.includes(block.typeId)) {continue};
        const key = GetDmk(dimension.id, location);
        if (world.getDynamicProperty(key)) {continue};
        if (isBlockExposed(block)) {continue}; // If block exposed, dont spoof.
        // Save block type before replace.
        world.setDynamicProperty(key, ReplaceableBlocks.indexOf(block.typeId));
        // Replace block.
        dimension.setBlockType(location, SpoofBlock);
        cost += TickCosts.full;
    }}};
    playersRunningJob.delete(ownerId);
};


export function isBlockExposed(block:Block) {
    return GetBlockNeighbors(block).some(value => {
        return !SolidBlocks.includes(value?.typeId);
    });
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'shard', type:'after', eventId:'tick'},
    {callback: Callback},
);