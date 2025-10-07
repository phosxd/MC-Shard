// Copyright (c) 2025 PhosXD

import {world, World, Entity, Block, ItemStack, Vector3, CommandPermissionLevel, EntityQueryOptions} from '@minecraft/server';
import {Dictionary, AlignedArea} from './CONST';
import {StringEqualSplit} from '../util/string';


/**Converts a Build Number to a Version.*/
export function BuildNumberToVersion(buildNumber:number): Array<number> {
    return [
        Math.floor(buildNumber/1000),
        Math.floor((buildNumber%1000)/100),
        buildNumber%100,
    ];
};


/**Converts a Version to a Build Number.*/
export function VersionToBuildNumber(version:Array<number>): number {
    return version[0]*1000 + version[1]*100 + version[2];
};




/**Returns a deepcopy of the object.*/
export function Deepcopy(object) {
    return JSON.parse(JSON.stringify(object));
};



/**
 * Convert range of value from `a` to `b`.
*/
export function Lerp(a:{min:number,max:number}, b:{min:number,max:number}, value:number): number {
    return (b.min + (((value-a.min) / (a.max-a.min)) * (b.max-b.min)));
};


/**
 * Blend `a` & `b` together using `ratio`. Ratio of 1 returns `a`, ratio of 0 returns `b`.
 * 
 * (Sidenote, I didnt make this function with negative numbers in mind so I have no idea how it will treat them so uh dont use them just to be safe lol)
*/
export function Blend(a:number, b:number, ratio:number): number {
    if (a == 0 && b == 0) {return 0}; // Ratio of 0 is impossible to calculate, so NaN gets returned. Instead return 0.
    // Define min/max values.
    const min = Math.min(a,b);
    const max = Math.max(a,b);
    // If `max` is `b`, we need to flip the ratio so `1` still relates to `a`.
    if (max == b) {
        ratio = Math.abs(Lerp({min:0,max:1}, {min:-1,max:0}, ratio));
    };
    // Return result.
    return Lerp({min:0,max:max}, {min:min,max:max}, max*ratio);
};




/**Return a random element from the array.*/
export function RandomElement(array:Array<any>) {
    return array[Math.floor(Math.random() * array.length)];
};




/**Determines if a block location is out of bounds.*/
export function LocationOutOfBounds(location:Vector3): boolean {
    if (location.y > 256 || location.y < -64) {return true};
    return false;
};


/**Get the center location of an `AlignedArea`.*/
export function GetAreaCenter(area:AlignedArea):Vector3 {
    return {
        x:area.end.x-(area.end.x-area.start.x)/2,
        y:area.end.y-(area.end.y-area.start.y)/2,
        z:area.end.z-(area.end.z-area.start.z)/2
    };
};


/**Returns a (new) corrected `AlignedArea`.*/
export function AlignArea(area:AlignedArea):AlignedArea {
    let negCorner = Object.assign({}, area.start);
    let posCorner = Object.assign({}, area.end);
    if (area.end.x < area.start.x) { negCorner.x = area.end.x; posCorner.x = area.start.x; };
    if (area.end.y < area.start.y) { negCorner.y = area.end.y; posCorner.y = area.start.y; };
    if (area.end.z < area.start.z) { negCorner.z = area.end.z; posCorner.z = area.start.z; };
    return {start:negCorner, end:posCorner};
};


/**Retruns a new Vector3 representing the closest point within the area, relative to `origin`.
 * If `inverted`, returns closest point outside the area.
*/
export function GetClosestPointInArea(origin:Vector3, area:AlignedArea, inverted:boolean=false) {
    if (inverted) {
        return {
            x: Math.min(origin.x, Math.max(area.start.x, area.end.x)),
            y: Math.min(origin.y, Math.max(area.start.y, area.end.y)),
            z: Math.min(origin.z, Math.max(area.start.z, area.end.z)),
        };
    }
    else {
        return {
            x: Math.max(area.start.x, Math.min(origin.x, area.end.x)),
            y: Math.max(area.start.y, Math.min(origin.y, area.end.y)),
            z: Math.max(area.start.z, Math.min(origin.z, area.end.z)),
        };
    };
};


/**Determines if a block location is within the `AlignedArea` bounds.*/
export function LocationInArea(location:Vector3, area:AlignedArea) {
    let result:boolean = true;

    ['x','y','z'].forEach(i=>{
        if (result == false) {return};

        if (area.start[i] <= area.end[i]) {
            if (location[i] < area.start[i] || location[i] > area.end[i]) {
                result = false;
            };
        }
        else {
            if (location[i] < area.end[i] || location[i] > area.start[i]) {
                result = false;
            };
        };
    });

    return result;
};




