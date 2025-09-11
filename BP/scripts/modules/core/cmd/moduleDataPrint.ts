import {CommandPermissionLevel, CustomCommandParamType, Entity} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {CommandNamespace} from '../../../Shard/CONST';
import {Hardcopy, Modules} from '../module';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const moduleId:string = args[0];
    const rawStrings:boolean = args[1];
    // Get module data.
    const module = Modules[moduleId];
    if (!module) {return undefined};
    const moduleData = module.persisData;

    let compiledString:string = JSON.stringify(moduleData);
    // 2 layer string reformatting.
    if (!rawStrings) {
        compiledString = compiledString.replaceAll('"','\\"').replaceAll('\\\\"','\\\\\\"');
    };

    // Print.
    console.warn(compiledString);
    return undefined;
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'module.data.print',
        brief: 'shard.core.cmd.moduleDataPrint.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:CommandNamespace+':'+'module', type:CustomCommandParamType.Enum},
        ],
        optionalParameters: [
            {name:'rawStrings', type:CustomCommandParamType.Boolean},
        ],
    },
    {callback: Callback},
);