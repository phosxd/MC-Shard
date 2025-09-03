import {CommandPermissionLevel} from '@minecraft/server';
import {ShardForm, ShardFormBuilder, ShardFormElement, ShardFormButton, ShardFormActionResponse} from '../../../Shard/form';
import {ShardModule} from '../../../Shard/module';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {Module} from '../module';




/**Build the form. `args` should only contain one item of type `ShardModule`.*/
function Builder(context:ShardCommandContext, ...args) {
    const module:ShardModule = args[0];
    const commandKey:string = args[1];
    const command:ShardCommand = module.commands[commandKey];

    const elements:Array<ShardFormElement> = [];
    elements.push({type:'title', id:'title', data:{display:Module.details.displayName}});
    elements.push({type:'body', id:'body', data:{display:{text:'Work in progress.'}}});
    return new ShardFormBuilder({type:'action'}, {elements:elements, callbackArgs:[module]});
};




function Callback(context:ShardCommandContext, response:ShardFormActionResponse, ...args) {
    const module:ShardModule = args[0];

    return;
};




// Initialize form.
export const Form:ShardForm = new ShardForm(
    {
        id: 'module_command_settings',
        permissionLevel: CommandPermissionLevel.Admin,
    },
    {
        buildForm: Builder,
        callback: Callback,
    },
);