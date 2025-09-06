import {CommandPermissionLevel} from '@minecraft/server';
import {ShardForm, ShardFormBuilder, ShardFormElement, ShardFormActionResponse} from '../../../Shard/form';
import {ShardCommandContext} from '../../../Shard/command';
import {Module} from '../module';




function Builder(context:ShardCommandContext, ...args):ShardFormBuilder {
    const elements:Array<ShardFormElement> = [];
    elements.push({type:'title', id:'title', data:{display:Module.details.displayName}});
    elements.push({type:'body', id:'body', data:{display:{translate:'shard.textdisplay.form.main.body'}}});
    elements.push({type:'label', id:'guideEdit', data:{display:{translate:'shard.textdisplay.form.main.guide.edit'}}});
    elements.push({type:'button', id:'viewAll', data:{display:{translate:'shard.textdisplay.form.main.viewAll'}}});
    return new ShardFormBuilder({type:'action'}, {elements:elements, callbackArgs:[]});
};


function Callback(context:ShardCommandContext, response:ShardFormActionResponse, ...args) {
    switch (response.selection) {
        case 0: { // View All.
            Module.forms.viewAll.show(context, [args]);
            break;
        };
        default: return;
    };
};




// Initialize form.
export const MAIN = new ShardForm(
    {
        id: 'main',
        permissionLevel: CommandPermissionLevel.Admin,
    },
    {
        buildForm: Builder,
        callback: Callback,
    },
);