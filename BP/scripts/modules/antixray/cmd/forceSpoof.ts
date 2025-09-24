import {system, world, CommandPermissionLevel, CustomCommandParamType, BlockVolume, Vector3, Block, Dimension, Player} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {StringifyVector3, RoundVector3} from '../../../Shard/util';
import {GetBlockNeighbors} from '../../../util/block';
import {GetDmk, SpoofBlock, ReplaceableBlocks, SolidBlocks} from '../module';


function* forceSpoofArea(volume:BlockVolume, dimension:Dimension, player?:Player) {
    let spoofedBlocks:number = 0;
    // Iterate on every spoof block in the radius.
    const blocks = dimension.getBlocks(volume, {includeTypes:ReplaceableBlocks}, true);
    for (const location of blocks.getBlockLocationIterator()) {
        const block = dimension.getBlock(location);
        if (block == undefined) {continue};
        const key = GetDmk(dimension.id, location);
        const data = world.getDynamicProperty(key) as number;
        if (data == undefined) {
            if (!ReplaceableBlocks.includes(block.typeId)) {continue};
            if (isBlockExposed(block)) {continue}; // If block exposed, dont spoof.
            // Save block type before replace.
            world.setDynamicProperty(key, ReplaceableBlocks.indexOf(block.typeId));
            // Replace block.
            dimension.setBlockType(location, SpoofBlock);
            spoofedBlocks += 1;
        };
        yield;
    };
    if (player) {
        player.sendMessage({translate:'shard.antixray.cmd.forceSpoof.result', with:[String(spoofedBlocks)]});
    };
};


function isBlockExposed(block:Block) {
    return GetBlockNeighbors(block).some(value => {
        return !SolidBlocks.includes(value?.typeId);
    });
};


function Callback(context:ShardCommandContext, args:Array<any>) {
    const volume = new BlockVolume(args[0] as Vector3, args[1] as Vector3);
    const sendResult = args[2] as boolean;
    let player = context.sourcePlayer;
    if (sendResult === false) {player = undefined};
    system.runJob(forceSpoofArea(volume, context.dimension, player));

    return {message:{translate:'shard.antixray.cmd.forceSpoof.success', with:[StringifyVector3(RoundVector3(args[0])), StringifyVector3(RoundVector3(args[1]))]}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'antixray.forcespoof',
        brief: 'shard.antixray.cmd.forceSpoof.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'start', type:CustomCommandParamType.Location},
            {name:'end', type:CustomCommandParamType.Location},
        ],
        optionalParameters: [
            {name:'sendResult', type:CustomCommandParamType.Boolean},
        ],
    },
    {callback: Callback},
);