import {Entity, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {FixVector3, FixVector2} from '../../../Shard/util';
import {Module} from '../module';

const defaultTime:number = 999999;




function Callback(_context:ShardCommandContext, args:Array<any>) {
    let targets:Array<Entity> = args[0];
    let time:number = args[1];
    // If no specified time, set default time.
    if (time == undefined) {
        time = defaultTime;
    };
    // Apply to targets.
    let count:number = 0;
    targets.forEach(entity => {
        if (!entity.isValid) {return};
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
export const MAIN = new ShardCommand(
    {
        id: 'freeze',
        brief: 'shard.util.cmd.freeze.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'targets', type:CustomCommandParamType.EntitySelector},
        ],
        optionalParameters: [
            {name:'time', type:CustomCommandParamType.Float},
        ],
    },
    {callback: Callback},
);