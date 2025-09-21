import {system, GameMode, CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';


function Callback(context:ShardCommandContext, _args:Array<any>) {
    system.run(()=>{context.sourcePlayer?.setGameMode(GameMode.Creative)});
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {id:'c', brief:'shard.util.cmd.c.brief', permissionLevel:CommandPermissionLevel.Admin},
    {callback: Callback},
);