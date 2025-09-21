import {system, EntityDieAfterEvent, Entity} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {StringFormat} from '../../../util/string';
import {Module, Event} from '../module';


function Callback(event:EntityDieAfterEvent) {
    const deadEntity = event.deadEntity;
    const damageSource = event.damageSource;
    const damagingEntity = damageSource.damagingEntity;
    const env = {deadEntity:deadEntity, damagingEntity:damagingEntity, damageSource:damageSource};
    system.run(()=>{
        (Object.values(Module.persisData.events) as Array<Event>).forEach(event => {
            if (event.eventId !== 'entityDie') {return};
            const deadEntityActor = event.actors.deadEntity;
            if (deadEntityActor) {
                try {deadEntity.runCommand(StringFormat(deadEntityActor.command, env))} catch {};
            };
            const damagingEntityActor = event.actors.damagingEntity;
            if (damagingEntityActor) {
                try {damagingEntity.runCommand(StringFormat(damagingEntityActor.command, env))} catch {};
            };
        });
    });
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'after', eventId:'entityDie'},
    {callback: Callback},
);