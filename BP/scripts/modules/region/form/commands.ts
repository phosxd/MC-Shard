import {CommandPermissionLevel} from '@minecraft/server';
import {ShardForm, ShardFormBuilder, ShardFormElement, ShardFormActionResponse} from '../../../Shard/form';
import {ShardCommandContext} from '../../../Shard/command';
import {Module} from '../module';


function Builder(context:ShardCommandContext, ...args) {
    const regionName:string = args[0];
    const regionCommandKeys:Array<string> = Object.keys(Module.persisData.regions[regionName].commands).sort();

    const elements:Array<ShardFormElement> = [];
    elements.push({type:'title', id:'title', data:{display:{rawtext:[Module.details.displayName, {text:' - '}, {translate:'shard.region.form.commands.title'}]}}});
    elements.push({type:'button', id:'add', data:{display:{translate:'shard.region.form.commands.add'}}});
    // Command buttons.
    regionCommandKeys.forEach(key => {
        elements.push({type:'button', id:`c:${key}`, data:{display:key}});
    });
    elements.push({type:'button', id:'done', data:{display:{translate:'shard.formCommon.done'}}});
    return new ShardFormBuilder({type:'action'}, {elements:elements, callbackArgs:[regionName, regionCommandKeys]});
};


function Callback(context:ShardCommandContext, response:ShardFormActionResponse, ...args) {
    const regionName:string = args[0];
    const regionCommandKeys:Array<string> = args[1];

    // Add command button.
    if (response.selection == 0) {
        Module.forms.addCommand.show(context, [regionName]);
        return;
    };
    // Done button.
    if (response.selection == regionCommandKeys.length+1) {
        Module.forms.edit.show(context, [regionName]);
        return;
    };

    // Command button.
    Module.forms.editCommand.show(context, [regionName, regionCommandKeys[response.selection-1]]);
};




// Initialize form.
export const MAIN = new ShardForm(
    {id:'commands', permissionLevel:CommandPermissionLevel.Admin},
    {buildForm:Builder, callback:Callback},
);