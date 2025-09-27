import {CommandPermissionLevel} from '@minecraft/server';
import {ShardForm, ShardFormBuilder, ShardFormElement, ShardFormActionResponse} from '../../../Shard/form';
import {ShardCommandContext} from '../../../Shard/command';
import {Module, BlacklistItem} from '../module';


function Builder(context:ShardCommandContext, ...args) {
    const blacklistItemKeys:Array<string> = Object.keys(Module.persisData.items).sort();

    const elements:Array<ShardFormElement> = [];
    elements.push({type:'title', id:'title', data:{display:{rawtext:[Module.details.displayName, {text:' - '}, {translate:'shard.blacklist.form.items.title'}]}}});
    elements.push({type:'button', id:'add', data:{display:{translate:'shard.blacklist.form.items.add'}}});
    // Item buttons.
    blacklistItemKeys.forEach(key => {
        elements.push({type:'button', id:`i:${key}`, data:{display:key}});
    });
    //elements.push({type:'button', id:'done', data:{display:{translate:'shard.formCommon.done'}}});
    return new ShardFormBuilder({type:'action'}, {elements:elements, callbackArgs:[blacklistItemKeys]});
};


function Callback(context:ShardCommandContext, response:ShardFormActionResponse, ...args) {
    const blacklistItemKeys:Array<string> = args[0];

    // Add rule button.
    if (response.selection == 0) {
        Module.forms.editItem.show(context);
        return;
    };

    // Item button.
    Module.forms.editItem.show(context, [blacklistItemKeys[response.selection-1]]);
};




// Initialize form.
export const MAIN = new ShardForm(
    {id:'items', permissionLevel:CommandPermissionLevel.GameDirectors},
    {buildForm:Builder, callback:Callback},
);