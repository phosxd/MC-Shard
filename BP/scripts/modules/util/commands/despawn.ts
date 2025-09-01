import {system, CommandPermissionLevel, Entity, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../ShardAPI/command';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    let targets:Array<Entity> = Options[0];
    // Despawn targets.
    let count:number = 0;
    targets.forEach(entity => {
        if (entity.typeId == 'minecraft:player') {return};
        system.run(()=>{
            entity.remove();
        });
        count += 1;
    });

    return {message:{translate:'shard.util.cmd.despawn.success', with:[String(count)]}, status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'despawn',
    'Remove entities without death animations & without dropping loot/XP. Cannot use on players.',
    [
        {name:'targets', type:CustomCommandParamType.EntitySelector},
    ],
    [],
    CommandPermissionLevel.GameDirectors,
    [],
    Callback,
);