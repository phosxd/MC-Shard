import {CommandPermissionLevel, CustomCommandParamType, Entity} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {Hardcopy} from '../module';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const targets:Array<Entity> = args[0];
    // Return error if incorrect target count.
    if (targets.length !== 1) {return {message:{translate:'shard.core.cmd.hcPrintEntity'}, status:1}};
    const target = targets[0];

    let compiled;
    if (target.typeId == 'minecraft:item') {compiled = Hardcopy.compileItem(target.getComponent('minecraft:item').itemStack)}
    else {compiled = Hardcopy.compileEntity(target)};
    console.warn(JSON.stringify(compiled).replaceAll('"','\\"').replaceAll('\\\\"','\\\\\\"')); // 2 layer string reformatting.
    
    return undefined;
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'hc.print.entity',
        brief: 'shard.core.cmd.hcPrintEntity.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'targets', type:CustomCommandParamType.EntitySelector},
        ],
    },
    {callback: Callback},
);