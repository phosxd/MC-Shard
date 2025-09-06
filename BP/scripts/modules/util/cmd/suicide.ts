import {system, Entity, CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';


function Callback(context:ShardCommandContext, args:Array<any>) {
    if (!(context.target instanceof Entity)) {return undefined};
    system.run(()=>{
        (context.target as Entity).kill();
    });
    return undefined;
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