import {system, Dimension, Vector3, BlockVolume, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {LocationOutOfBounds} from '../../../Shard/util';
import {AddVector} from '../../../util/vector';

const MinRadius:number = 1;
const MaxRadius:number = 50;


function* clearLiquidBlocks(distance:number, location:Vector3, dimension:Dimension) {
    const volume = new BlockVolume(
        AddVector(location, distance) as Vector3,
        AddVector(location, -distance) as Vector3,
    );
    // Iterate on every block in the radius.
    for (const location of volume.getBlockLocationIterator()) {
        if (LocationOutOfBounds(location)) {continue};
        const block = dimension.getBlock(location);
        if (block == undefined) {continue};
        // If block is liquid, set to air.
        if (block.isLiquid) {block.setType('air')};
        yield;
    };
};


function Callback(context:ShardCommandContext, args:Array<any>) {
    const radius:number = args[0];
    // Return error if radius out of bounds.
    if (radius > MaxRadius || radius < MinRadius) {return {message:{translate:'shard.util.cmd.drain.radiusOutOfBounds'}, status:1}};
    // Run job.
    if (!context.location) {return {status:0}};
    system.runJob(clearLiquidBlocks(radius, context.location, context.dimension));
    
    return {message:{translate:'shard.util.cmd.drain.success', with:[String(radius)]}, status:0};
};




// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'drain',
        brief: 'shard.util.cmd.drain.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'radius', type:CustomCommandParamType.Integer},
        ],
    },
    {callback:Callback},
);