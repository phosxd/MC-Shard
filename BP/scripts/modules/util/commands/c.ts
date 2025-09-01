import {system, Player, GameMode, CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../ShardAPI/command';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    const target = Context.target as Player;
    system.run(()=>{target.setGameMode(GameMode.Creative)});
    return undefined;
};




// Initialize Command.
export const Command = new ShardCommand(
    'c',
    'Creative mode.',
    [],
    [],
    CommandPermissionLevel.Admin,
    [],
    Callback,
);