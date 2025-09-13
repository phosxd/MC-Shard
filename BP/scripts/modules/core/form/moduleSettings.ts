import {CommandPermissionLevel} from '@minecraft/server';
import {ShardForm, ShardFormBuilder, ShardFormElement, ShardFormModalResponse} from '../../../Shard/form';
import {ShardModule} from '../../../Shard/module';
import {ShardCommandContext} from '../../../Shard/command';
import {PermaEnabledModules} from '../../../Shard/CONST';
import {Deepcopy} from '../../../Shard/util';
import {Module} from '../module';


/**Build the form. `args` should only contain one item of type `ShardModule`.*/
function Builder(context:ShardCommandContext, ...args) {
    const module:ShardModule = args[0];
    const elements:Array<ShardFormElement> = [];
    elements.push({type:'title', id:'title', data:{display:{rawtext:[module.details.displayName, {text:' - '}, {translate:'shard.general.settings'}]}}});
    // Add module settings.
    module.settingElements.forEach(element => {
        const newElement = Deepcopy(element);
        // Set default value to value of the setting.
        newElement.data.defaultValue = module.persisData.settings[element.id];
        elements.push(newElement);
    });
    return new ShardFormBuilder({type:'modal'}, {elements:elements, callbackArgs:[module]});
};


function Callback(context:ShardCommandContext, response:ShardFormModalResponse, ...args) {
    const module:ShardModule = args[0];
    // Apply changes.
    for (const key in response.map) {
        let value = response.map[key];
        // Fix enabled setting if module cannot be disabled.
        if (key == 'enabled' && value == false && PermaEnabledModules.includes(module.details.id)) {
            value = true;
        };
        // Update setting.
        module.persisData.settings[key] = value;
    };
    module.saveData();
    // Return to parent form.
    Module.forms.module.show(context, [module]);
    return;
};




// Initialize form.
export const MAIN = new ShardForm(
    {id:'moduleSettings', permissionLevel:CommandPermissionLevel.Admin},
    {buildForm:Builder, callback:Callback},
);