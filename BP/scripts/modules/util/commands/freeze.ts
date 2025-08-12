import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';
import {FixVector3, FixVector2} from '../../../ShardAPI/util';
import {Module} from '../module';

const default_time:number = 999999;




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    let targets:Array<MC.Entity> = Options[0];
    let time:number = Options[1];
    // If no specified time, set default time.
    if (time == undefined) {
        time = default_time;
    };
    // Apply to targets.
    let count:number = 0;
    targets.forEach(entity => {
        let data = Module.persisData.frozenEntities[entity.id];
        // If no frozen entity data, generate frozen entity data.
        if (data == undefined) {data = {time:Number(time.toPrecision(2)), location:FixVector3(entity.location,3), rotation:FixVector2(entity.getRotation(),3)}}
        // Only update time if frozen entity data is still valid.
        else {data.time = time};
        // Update data.
        Module.persisData.frozenEntities[entity.id] = data;
        count += 1;
    });

    return {message:{translate:'shard.util.cmd.freeze.success', with:[String(count), String(time)]}, status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'freeze',
    'Freeze entities so they cannot move or turn. Freeze with 0 time to unfreeze.',
    [
        {name:'targets', type:MC.CustomCommandParamType.EntitySelector},
    ],
    [
        {name:'time', type:MC.CustomCommandParamType.Float},
    ],
    MC.CommandPermissionLevel.GameDirectors,
    [],
    Callback,
);