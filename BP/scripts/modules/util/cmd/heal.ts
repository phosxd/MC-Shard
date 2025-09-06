import {system, Entity, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';




function Callback(context:ShardCommandContext, args:Array<any>) {
    let targets:Array<Entity> = args[0];
    // If no specified targets, set the user as the target & if the user is not an entity or player, then return.
    if (targets == undefined) {
        if (context.targetType !== 'entity' && context.targetType !== 'player') {return};
        targets = [context.target as Entity];
    };
    // Apply to targets.
    let count:number = 0;
    targets.forEach(entity => {
        system.run(()=>{entity.runCommand('effect @s instant_health 1 200 true')});
        count += 1;
    });

    return {message:{translate:'shard.util.cmd.heal.success', with:[String(count)]}, status:0};
};




// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'heal',
        brief: 'shard.util.cmd.heal.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            {name:'targets', type:CustomCommandParamType.EntitySelector},
        ],
    },
    {callback: Callback},
);