import {system, ButtonPushAfterEvent} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {StringifyVector3} from '../../../Shard/util';
import {StringFormat} from '../../../util/string';
import {Module, Event} from '../module';


function Callback(event:ButtonPushAfterEvent) {
    const source = event.source;
    const block = event.block;
    const env = {source:source, block:block};
    system.run(()=>{
        (Object.values(Module.persisData.events) as Array<Event>).forEach(event => {
            if (event.eventId != 'buttonPush') {return};
            const sourceActor = event.actors.source;
            const blockActor = event.actors.block;
            if (sourceActor) {
                try {source.runCommand(StringFormat(sourceActor.command, env))} catch {};
            };
            if (blockActor) {
                try {block.dimension.runCommand(`execute positioned ${StringifyVector3(block.location)} run ${Format(blockActor.command, env)}`)} catch {};
            };
        });
    });
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'after', eventId:'buttonPush'},
    {callback: Callback},
);