import {MC} from './CONST';


class EventSignal {
    _id: string;
    _listeners:Array<()=>void> = [];


    constructor(id) {
        this._id = id;
    };


    subscribe(callback:()=>void) {
        this._listeners.push(callback);
    };


    unsubscribe(callback:()=>void) {
        this._listeners.splice(this._listeners.indexOf(callback), 1);
    };
};




// All Shard after events.
export const afterEvents = {
    tick: new EventSignal('tick'),

}



// Tick loop.
function tick() {
    afterEvents.tick._listeners.forEach(listener => {
        listener();
    });
    
    MC.system.run(tick);
};


MC.system.run(tick);