import {system, world, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {Hardcopy} from '../module';
system;
world;


function Callback(context:ShardCommandContext, args:Array<any>) {
    const stringData = args[0];
    const data = JSON.parse(stringData);
    if (!data) {undefined};

    system.run(()=>{
        if (data.type == 'entity') {Hardcopy.decompileEntity(data.data, context.dimension, context.location)}
        else if (data.type == 'item') {Hardcopy.decompileItem(data.data, context.dimension, context.location)};
    });

    return undefined;
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'hc.load',
        brief: 'shard.core.cmd.hcLoad.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'data', type:CustomCommandParamType.String},
        ],
    },
    {callback: Callback},
);