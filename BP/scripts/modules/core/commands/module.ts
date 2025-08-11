import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import ShardModule from '../../../ShardAPI/module';
import {MC, Dictionary, CommandNamespace, ModuleNames, PermaEnabledModules} from '../../../ShardAPI/CONST';


// Define command properties.
const MandatoryParameters:Array<MC.CustomCommandParameter> = [
    {name:CommandNamespace+':'+'module', type:MC.CustomCommandParamType.Enum}
];
const OptionalParameters:Array<MC.CustomCommandParameter> = [
    {name:CommandNamespace+':'+'moduleAction', type:MC.CustomCommandParamType.Enum},
];
const PermissionLevel:MC.CommandPermissionLevel = MC.CommandPermissionLevel.Admin;
const RequiredTags:Array<string> = [];
const RegisterEnums:Dictionary<Array<string>> = {
    module: ModuleNames,
    moduleAction: [
        'info',
        'disable',
        'enable',
        'clearData',
        'printData',
    ],
};




function moduleActionInfo(context:ShardCommandContext, module_key:string) {
    // Import modules then perform action.
    import('../../modules').then(modules => {
        const module:ShardModule = modules.Modules[module_key];
        // Generate command list.
        let commandList:Array<string> = [''];
        for (let key in module.commands) {
            let value:ShardCommand = module.commands[key];
            commandList.push(value.id);
        };
        commandList = commandList.sort(); // Sort alphabetically.
        let commandListString:string = commandList.join('\n §r- §e/');

        // Send message.
        context.target.sendMessage({translate:'shard.core.cmd.module.info', with:{rawtext: [{text:module.id}, module.description, {text:commandListString}]}});
    });

    return undefined;
};


function moduleActionDisable(module_key:string) {
    // Return error if module cannot be disabled.
    if (PermaEnabledModules.includes(module_key)) {
        return {message:{translate:'shard.core.cmd.module.cannotDisable', with:[module_key]}, status:1};
    };

    // Import modules then perform action.
    import('../../modules').then(modules => {
        const module:ShardModule = modules.Modules[module_key];
        module.disable();
    });

    return {message:{translate:'shard.core.cmd.module.disable', with:[module_key]}, status:0};
};


function moduleActionEnable(module_key:string) {
    // Import modules then perform action.
    import('../../modules').then(modules => {
        const module:ShardModule = modules.Modules[module_key];
        module.enable();
    });

    return {message:{translate:'shard.core.cmd.module.enable', with:[module_key]}, status:0};
};


function moduleActionClearData(module_key:string) {
    // Import modules then perform action.
    import('../../modules').then(modules => {
        const module:ShardModule = modules.Modules[module_key];
        module.resetData();
    });

    return {message:{translate:'shard.core.cmd.module.clearData', with:[module_key]}, status:0};
};


function moduleActionPrintData(module_key:string) {
    // Import modules then perform action.
    import('../../modules').then(modules => {
        let module:ShardModule = modules.Modules[module_key];
        console.warn(`${module_key} persistent data: `+JSON.stringify(module.persisData));
    });

    return {message:{translate:'shard.core.cmd.module.printData', with:[module_key]}, status:0};
};


function Callback(Context:ShardCommandContext, Options:Array<any>) {
    let module_key:string = Options[0];
    let action:string = Options[1];

    switch (action) {
        case 'disable': return moduleActionDisable(module_key);
        case 'enable': return moduleActionEnable(module_key);
        case 'clearData': return moduleActionClearData(module_key);
        case 'printData': return moduleActionPrintData(module_key);
        case 'info': return moduleActionInfo(Context, module_key);
    }

    return undefined;
};




// Initialize Command.
export const Command = new ShardCommand(
    'module',
    'Open module configuration UI, or perform actions.',
    MandatoryParameters,
    OptionalParameters,
    PermissionLevel,
    RequiredTags,
    Callback,
    RegisterEnums,
);