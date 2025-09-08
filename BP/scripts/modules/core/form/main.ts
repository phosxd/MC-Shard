import {CommandPermissionLevel, RawMessage} from '@minecraft/server';
import {ShardForm, ShardFormBuilder, ShardFormElement, ShardFormActionResponse} from '../../../Shard/form';
import {ShardCommandContext} from '../../../Shard/command';
import {Module} from '../module';


function Builder(context:ShardCommandContext, ...args) {
    const elements:Array<ShardFormElement> = [];
    elements.push({type:'title', id:'title', data:{display:Module.details.displayName}});
    return new ShardFormBuilder({type:'action'}, {elements:elements, callbackArgs:[]});
};


function Callback(context:ShardCommandContext, response:ShardFormActionResponse, ...args) {
    return;
};




// Initialize form.
export const MAIN = new ShardForm(
    {id:'main', permissionLevel:CommandPermissionLevel.Admin},
    {buildForm:Builder, callback:Callback},
);