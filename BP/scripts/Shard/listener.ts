export interface ShardListenerDetails {
    source: 'world'|'system'|'shard',
    type: 'before'|'after',
    eventId: string,
};


export interface ShardListenerData {
    callback: Function,
};




export class ShardListener {
    readonly details: ShardListenerDetails;
    callback: Function;


    constructor(details:ShardListenerDetails, data:ShardListenerData) {
        this.details = details;
        this.callback = data.callback;
    };
};