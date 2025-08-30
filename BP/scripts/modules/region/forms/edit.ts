import {CommandPermissionLevel, RawMessage} from '@minecraft/server';
import {ActionFormData, ActionFormResponse} from '@minecraft/server-ui';
import ShardForm from '../../../ShardAPI/form';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {Module} from '../module';




function BuildForm(context:ShardCommandContext, ...args) {
    const regionName:string = args[0];

    const formData = new ActionFormData()
        .title({rawtext:[Module.displayName, {text:' - '}, {translate:'shard.region.form.edit.title'}]})
        .button({translate:'shard.region.form.edit.general'})
        .button({translate:'shard.region.form.edit.commands'})
        .button({translate:'shard.formCommon.done'});
    
    return {data:formData, callbackArgs:[regionName]};
};




function Callback(context:ShardCommandContext, response:ActionFormResponse, ...args) {
    const regionName:string = args[0];

    switch (response.selection) {
        case 0: { // General.
            Module.forms.editGeneral.show(context, regionName);
            break;
        };
        case 1: { // Commands.
            Module.forms.commands.show(context, regionName);
            break;
        };
    }
};




// Initialize form.
export const Form:ShardForm = new ShardForm(
    'edit',
    CommandPermissionLevel.Admin,
    [],
    BuildForm,
    Callback,
);