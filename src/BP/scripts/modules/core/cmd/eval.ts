import {system, world, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import * as Util from '../../../Shard/util';
import {StringFormat} from '../../../util/string';
import * as VectorUtil from '../../../util/vector';
system;
world;
Util;
VectorUtil;

const env = Object.freeze({
    system: system,
    world: world,
    Util: Util,
    VectorUtil: VectorUtil,
});


function Callback(context:ShardCommandContext, args:Array<any>) {
    const mode = args[0] as string;
    const code = StringFormat(args[1] as string, Object.assign({context:context},env));
    if (['command','cmd'].includes(mode)) {runCommand(context, code)}
    else if (['javascript','js'].includes(mode)) {runJavaScript(context, code)}
    else {return {message:{translate:'shard.error.invalidOption', with:[mode]}, status:1}};
    return {message:{translate:'shard.core.cmd.eval.success'}, status:0};
};


function runCommand(context:ShardCommandContext, code:string): void {
    if (['player','entity'].includes(context.sourceType)) {
        const entity = context.sourceEntity;
        system.run(()=>{
            if (!entity.isValid) {return};
            entity.runCommand(code);
        });
    }
    else if (context.sourceType == 'block') {
        const block = context.sourceBlock;
        system.run(()=>{
            block.dimension.runCommand(`execute positioned ${VectorUtil.StringifyVector(block.location)} run ${code}`);
        });
    }
    else {
        system.run(()=>{
            context.dimension.runCommand(code);
        });
    };
};


function runJavaScript(context:ShardCommandContext, code:string): void {
    system.run(()=>{
        eval(code);
    });
};




// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'eval',
        brief: 'shard.core.cmd.eval.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'sh:evalMode', type:CustomCommandParamType.Enum},
            {name:'code', type:CustomCommandParamType.String},
        ],
    },
    {callback: Callback},
);