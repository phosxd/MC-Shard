import * as ShardEventServer from './event_server';
import {world, system} from '@minecraft/server';


const Sources = {
    'world': world,
    'system': system,
    'shard': ShardEventServer,
};




export default class ShardEventListener {
    source: 'world'|'system'|'shard';
    type: 'before'|'after';
    eventId: string;
    callback: Function;


    constructor(source:'world'|'system'|'shard', type:'before'|'after', eventId:string, callback:Function) {
        this.source = source;
        this.type = type;
        this.eventId = eventId;
        this.callback = callback;

        // Register event.
        Sources[source][`${type}Events`][eventId].subscribe(callback);
    };
};