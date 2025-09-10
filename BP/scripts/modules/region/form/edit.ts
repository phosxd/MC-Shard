import {CommandPermissionLevel, RawMessage} from '@minecraft/server';
import {ShardForm, ShardFormBuilder, ShardFormElement, ShardFormActionResponse} from '../../../Shard/form';
import {ShardCommandContext} from '../../../Shard/command';
import {Module} from '../module';


function Builder(context:ShardCommandContext, ...args) {
    const regionName:string = args[0];
    const elements:Array<ShardFormElement> = [];
    elements.push({type:'title', id:'title', data:{display:{rawtext:[Module.details.displayName, {text:' - '}, {translate:'shard.region.form.edit.title'}]}}});
    elements.push({type:'button', id:'general', data:{display:{translate:'shard.region.form.edit.general'}}});
    elements.push({type:'button', id:'rules', data:{display:{translate:'shard.region.form.edit.rules'}}});
    return new ShardFormBuilder({type:'action'}, {elements:elements, callbackArgs:[regionName]});
};


function Callback(context:ShardCommandContext, response:ShardFormActionResponse, ...args) {
    const regionName:string = args[0];

    switch (response.selection) {
        case 0: { // General.
            Module.forms.editGeneral.show(context, [regionName]);
            break;
        };
        case 1: { // Rules.
            Module.forms.rules.show(context, [regionName]);
            break;
        };
    }
};




// Initialize form.
export const MAIN = new ShardForm(
    {id:'edit', permissionLevel:CommandPermissionLevel.Admin},
    {buildForm:Builder, callback:Callback},
);