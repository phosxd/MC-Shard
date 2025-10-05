import {system, world, CommandPermissionLevel, CustomCommandParamType, BlockVolume, Vector3, Dimension, Player} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {ShortDimensionIdToNormal} from '../../../Shard/CONST';
import {StringToVector, AddVector} from '../../../util/vector';
import {DmkHeader, DmkHeaderOld, UnspoofBlock, SpoofBlock} from '../module';

const tickingAreaName = 'shard:antixray.wipeSpoofs';
/**Whether or not this command is already in use.*/
let inUse:boolean = false;
let progress:number = 0;
let goal:number = 0;


function* wipeSpoofs(originDimension:Dimension, player?:Player) {
    originDimension.runCommand(`tickingarea remove "${tickingAreaName}"`); // Remove any previous ticking area.
    // Get all spoofed block keys.
    const keys = world.getDynamicPropertyIds().filter(value => {
        return value.startsWith(DmkHeader) || value.startsWith(DmkHeaderOld);
    });
    const keysNoHeader = keys.map(value => {
        if (value.startsWith(DmkHeader)) {
            return value.replace(DmkHeader,'');
        }
        else if (value.startsWith(DmkHeaderOld)) {
            return value.replace(DmkHeaderOld,'').replace(':','');
        };
    });
    goal = keys.length;
    for (const index in keys) {
        const key = keys[index];
        const keyNoHeader = keysNoHeader[index];
        progress += 1;
        if (world.getDynamicProperty(key) == undefined) {continue};
        // Decode key to get dimension & location.
        const dimensionId = ShortDimensionIdToNormal[keyNoHeader[0]];
        const stringLocation = keyNoHeader.replace(keyNoHeader[0],'');
        const dimension = world.getDimension(dimensionId);
        const location = StringToVector(stringLocation, 3).vector as Vector3;
        // Add chunk loader.
        dimension.runCommand(`tickingarea add circle ${stringLocation} 2 "${tickingAreaName}"`);
        // Wait until location is loaded.
        yield {dimension:dimension, location:location};
        // Unspoof block.
        UnspoofBlock(dimension.getBlock(location));
        // Unspoof nearby blocks.
        const volume = new BlockVolume(AddVector(location, -20) as Vector3, AddVector(location, 20) as Vector3);
        const spoofedBlocks = dimension.getBlocks(volume, {includeTypes:[SpoofBlock]}, true);
        for (const location of spoofedBlocks.getBlockLocationIterator()) {
            const block = dimension.getBlock(location);
            if (!block) {continue};
            UnspoofBlock(block);
        };
        // Remove loader then yield.
        dimension.runCommand(`tickingarea remove "${tickingAreaName}"`);
        yield;
    };
    player?.sendMessage({translate:'shard.antixray.cmd.unspoof.result', with:[String(progress)]});
    progress = 0;
    goal = 0;
};




function Callback(context:ShardCommandContext, args:Array<any>) {
    const sendResult = args[0] as boolean;
    let player = context.sourcePlayer;
    if (sendResult === false) {player = undefined};
    const originDimension = context.dimension;
    const originLocation = context.location;
    if (!originLocation) {return {status:1}};
    if (inUse) {return {message:{translate:'shard.antixray.cmd.wipeSpoofs.inProgress', with:[String(progress), String(goal)]}, status:1}};

    // Run the generator.
    let readyForNext:boolean = true;
    const generator = wipeSpoofs(originDimension, player);
    inUse = true;
    progress = 0;
    goal = 0;
    let failed:boolean = false;
    const runId = system.runInterval(()=>{
        if (failed) {
            player?.sendMessage({translate:'shard.antixray.cmd.wipeSpoofs.failed'});
            system.clearRun(runId);
            inUse = false;
            return;
        };
        if (!readyForNext) {return};
        // Run next generator iteration.
        const result = generator.next();
        const value = result.value as any;
        // If received value, wait until block at location is loaded.
        if (result.value) {
            readyForNext = false;
            let attempts:number = 0;
            const checkBlock = ()=>{
                attempts += 1;
                // If chunk not loaded after 80 ticks, return failed.
                if (attempts == 80) {failed = true; return};
                const block = value.dimension.getBlock(value.location);
                if (!block) {system.run(checkBlock)}
                else {readyForNext = true};
            };
            system.run(checkBlock);
        }
        // Quit if done.
        else if (result.done) {
            system.clearRun(runId);
            inUse = false;
        };
    },1);

    return {message:{translate:'shard.antixray.cmd.wipeSpoofs.success'}, status:0};
};




// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'antixray.wipespoofs',
        brief: 'shard.antixray.cmd.wipespoofs.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            {name:'sendResult', type:CustomCommandParamType.Boolean},
        ],
    },
    {callback: Callback},
);