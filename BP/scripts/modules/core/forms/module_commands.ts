import {CommandPermissionLevel} from '@minecraft/server';
import {ActionFormData, ActionFormResponse} from '@minecraft/server-ui';
import {ShardForm} from '../../../ShardAPI/form';
import {ShardModule} from '../../../ShardAPI/module';
import {ShardCommandContext} from '../../../ShardAPI/command';
import {Module} from '../module';




/**Build the form. `args` should only contain one item of type `ShardModule`.*/
function BuildForm(context:ShardCommandContext, ...args) {
    const module:ShardModule = args[0];
    const commandKeys:Array<string> = Object.keys(module.commands).sort();

    const formData = new ActionFormData()
        .title({rawtext:[module.details.displayName, {text:' - '}, {translate:'shard.general.commands'}]})
        .body({translate:'shard.misc.moduleCommands.body'})
    // Add command buttons.
    commandKeys.forEach(key => {
        const command = module.commands[key];
        formData.button(command.details.id);
    });
    formData.button({translate:'shard.formCommon.done'});
    
    return {data:formData, callbackArgs:[module, commandKeys]};
};




function Callback(context:ShardCommandContext, response:ActionFormResponse, ...args) {
    if (response.canceled) {return};
    const module:ShardModule = args[0];
    const commandKeys:Array<string> = args[1];
    if (response.selection == commandKeys.length) {return}; // Done button.

    Module.forms.module_command_settings.show(context, module, commandKeys[response.selection]);

    return;
};




// Initialize form.
export const Form:ShardForm = new ShardForm(
    {
        id: 'module_commands',
        permissionLevel: CommandPermissionLevel.Admin,
    },
    {
        buildForm: BuildForm,
        callback: Callback,
    },
);