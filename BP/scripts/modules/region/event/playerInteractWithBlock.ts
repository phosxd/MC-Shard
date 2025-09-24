import {system, PlayerInteractWithBlockBeforeEvent} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {LocationInArea, LocationToString, EntityHasAnyTags, EntityHasAllTags, IsAnyType, IsAllTypes} from '../../../Shard/util';
import {Module, Region, RegionRule} from '../module';


function Callback(event:PlayerInteractWithBlockBeforeEvent) {
    const player = event.player;
    for (const key in Module.persisData.regions) {
        // Get region.
        const region = Module.persisData.regions[key] as Region;
        // Check if block in region.
        const inArea:boolean = LocationInArea(event.block.location, region.area);
        if ((region.dimensionId != event.block.dimension.id) || (region.inverted && inArea) || (!region.inverted && !inArea)) {continue};

        // Run region commands on player.
        for (const key in region.rules) {
            const rule:RegionRule = region.rules[key];
            if (rule.eventId != 'playerInteractWithBlock') {continue};
            if (!EntityHasAnyTags(player, rule.tags.anyOf) || !EntityHasAllTags(player, rule.tags.allOf) || !IsAnyType(event.block, rule.blockTypes.anyOf) || !IsAllTypes(event.block, rule.blockTypes.allOf) || !IsAnyType(event.itemStack, rule.itemTypes.anyOf) || !IsAllTypes(event.itemStack, rule.itemTypes.allOf)) {continue};
            if (rule.revert) {event.cancel = true};
            system.run(()=>{
                try {player.runCommand(`execute positioned ${LocationToString(event.block.location)} run ${rule.command}`)} catch {};
            });
        };
    };
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'before', eventId:'playerInteractWithBlock'},
    {callback: Callback},
);