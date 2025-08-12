import ShardForm from '../../../ShardAPI/form';
import ShardModule from '../../../ShardAPI/module';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC, MCUI} from '../../../ShardAPI/CONST';
import {Module} from '../module';




function BuildForm(context:ShardCommandContext, ...args) {
    const formData = new MCUI.ActionFormData()
        .title(Module.displayName)
        .body('No settings.')
        .button('Ok');
    
    return formData;
};




function Callback(context:ShardCommandContext, response:MCUI.ActionFormResponse, ...args) {
    return;
};




// Initialize form.
export const Form:ShardForm = new ShardForm(
    'main',
    MC.CommandPermissionLevel.Admin,
    [],
    BuildForm,
    Callback,
);