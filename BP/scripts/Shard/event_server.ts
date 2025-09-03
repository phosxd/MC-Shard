import {system, world, PlayerJoinAfterEvent, Player} from '@minecraft/server';
import {Dictionary} from './CONST';




class TickEventSignal {
    _listeners:Array<(data:Dictionary<any>)=>Dictionary<any>>;

    constructor() {
        this._listeners = [];
    };
    subscribe(callback:(data:Dictionary<any>)=>Dictionary<any>):void {
        this._listeners.push(callback);
    };
    unsubscribe(callback:(data:Dictionary<any>)=>Dictionary<any>):void {
        this._listeners.splice(this._listeners.indexOf(callback), 1);
    };
};




// All Shard after events.
export const afterEvents = {
    /**Runs every server tick (1/20th seconds).
     * 
     * `data` is the data passed onto the next listener, this exists for separate listeners to be able to share resources to save performance.
    */
    tick: new TickEventSignal(),
};



// Tick loop.
function tick() {
    let data:Dictionary<any> = {};
    afterEvents.tick._listeners.forEach(listener => {
        data = listener(data);
    });
    
    system.run(tick);
};
system.run(tick);