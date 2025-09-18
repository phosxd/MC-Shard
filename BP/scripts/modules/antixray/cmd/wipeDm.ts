import {world, CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {DmkHeader} from '../module';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const keys = world.getDynamicPropertyIds().filter(value => {
        return value.startsWith(DmkHeader);
    });
    keys.forEach(key => {
        world.setDynamicProperty(key, undefined);
    });
    return {message:{translate:'shard.antixray.cmd.wipeDm.success'}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'antixray.wipedm',
        brief: 'shard.antixray.cmd.wipeDm.brief',
        permissionLevel: CommandPermissionLevel.Admin,
    },
    {callback: Callback},
);