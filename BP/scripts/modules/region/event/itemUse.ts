import {system, ItemUseBeforeEvent} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {LocationInArea, LocationToString, EntityHasAnyTags, EntityHasAllTags, IsAnyType, IsAllTypes} from '../../../Shard/util';
import {Module, Region, RegionRule} from '../module';


function Callback(event:ItemUseBeforeEvent) {
    if (!event.itemStack) {return};
    const player = event.source;
    const item = event.itemStack;
    for (const key in Module.persisData.regions) {
        // Get region.
        const region = Module.persisData.regions[key] as Region;
        // Check if player in region.
        const inArea:boolean = LocationInArea(player.location, region.area);
        if ((region.dimensionId != player.dimension.id) || (region.inverted && inArea) || (!region.inverted && !inArea)) {continue};

        // Run region commands on player.
        for (const key in region.rules) {
            const rule:RegionRule = region.rules[key];
            if (rule.eventId != 'playerUseItem') {continue};
            if (!EntityHasAnyTags(player, rule.tags.anyOf) || !EntityHasAllTags(player, rule.tags.allOf) || !IsAnyType(item, rule.itemTypes.anyOf) || !IsAllTypes(item, rule.itemTypes.allOf)) {continue};
            if (rule.revert && item) {
                event.cancel = true;
            };
            system.run(()=>{try{
                player.runCommand(`execute positioned ${LocationToString(player.location)} run ${rule.command}`);
            }catch {}});
        };
    };
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'before', eventId:'itemUse'},
    {callback: Callback},
);