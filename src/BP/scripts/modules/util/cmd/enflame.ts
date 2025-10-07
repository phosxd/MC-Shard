import {system, Entity, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';

const defaultTime:number = 5;




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
        system.run(()=>{
            if (!entity.isValid) {return};
            if (time == 0) {entity.extinguishFire()}
            else {entity.setOnFire(time)};
        });
        count += 1;
    });

    if (time == 0) {return {message:{translate:'shard.util.cmd.enflame.extinguish', with:[String(count)]}, status:0}}
    else {return {message:{translate:'shard.util.cmd.enflame.success', with:[String(count), String(time)]}, status:0}};
};




// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'enflame',
        brief: 'shard.util.cmd.enflame.brief',
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