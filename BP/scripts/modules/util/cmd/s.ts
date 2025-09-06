import {system, Player, GameMode, CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../ShardAPI/command';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    if (Context.targetType !== 'player') {return undefined};
    const player:Player = Context.target as Player;
    system.run(()=>{player.setGameMode(GameMode.Survival)});
    return undefined;
};




// Initialize Command.
export const Command = new ShardCommand(
    's',
    'Survival mode.',
    [],
    [],
    CommandPermissionLevel.Admin,
    [],
    Callback,
);