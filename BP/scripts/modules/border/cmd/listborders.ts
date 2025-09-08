import {CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {LocationToString, RoundVector3} from '../../../Shard/util';
import {Module, Border} from '../module';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const name:string = args[0];

    const borderKeys:Array<string> = Object.keys(Module.persisData.borders);
    if (borderKeys.length == 0) {return {message:{translate:'shard.border.cmd.listBorders.noBorders'}, status:1}};

    let list:string = '';
    borderKeys.forEach(key => {
        const border:Border = Module.persisData.borders[key];
        list += '\n§r- §5Name: §e'+border.name+' §5Start: §e'+LocationToString(RoundVector3(border.area.start))+' §5End: §e'+LocationToString(RoundVector3(border.area.end))+' §5Inverted: §e'+String(border.inverted);
    });

    return {message:{translate:'shard.border.cmd.listBorders.success', with:[list]}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'listborders',
        brief: 'shard.border.cmd.listBorders.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
    },
    {callback: Callback},
);