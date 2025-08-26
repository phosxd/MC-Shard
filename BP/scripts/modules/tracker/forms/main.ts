import {CommandPermissionLevel, RawMessage} from '@minecraft/server';
import {ActionFormData, ActionFormResponse} from '@minecraft/server-ui';
import ShardForm from '../../../ShardAPI/form';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {Module, trackersList, scoreboardsList, statesList} from '../module';




function BuildForm(context:ShardCommandContext, ...args) {
    const formData = new ActionFormData()
        .title(Module.displayName)
        .body({translate:'shard.trackers.form.main.body', with:[trackersList, scoreboardsList, statesList]})
        .button({translate:'shard.formCommon.done'});
    
    return {data:formData, callbackArgs:[]};
};




function Callback(context:ShardCommandContext, response:ActionFormResponse, ...args) {
    return;
};




// Initialize form.
export const Form:ShardForm = new ShardForm(
    'main',
    CommandPermissionLevel.Admin,
    [],
    BuildForm,
    Callback,
);