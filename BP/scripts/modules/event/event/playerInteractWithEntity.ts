import {system, PlayerInteractWithEntityAfterEvent} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {StringFormat} from '../../../util/string';
import {Module, Event} from '../module';


function Callback(event:PlayerInteractWithEntityAfterEvent) {
    const player = event.player;
    const entity = event.target;
    const item = event.beforeItemStack;
    const env = {player:player, target:entity, item:item};
    (Object.values(Module.persisData.events) as Array<Event>).forEach(event => {
        if (event.eventId != 'playerInteractWithEntity') {return};
        const playerActor = event.actors.player;
        const targetActor = event.actors.targetEntity;
        system.run(()=>{
            if (playerActor) {
                try {player.runCommand(StringFormat(playerActor.command, env))} catch {};
            };
            if (targetActor) {
                try {entity.runCommand(StringFormat(targetActor.command, env))} catch {};
            };
        });
    });
};


// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'before', eventId:'playerInteractWithEntity'},
    {callback: Callback},
);