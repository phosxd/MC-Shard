import {CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {} from '../../../ShardAPI/CONST';
import {LocationToString, RoundVector3} from '../../../ShardAPI/util';
import {Module, Region} from '../module';




function Callback(context:ShardCommandContext, args:Array<any>) {
    const name:string = args[0];

    const regionKeys:Array<string> = Object.keys(Module.persisData.regions);
    if (regionKeys.length == 0) {return {message:{translate:'shard.region.cmd.listRegions.noRegions'}, status:1}};

    let list:string = '';
    regionKeys.forEach(key => {
        const region:Region = Module.persisData.regions[key];
        list += '\n§r- §5Name: §e'+region.name+' §5Start: §e'+LocationToString(RoundVector3(region.area.start))+' §5End: §e'+LocationToString(RoundVector3(region.area.end))+' §5Inverted: §e'+String(region.inverted);
    });

    return {message:{translate:'shard.region.cmd.listRegions.success', with:[list]}, status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'listregions',
    'List all regions.',
    [],
    [],
    CommandPermissionLevel.GameDirectors,
    [],
    Callback,
);