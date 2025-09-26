import {CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {StringifyVector, RoundVector} from '../../../util/vector';
import {Module, Border} from '../module';


function Callback(_context:ShardCommandContext, args:Array<any>) {
    const name:string = args[0];

    const borderKeys:Array<string> = Object.keys(Module.persisData.borders);
    if (borderKeys.length == 0) {return {message:{translate:'shard.border.cmd.listBorders.none'}, status:1}};

    let list:string = '';
    borderKeys.forEach(key => {
        const border:Border = Module.persisData.borders[key];
        list += '\n§r- §5Name: §7'+border.name+' §5Start: §7'+StringifyVector(RoundVector(border.area.start))+' §5End: §7'+StringifyVector(RoundVector(border.area.end))+' §5Inverted: §7'+String(border.inverted);
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