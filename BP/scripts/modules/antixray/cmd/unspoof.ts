import {system, CommandPermissionLevel, CustomCommandParamType, BlockVolume, Vector3, Dimension, Player} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {StringifyVector, RoundVector} from '../../../util/vector';
import {UnspoofBlock, SpoofBlock} from '../module';


function* unspoofArea(volume:BlockVolume, dimension:Dimension, player?:Player) {
    let blocksUnspoofed:number = 0;
    // Iterate on every spoofed block in the radius.
    const spoofedBlocks = dimension.getBlocks(volume, {includeTypes:[SpoofBlock]}, true);
    for (const location of spoofedBlocks.getBlockLocationIterator()) {
        const block = dimension.getBlock(location);
        if (block == undefined) {continue};
        const unspoofed = UnspoofBlock(block);
        if (unspoofed) {blocksUnspoofed += 1};
        yield;
    };
    if (player) {
        player.sendMessage({translate:'shard.antixray.cmd.unspoof.result', with:[String(blocksUnspoofed)]});
    };
};


function Callback(context:ShardCommandContext, args:Array<any>) {
    const volume = new BlockVolume(args[0] as Vector3, args[1] as Vector3);
    const sendResult = args[2] as boolean;
    let player = context.sourcePlayer;
    if (sendResult === false) {player = undefined};
    system.runJob(unspoofArea(volume, context.dimension, player));

    return {message:{translate:'shard.antixray.cmd.unspoof.success', with:[StringifyVector(RoundVector(args[0])), StringifyVector(RoundVector(args[1]))]}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'antixray.unspoof',
        brief: 'shard.antixray.cmd.unspoof.brief',
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