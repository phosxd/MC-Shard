import {CommandPermissionLevel} from '@minecraft/server';
import {ShardForm, ShardFormBuilder, ShardFormElement, ShardFormModalResponse} from '../../../Shard/form';
import {ShardModule} from '../../../Shard/module';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {Deepcopy} from '../../../Shard/util';
import {Module} from '../module';


/**Build the form. `args` should only contain one item of type `ShardModule`.*/
function Builder(context:ShardCommandContext, ...args) {
    const module:ShardModule = args[0];
    const commandKey:string = args[1];
    const command:ShardCommand = module.commands[commandKey];
    const commandData = module.persisData.commandSettings[command.details.id];

    const elements:Array<ShardFormElement> = [];
    elements.push({type:'title', id:'title', data:{display:{rawtext:[module.details.displayName, {text:' - '}, {translate:'shard.general.commands'}]}}});
    elements.push({type:'label', id:'body', data:{display:{text:command.details.brief}}});
    // Add command settings.
    command.settingElements.forEach(element => {
        const newElement = Deepcopy(element);
        // Set default value to value of the setting.
        newElement.data.defaultValue = commandData[element.id];
        elements.push(newElement);
    });
    return new ShardFormBuilder({type:'modal'}, {elements:elements, callbackArgs:[module, commandKey]});
};


function Callback(context:ShardCommandContext, response:ShardFormModalResponse, ...args) {
    const module:ShardModule = args[0];
    const commandKey:string = args[1];
    const command:ShardCommand = module.commands[commandKey];
    // Apply changes.
    for (const key in response.map) {
        const value = response.map[key];
        module.persisData.commandSettings[command.details.id][key] = value;
    };
    module.saveData();
    // Return to parent form.
    Module.forms.moduleCommands.show(context, [module]);
    return;
};




// Initialize form.
export const MAIN = new ShardForm(
    {id:'moduleCommandSettings', permissionLevel:CommandPermissionLevel.Admin},
    {buildForm:Builder, callback: Callback},
);