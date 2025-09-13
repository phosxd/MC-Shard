import {Dictionary} from './CONST';


export interface ShardListenerDetails {
    source: 'world'|'system'|'shard',
    type: 'before'|'after',
    eventId: string,
};


export interface ShardListenerData {
    callback: Function,
    options?: Dictionary<any>,
};




export class ShardListener {
    readonly details: ShardListenerDetails;
    callback: Function;
    options: Dictionary<any>;


    constructor(details:ShardListenerDetails, data:ShardListenerData) {
        this.details = details;
        this.callback = data.callback;
        if (data.options) {this.options = data.options}
        else {this.options = {}};
    };
};