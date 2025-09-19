import {CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {ShardModule} from '../../../Shard/module';
import {CommandNamespace, PermaEnabledModules} from '../../../Shard/CONST';
import {Module} from '../module';
import {Modules} from '../../modules';


function moduleConfig(context:ShardCommandContext, module_key:string) {
    const module:ShardModule = Modules[module_key];
    Module.forms.module.show(context, [module]);
    return undefined;
};


function moduleActionInfo(module_key:string) {
    const module:ShardModule = Modules[module_key];
    // Generate command list.
    let commandList:Array<string> = [''];
    for (let key in module.commands) {
        let value:ShardCommand = module.commands[key];
        commandList.push(value.details.id);
    };
    commandList = commandList.sort(); // Sort alphabetically.
    let commandListString:string = commandList.join('\n §r- §7/');

    // Return message.
    return {message:{translate:'shard.core.cmd.module.info', with:{rawtext: [{text:module.details.id}, module.details.brief, {text:commandListString}]}}, status:0};
};


function moduleActionDisable(module_key:string) {
    // Return error if module cannot be disabled.
    if (PermaEnabledModules.includes(module_key)) {
        return {message:{translate:'shard.core.cmd.module.cannotDisable', with:[module_key]}, status:1};
    };

    const module:ShardModule = Modules[module_key];
    module.disable();
    return {message:{translate:'shard.core.cmd.module.disabled', with:[module_key]}, status:0};
};


function moduleActionEnable(module_key:string) {
    const module:ShardModule = Modules[module_key];
    module.enable()
    return {message:{translate:'shard.core.cmd.module.enabled', with:[module_key]}, status:0};
};


function moduleActionClearData(module_key:string) {
    const module:ShardModule = Modules[module_key];
    module.resetData();
    return {message:{translate:'shard.core.cmd.module.clearData', with:[module_key]}, status:0};
};




function Callback(context:ShardCommandContext, args:Array<any>) {
    let module_key:string = args[0];
    let action:string = args[1];

    switch (action) {
        case 'disable': return moduleActionDisable(module_key);
        case 'enable': return moduleActionEnable(module_key);
        case 'reset': return moduleActionClearData(module_key);
        case 'info': return moduleActionInfo(module_key);
        default: return moduleConfig(context, module_key);
    };
};




// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'module',
        brief: 'shard.core.cmd.module.brief',
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
            {name:CommandNamespace+':'+'module', type:CustomCommandParamType.Enum},
        ],
        optionalParameters: [
            {name:CommandNamespace+':'+'moduleAction', type:CustomCommandParamType.Enum},
        ],
        important: true,
    },
    {callback: Callback},
);