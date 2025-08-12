import ShardForm from '../../../ShardAPI/form';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC, MCUI} from '../../../ShardAPI/CONST';
import {Module} from '../module';


// Define form properties.
const ID:string = 'main';
const PemrissionLevel:MC.CommandPermissionLevel = MC.CommandPermissionLevel.Admin;
const RequiredTags:Array<string> = [];
const Title:string = 'Simple Utility';
const Body:string = 'This module cannot be modified.';




function BuildForm(context:ShardCommandContext, ...args) {
    const formData = new MCUI.ActionFormData()
        .title(Title)
        .body(Body)
        .button('Okay');

    return formData;
};


function Callback(context:ShardCommandContext, response:MCUI.ActionFormResponse, ...args) {
    return;
};




// Initialize form.
export const Form:ShardForm = new ShardForm(
    ID,
    PemrissionLevel,
    RequiredTags,
    BuildForm,
    Callback,
);