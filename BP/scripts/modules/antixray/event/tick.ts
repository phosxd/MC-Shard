import {system, world, Dimension, Block, Vector3, BlockVolume} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {RoundVector, AddVector, MultiplyVector} from '../../../util/vector';
import {GetBlockNeighbors} from '../../../util/block';
import {Module, GetDmk, SpoofBlock, ReplaceableBlocks, SolidBlocks, SpoofVolumeChunkSize, SpoofVolumeChunkSizeHalf} from '../module';

const playersRunningJob = new Set();


function Callback() {
    if (system.currentTick%(Module.persisData.settings.spoofInterval*20) == 0) {
        world.getAllPlayers().forEach(player => {
            if (playersRunningJob.has(player.id)) {return};
            playersRunningJob.add(player.id);
            system.runJob(spoofArea(RoundVector(player.location) as Vector3, player.dimension, player.id));
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
        const chunkLocation = AddVector(MultiplyVector({x:x,y:y,z:z}, SpoofVolumeChunkSize+1), originLocation) as Vector3;
        const volume = new BlockVolume(
            AddVector(chunkLocation, -SpoofVolumeChunkSizeHalf) as Vector3,
            AddVector(chunkLocation, SpoofVolumeChunkSizeHalf) as Vector3,
        );
        yield;
        for (const location of dimension.getBlocks(volume, {includeTypes:Object.assign([],ReplaceableBlocks)}, true).getBlockLocationIterator()) {
            yield;
            const block = dimension.getBlock(location);
            if (!block) {continue};
            const key = GetDmk(dimension.id, location);
            if (world.getDynamicProperty(key) !== undefined) {continue};
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