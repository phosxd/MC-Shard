import {CommandPermissionLevel} from '@minecraft/server';
import {ShardForm, ShardFormBuilder, ShardFormElement, ShardFormActionResponse} from '../../../Shard/form';
import {ShardCommandContext} from '../../../Shard/command';
import {Module, trackersList, scoreboardsList, statesList} from '../module';


function Builder(context:ShardCommandContext, ...args):ShardFormBuilder {
    const elements:Array<ShardFormElement> = [];
    elements.push({type:'title', id:'title', data:{display:Module.details.displayName}});
    elements.push({type:'body', id:'body', data:{display:{translate:'shard.trackers.form.main.body', with:[trackersList, scoreboardsList, statesList]}}});
    return new ShardFormBuilder({type:'action'}, {elements:elements, callbackArgs:[]});
};


function Callback(context:ShardCommandContext, response:ShardFormActionResponse, ...args) {};


// Initialize form.
export const MAIN = new ShardForm(
    {
        id: 'main',
        permissionLevel: CommandPermissionLevel.GameDirectors,
    },
    {
        buildForm: Builder,
        callback: Callback,
    },
);