import {MC, Dictionary} from './CONST';


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
export function LocationToString(location:MC.Vector3) {
    return `${location.x} ${location.y} ${location.z}`;
};


/**Determines if a block location is out of bounds.*/
export function LocationOutOfBounds(location:MC.Vector3):boolean {
    if (location.y > 256 || location.y < -64) {return true};
    return false;
};


/**Returns a new Vector3 with the new precision.*/
export function FixVector3(vector:MC.Vector3, precision:number):MC.Vector3 {
    let newVector:MC.Vector3 = {x:0,y:0,z:0};
    newVector.x = Number(vector.x.toPrecision(precision));
    newVector.y = Number(vector.y.toPrecision(precision));
    newVector.z = Number(vector.z.toPrecision(precision));
    return newVector;
};


/**Returns a new Vector2 with the new precision.*/
export function FixVector2(vector:MC.Vector2, precision:number):MC.Vector2 {
    let newVector:MC.Vector2 = {x:0,y:0};
    newVector.x = Number(vector.x.toPrecision(precision));
    newVector.y = Number(vector.y.toPrecision(precision));
    return newVector;
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




// Specifies what each CommandPermissionLevel value is equal to or greater than.
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
export function CompareCommandPermissionLevel(a:MC.CommandPermissionLevel, b:MC.CommandPermissionLevel):boolean {
    return cplMap[a].includes(b);
};



/**Max character length for dynamic property string value.*/
const mcDataCharCap:number = 9500;
/**API for persistent data.
 * 
 * Saves & retieves data in "parts" to overcome maximum dynamic property string value length.
 * New parts are only created if absolutely needed.
 * Since there is no way to "delete" dynamic properties, discarded parts are set to `false`.
*/
export const MCData = {
    // Get persistent data.
    'get': (key:string, Holder=MC.world) => {
        let result:Array<any> = [];
        let i:number = -1;
        while (true) {
            i += 1;
            const x = Holder.getDynamicProperty(`${key}[${i}]`);
            if (x == undefined || x == false) {break}
            else {result.push(x)};
        };
        if (result.length == 0) {return undefined};
        return JSON.parse(result.join(''));
    },


    // Set persistent data.
    'set': (key:string, value:Dictionary<any>, Holder=MC.world) => {
        const stringValue = JSON.stringify(value);
        // Set all occupied parts to `false`. To "erase" previous data.
        let i:number = -1;
        while (true) {
            i += 1;
            const id:string = `${key}[${i}]`;
            const x = Holder.getDynamicProperty(id);
            if (x == undefined || x == false) {break}
            else {Holder.setDynamicProperty(id, false)};
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