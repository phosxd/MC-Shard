import {system} from '@minecraft/server';
import {Namespace, BuildNumber} from './CONST';


const Discovery = {
    id: Namespace,
    version: BuildNumber,
    name: 'shard',
    additions: [],
};


system.sendScriptEvent('global:discovery', JSON.stringify(Discovery));