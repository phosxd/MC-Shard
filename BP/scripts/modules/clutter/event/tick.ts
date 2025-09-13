import {system, Dimension, Entity} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {GetAllEntities} from '../../../Shard/util';
import {Module, entityGroupTag} from '../module';


function Callback() {
    if (system.currentTick%20 != 0) {return};
    const settings = Module.persisData.settings;
    const includedEntities:Array<Entity> = getIncludedEntities();
    // Iterate on every included entity.
    includedEntities.forEach(entity => {
        if (!entity.isValid) {return};
        if (entity.hasTag(entityGroupTag)) {return};
        if (Module.persisData.settings.excludeNamed && entity.nameTag.length != 0) {return};
        // Get nearby entities not already groupped.
        const group = getIncludedEntities({excludeTags:[entityGroupTag], location:entity.location, maxDistance:settings.groupRadius}, entity.dimension);
        if (group.length < settings.threshold) {return};
        // Tag entities & start countdown for deletion.
        group.forEach(entity => {
            entity.addTag(entityGroupTag);
        });
        if (settings.countdown > 0) {startCountdown(settings, entity, group)}
        else {removeGroup(group)};
    });
};


function getIncludedEntities(options={}, dimension?:Dimension):Array<Entity> {
    const getEntities = (options)=>{
        if (Module.persisData.settings.excludeNamed) {
            options.name = '';
        };
        if (!dimension) {return GetAllEntities(options)}
        else {return dimension.getEntities(options)};
    };

    let result:Array<Entity> = [];
    if (Module.persisData.settings.includeItems) {
        result = result.concat(getEntities(Object.assign({type:'minecraft:item'}, options)));
    };
    if (Module.persisData.settings.includeProjectiles) {
        result = result.concat(
            getEntities(Object.assign({type:'minecraft:arrow'}, options)),
            getEntities(Object.assign({type:'minecraft:snowball'}, options)),
            getEntities(Object.assign({type:'minecraft:egg'}, options)),
            getEntities(Object.assign({type:'minecraft:ender_pearl'}, options)),
            getEntities(Object.assign({type:'minecraft:wind_charge_projectile'}, options)),
        );
    };
    if (Module.persisData.settings.includePassiveMobs) {
        result = result.concat(
            getEntities(Object.assign({families:['cow']}, options)),
            getEntities(Object.assign({families:['pig']}, options)),
            getEntities(Object.assign({families:['sheep']}, options)),
            getEntities(Object.assign({families:['chicken']}, options)),
            getEntities(Object.assign({families:['rabbit']}, options)),
            getEntities(Object.assign({families:['bat']}, options)),
            getEntities(Object.assign({families:['mooshroom']}, options)),
        );
    };
    if (Module.persisData.settings.includeHostileMobs) {
        result = result.concat(getEntities(Object.assign({families:['monster']}, options)));
    };
    return result;
};


function startCountdown(settings, entity:Entity, group:Array<Entity>):void {
    const display = entity.dimension.spawnEntity('shard:display', entity.location);
    display.nameTag = settings.countdownText.replace('{time}', String(settings.countdown)).replace('{count}', String(group.length));
    let count:number = 0;
    const runId = system.runInterval(()=>{
        count += 0.5;
        // When countdown finished, remove items.
        if (count >= settings.countdown) {
            removeGroup(group);
            if (display.isValid) {display.remove()};
            system.clearRun(runId);
            return;
        };
        // Update group.
        group = group.filter(value => {return value.isValid});
        // If group too small, cancel.
        if (group.length < settings.threshold) {
            group.forEach(entity => {entity.removeTag(entityGroupTag)});
            if (display.isValid) {display.remove()};
            system.clearRun(runId);
            return;
        };
        // Update display.
        if (entity.isValid) {
            display.teleport(entity.location);
        };
        display.nameTag = settings.countdownText.replace('{time}', String(Math.round(settings.countdown-count))).replace('{count}', String(group.length));
    },10);
};


function removeGroup(group:Array<Entity>):void {
    group.forEach(entity => {
        if (!entity.isValid) {return};
        entity.remove();
    });
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'shard', type:'after', eventId:'tick'},
    {callback: Callback},
);