import {system, Entity, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    let targets:Array<Entity> = Options[0];
    // If no specified targets, set the user as the target & if the user is not an entity or player, then return.
    if (targets == undefined) {
        if (Context.targetType !== 'entity' && Context.targetType !== 'player') {return};
        targets = [Context.target as Entity];
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
export const Command = new ShardCommand(
    'heal',
    'Regenerate all health.',
    [],
    [
        {name:'targets', type:CustomCommandParamType.EntitySelector},
    ],
    CommandPermissionLevel.GameDirectors,
    [],
    Callback,
);