import {system, world, ScoreboardObjective} from '@minecraft/server';
import {Dictionary} from '../../ShardAPI/CONST';
import ShardModule from '../../ShardAPI/module';
import ShardEventListener from '../../ShardAPI/event_listener';
import ShardCommand from '../../ShardAPI/command';
import ShardForm from '../../ShardAPI/form';
// Import events.
import * as event_playerSpawn from './events/playerSpawn';
import * as event_entityDie from './events/entityDie';
import * as event_tick from './events/tick';
// Import forms.
import * as form_main from './forms/main';




// Define module properties.
var EventListeners:Dictionary<ShardEventListener> = {
    playerSpawn: event_playerSpawn.EventListener,
    entityDie: event_entityDie.EventListener,
    tick: event_tick.EventListener,
};
var Commands:Dictionary<ShardCommand> = {
};
var Forms:Dictionary<ShardForm> = {
};


// Setup scoreboards.
export var scoreboardsReady:boolean = false;
const scoreboardIds:Array<string> = [
    'sh.tk.playerJoins',
    'sh.tk.playerDeaths',
    'sh.tk.timePlayed.t',
    'sh.tk.timePlayed.s',
    'sh.tk.timePlayed.m',
    'sh.tk.timePlayed.h',
    'sh.tk.timePlayed.d',
];
export const Scoreboards:Dictionary<ScoreboardObjective> = {};

system.run(()=>{
    scoreboardIds.forEach(id => {
        // If scoreboard already exists in world, add to `Scoreboards` then return.
        if (world.scoreboard.getObjective(id)) {
            Scoreboards[id] = world.scoreboard.getObjective(id);
            return;
        };
        // Create scoreboard & add to `Scoreboards` if it doesn't exist.
        Scoreboards[id] = world.scoreboard.addObjective(id);
    });
    scoreboardsReady = true;
});




// Init callback.
function Init() {};





// Instantiate Module.
export const Module:ShardModule = new ShardModule(
    'tracker', // ID
    {translate:'shard.tracker.displayName'}, // Display name
    {translate:'shard.tracker.description'}, // Description
    Init,
    EventListeners,
    Commands,
    Forms,
    form_main.Form,
);