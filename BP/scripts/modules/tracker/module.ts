import {system, world, ScoreboardObjective} from '@minecraft/server';
import {Dictionary} from '../../Shard/CONST';
import {ShardModule} from '../../Shard/module';


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




// Instantiate Module.
export const Module = new ShardModule(
    {
        id: 'tracker',
        displayName: {translate:'shard.tracker.displayName'},
        brief: {translate:'shard.tracker.brief'},
        description: {translate:'shard.tracker.description', with:[trackersList, scoreboardsList, statesList]},
    },
    {
        childPaths: [
            'event/entityDie',
            'event/entityHealthChange',
            'event/playerHotbarSelectedSlotChange',
            'event/playerSpawn',
            'event/tick',
        ],
    },
);