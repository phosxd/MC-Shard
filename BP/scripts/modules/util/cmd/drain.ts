import {system, Dimension, Vector3, BlockVolume, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';

const MinRadius:number = 1;
const MaxRadius:number = 50;


function* clearLiquidBlocks(distance:number, location:Vector3, dimension:Dimension) {
    // Iterate on every block in the radius.
    for (let x:number = -distance; x < distance; x++) {
    for (let z:number = -distance; z < distance; z++) {
        let blockLocation = {x:location.x+x, y:location.y-distance, z:location.z+z};
        // Remove liquid blocks.
        dimension.fillBlocks(
            new BlockVolume(blockLocation, {x:blockLocation.x, y:blockLocation.y+distance, z:blockLocation.z}),
            'air',
            {
                ignoreChunkBoundErrors: true,
                blockFilter:{includeTypes: ['water','lava']},
            },
        );
        yield;
    }};
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