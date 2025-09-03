import {CommandPermissionLevel} from '@minecraft/server';
import {ShardForm, ShardFormBuilder, ShardFormElement, ShardFormMessageResponse} from '../../../Shard/form';
import {ShardCommandContext} from '../../../Shard/command';




/**Build the form. `args` should only contain one item of type `ShardModule`.*/
function Builder(context:ShardCommandContext, ...args) {
    const elements:Array<ShardFormElement> = [];
    elements.push({type:'title', id:'title', data:{display:{translate:'shard.core.form.shard.title'}}});
    elements.push({type:'body', id:'body', data:{display:{translate:'shard.core.form.shard.body'}}});
    return new ShardFormBuilder({type:'message'}, {elements:elements, callbackArgs:args});
};




function Callback(context:ShardCommandContext, response:ShardFormMessageResponse, ...args) {
    return;
};




// Initialize form.
export const Form:ShardForm = new ShardForm(
    {
        id: 'shard',
        permissionLevel: CommandPermissionLevel.Any,
    },
    {
        buildForm: Builder,
        callback: Callback,
    },
);