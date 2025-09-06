import {system, CommandPermissionLevel, Entity, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';




function Callback(context:ShardCommandContext, args:Array<any>) {
    let targets:Array<Entity> = args[0];
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
export const MAIN = new ShardCommand(
    {
        id: 'despawn',
        brief: 'Remove entities without death animations or dropping loot/XP. Cannot use on players.',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'targets', type:CustomCommandParamType.EntitySelector},
        ],
    },
    {callback: Callback},
);