import {CommandPermissionLevel} from '@minecraft/server';
import {ActionFormData, ActionFormResponse} from '@minecraft/server-ui';
import ShardForm from '../../../ShardAPI/form';
import ShardModule from '../../../ShardAPI/module';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {Module} from '../module';




/**Build the form. `args` should only contain one item of type `ShardModule`.*/
function BuildForm(context:ShardCommandContext, ...args) {
    const module:ShardModule = args[0];

    const formData = new ActionFormData()
        .title(module.displayName)
        .body(module.description)
        .button({translate:'shard.misc.moduleOption.settings'})
        .button({translate:'shard.misc.moduleOption.commands'})
        .button({translate:'shard.formCommon.done'});
    
    return {data:formData, callbackArgs:args};
};




function Callback(context:ShardCommandContext, response:ActionFormResponse, ...args) {
    if (response.canceled) {return};
    const module:ShardModule = args[0];

    switch (response.selection) {
        case 0: { // Settings.
            module.mainForm.show(context);
            break;
        };
        case 1: { // Commands.
            Module.forms.module_commands.show(context, module);
            break;
        };
        case 3: { // Done.
            return;
        };
    };

    return;
};




// Initialize form.
export const Form:ShardForm = new ShardForm(
    'module',
    CommandPermissionLevel.Admin,
    [],
    BuildForm,
    Callback,
);