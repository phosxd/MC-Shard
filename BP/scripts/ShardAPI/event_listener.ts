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
    };
};