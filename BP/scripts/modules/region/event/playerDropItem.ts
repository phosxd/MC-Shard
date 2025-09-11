import {ShardListener} from '../../../Shard/listener';
import {PlayerDropItemEvent} from '../../../Shard/event_server';
import {LocationInArea, LocationToString, EntityHasAnyTags, EntityHasAllTags} from '../../../Shard/util';
import {Module, Region, RegionRule} from '../module';


function Callback(event:PlayerDropItemEvent) {
    if (!event.droppedItem) {return};
    const player = event.player;
    const droppedItemStack = event.droppedItem.getComponent('item').itemStack;
    for (const key in Module.persisData.regions) {
        // Get region.
        const region = Module.persisData.regions[key] as Region;
        // Check if player in region.
        const inArea:boolean = LocationInArea(event.player.location, region.area);
        if ((region.dimensionId != event.player.dimension.id) || (region.inverted && inArea) || (!region.inverted && !inArea)) {continue};

        // Run region commands on player.
        for (const key in region.rules) {
            const rule:RegionRule = region.rules[key];
            if (rule.eventId != 'playerDropItem') {continue};
            if (!EntityHasAnyTags(player, rule.tags.anyOf) || !EntityHasAllTags(player, rule.tags.allOf)) {continue};
            if (rule.revert && event.droppedItem) {
                event.droppedItem.remove();
                player.getComponent('inventory').container.addItem(droppedItemStack);
            };
            try {player.runCommand(`execute positioned ${LocationToString(event.player.location)} run ${rule.command}`)} catch {};
        };
    };
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'shard', type:'after', eventId:'playerDropItem'},
    {callback: Callback},
);