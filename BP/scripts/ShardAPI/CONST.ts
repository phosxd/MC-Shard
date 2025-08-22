import {VersionToBuildNumber} from './util';


/**Namespace used for features initialized with scripts.
 * Should always adhere to Minecraft namespace rules.
*/
export const Namespace:string = 'sh';

/**Namespace used when initializing custom commands & custom command enums.*/
export const CommandNamespace:string = Namespace;

/**The current version of the add-on.*/
export const Version:Array<number> = [0,0,2];
/**Version as a string value. Derived from `Version`.*/
export const VersionString:string = Version.join('.');
/**Build number used for integral versioning. Derived from `Version`.*/
export const BuildNumber = VersionToBuildNumber(Version);


/**Every module the add-on includes.
 * Can be modified to include new modules or exclude existing ones.
 * Must be valid module folder names that actually exist.
*/
export const ModuleNames = [
    'core',
    'util',
    'tracker',
    'textdisplay',
    'draw',
];

/**Modules that cannot be disabled during run-time.*/
export const PermaEnabledModules = [
    'core',
    'textdisplay',
];




// EVERYTHING BELOW THIS POINT SHOULD NOT BE MODIFIED.
// ---------------------------------------------------

export interface Dictionary<T> {
    [key:string]: T,
};


//export type CardinalDirection = 'North'|'East'|'South'|'West'|'Up'|'Down';

export const CardinalDirectionMap = {
    'north': {x:0,y:0,z:1},
    'east': {x:1,y:0,z:0},
    'south': {x:0,y:0,z:-1},
    'west': {x:-1,y:0,z:0},
    'up': {x:0,y:1,z:0},
    'down': {x:0,y:-1,z:0},
};