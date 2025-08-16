export {MC, MCUI};
import * as MC from '@minecraft/server';
import * as MCUI from '@minecraft/server-ui';
import * as Util from './util';


export interface Dictionary<T> {
    [key:string]: T,
};
export const Namespace:string = 'sh';
export const CommandNamespace:string = Namespace; // Used for command & command enum namespace.
export const BranchString:string = 'STABLE';
export const Version:Array<number> = [0,0,2];
export const VersionString:string = Version.join('.');
export const BuildNumber = Util.VersionToBuildNumber(Version);

//export type CardinalDirection = 'North'|'East'|'South'|'West'|'Up'|'Down';

export const CardinalDirectionMap = {
    'north': {x:0,y:0,z:1},
    'east': {x:1,y:0,z:0},
    'south': {x:0,y:0,z:-1},
    'west': {x:-1,y:0,z:0},
    'up': {x:0,y:1,z:0},
    'down': {x:0,y:-1,z:0},
};


// Every module.
export const ModuleNames = [
    'core',
    'util',
    'textdisplay',
    'draw',
];
// Modules that cannot be disabled.
export const PermaEnabledModules = [
    'core',
    'textdisplay',
];