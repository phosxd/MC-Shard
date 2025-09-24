import {system, PlayerBreakBlockBeforeEvent, Block} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {IsOre} from '../../../util/block';
import {Module} from '../module';


function* capitateTree(block:Block) {
};


function* capitateOreVein(block:Block) {};


function Callback(event:PlayerBreakBlockBeforeEvent) {
    const settings = Module.persisData.settings;
    if (settings.requireSneak && !event.player.isSneaking) {return};
    if (settings.doTrees && event.block.hasTag('log')) {
        system.runJob(capitateTree(event.block));
    }
    else if (settings.doOres && IsOre(event.block)) {
        system.runJob(capitateOreVein(event.block));
    };
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'before', eventId:'playerBreakBlock'},
    {callback: Callback},
);