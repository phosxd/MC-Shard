import {CommandPermissionLevel} from '@minecraft/server';
import {ShardForm, ShardFormBuilder, ShardFormElement, ShardFormModalResponse} from '../../../Shard/form';
import {ShardCommandContext} from '../../../Shard/command';
import {} from '../../../Shard/util';
import {Module, Event} from '../module';
import EventVariables from '../eventVariables';


function Builder(context:ShardCommandContext, ...args) {
    const eventName:string = args[0];
    const event:Event = Module.persisData.events[eventName];
    if (!event) {return};
    // Get event actor IDs.
    const eventVariables = EventVariables[event.eventId];
    let eventActorIds = [];
    eventVariables.forEach(item => {
        if (!item.startsWith('@')) {return};
        eventActorIds.push(item.replace('@','').split(':')[0]);
    });

    const eventActors = event.actors;
    const message:string = args[1];

    const elements:Array<ShardFormElement> = [];
    elements.push({type:'title', id:'title', data:{display:{rawtext:[Module.details.displayName, {text:' - '}, {translate:'shard.event.form.edit.title'}]}}});
    if (message) {
        elements.push({type:'label', id:'message', data:{display:message}});
    };
    elements.push({type:'label', id:'body', data:{display:{translate:'shard.event.form.edit.body', with:[event.eventId]}}});
    elements.push({type:'textBox', id:'name', data:{display:{translate:'shard.general.name'}, placeholder:{translate:'shard.formCommon.enterUniqueName'}, defaultValue:event.name}});

    // Add actor command options.
    eventActorIds.forEach(actorId => {
        let actor = eventActors[actorId];
        if (!actor) {actor = {command:''}};
        elements.push({type:'textBox', id:'@'+actorId, data:{
            display: {translate:'shard.event.form.edit.@'+actorId},
            tooltip: {translate:'shard.event.form.edit.@'+actorId+'.tooltip'},
            defaultValue: actor.command,
        }});
    });

    return new ShardFormBuilder({type:'modal'}, {elements:elements, callbackArgs:[eventName]});
};




function Callback(context:ShardCommandContext, response:ShardFormModalResponse, ...args) {
    const eventName:string = args[0];
    const newName:string = response.map.name
    // Edit event.
    if (newName != eventName) {
        Module.persisData.events[newName] = Module.persisData.events[eventName];
        delete Module.persisData.events[eventName];
    };
    const event:Event = Module.persisData.events[newName];
    event.name = newName;

    // Actor commands.
    for (const key in response.map) {
        const value = response.map[key];
        if (!key.startsWith('@')) {continue};
        event.actors[key.replace('@','')] = {command: value};
    };

    // Save.
    Module.persisData.events[newName] = event;
    Module.saveData();
};




// Initialize form.
export const MAIN = new ShardForm(
    {id:'edit', permissionLevel:CommandPermissionLevel.GameDirectors},
    {buildForm:Builder, callback:Callback},
);