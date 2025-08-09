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
export const Version:Array<number> = [0,0,1];
export const VersionString:string = Version.join('.');
export const BuildNumber = Util.VersionToBuildNumber(Version);


// Every module.
export const ModuleNames = [
    'core',
    'util',
];
// Modules that cannot be disabled.
export const PermaEnabledModules = [
    'core',
];