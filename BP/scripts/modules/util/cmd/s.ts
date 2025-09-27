import {system, GameMode, CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';


function Callback(context:ShardCommandContext, args:Array<any>) {
    system.run(()=>{context.sourcePlayer?.setGameMode(GameMode.Survival)});
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {id:'s', brief:'shard.util.cmd.s.brief', permissionLevel:CommandPermissionLevel.GameDirectors},
    {callback: Callback},
);