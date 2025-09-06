import {system, Player, GameMode, CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';


function Callback(context:ShardCommandContext, args:Array<any>) {
    system.run(()=>{(context.target as Player).setGameMode(GameMode.Adventure)});
    return undefined;
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {id:'a', brief:'shard.util.cmd.a.brief', permissionLevel:CommandPermissionLevel.Admin},
    {callback: Callback},
);