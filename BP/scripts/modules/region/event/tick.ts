import {world, system, Dimension, Player, Entity, Vector3} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {Dictionary} from '../../../Shard/CONST';
import {GetAllEntities, LocationInArea, LocationToString, GetAreaCenter} from '../../../Shard/util';
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
                if (command.event == 'tick') {
                    try {
                        dimension.runCommand('execute positioned '+LocationToString(GetAreaCenter(region.area))+' run '+command.command);
                    } catch {};
                }
                else if (command.event == 'tickEntity') {
                    try {
                        entity.runCommand(command.command);
                    } catch {};
                };
            };
        };
    });

    return data;
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'shard', type:'after', eventId:'tick'},
    {callback: Callback},
);