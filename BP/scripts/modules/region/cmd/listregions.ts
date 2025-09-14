import {CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {LocationToString, RoundVector3} from '../../../Shard/util';
import {Module, Region} from '../module';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const name:string = args[0];
    const regionKeys:Array<string> = Object.keys(Module.persisData.regions);
    if (regionKeys.length == 0) {return {message:{translate:'shard.region.cmd.listRegions.none'}, status:1}};

    let list:string = '';
    regionKeys.forEach(key => {
        const region:Region = Module.persisData.regions[key];
        list += '\n§r- §5Name: §7'+region.name+' §5Start: §7'+LocationToString(RoundVector3(region.area.start))+' §5End: §7'+LocationToString(RoundVector3(region.area.end))+' §5Inverted: §7'+String(region.inverted);
    });

    return {message:{translate:'shard.region.cmd.listRegions.success', with:[list]}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'listregions',
        brief: 'shard.region.cmd.listRegions.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
    },
    {callback: Callback},
);