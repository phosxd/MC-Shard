import {CommandPermissionLevel} from '@minecraft/server';
import {ActionFormData, ActionFormResponse} from '@minecraft/server-ui';
import {ShardForm} from '../../../ShardAPI/form';
import {ShardModule} from '../../../ShardAPI/module';
import {ShardCommandContext} from '../../../ShardAPI/command';
import {Module} from '../module';




/**Build the form. `args` should only contain one item of type `ShardModule`.*/
function BuildForm(context:ShardCommandContext, ...args) {
    const formData = new ActionFormData()
        .title({translate:'shard.core.form.shard.title'})
        .body({translate:'shard.core.form.shard.body'})
        .button({translate:'shard.formCommon.done'});
    
    return {data:formData, callbackArgs:args};
};




function Callback(context:ShardCommandContext, response:ActionFormResponse, ...args) {
    return;
};




// Initialize form.
export const Form:ShardForm = new ShardForm(
    {
        id: 'shard',
        permissionLevel: CommandPermissionLevel.Any,
    },
    {
        buildForm: BuildForm,
        callback: Callback,
    },
);