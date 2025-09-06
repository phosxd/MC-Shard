import {CommandPermissionLevel} from '@minecraft/server';
import {ShardForm, ShardFormBuilder, ShardFormElement, ShardFormButton, ShardFormActionResponse} from '../../../Shard/form';
import {ShardModule} from '../../../Shard/module';
import {ShardCommandContext} from '../../../Shard/command';
import {Module} from '../module';




/**Build the form. `args` should only contain one item of type `ShardModule`.*/
function Builder(context:ShardCommandContext, ...args) {
    const module:ShardModule = args[0];
    const elements:Array<ShardFormElement> = [];
    elements.push({type:'title', id:'title', data:{display: module.details.displayName}});
    elements.push({type:'body', id:'body', data:{display: module.details.brief}});
    if (module.mainForm) {
        elements.push({type:'button', id:'settings', data:{display:{translate:'shard.misc.moduleOption.settings'}}});
    };
    elements.push({type:'button', id:'commands', data:{display:{translate:'shard.misc.moduleOption.commands'}}});
    return new ShardFormBuilder({type:'action'}, {elements:elements, callbackArgs:args});
};




function Callback(context:ShardCommandContext, response:ShardFormActionResponse, ...args) {
    const module:ShardModule = args[0];

    switch (response.selectedId) {
        case 'settings': { // Settings.
            module.mainForm.show(context);
            break;
        };
        case 'commands': { // Commands.
            Module.forms.module_commands.show(context, [module]);
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
    {
        id: 'module',
        permissionLevel: CommandPermissionLevel.Admin,
    },
    {
        buildForm: Builder,
        callback: Callback,
    },
);