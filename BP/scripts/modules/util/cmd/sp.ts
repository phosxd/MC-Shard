import {system, Player, GameMode, CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';


function Callback(context:ShardCommandContext, args:Array<any>) {
    system.run(()=>{(context.target as Player).setGameMode(GameMode.Spectator)});
    return undefined;
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {id:'sp', brief:'shard.util.cmd.sp.brief', permissionLevel:CommandPermissionLevel.Admin},
    {callback: Callback},
);