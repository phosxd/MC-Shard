import {world, Dimension} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {GetAreaCenter} from '../../../Shard/util';
import {StringifyVector} from '../../../util/vector';
import {Module, Region, RegionRule} from '../module';


function Callback() {
    // Region tick commands.
    for (const key in Module.persisData.regions) {
        const region = Module.persisData.regions[key] as Region;
        const dimension:Dimension = world.getDimension(region.dimensionId);
        for (const key in region.rules) {
            const rule:RegionRule = region.rules[key];
            if (rule.eventId == 'tick') {
                try {dimension.runCommand('execute positioned '+StringifyVector(GetAreaCenter(region.area))+' run '+rule.command)} catch {};
            };
        };
    };
};


// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'shard', type:'after', eventId:'tick'},
    {callback: Callback},
);