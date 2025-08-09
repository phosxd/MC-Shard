import {MC, Dictionary} from './CONST';


// Converts a Build Number to a Version.
export function BuildNumberToVersion(buildNumber:number) {
    return [
        Math.floor(buildNumber/1000),
        Math.floor((buildNumber%1000)/100),
        buildNumber%100,
    ];
};


// Converts a Version to a Build Number.
export function VersionToBuildNumber(version:Array<number>) {
    return version[0]*1000 + version[1]*100 + version[2];
};



// Converts a location to a string.
export function LocationToString(location:MC.Vector3) {
    return `${location.x} ${location.y} ${location.z}`;
};


// Determines if a block location is out of bounds.
export function LocationOutOfBounds(location:MC.Vector3) {
    if (location.y > 256 || location.y < -64) {return true};
    return false;
};


// Split a string into equal parts.
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




// API for persistent data.
export const MCData = {
    // Get persistent data.
    'get': (key:string, Holder=MC.world) => {
        let result:Array<any> = [];
        let i = -1;
        while (true) {
            i += 1;
            let x = Holder.getDynamicProperty(`${key}[${i}]`);
            if (x === undefined) {break}
            else {result.push(x)};
        };
        if (result.length === 0) {return undefined};
        //console.warn(result.join(''));
        return JSON.parse(result.join(''));
    },


    // Set persistent data.
    'set': (key:string, value:Dictionary<any>, Holder=MC.world) => {
        let stringValue = JSON.stringify(value);
        // Dynamic properties must be split when they are large enough due to the limits imposed by the Minecraft Server API.
        let parts = Math.round(stringValue.length / 9500);
        if (parts < 1) { parts = 1; };
        let splitValue = EqualSplitString(stringValue, parts);
        for (let i:number = 0; i < parts; i++) {
            Holder.setDynamicProperty(`${key}[${i}]`, splitValue[i]);
        };
    },
};