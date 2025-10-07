import {system, world, PlayerBreakBlockBeforeEvent} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {StringifyVector} from '../../../util/vector';
import {GetBlockNeighbors} from '../../../util/block';
import {GetDmk, UnspoofBlock} from '../module';


function Callback(event:PlayerBreakBlockBeforeEvent) {
    const key = GetDmk(event.dimension.id, event.block.location);
    const spoofedBlock = world.getDynamicProperty(key) as number;
    // If block is spoofed, restore original block then break.
    if (spoofedBlock) {
        event.cancel = true;
        system.run(()=>{
            UnspoofBlock(event.block, true);
            event.player.runCommand(`setblock ${StringifyVector(event.block.location)} air destroy`);
        });
    };
    // Unspoof neighboring blocks.
    GetBlockNeighbors(event.block).forEach(block => {
        system.run(()=>{
            UnspoofBlock(block);
        });
    });
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'before', eventId:'playerBreakBlock'},
    {callback: Callback},
);