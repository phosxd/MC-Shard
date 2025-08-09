import {MC, Namespace, BuildNumber} from './CONST';


const Discovery = {
    id: Namespace,
    version: BuildNumber,
    name: 'shard',
    additions: [],
};


MC.system.sendScriptEvent('global:discovery', JSON.stringify(Discovery));