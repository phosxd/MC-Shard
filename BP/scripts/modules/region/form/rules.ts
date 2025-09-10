import {CommandPermissionLevel} from '@minecraft/server';
import {ShardForm, ShardFormBuilder, ShardFormElement, ShardFormActionResponse} from '../../../Shard/form';
import {ShardCommandContext} from '../../../Shard/command';
import {Module} from '../module';


function Builder(context:ShardCommandContext, ...args) {
    const regionName:string = args[0];
    const regionRuleKeys:Array<string> = Object.keys(Module.persisData.regions[regionName].rules).sort();

    const elements:Array<ShardFormElement> = [];
    elements.push({type:'title', id:'title', data:{display:{rawtext:[Module.details.displayName, {text:' - '}, {translate:'shard.region.form.rules.title'}]}}});
    elements.push({type:'button', id:'add', data:{display:{translate:'shard.region.form.rules.add'}}});
    // Rule buttons.
    regionRuleKeys.forEach(key => {
        elements.push({type:'button', id:`r:${key}`, data:{display:key}});
    });
    elements.push({type:'button', id:'done', data:{display:{translate:'shard.formCommon.done'}}});
    return new ShardFormBuilder({type:'action'}, {elements:elements, callbackArgs:[regionName, regionRuleKeys]});
};


function Callback(context:ShardCommandContext, response:ShardFormActionResponse, ...args) {
    const regionName:string = args[0];
    const regionRuleKeys:Array<string> = args[1];

    // Add rule button.
    if (response.selection == 0) {
        Module.forms.editRule.show(context, [regionName]);
        return;
    };
    // Done button.
    if (response.selection == regionRuleKeys.length+1) {
        Module.forms.edit.show(context, [regionName]);
        return;
    };

    // Command button.
    Module.forms.editRule.show(context, [regionName, regionRuleKeys[response.selection-1]]);
};




// Initialize form.
export const MAIN = new ShardForm(
    {id:'rules', permissionLevel:CommandPermissionLevel.Admin},
    {buildForm:Builder, callback:Callback},
);