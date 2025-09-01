import {CommandPermissionLevel, RawMessage} from '@minecraft/server';
import {ActionFormData, ActionFormResponse} from '@minecraft/server-ui';
import ShardForm from '../../../ShardAPI/form';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {Module} from '../module';




function BuildForm(context:ShardCommandContext, ...args) {
    const regionName:string = args[0];
    const regionCommandKeys:Array<string> = Object.keys(Module.persisData.regions[regionName].commands).sort();

    const formData = new ActionFormData()
        .title({rawtext:[Module.displayName, {text:' - '}, {translate:'shard.region.form.commands.title'}]})
        .button({translate:'shard.region.form.commands.add'})
    // Command buttons.
    regionCommandKeys.forEach(key => {
        formData.button(key);
    });
    formData.button({translate:'shard.formCommon.done'});
    
    return {data:formData, callbackArgs:[regionName, regionCommandKeys]};
};




function Callback(context:ShardCommandContext, response:ActionFormResponse, ...args) {
    const regionName:string = args[0];
    const regionCommandKeys:Array<string> = args[1];

    // Add command button.
    if (response.selection == 0) {
        Module.forms.addCommand.show(context, regionName);
        return;
    };
    // Done button.
    if (response.selection == regionCommandKeys.length+1) {
        Module.forms.edit.show(context, regionName);
        return;
    };

    // Command button.
    Module.forms.editCommand.show(context, regionName, regionCommandKeys[response.selection-1]);
};




// Initialize form.
export const Form:ShardForm = new ShardForm(
    'commands',
    CommandPermissionLevel.Admin,
    [],
    BuildForm,
    Callback,
);