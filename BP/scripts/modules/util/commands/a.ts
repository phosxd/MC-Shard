import {system, Player, GameMode, CommandPermissionLevel} from '@minecraft/server';
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    const target = Context.target as Player;
    system.run(()=>{target.setGameMode(GameMode.Adventure)});
    return undefined;
};




// Initialize Command.
export const Command = new ShardCommand(
    'a',
    'Adventure mode.',
    [],
    [],
    CommandPermissionLevel.Admin,
    [],
    Callback,
);