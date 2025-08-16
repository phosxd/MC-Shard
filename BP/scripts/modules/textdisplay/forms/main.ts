import ShardForm from '../../../ShardAPI/form';
import ShardModule from '../../../ShardAPI/module';
import ShardCommandContext from '../../../ShardAPI/command_context';
import ShardFormBuildResult from '../../../ShardAPI/form_build_result';
import {MC, MCUI} from '../../../ShardAPI/CONST';
import {Module} from '../module';




function BuildForm(context:ShardCommandContext, ...args):ShardFormBuildResult {
    const formData = new MCUI.ActionFormData()
        .title(Module.displayName)
        .body({translate:'shard.textdisplay.form.main.guide.summon'})
        .label({translate:'shard.textdisplay.form.main.guide.edit'})
        .button({translate:'shard.textdisplay.form.main.viewAll'})
        .button({translate:'shard.formCommon.done'});
    
    return {data:formData, callbackArgs:[]};
};


function Callback(context:ShardCommandContext, response:MCUI.ActionFormResponse, ...args) {
    switch (response.selection) {
        case 0: { // View All.
            Module.forms.viewAll.show(context, ...args);
            break;
        };
        default: return;
    };
};




// Initialize form.
export const Form:ShardForm = new ShardForm(
    'main',
    MC.CommandPermissionLevel.Admin,
    [],
    BuildForm,
    Callback,
);