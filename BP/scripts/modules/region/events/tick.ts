import {world, system, Dimension, Player, Entity, Vector3} from '@minecraft/server';
import ShardEventListener from '../../../ShardAPI/event_listener';
import {Dictionary} from '../../../ShardAPI/CONST';
import {GetAllEntities, LocationInArea, AddVector3, SubtractVector3, NormalizeVector3, FlipVector3, GetClosestPointInArea} from '../../../ShardAPI/util';
import {Module, Region, RegionCommand} from '../module';




function Callback(data:Dictionary<any>) {
    if (!data.allEntities) {data.allEntities = GetAllEntities()};
    const allEntities = data.allEntities as Array<Entity>;

    allEntities.forEach(entity => {
        if (!entity.isValid) {return};
        for (const key in Module.persisData.regions) {
            const region = Module.persisData.regions[key] as Region;
            if (region.dimensionId !== entity.dimension.id) {continue};

            const inArea:boolean = LocationInArea(entity.location, region.area);
            if (region.inverted && inArea) {continue};
            if (!region.inverted && !inArea) {continue};

            const dimension:Dimension = world.getDimension(region.dimensionId);

            for (const key in region.commands) {
                const command:RegionCommand = region.commands[key];
                if (command.event !== 'tick') {continue};
                try {
                    dimension.runCommand(command.command);
                } catch {};
            };
        };
    });

    return data;
};




// Initialize event listener.
export const EventListener:ShardEventListener = new ShardEventListener(
    'shard',
    'after',
    'tick',
    Callback,
);