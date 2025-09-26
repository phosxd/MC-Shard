import {Entity, Vector3} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {GetAllEntities, LocationInArea, GetClosestPointInArea} from '../../../Shard/util';
import {AddVector, FlipVector} from '../../../util/vector';
import {afterEvents} from '../../../Shard/event_server';
import {Module, Border} from '../module';


function Callback() {
    const data = afterEvents.tick.sharedData;
    if (!data.allEntities) {data.allEntities = GetAllEntities()};
    const allEntities = data.allEntities as Array<Entity>;

    allEntities.forEach(entity => {
        if (!entity.isValid) {return};
        for (const key in Module.persisData.borders) {
            const border = Module.persisData.borders[key] as Border;
            if (border.dimensionId !== entity.dimension.id) {return};

            const inArea:boolean = LocationInArea(entity.location, border.area);
            if (border.inverted && inArea) {return};
            if (!border.inverted && !inArea) {return};

            // I cant get non-inverted borders to not freeze entities in place on contact, so this should only ever be used inverted.

            // Calculate direction to push entity.
            const direction = AddVector(
                entity.location,
                FlipVector(GetClosestPointInArea(entity.location, border.area)),
            ) as Vector3;
            const location = AddVector(entity.location, FlipVector(direction)) as Vector3;

            // Apply.
            entity.teleport(location);
            entity.applyDamage(border.damage);
        };
    });

    afterEvents.tick.sharedData = data;
};


// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'shard', type:'after', eventId:'tick'},
    {callback: Callback},
);