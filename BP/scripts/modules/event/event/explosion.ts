import {system, ExplosionBeforeEvent} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {Format} from '../../../util/string';
import {Module, Event} from '../module';


function Callback(event:ExplosionBeforeEvent) {
    const source = event.source;
    const env = {source:source};
    if (!source) {return};
    system.run(()=>{
        (Object.values(Module.persisData.events) as Array<Event>).forEach(event => {
            if (event.eventId != 'explosion') {return};
            const sourceActor = event.actors.source;
            if (sourceActor) {
                try {source.runCommand(Format(sourceActor.command, env))} catch {};
            };
        });
    });
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'world', type:'before', eventId:'explosion'},
    {callback: Callback},
);