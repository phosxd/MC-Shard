import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';

const Lang = {
    success: 'Woosh!',
    outOfBounds: 'Target location is out of bounds.',
    obstructed: 'Target location is obstructed.',
};




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    // Get target block & location. Return error if out of bounds.
    let amount:number = Options[0];
    let target_location = Context.target.location; target_location.y += amount;
    if (target_location.y > 256 || target_location.y < -64) {return {message:Lang.outOfBounds, status:MC.CustomCommandStatus.Failure}}
    let target_block = Context.target.dimension.getBlock(target_location);
    if (target_block == undefined) {return {message:Lang.outOfBounds, status:MC.CustomCommandStatus.Failure}};
    // Return error if obstructed.
    if (target_block.isAir == false || target_block.above(1).isAir == false || target_block.above(2).isAir == false) {return {message:Lang.obstructed, status:MC.CustomCommandStatus.Failure}};
    
    // 1 tick later... Set support block & teleport target.
    MC.system.run(()=>{
        target_block.setType('glass');
        let teleport_location = Context.target.location; teleport_location.y = target_block.above().location.y;
        Context.target.teleport(teleport_location);
    });

    return {message:Lang.success, status:MC.CustomCommandStatus.Success};
};




// Initialize Command.
export const Command = new ShardCommand(
    'up',
    'Teleport up with a platform.',
    [
        {name:'amount', type:MC.CustomCommandParamType.Integer},
    ],
    [],
    MC.CommandPermissionLevel.Admin,
    [],
    Callback,
);