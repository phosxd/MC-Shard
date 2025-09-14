import {Vector3, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {AlignedArea} from '../../../Shard/CONST';
import {AlignArea, LocationToString, RoundVector3} from '../../../Shard/util';
import {Module, Region} from '../module';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const name:string = args[0];
    const start:Vector3 = args[1];
    const end:Vector3 = args[2];
    const inverted:boolean = args[3];
    const area:AlignedArea = AlignArea({start:start, end:end});

    const currentRegion = Module.persisData.regions[name];
    if (currentRegion) {return {message:{translate:'shard.misc.createDuplicateName'}, status:1}};

    const newRegion:Region = {
        name: name,
        dimensionId: context.dimension.id,
        area: area,
        inverted: inverted,
        rules: {},
    };
    Module.persisData.regions[name] = newRegion;
    Module.saveData();

    return {message:{translate:'shard.region.cmd.addRegion.success', with:[name, LocationToString(RoundVector3(start)), LocationToString(RoundVector3(end))]}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'addregion',
        brief: 'shard.region.cmd.addRegion.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'name', type:CustomCommandParamType.String},
            {name:'start', type:CustomCommandParamType.Location},
            {name:'end', type:CustomCommandParamType.Location},
            {name:'inverted', type:CustomCommandParamType.Boolean},
        ],
    },
    {callback: Callback},
);