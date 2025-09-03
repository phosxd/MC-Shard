import {CommandPermissionLevel} from '@minecraft/server';
import {ShardForm, ShardFormBuilder, ShardFormElement, ShardFormTitle, ShardFormButton, ShardFormActionResponse} from '../../../Shard/form';
import {ShardModule} from '../../../Shard/module';
import {ShardCommandContext} from '../../../Shard/command';
import {Module} from '../module';




/**Build the form. `args` should only contain one item of type `ShardModule`.*/
function Builder(context:ShardCommandContext, ...args) {
    const module:ShardModule = args[0];
    const commandKeys:Array<string> = Object.keys(module.commands).sort();

    const elements:Array<ShardFormElement> = [];
    elements.push({type:'title', id:'title', data:{display:{rawtext:[module.details.displayName, {text:' - '}, {translate:'shard.general.commands'}]}}});
    elements.push({type:'body', id:'body', data:{display:{translate:'shard.misc.moduleCommands.body'}}});
    // Add command buttons.
    commandKeys.forEach(key => {
        const command = module.commands[key];
        elements.push({type:'button', id:command.details.id, data:{display: {text:command.details.id}}});
    });
    elements.push({type:'button', id:'done', data:{display: {translate:'shard.formCommon.done'}}});

    return new ShardFormBuilder({type:'action'}, {elements:elements, callbackArgs:[module, commandKeys]});
};




function Callback(context:ShardCommandContext, response:ShardFormActionResponse, ...args) {
    const module:ShardModule = args[0];
    const commandKeys:Array<string> = args[1];

    // Done button.
    if (response.selection == commandKeys.length) {
        // Return to parent form.
        Module.forms.module.show(context, [module]);
        return;
    };

    Module.forms.module_command_settings.show(context, [module, commandKeys[response.selection]]);

    return;
};




// Initialize form.
export const Form:ShardForm = new ShardForm(
    {
        id: 'module_commands',
        permissionLevel: CommandPermissionLevel.Admin,
    },
    {
        buildForm: Builder,
        callback: Callback,
    },
);