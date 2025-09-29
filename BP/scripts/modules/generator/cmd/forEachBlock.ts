import {system, Dimension, BlockVolume, Vector3, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {StringFormat} from '../../../util/string';
import {StringifyVector} from '../../../util/vector';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const from = args[0] as Vector3;
    const to = args[1] as Vector3;
    const command = args[2] as string;
    const volume = new BlockVolume(from, to)
    system.runJob(iterateBlocks(context, volume, command));
    return {message:{translate:'shard.generator.cmd.forEachBlock.success'}, status:0};
};


function* iterateBlocks(context:ShardCommandContext, volume:BlockVolume, command:string) {
    for (const location of volume.getBlockLocationIterator()) {
        const env = {
            context: context,
            dimension: context.dimension,
            location: location,
        };
        context.dimension.runCommand(`execute positioned ${StringifyVector(location)} run ${StringFormat(command, env)}`);
        yield;
    };
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'foreachblock',
        brief: 'shard.generator.cmd.forEachBlock.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'from', type:CustomCommandParamType.Location},
            {name:'to', type:CustomCommandParamType.Location},
            {name:'command', type:CustomCommandParamType.String},
        ],
        important: false,
    },
    {callback: Callback},
);