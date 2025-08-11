export {Command};
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';
import {LocationOutOfBounds} from '../../../ShardAPI/util';


// Define command properties.
const MandatoryParameters:Array<MC.CustomCommandParameter> = [
    {name:'radius', type:MC.CustomCommandParamType.Integer},
];
const OptionalParameters:Array<MC.CustomCommandParameter> = [];
const PermissionLevel:MC.CommandPermissionLevel = MC.CommandPermissionLevel.GameDirectors;
const RequiredTags:Array<string> = [];

const MinRadius:number = 1;
const MaxRadius:number = 50;




function* clearLiquidBlocks(radius:number, location:MC.Vector3, dimension:MC.Dimension) {
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


function Callback(Context:ShardCommandContext, Options:Array<any>) {
    let radius:number = Options[0];
    // Return error if radius out of bounds.
    if (radius > MaxRadius || radius < MinRadius) {return {message:{translate:'shard.util.cmd.drain.radiusOutOfBounds'}, status:1}};
    // Run job.
    MC.system.runJob(clearLiquidBlocks(radius, Context.target.location, Context.target.dimension));
    
    return {message:{translate:'shard.util.cmd.drain.success', with:[String(radius)]}, status:0};
};




// Initialize Command.
var Command = new ShardCommand(
    'drain',
    'Remove liquid blocks in a radius.',
    MandatoryParameters,
    OptionalParameters,
    PermissionLevel,
    RequiredTags,
    Callback,
);