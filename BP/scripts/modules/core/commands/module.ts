import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import ShardModule from '../../../ShardAPI/module';
import {MC, Dictionary, CommandNamespace, ModuleNames, PermaEnabledModules} from '../../../ShardAPI/CONST';

var Modules:Dictionary<ShardModule>;
// Import modules after they have all initialized.
MC.system.runTimeout(()=>{
    import('../../modules').then(modules => {
        Modules = modules.Modules;
    });
},10);




function moduleConfig(context:ShardCommandContext, module_key:string) {
    const module:ShardModule = Modules[module_key];
    Modules.core.forms.module.show(context, module);
    return undefined;
};


function moduleActionInfo(context:ShardCommandContext, module_key:string) {
    const module:ShardModule = Modules[module_key];
    // Generate command list.
    let commandList:Array<string> = [''];
    for (let key in module.commands) {
        let value:ShardCommand = module.commands[key];
        commandList.push(value.id);
    };
    commandList = commandList.sort(); // Sort alphabetically.
    let commandListString:string = commandList.join('\n §r- §e/');

    // Return message.
    return {message:{translate:'shard.core.cmd.module.info', with:{rawtext: [{text:module.id}, module.description, {text:commandListString}]}}, status:0};
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


function moduleActionPrintData(module_key:string) {
    let module:ShardModule = Modules[module_key];
    if (module == undefined) {console.warn(`${module_key} does not exist.`)}
    else {console.warn(`${module_key} persistent data: `+JSON.stringify(module.persisData))};

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
        default: return moduleConfig(Context, module_key);
    };
};




// Initialize Command.
export const Command = new ShardCommand(
    'module',
    'Open module configuration UI, or perform actions.',
    [
        {name:CommandNamespace+':'+'module', type:MC.CustomCommandParamType.Enum}
    ],
    [
        {name:CommandNamespace+':'+'moduleAction', type:MC.CustomCommandParamType.Enum},
    ],
    MC.CommandPermissionLevel.Admin,
    [],
    Callback,
    {
        module: ModuleNames,
        moduleAction: [
            'info',
            'disable',
            'enable',
            'clearData',
            'printData',
        ],
    },
);