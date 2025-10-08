import {system, PlayerDimensionChangeAfterEvent} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {StringFormat} from '../../../util/string';
import {Module, Event} from '../module';


function Callback(event:PlayerDimensionChangeAfterEvent) {
    const player = event.player;
    const fromDimension = event.fromDimension;
    const toDimension = event.toDimension;
    const fromLocation = event.fromLocation;
    const toLocation = event.toLocation;
    const env = {player:player, fromDimension:fromDimension, toDimension:toDimension, fromLocation:fromLocation, toLocation:toLocation};
    system.run(()=>{
        (Object.values(Module.persisData.events) as Array<Event>).forEach(event => {
            if (event.eventId != 'playerDimensionChange') {return};
            const playerActor = event.actors.player;
            if (playerActor) {
                try {player.runCommand(StringFormat(playerActor.command, env))} catch {};
            };
        });
    });
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'after', eventId:'playerDimensionChange'},
    {callback: Callback},
);