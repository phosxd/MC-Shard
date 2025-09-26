import {system, ExplosionBeforeEvent} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {LocationInArea, EntityHasAnyTags, EntityHasAllTags, IsAnyType, IsAllTypes} from '../../../Shard/util';
import {StringifyVector} from '../../../util/vector';
import {Module, Region, RegionRule} from '../module';


function Callback(event:ExplosionBeforeEvent) {
    const blocks = event.getImpactedBlocks();
    for (const key in Module.persisData.regions) {
        // Get region.
        const region = Module.persisData.regions[key] as Region;
        let anyBlockInRegion:boolean = false;
        // Check if any block in region.
        blocks.forEach(block => {
            const inArea:boolean = LocationInArea(block.location, region.area);
            if ((region.dimensionId != block.dimension.id) || (region.inverted && inArea) || (!region.inverted && !inArea)) {return};
            anyBlockInRegion = true;
        });
        if (!anyBlockInRegion) {continue};
        // Run region actions.
        for (const key in region.rules) {
            const rule:RegionRule = region.rules[key];
            if (rule.eventId != 'explosion') {continue};
            if (!EntityHasAnyTags(event.source, rule.tags.anyOf) || !EntityHasAllTags(event.source, rule.tags.allOf)) {continue};
            // Remove blocks from explosion.
            if (rule.revert) {
                event.setImpactedBlocks(blocks.filter((value)=>{
                    return !IsAnyType(value, rule.blockTypes.anyOf) || !IsAllTypes(value, rule.blockTypes.allOf);
                }));
            };
            const previousSourceLocation = event.source.location;
            system.run(()=>{
                try {event.dimension.runCommand(`execute positioned ${StringifyVector(previousSourceLocation)} run ${rule.command}`)} catch {};
            });
        };
    };
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'before', eventId:'explosion'},
    {callback: Callback},
);