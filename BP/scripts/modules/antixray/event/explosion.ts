import {system, ExplosionBeforeEvent, BlockVolume, Block} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {AddVector3, StringifyVector3} from '../../../Shard/util';
import {Module, SpoofBlock, UnspoofBlock} from '../module';


function Callback(event:ExplosionBeforeEvent) {
    const impactedBlocks = event.getImpactedBlocks();
    const newImpactedBlocks:Array<Block> = [];
    impactedBlocks.forEach(block => {
        if (block.typeId !== SpoofBlock) {
            newImpactedBlocks.push(block);
            return;
        };
        system.run(()=>{
            UnspoofBlock(block, true);
            event.dimension.runCommand(`setblock ${StringifyVector3(block.location)} air destroy`);
        });
    });
    event.setImpactedBlocks(newImpactedBlocks);
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'before', eventId:'explosion'},
    {callback: Callback},
);