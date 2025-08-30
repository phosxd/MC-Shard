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
        .body('Work in progress.')
    formData.button({translate:'shard.formCommon.done'});
    
    return {data:formData, callbackArgs:[module]};
};




function Callback(context:ShardCommandContext, response:ActionFormResponse, ...args) {
    const module:ShardModule = args[0];

    return;
};




// Initialize form.
export const Form:ShardForm = new ShardForm(
    'module_command_settings',
    CommandPermissionLevel.Admin,
    [],
    BuildForm,
    Callback,
);