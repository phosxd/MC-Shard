import {system, world, Dimension, Block, Vector3, BlockVolume} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {RoundVector3, AddVector3, SubtractVector3, MultiplyVector3} from '../../../Shard/util';
import {GetBlockNeighbors} from '../../../util/block';
import {Module, GetDmk, SpoofBlock, ReplaceableBlocks, SolidBlocks, SpoofVolumeChunkSize, SpoofVolumeChunkSizeHalf} from '../module';

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
    const spoofDistance:number = Module.persisData.settings.spoofDistance;
    // Get volumes to iterate over.
    const chunks = Math.floor(spoofDistance/SpoofVolumeChunkSize);
    const chunksHalf = chunks/2;
    for (let x:number=-chunksHalf; x < chunksHalf; x++) {
    for (let y:number=-chunksHalf; y < chunksHalf; y++) {
    for (let z:number=-chunksHalf; z < chunksHalf; z++) {
        const chunkLocation = AddVector3(MultiplyVector3({x:x,y:y,z:z}, SpoofVolumeChunkSize+1), originLocation);
        const volume = new BlockVolume(
            SubtractVector3(chunkLocation, SpoofVolumeChunkSizeHalf),
            AddVector3(chunkLocation, SpoofVolumeChunkSizeHalf),
        );
        yield;
        for (const location of dimension.getBlocks(volume, {includeTypes:ReplaceableBlocks}, true).getBlockLocationIterator()) {
            yield;
            const block = dimension.getBlock(location);
            if (!block) {continue};
            const key = GetDmk(dimension.id, location);
            if (world.getDynamicProperty(key)) {continue};
            if (isBlockExposed(block)) {continue}; // If block exposed, dont spoof.
            // Save block type before replace.
            world.setDynamicProperty(key, ReplaceableBlocks.indexOf(block.typeId));
            // Replace block.
            dimension.setBlockType(location, SpoofBlock);
        };
        yield;
    }}};
    playersRunningJob.delete(ownerId);
};


function isBlockExposed(block:Block) {
    return GetBlockNeighbors(block).some(value => {
        return !SolidBlocks.includes(value?.typeId);
    });
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'shard', type:'after', eventId:'tick'},
    {callback: Callback},
);