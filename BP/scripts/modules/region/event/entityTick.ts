import {Entity} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {LocationInArea, EntityHasAnyTags, EntityHasAllTags} from '../../../Shard/util';
import {Module, Region, RegionRule} from '../module';


function Callback(entity:Entity) {
    for (const key in Module.persisData.regions) {
        // Get region.
        const region = Module.persisData.regions[key] as Region;
        const regionTag = `sh:inRegion.${region.name}`;
        // Check if entity in region.
        const inArea:boolean = LocationInArea(entity.location, region.area);
        if ((region.dimensionId != entity.dimension.id) || (region.inverted && inArea) || (!region.inverted && !inArea)) {
            // Run `entityExit` commands.
            if (entity.hasTag(regionTag)) {
                entity.removeTag(regionTag);
                for (const key in region.rules) {
                    const rule:RegionRule = region.rules[key];
                    if (!EntityHasAnyTags(entity, rule.tags.anyOf) || !EntityHasAllTags(entity, rule.tags.allOf)) {continue};
                    if (rule.eventId != 'entityExit') {continue};
                    try {entity.runCommand(rule.command)} catch {};
                };
            };
            continue;
        };
        // Add tag if just entered.
        let justEntered:boolean = false;
        if (!entity.hasTag(regionTag)) {
            justEntered = true;
            entity.addTag(regionTag);
        };

        // Run region commands on entity.
        for (const key in region.rules) {
            const rule:RegionRule = region.rules[key];
            if (!EntityHasAnyTags(entity, rule.tags.anyOf) || !EntityHasAllTags(entity, rule.tags.allOf)) {continue};
            let run:boolean = false;
            if (rule.eventId == 'entityTick') {run = true}
            else if (rule.eventId == 'entityEnter' && justEntered) {run = true};
            if (run) {try {entity.runCommand(rule.command)} catch {}};
        };
    };
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'shard', type:'after', eventId:'entityTick'},
    {callback: Callback},
);