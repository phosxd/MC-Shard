import ShardForm from '../../../ShardAPI/form';
import ShardCommandContext from '../../../ShardAPI/command_context';
import ShardFormBuildResult from '../../../ShardAPI/form_build_result';
import {MC, MCUI} from '../../../ShardAPI/CONST';
import {Module} from '../module';




function BuildForm(context:ShardCommandContext, ...args):ShardFormBuildResult {
    const textDisplay:MC.Entity = args[0];

    const formData = new MCUI.ModalFormData()
        .title(Module.displayName)
        .textField({translate:'shard.textdisplay.form.edit.text'}, {translate:'shard.textdisplay.form.edit.textPlaceholder'}, {defaultValue:textDisplay.nameTag})
        .toggle({translate:'shard.textdisplay.form.edit.killToggle'}, {defaultValue:false})
    
    return {data:formData, callbackArgs:args};
};


function Callback(context:ShardCommandContext, response:MCUI.ModalFormResponse, ...args) {
    const textDisplay:MC.Entity = args[0];
    // Kill if toggled.
    if (response.formValues[1] == true) {
        textDisplay.remove();
        return;
    };
    // Rename.
    textDisplay.nameTag = response.formValues[0];
};




// Initialize form.
export const Form:ShardForm = new ShardForm(
    'edit',
    MC.CommandPermissionLevel.Admin,
    [],
    BuildForm,
    Callback,
);