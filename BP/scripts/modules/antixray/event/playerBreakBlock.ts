import {system, world, PlayerBreakBlockAfterEvent, BlockVolume} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {AddVector3} from '../../../Shard/util';
import {Module, GetDmk, SpoofBlock, ReplaceableBlocks} from '../module';


function Callback(event:PlayerBreakBlockAfterEvent) {
    const volume = new BlockVolume(AddVector3(event.block.location, -1), AddVector3(event.block.location, 1));
    const blocksToCheck = event.dimension.getBlocks(volume, {includeTypes:[SpoofBlock]});
    // Unspoof nearby blocks.
    system.run(()=>{
    let count = 0;
        for (const location of blocksToCheck.getBlockLocationIterator()) {
            count += 1;
            const key = GetDmk(event.dimension.id, location);
            const spoofedBlock = world.getDynamicProperty(key) as number;
            if (spoofedBlock === undefined) {continue};
            const block = event.dimension.getBlock(location);
            if (!block) {continue};
            block.setType(ReplaceableBlocks[spoofedBlock]);
            world.setDynamicProperty(key, undefined);
        };
        if (count != 0) {Module.saveData()};
    });
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'after', eventId:'playerBreakBlock'},
    {callback: Callback},
);