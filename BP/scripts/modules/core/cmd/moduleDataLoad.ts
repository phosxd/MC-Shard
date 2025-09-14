import {CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {CommandNamespace} from '../../../Shard/CONST';
import {Modules} from '../../modules';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const moduleId:string = args[0];
    const data:string = args[1];
    // Get module data.
    const module = Modules[moduleId];
    if (!module) {return undefined};

    const parsedData = JSON.parse(data);
    if (!parsedData) {return undefined};
    module.setData(parsedData);
    module.saveData();
    return undefined;
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'module.data.load',
        brief: 'shard.core.cmd.moduleDataLoad.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:CommandNamespace+':'+'module', type:CustomCommandParamType.Enum},
            {name:'data', type:CustomCommandParamType.String},
        ],
    },
    {callback: Callback},
);