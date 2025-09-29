import {system, Dimension, CommandPermissionLevel, CustomCommandParamType, Entity, Player, Vector3, MolangVariableMap} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {AddVector} from '../../../util/vector';
import {partying} from '../module';


const defaultLength:number = 10; // Party duration in seconds.
const interval:number = 5; // Interval in ticks.
const partyDistance:number = 15;
const particleCount:number = 6;
const particleSpread:number = 2.8;




function Callback(context:ShardCommandContext, args:Array<any>) {
    const player = context.target as Player;
    // Return error if already partying.
    if (partying.includes(player.id)) {
        return {message:{translate:'shard.fun.cmd.party.alreadyPartying'}, status:1};
    };
    // Get nearby entities to party with.
    const friends:Array<Entity> = context.target.dimension.getEntities({excludeTypes:['player', 'item'], excludeFamilies:['inanimate'], location:context.location, maxDistance:partyDistance});
    if (friends.length < 1) {
        return {message:{translate:'shard.fun.cmd.party.noFriends'}, status:1};
    };
    let seconds:number = args[0];
    if (!seconds) {seconds = defaultLength};
    const maxIterations:number = seconds*interval

    let runId:number;
    let iteration:number = 0;
    runId = system.runInterval(()=>{
        iteration += 1;
        // Quit if hit max iterations.
        if (iteration >= maxIterations) {
            system.clearRun(runId);
            return;
        };
        // Run.
        let i:number = 0;
        friends.concat(player).forEach(entity => {
            i += 1;
            try {
                // Make mobs jumps.
                if (entity.isOnGround && entity.typeId !== 'minecraft:player') {entity.applyKnockback({x:0,z:0}, 0.5)};
                // Summon particles.
                generateParticles(context.dimension, entity.getHeadLocation());
            } catch {};
        });
    }, interval);

    // Play music.
    let music_choice:string
    const random = Math.random();
    if (random <= 0.25) {music_choice = 'record.otherside'}
    else if (random <= 0.5) {music_choice = 'record.pigstep'}
    else if (random <= 0.75) {music_choice = 'record.blocks'}
    else if (random <= 1.0) {music_choice = 'record.chirp'};
    system.run(()=>{
        context.dimension.playSound(music_choice, context.location, {volume:0.8});
    });
    // End music & remove from list.
    system.runTimeout(()=>{
        context.dimension.runCommand('stopsound @a '+music_choice);
        partying.splice(partying.indexOf(player.id));
    }, interval*maxIterations);

    partying.push(player.id);

    return {message:{translate:'shard.fun.cmd.party.success', with:[String(friends.length)]}, status:0};
};


function generateParticles(dimension:Dimension, location:Vector3) {
    for (let i:number=0; i < particleCount; i++) {
        const variables = new MolangVariableMap();
        variables.setColorRGB('note_color', {red:Math.random(), green:Math.random(), blue:Math.random()});
        dimension.spawnParticle('minecraft:note_particle', AddVector(location, randomParticleLocation()) as Vector3, variables);
    };
};


function randomParticleLocation() {
    return {
        x: (Math.random()-0.5)*particleSpread,
        y: (Math.random()-0.5)*particleSpread,
        z: (Math.random()-0.5)*particleSpread,
    };
};




// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'party',
        brief: 'shard.fun.cmd.party.brief',
        permissionLevel: CommandPermissionLevel.Any,
        optionalParameters: [
            {name:'seconds', type:CustomCommandParamType.Integer},
        ],
    },
    {callback: Callback},
);