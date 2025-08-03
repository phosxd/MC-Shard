import * as ShardAPI from './ShardAPI';

export default class ShardEvent {
    eventId: ShardAPI.EventIds;
    callback: Function;

    constructor(eventId:ShardAPI.EventIds, callback:Function) {
        this.eventId = eventId;
        this.callback = callback;
    };
};