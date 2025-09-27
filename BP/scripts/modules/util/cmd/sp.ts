import {system, GameMode, CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';


function Callback(context:ShardCommandContext, args:Array<any>) {
    system.run(()=>{context.sourcePlayer?.setGameMode(GameMode.Spectator)});
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {id:'sp', brief:'shard.util.cmd.sp.brief', permissionLevel:CommandPermissionLevel.GameDirectors},
    {callback: Callback},
);