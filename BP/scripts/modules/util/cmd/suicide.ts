import {system, Entity, CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';


function Callback(context:ShardCommandContext, args:Array<any>) {
    if (!context.sourcePlayer) {return};
    system.run(()=>{
        if (!context.sourcePlayer.isValid) {return};
        context.sourcePlayer.kill();
    });
    return;
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'suicide',
        brief: 'shard.util.cmd.suicide.brief',
        permissionLevel: CommandPermissionLevel.Any,
    },
    {callback: Callback},
);