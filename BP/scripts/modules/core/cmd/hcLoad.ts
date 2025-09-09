import {system, CommandPermissionLevel, CustomCommandParamType, Vector3} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {Hardcopy} from '../module';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const stringData = args[0];
    let location:Vector3 = args[1];
    if (!location) {location = context.location};
    const data = JSON.parse(stringData);
    if (!data) {undefined};

    system.run(()=>{
        if (data.type == 'entity') {Hardcopy.decompileEntity(data.data, context.dimension, location)}
        else if (data.type == 'item') {Hardcopy.decompileItem(data.data, context.dimension, location)};
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
        optionalParameters: [
            {name:'location', type:CustomCommandParamType.Location},
        ],
    },
    {callback: Callback},
);