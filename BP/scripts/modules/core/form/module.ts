import {CommandPermissionLevel} from '@minecraft/server';
import {ShardForm, ShardFormBuilder, ShardFormElement, ShardFormActionResponse} from '../../../Shard/form';
import {ShardModule} from '../../../Shard/module';
import {ShardCommandContext} from '../../../Shard/command';
import {Module} from '../module';


/**Build the form. `args` should only contain one item of type `ShardModule`.*/
function Builder(context:ShardCommandContext, ...args) {
    const module:ShardModule = args[0];
    const elements:Array<ShardFormElement> = [];
    elements.push({type:'title', id:'title', data:{display:module.details.displayName}});
    elements.push({type:'body', id:'brief', data:{display:module.details.brief}});
    if (module.details.description) {
        elements.push({type:'body', id:'description', data:{display:module.details.description}});
        elements.push({type:'divider', id:'descDiv', data:{}});
    };
    if (module.settingElements.length != 0) {
        elements.push({type:'button', id:'settings', data:{display:{translate:'shard.misc.moduleOption.settings'}}});
    };
    elements.push({type:'button', id:'commands', data:{display:{translate:'shard.misc.moduleOption.commands'}}});
    return new ShardFormBuilder({type:'action'}, {elements:elements, callbackArgs:args});
};


function Callback(context:ShardCommandContext, response:ShardFormActionResponse, ...args) {
    const module:ShardModule = args[0];

    switch (response.selectedId) {
        case 'settings': { // Settings.
            Module.forms.moduleSettings.show(context, [module]);
            break;
        };
        case 'commands': { // Commands.
            Module.forms.moduleCommands.show(context, [module]);
            break;
        };
        case 'done': { // Done.
            return;
        };
    };

    return;
};




// Initialize form.
export const MAIN = new ShardForm(
    {id:'module', permissionLevel:CommandPermissionLevel.Admin},
    {buildForm:Builder, callback:Callback},
);