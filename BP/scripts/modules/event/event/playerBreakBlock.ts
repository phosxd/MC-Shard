import {system, PlayerBreakBlockBeforeEvent} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {StringifyVector3} from '../../../Shard/util';
import {Format} from '../../../util/string';
import {Module, Event} from '../module';


function Callback(event:PlayerBreakBlockBeforeEvent) {
    const player = event.player;
    const block = event.block;
    const beforeBlock = {
        typeId: block.typeId,
        location: block.location,
        dimension: block.dimension,
        center: block.center(),
        isAir: block.isAir,
        isLiquid: block.isLiquid,
        isLiquidBlocking: block.isLiquidBlocking,
    };
    const env = {player:player, block:beforeBlock};
    system.run(()=>{
        (Object.values(Module.persisData.events) as Array<Event>).forEach(event => {
            if (event.eventId != 'playerBreakBlock') {return};
            const playerActor = event.actors.player;
            const blockActor = event.actors.block;
            if (playerActor) {
                try {player.runCommand(Format(playerActor.command, env))} catch {};
            };
            if (blockActor) {
                try {block.dimension.runCommand(`execute positioned ${StringifyVector3(block.location)} run ${Format(blockActor.command, env)}`)} catch {};
            };
        });
    });
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'before', eventId:'playerBreakBlock'},
    {callback: Callback},
);