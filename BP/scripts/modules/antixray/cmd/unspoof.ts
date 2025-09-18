import {system, world, CommandPermissionLevel, CustomCommandParamType, BlockVolume, Vector3, Dimension, Player} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {AddVector3} from '../../../Shard/util';
import {GetDmk, SpoofBlock, ReplaceableBlocks} from '../module';

const MinRadius:number = 1;
const MaxRadius:number = 300;


function* unspoofArea(radius:number, originLocation:Vector3, dimension:Dimension, player?:Player) {
    let spoofedBlocks:number = 0;
    // Iterate on every spoof block in the radius.
    const volume = new BlockVolume(AddVector3(originLocation, -radius), AddVector3(originLocation, radius));
    const spoofBlocks = dimension.getBlocks(volume, {includeTypes:[SpoofBlock]}, true);
    for (const location of spoofBlocks.getBlockLocationIterator()) {
        const block = dimension.getBlock(location);
        if (block == undefined) {continue};
        const key = GetDmk(dimension.id, location);
        const data = world.getDynamicProperty(key) as number;
        if (data) {
            dimension.setBlockType(location, ReplaceableBlocks[data]);
            world.setDynamicProperty(key, undefined);
            spoofedBlocks += 1;
        };
        yield;
    };
    if (player) {
        player.sendMessage({translate:'shard.antixray.cmd.unspoof.result', with:[String(spoofedBlocks)]});
    };
};


function Callback(context:ShardCommandContext, args:Array<any>) {
    const radius:number = args[0];
    // Return error if radius out of bounds.
    if (radius > MaxRadius || radius < MinRadius) {return {message:{translate:'shard.antixray.cmd.unspoof.radiusOutOfBounds'}, status:1}};
    let player: Player;
    if (context.targetType == 'player') {player = context.target as Player};
    system.runJob(unspoofArea(radius, context.location, context.dimension, player));

    return {message:{translate:'shard.antixray.cmd.unspoof.success', with:[String(radius)]}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'antixray.unspoof',
        brief: 'shard.antixray.cmd.unspoof.brief',
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
            {name:'radius', type:CustomCommandParamType.Integer}
        ]
    },
    {callback: Callback},
);