import {system, Player, GameMode, CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';


function Callback(context:ShardCommandContext, args:Array<any>) {
    system.run(()=>{(context.target as Player).setGameMode(GameMode.Survival)});
    return undefined;
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {id:'s', brief:'shard.util.cmd.s.brief', permissionLevel:CommandPermissionLevel.Admin},
    {callback: Callback},
);