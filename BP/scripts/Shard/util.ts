import {world, Entity, Block, Vector2, Vector3, CommandPermissionLevel, EntityQueryOptions} from '@minecraft/server';
import {Dictionary, AlignedArea} from './CONST';




/**Converts a Build Number to a Version.*/
export function BuildNumberToVersion(buildNumber:number) {
    return [
        Math.floor(buildNumber/1000),
        Math.floor((buildNumber%1000)/100),
        buildNumber%100,
    ];
};


/**Converts a Version to a Build Number.*/
export function VersionToBuildNumber(version:Array<number>) {
    return version[0]*1000 + version[1]*100 + version[2];
};



/**Converts a location to a string.*/
export function LocationToString(location:Vector3) {
    return `${location.x} ${location.y} ${location.z}`;
};


/**Converts a string to a location.*/
export function StringToLocation(value:string):{status:number, location?:Vector3} {
    if (value == undefined) {return {status:1}};

    const splitValue:Array<string> = value.split(' ');
    let x:any = splitValue[0];
    let y:any = splitValue[1];
    let z:any = splitValue[2];
    if (x == undefined || y == undefined || z == undefined) {
        return {status:1};
    };
    x = Number(x);
    y = Number(y);
    z = Number(z);
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
        return {status:1};
    };

    return {status:0, location:{x:x,y:y,z:z}};
};


/**Determines if a block location is out of bounds.*/
export function LocationOutOfBounds(location:Vector3):boolean {
    if (location.y > 256 || location.y < -64) {return true};
    return false;
};


/**Returns a new Vector3 with added values.*/
export function AddVector3(a:Vector3, b:Vector3|number):Vector3 {
    if (typeof b == 'number') {
        b = {x:b, y:b, z:b};
    };
    return {
        x: a.x+b.x,
        y: a.y+b.y,
        z: a.z+b.z,
    };
};


/**Returns a new Vector3 with subtracted values.*/
export function SubtractVector3(a:Vector3, b:Vector3|number):Vector3 {
    if (typeof b == 'number') {
        b = {x:b, y:b, z:b};
    };
    return {
        x: a.x-b.x,
        y: a.y-b.y,
        z: a.z-b.z,
    };
};


/**Returns a new Vector3 with normalized values.*/
export function NormalizeVector3(vector:Vector3):Vector3 {
    let length = Math.sqrt(vector.x**2 + vector.y**2 + vector.z**2);
    if (length == 0) {
        return {x:0,y:0,z:0};
    };
    return {
        x: vector.x / length,
        y: vector.y / length,
        z: vector.z / length,
    };
};


/**Returns a new Vector3 with rounded values.*/
export function RoundVector3(vector:Vector3):Vector3 {
    return {
        x: Math.round(vector.x),
        y: Math.round(vector.y),
        z: Math.round(vector.z),
    };
};


/**Returns a new Vector3 with sign flipped values.
 * Equivalant to `var number = -number`.
*/
export function FlipVector3(vector:Vector3):Vector3 {
    return {
        x: -vector.x,
        y: -vector.y,
        z: -vector.z,
    };
};


/**Returns a new Vector3 with the new precision.*/
export function FixVector3(vector:Vector3, precision:number):Vector3 {
    let newVector:Vector3 = {x:0,y:0,z:0};
    newVector.x = Number(vector.x.toPrecision(precision));
    newVector.y = Number(vector.y.toPrecision(precision));
    newVector.z = Number(vector.z.toPrecision(precision));
    return newVector;
};


/**Returns a new Vector2 with the new precision.*/
export function FixVector2(vector:Vector2, precision:number):Vector2 {
    let newVector:Vector2 = {x:0,y:0};
    newVector.x = Number(vector.x.toPrecision(precision));
    newVector.y = Number(vector.y.toPrecision(precision));
    return newVector;
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


/**Split a string into equal parts.*/
export function EqualSplitString(value:string, parts:number) {
    let result:Array<string> = [];
    const partLength = Math.floor(value.length/parts);
    const remainder = value.length%parts;
    let startIndex:number = 0;
    for (let i:number = 0; i < parts; i++) {
        const length:number = partLength + (i<remainder?1:0);
        result.push(value.slice(startIndex, startIndex+length));
        startIndex += length;
    };

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
/**Compares two command permission level values.
 * 
 * Returns `true` if `a` is equal to or higher than `b`.
 * */
export function CompareCommandPermissionLevel(a:CommandPermissionLevel, b:CommandPermissionLevel):boolean {
    return cplMap[a].includes(b);
};




/**Returns every entity in every dimension.*/
export function GetAllEntities(options?:EntityQueryOptions) {
    return [
        ...world.getDimension('overworld').getEntities(options),
        ...world.getDimension('nether').getEntities(options),
        ...world.getDimension('the_end').getEntities(options),
    ];
};


/**Tests if the Entity Selector applies to the `Entity`.
 * 
 * Cannot be called in `read-only` mode.
*/
export function SelectorApplies(entity:Entity, selector:string):boolean {
    const testTag = `sh:testSelector.${Math.random()}`;
    entity.runCommand(`tag ${selector} add ${testTag}`);
    if (entity.hasTag(testTag)) {
        entity.removeTag(testTag);
        return true;
    };
    return false;
};


/**Returns true if `Entity` has any of the tags. If no tags in `tags` returns true.
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


/**Returns true if `Block` is any of the block types. If no block types in `blockTypes` returns true.
 * Block types starting with "!" will return true if the `Block` is not the type.
*/
export function BlockIsAnyType(block:Block, blockTypes:Array<string>):boolean {
    if (blockTypes.length == 0) {return true};
    let result = false;
    blockTypes.forEach(type => {
        if (!type.includes(':')) {type = 'minecraft:'+type}; // Assume minecraft namespace if none.
        if (result == true) {return};
        if (block.typeId == type || (type.startsWith('!') && block.typeId != type.replace('!',''))) {result = true};
    });
    return result;
};


/**Returns true if `Block` is all of the block types. If no block types in `blockTypes` returns true.
 * Block types starting with "!" will return true if the `Block` is not the type.
*/
export function BlockIsAllTypes(block:Block, blockTypes:Array<string>):boolean {
    if (blockTypes.length == 0) {return true};
    let result;
    blockTypes.forEach(type => {
        if (!type.includes(':')) {type = 'minecraft:'+type}; // Assume minecraft namespace if none.
        if (result == false) {return};
        if (block.typeId == type || (type.split(':')[1].startsWith('!') && block.typeId != type.replace('!',''))) {result = true}
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
export const MCData = {
    // Get persistent data.
    'get': (key:string, Holder=world) => {
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
    'set': (key:string, value:Dictionary<any>, Holder=world) => {
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
        // Set parts to new value.
        // Dynamic properties must be split when they are large enough due to the limits imposed by the Minecraft Server API.
        let parts = Math.round(stringValue.length / mcDataCharCap);
        if (parts < 1) { parts = 1; };
        const splitValue = EqualSplitString(stringValue, parts);
        for (let i:number = 0; i < parts; i++) {
            Holder.setDynamicProperty(`${key}[${i}]`, splitValue[i]);
        };
    },
};