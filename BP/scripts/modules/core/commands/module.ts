import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import ShardModule from '../../../ShardAPI/module';
import {MC, Dictionary, CommandNamespace, ModuleNames, PermaEnabledModules} from '../../../ShardAPI/CONST';


// Define command properties.
const ID:string = 'module';
const Description:string = 'Open module configuration UI, or perform actions.';
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
        'disable',
        'enable',
        'clearData',
        'printData',
    ],
};

const Lang = {
    disable: 'Disabled module §e{module}§r.',
    enable: 'Enabled module §e{module}§r',
    clearData: 'Deleted all data for the §e{module}§r module.',
    printData: 'Printing all data for the §e{module}§r module. Data can be accessed in server logs.',
    cannotDisable: 'Cannot disable §e{module}§r module.',
};




//
function moduleActionEnable(module_key:string) {
    // Import modules then perform action.
    import('../../modules').then(modules => {
        let module:ShardModule = modules.Modules[module_key];
        module.enable();
    });

    return {message:Lang.enable.replace('{module}',module_key), status:MC.CustomCommandStatus.Success};
};


function moduleActionDisable(module_key:string) {
    // Return error if module cannot be disabled.
    if (PermaEnabledModules.includes(module_key)) {
        return {message:Lang.cannotDisable.replace('{module}',module_key), status:MC.CustomCommandStatus.Failure};
    };

    // Import modules then perform action.
    import('../../modules').then(modules => {
        let module:ShardModule = modules.Modules[module_key];
        module.disable();
    });

    return {message:Lang.disable.replace('{module}',module_key), status:MC.CustomCommandStatus.Success};
};


function moduleActionClearData(module_key:string) {
    // Import modules then perform action.
    import('../../modules').then(modules => {
        let module:ShardModule = modules.Modules[module_key];
        module.resetData();
    });

    return {message:Lang.clearData.replace('{module}',module_key), status:MC.CustomCommandStatus.Success};
};


function moduleActionPrintData(module_key:string) {
    // Import modules then perform action.
    import('../../modules').then(modules => {
        let module:ShardModule = modules.Modules[module_key];
        console.warn(`${module_key} persistent data: `+JSON.stringify(module.persisData));
    });

    return {message:Lang.printData.replace('{module}',module_key), status:MC.CustomCommandStatus.Success};
};


function Callback(Context:ShardCommandContext, Options:Array<any>) {
    let module_key:string = Options[0];
    let action:string = Options[1];

    switch (action) {
        case 'disable': return moduleActionDisable(module_key);
        case 'enable': return moduleActionEnable(module_key);
        case 'clearData': return moduleActionClearData(module_key);
        case 'printData': return moduleActionPrintData(module_key);
    }

    return undefined;
};




// Initialize Command.
export const Command = new ShardCommand(
    ID,
    Description,
    MandatoryParameters,
    OptionalParameters,
    PermissionLevel,
    RequiredTags,
    Callback,
    RegisterEnums,
);