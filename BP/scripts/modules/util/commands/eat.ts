import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    let targets:Array<MC.Entity> = Options[0];
    // If no specified targets, set the user as the target & if the user is not an entity or player, then return.
    if (targets == undefined) {
        if (Context.targetType !== 'entity' && Context.targetType !== 'player') {return};
        targets = [Context.target];
    };
    // Apply to targets.
    let count:number = 0;
    targets.forEach(entity => {
        MC.system.run(()=>{entity.runCommand('effect @s saturation 1 200 true')});
        count += 1;
    });

    return {message:{translate:'shard.util.cmd.eat.success', with:[String(count)]}, status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'eat',
    'Replenishes all hunger bars.',
    [],
    [
        {name:'targets', type:MC.CustomCommandParamType.EntitySelector},
    ],
    MC.CommandPermissionLevel.GameDirectors,
    [],
    Callback,
);