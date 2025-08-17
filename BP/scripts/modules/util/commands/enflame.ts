import {system, Entity, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';

const default_time:number = 5;




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    let targets:Array<Entity> = Options[0];
    let time:number = Options[1];
    // If no specified time, set default time.
    if (time == undefined) {
        time = default_time;
    };
    // Apply to targets.
    let count:number = 0;
    targets.forEach(entity => {
        system.run(()=>{
            if (time == 0) {entity.extinguishFire()}
            else {entity.setOnFire(time)};
        });
        count += 1;
    });

    if (time == 0) {return {message:{translate:'shard.util.cmd.enflame.extinguish', with:[String(count)]}, status:0}}
    else {return {message:{translate:'shard.util.cmd.enflame.success', with:[String(count), String(time)]}, status:0}};
};




// Initialize Command.
export const Command = new ShardCommand(
    'enflame',
    'Set entities on fire. Enflame with 0 time to remove fire.',
    [
        {name:'targets', type:CustomCommandParamType.EntitySelector},
    ],
    [
        {name:'time', type:CustomCommandParamType.Float},
    ],
    CommandPermissionLevel.GameDirectors,
    [],
    Callback,
);