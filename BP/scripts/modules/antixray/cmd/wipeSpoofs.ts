import {system, world, CommandPermissionLevel, CustomCommandParamType, BlockVolume, Vector3, Dimension, Player} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {ShortDimensionIdToNormal} from '../../../Shard/CONST';
import {StringToVector, AddVector} from '../../../util/vector';
import {DmkHeader, GetDmk, UnspoofBlock, SpoofBlock} from '../module';

const tickingAreaName = 'shard:antixray.wipeSpoofs';
/**Whether or not this command is already in use.*/
let inUse:boolean = false;
let progress:number = 0;
let goal:number = 0;


function* wipeSpoofs(originLocation:Vector3, originDimension:Dimension, player?:Player) {
    originDimension.runCommand(`tickingarea remove "${tickingAreaName}"`);
    // Iterate on every saved spoof block.
    const keys = world.getDynamicPropertyIds().filter(value => {
        return value.startsWith(DmkHeader);
    });
    goal = keys.length;
    for (const index in keys) {
        const key = keys[index];
        progress += 1;
        if (world.getDynamicProperty(key) == undefined) {continue};
        const noHeaderKey = key.replace(DmkHeader,'').replace(':','');
        const dimensionId = ShortDimensionIdToNormal[noHeaderKey[0]];
        const stringLocation = noHeaderKey.replace(noHeaderKey[0],'');
        const dimension = world.getDimension(dimensionId);
        const location = StringToVector(stringLocation, 3).vector as Vector3;
        // Add chunk loader.
        dimension.runCommand(`tickingarea add circle ${stringLocation} 2 "${tickingAreaName}"`);
        // Wait until location is loaded.
        yield {dimension:dimension, location:location};
        // Unspoof block.
        const block = dimension.getBlock(location);
        UnspoofBlock(block);
        // Unspoof nearby blocks.
        const volume = new BlockVolume(AddVector(location, -20) as Vector3, AddVector(location, 20) as Vector3);
        const spoofedBlocks = dimension.getBlocks(volume, {includeTypes:[SpoofBlock]}, true);
        for (const location of spoofedBlocks.getBlockLocationIterator()) {
            const block = dimension.getBlock(location);
            if (block == undefined) {continue};
            const key = GetDmk(dimension.id, location);
            const data = world.getDynamicProperty(key) as number;
            if (data != undefined) {
                UnspoofBlock(block);
            };
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
    const generator = wipeSpoofs(originLocation, originDimension, player);
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
                // If chunk not loaded after 30 ticks, return failed.
                if (attempts == 30) {failed = true; return};
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
        permissionLevel: CommandPermissionLevel.Admin,
        optionalParameters: [
            {name:'sendResult', type:CustomCommandParamType.Boolean},
        ],
    },
    {callback: Callback},
);