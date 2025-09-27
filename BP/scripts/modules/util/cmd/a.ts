import {system, GameMode, CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';


function Callback(context:ShardCommandContext, _args:Array<any>) {
    system.run(()=>{context.sourcePlayer?.setGameMode(GameMode.Adventure)});
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {id:'a', brief:'shard.util.cmd.a.brief', permissionLevel:CommandPermissionLevel.GameDirectors},
    {callback: Callback},
);