/**Specifies what each CommandPermissionLevel value is equal to or greater than.*/
const cplMap:Dictionary<Array<number>> = {
    0: [0], // Any
    1: [0,1,2], // Game Directors
    2: [0,1,2], // Admin
    3: [0,1,2,3], // Host
    4: [0,1,2,3,4], // Owner
};
/**
 * Compares two command permission level values.
 * 
 * Returns `true` if `a` is equal to or higher than `b`.
 * */
export function CompareCommandPermissionLevel(a:CommandPermissionLevel, b:CommandPermissionLevel):boolean {
    return cplMap[a].includes(b);
};




/**
 * Assigns "minecraft:" namespace if no namespace already present.
*/
export function AssumeNamespace(type:string): string {
    if (!type.includes(':')) {type = 'minecraft:'+type};
    return type;
};


/**Returns every entity in every dimension.*/
export function GetAllEntities(options?:EntityQueryOptions) {
    return [
        ...world.getDimension('overworld').getEntities(options),
        ...world.getDimension('nether').getEntities(options),
        ...world.getDimension('the_end').getEntities(options),
    ];
};


/**
 * Returns true if `Entity` has any of the tags. If no tags in `tags` returns true.
 * Tags starting with "!" will return true if the `Entity` does NOT have the tag.
*/
export function EntityHasAnyTags(entity:Entity, tags:Array<string>):boolean {
    if (tags.length == 0) {return true};
    let result = false;
    tags.forEach(tag => {
        if (result == true) {return};
        if (entity.hasTag(tag) || (tag.startsWith('!') && !entity.hasTag(tag.replace('!','')))) {result = true};
    });
    return result;
};


/**
 * Returns true if `Entity` has all of the tags. If no tags in `tags` returns true.
 * Tags starting with "!" will return true if the `Entity` does NOT have the tag.
*/
export function EntityHasAllTags(entity:Entity, tags:Array<string>):boolean {
    if (tags.length == 0) {return true};
    let result;
    tags.forEach(tag => {
        if (result == false) {return};
        if (entity.hasTag(tag) || (tag.startsWith('!') && !entity.hasTag(tag.replace('!','')))) {result = true}
        else {result = false};
    });
    return result;
};


/**
 * Returns true if `object` is any of the types. If no items in `types`, returns true.
 * Types starting with "!" will return true if the `object` is not the type.
*/
export function IsAnyType(object:ItemStack|Entity|Block, types:Array<string>):boolean {
    if (types.length == 0) {return true};
    let result = false;
    types.forEach(type => {
        type = AssumeNamespace(type);
        if (result == true) {return};
        if (object.typeId == type || (type.split(':')[1].startsWith('!') && object.typeId != type.replace('!',''))) {result = true};
    });
    return result;
};


/**
 * Returns true if `object` is all of the types. If no items in `types`, returns true.
 * Types starting with "!" will return true if the `object` is not the type.
*/
export function IsAllTypes(object:ItemStack|Entity|Block, types:Array<string>):boolean {
    if (types.length == 0) {return true};
    let result;
    types.forEach(type => {
        if (!type.includes(':')) {type = 'minecraft:'+type}; // Assume minecraft namespace if none.
        if (result == false) {return};
        if (object.typeId == type || (type.split(':')[1].startsWith('!') && object.typeId != type.replace('!',''))) {result = true}
        else {result = false};
    });
    return result;
};



/**Max character length for dynamic property string value.*/
const mcDataCharCap:number = 32700;
/**
 * Saves & retieves data in "parts" to overcome maximum dynamic property string value length.
 * New parts are only created if absolutely needed.
*/
export const MCData = Object.freeze({
    // Get persistent data.
    get: (key:string, Holder:ItemStack|Entity|World=world) => {
        let result:Array<any> = [];
        let i:number = -1;
        while (true) {
            i += 1;
            const x = Holder.getDynamicProperty(`${key}[${i}]`);
            if (x == undefined) {break}
            else {result.push(x)};
        };
        if (result.length == 0) {return undefined};
        return JSON.parse(result.join(''));
    },


    // Set persistent data.
    set: (key:string, value:Dictionary<any>|Array<any>|undefined, Holder:ItemStack|Entity|World=world) => {
        const stringValue = JSON.stringify(value);
        // Set all occupied parts to `undefined`. To erase previous data.
        let i:number = -1;
        while (true) {
            i += 1;
            const id:string = `${key}[${i}]`;
            const x = Holder.getDynamicProperty(id);
            if (x == undefined) {break}
            else {Holder.setDynamicProperty(id, undefined)};
        };
        if (value == undefined) {return};
        // Set parts to new value.
        // Dynamic properties must be split when they are large enough due to the limits imposed by the Minecraft Server API.
        let parts = Math.ceil(stringValue.length / mcDataCharCap);
        if (parts < 1) {parts = 1};
        const splitValue = StringEqualSplit(stringValue, parts);
        for (let i:number = 0; i < parts; i++) {
            Holder.setDynamicProperty(`${key}[${i}]`, splitValue[i]);
        };
    },
});