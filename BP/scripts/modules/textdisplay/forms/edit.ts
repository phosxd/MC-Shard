import {CommandPermissionLevel, Entity} from '@minecraft/server';
import {ModalFormData, ModalFormResponse} from '@minecraft/server-ui';
import ShardForm from '../../../ShardAPI/form';
import {ShardCommandContext} from '../../../ShardAPI/command';
import ShardFormBuildResult from '../../../ShardAPI/form_build_result';
import {Module} from '../module';




function BuildForm(context:ShardCommandContext, ...args):ShardFormBuildResult {
    const textDisplay:Entity = args[0];

    const formData = new ModalFormData()
        .title(Module.displayName)
        .textField({translate:'shard.textdisplay.form.edit.text'}, {translate:'shard.textdisplay.form.edit.textPlaceholder'}, {defaultValue:textDisplay.nameTag})
        .toggle({translate:'shard.textdisplay.form.edit.isBossbar'}, {defaultValue:textDisplay.getProperty('shard:mode') == 'bossbar'})
        .toggle({translate:'shard.textdisplay.form.edit.killToggle'}, {defaultValue:false})
    
    return {data:formData, callbackArgs:args};
};


function Callback(context:ShardCommandContext, response:ModalFormResponse, ...args) {
    const textDisplay:Entity = args[0];
    // Kill if toggled.
    if (response.formValues[2] == true) {
        textDisplay.remove();
        return;
    };

    // Set bossbar mode.
    if (response.formValues[1] == true) {
        textDisplay.triggerEvent('shard:bossbar_range_3');
    }
    else {textDisplay.triggerEvent('shard:text_display')};

    // Rename.
    textDisplay.nameTag = response.formValues[0] as string;
};




// Initialize form.
export const Form:ShardForm = new ShardForm(
    'edit',
    CommandPermissionLevel.Admin,
    [],
    BuildForm,
    Callback,
);