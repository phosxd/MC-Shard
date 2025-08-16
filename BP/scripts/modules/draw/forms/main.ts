import ShardForm from '../../../ShardAPI/form';
import ShardModule from '../../../ShardAPI/module';
import ShardCommandContext from '../../../ShardAPI/command_context';
import ShardFormBuildResult from '../../../ShardAPI/form_build_result';
import {MC, MCUI} from '../../../ShardAPI/CONST';
import {Module} from '../module';




function BuildForm(context:ShardCommandContext, ...args):ShardFormBuildResult {
    const formData = new MCUI.ActionFormData()
        .title(Module.displayName)
        .body('')
        .button({translate:'shard.formCommon.done'});
    
    return {data:formData, callbackArgs:[]};
};


function Callback(context:ShardCommandContext, response:MCUI.ActionFormResponse, ...args) {
};




// Initialize form.
export const Form:ShardForm = new ShardForm(
    'main',
    MC.CommandPermissionLevel.Admin,
    [],
    BuildForm,
    Callback,
);