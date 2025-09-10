import {PlayerPlaceBlockAfterEvent} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {LocationInArea, LocationToString, EntityHasAnyTags, BlockIsAllTypes} from '../../../Shard/util';
import {Module, Region, RegionRule} from '../module';


function Callback(event:PlayerPlaceBlockAfterEvent) {
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
            if (rule.eventId != 'playerPlaceBlock') {continue};
            if (!EntityHasAnyTags(player, rule.tags)) {continue};
            if (!BlockIsAllTypes(event.block, rule.blockTypes)) {continue};
            if (rule.revert) {event.block.setType('air')};
            try {player.runCommand(`execute positioned ${LocationToString(event.block.location)} run ${rule.command}`)} catch {};
        };
    };
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'after', eventId:'playerPlaceBlock'},
    {callback: Callback},
);