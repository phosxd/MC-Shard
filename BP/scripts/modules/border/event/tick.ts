import {world, system, Entity, Vector3} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {Dictionary} from '../../../Shard/CONST';
import {GetAllEntities, LocationInArea, SubtractVector3, GetClosestPointInArea} from '../../../Shard/util';
import {Module, Border} from '../module';


function Callback(data:Dictionary<any>) {
    if (!data.allEntities) {data.allEntities = GetAllEntities()};
    const allEntities = data.allEntities as Array<Entity>;

    allEntities.forEach(entity => {
        if (!entity.isValid) {return};
        Object.keys(Module.persisData.borders).forEach(key => {
            const border = Module.persisData.borders[key] as Border;
            if (border.dimensionId !== entity.dimension.id) {return};

            const inArea:boolean = LocationInArea(entity.location, border.area);
            if (border.inverted && inArea) {return};
            if (!border.inverted && !inArea) {return};

            // I cant get non-inverted borders to not just freeze entities in place on contact, so this should only ever be used inverted.

            // Calculate direction to push entity.
            let direction:Vector3 = SubtractVector3(
                entity.location,
                GetClosestPointInArea(entity.location, border.area),
            );
            let location:Vector3 = SubtractVector3(entity.location, direction);

            // Apply.
            entity.teleport(location);
            entity.applyDamage(border.damage);
        });
    });

    return data;
};


// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'shard', type:'after', eventId:'tick'},
    {callback: Callback},
);