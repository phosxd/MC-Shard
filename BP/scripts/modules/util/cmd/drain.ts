import {system, Dimension, Vector3, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {LocationOutOfBounds} from '../../../Shard/util';

const MinRadius:number = 1;
const MaxRadius:number = 50;


function* clearLiquidBlocks(radius:number, location:Vector3, dimension:Dimension) {
    // Iterate on every block in the radius.
    for (let x:number = -radius; x < radius; x++) {
    for (let y:number = -radius; y < radius; y++) {
    for (let z:number = -radius; z < radius; z++) {
        let blockLocation = {x:location.x+x, y:location.y+y, z:location.z+z};
        if (LocationOutOfBounds(blockLocation)) {continue};
        const block = dimension.getBlock(blockLocation);
        if (block == undefined) {continue};
        // If block is liquid, set to air.
        if (block.isLiquid) {block.setType('air')};
        yield;
    }}};
};


function Callback(context:ShardCommandContext, args:Array<any>) {
    let radius:number = args[0];
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