import {system, world, PlayerJoinAfterEvent, Player} from '@minecraft/server';




class EventSignal {
    _id: string;
    _listeners:Array<Function> = [];


    constructor(id) {
        this._id = id;
    };


    subscribe(callback:Function) {
        this._listeners.push(callback);
    };


    unsubscribe(callback:()=>void) {
        this._listeners.splice(this._listeners.indexOf(callback), 1);
    };
};




// All Shard after events.
export const afterEvents = {
    tick: new EventSignal('tick'),
    playerLoad: new EventSignal('playerLoad'),
};



// Tick loop.
function tick() {
    afterEvents.tick._listeners.forEach(listener => {
        listener();
    });
    
    system.run(tick);
};
system.run(tick);


// Player Load.
world.afterEvents.playerJoin.subscribe(event => {
    afterEvents.playerLoad._listeners.forEach(listener => {
        const attempts:number = 10; // How many times it attempts to find the player.
        const attempt_interval:number = 20; // Ticks between each attempt.
        let attempt_count:number = 0;
        function Attempt(event:PlayerJoinAfterEvent) {
            attempt_count += 1;
            // Quit if used all attempts.
            if (attempt_count > attempts) {return};
            const players:Array<Player> = world.getPlayers({name:event.playerName});
            const player = players[0];
            // If no player, try again.
            if (player == undefined) {
                system.runTimeout(Attempt.bind(this,event), attempt_interval);
                return;
            };

            // If player found run listeners.
            listener({
                player: player,
            });
        };


        Attempt(event);
    });
});