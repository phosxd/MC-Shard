import {system, world, ScoreboardObjective} from '@minecraft/server';
import {Dictionary} from '../../ShardAPI/CONST';
import ShardModule from '../../ShardAPI/module';
import ShardEventListener from '../../ShardAPI/event_listener';
import {ShardCommand} from '../../ShardAPI/command';
import ShardForm from '../../ShardAPI/form';
// Import events.
import * as event_playerSpawn from './events/playerSpawn';
import * as event_entityDie from './events/entityDie';
import * as event_entityHealthChange from './events/entityHealthChange';
import * as event_selectedSlotChange from './events/playerHotbarSelectedSlotChange';
import * as event_tick from './events/tick';
// Import forms.
import * as form_main from './forms/main';




// Define module properties.
var EventListeners:Dictionary<ShardEventListener> = {
    playerSpawn: event_playerSpawn.EventListener,
    entityDie: event_entityDie.EventListener,
    entityHealthChange: event_entityHealthChange.EventListener,
    selectedSlotChange: event_selectedSlotChange.EventListener,
    tick: event_tick.EventListener,
};
var Commands:Dictionary<ShardCommand> = {
};
var Forms:Dictionary<ShardForm> = {
};


// Setup scoreboards.
export var scoreboardsReady:boolean = false;
export const scoreboardIds:Array<string> = [
    'sh.tk.timePlayed.tt',
    'sh.tk.timePlayed.t',
    'sh.tk.timePlayed.s',
    'sh.tk.timePlayed.m',
    'sh.tk.timePlayed.h',
    'sh.tk.timePlayed.d',
    'sh.tk.playerJoins',
    'sh.tk.playerDeaths',
    'sh.tk.holdingSlot',
    'sh.tk.health',
];

export const trackerIds:Array<string> = [
    'sh.tk.timePlayed',
    'sh.tk.playerJoins',
    'sh.tk.playerDeaths',
    'sh.tk.holdingSlot',
    'sh.tk.health',
    'sh.tk.mobileState',
];

export const stateIds:Array<string> = [
    'sh.st.isJumping',
    'sh.st.isSneaking',
    'sh.st.isSprinting',
    'sh.st.isSwimming',
    'sh.st.isFalling',
    'sh.st.isFlying',
    'sh.st.isGliding',
    'sh.st.isClimbing',
    'sh.st.isSleeping',
    'sh.st.isEmoting',
];

export var trackersList:string = '';
trackerIds.forEach(id => {
    trackersList += '\n§r- §5'+id;
});

export var statesList:string = '';
stateIds.forEach(id => {
    statesList += '\n§r- §5'+id;
});

export var scoreboardsList:string = '';
scoreboardIds.forEach(id => {
    scoreboardsList += '\n§r- §5'+id;
});

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