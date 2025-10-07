import {CommandPermissionLevel} from '@minecraft/server';
import {ShardForm, ShardFormBuilder, ShardFormElement, ShardFormMessageResponse} from '../../../Shard/form';
import {ShardCommandContext} from '../../../Shard/command';


function Builder(context:ShardCommandContext, ...args) {
    const title = args[0];
    const body = args[1];
    const elements:Array<ShardFormElement> = [];
    elements.push({type:'title', id:'title', data:{display:title}});
    elements.push({type:'body', id:'body', data:{display:body}});
    return new ShardFormBuilder({type:'message'}, {elements:elements, callbackArgs:args});
};


function Callback(context:ShardCommandContext, response:ShardFormMessageResponse, ...args) {
    return;
};


// Initialize form.
export const MAIN = new ShardForm(
    {id:'popup', permissionLevel:CommandPermissionLevel.Any},
    {buildForm:Builder, callback:Callback},
);