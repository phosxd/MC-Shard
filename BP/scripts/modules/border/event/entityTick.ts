import {Entity, Vector3} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {AddVector, SubtractVector, FlipVector} from '../../../util/vector';
import {Module, Border} from '../module';


function Callback(entity:Entity) {
    for (const key in Module.persisData.borders) {
        const border = Module.persisData.borders[key] as Border;
        if (border.dimensionId !== entity.dimension.id) {return};

        function push(x:number=0, y:number=0, z:number=0): void {
            try {
                entity.applyKnockback({x:x, z:z}, y);
            } catch {
                entity.teleport(AddVector(entity.location, {x:x,y:y,z:z}) as Vector3);
            };
            damage();
        };

        function damage() {
            if (entity.typeId != 'miencraft:item') {
                entity.applyDamage(border.damage);
            };
        };

        // // Push entity out of the border.
        const start = border.area.start;
        const end = border.area.end;
        const location = entity.location;
        if (border.inverted) {
            if (location.x < start.x) {push(1)};
            if (location.x > end.x) {push(-1)};
            if (location.y < start.y) {push(0, 1)};
            if (location.y > end.y) {push(0, -1)};
            if (location.z < start.z) {push(0, 0, 1)};
            if (location.z > end.z) {push(0, 0, -1)};
        }
        else {
            
        };
    };
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'shard', type:'after', eventId:'entityTick'},
    {callback: Callback},
);