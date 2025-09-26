import {system, world, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import * as Util from '../../../Shard/util';
import * as VectorUtil from '../../../util/vector';
system;
world;
Util;
VectorUtil;


function Callback(context:ShardCommandContext, args:Array<any>) {
    return {message:eval(args[0]), status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'eval',
        brief: 'shard.core.cmd.eval.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'code', type:CustomCommandParamType.String},
        ],
    },
    {callback: Callback},
);