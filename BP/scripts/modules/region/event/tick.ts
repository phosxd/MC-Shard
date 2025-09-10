import {world, Dimension, Entity} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {Dictionary} from '../../../Shard/CONST';
import {GetAllEntities, LocationInArea, LocationToString, GetAreaCenter, EntityHasAnyTags} from '../../../Shard/util';
import {Module, Region, RegionRule} from '../module';




function Callback(data:Dictionary<any>) {
    if (!data.allEntities) {data.allEntities = GetAllEntities()};
    const allEntities = data.allEntities as Array<Entity>;
    if (Object.keys(Module.persisData.regions).length == 0) {return};


    allEntities.forEach(entity => {
        if (!entity.isValid) {return};
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
                        if (!EntityHasAnyTags(entity, rule.tags)) {continue};
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
                if (!EntityHasAnyTags(entity, rule.tags) && rule.tags.length != 0) {continue};
                let run:boolean = false;
                if (rule.eventId == 'entityTick') {run = true}
                else if (rule.eventId == 'entityEnter' && justEntered) {run = true};
                if (run) {try {entity.runCommand(rule.command)} catch {}};
            };
        };
    });

    // Region tick commands.
    for (const key in Module.persisData.regions) {
        const region = Module.persisData.regions[key] as Region;
        const dimension:Dimension = world.getDimension(region.dimensionId);
        for (const key in region.rules) {
            const rule:RegionRule = region.rules[key];
            if (rule.eventId == 'tick') {
                try {dimension.runCommand('execute positioned '+LocationToString(GetAreaCenter(region.area))+' run '+rule.command)} catch {};
            };
        };
    };


    return data;
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'shard', type:'after', eventId:'tick'},
    {callback: Callback},
);