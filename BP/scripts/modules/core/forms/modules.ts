export {Form};
import ShardForm from '../../../ShardAPI/form';
import {MC, MCUI} from '../../../ShardAPI/CONST';
import {Module} from '../module';


// Define form properties.
const ID:string = 'modules';
const PemrissionLevel:MC.CommandPermissionLevel = MC.CommandPermissionLevel.Admin;
const RequiredTags:Array<string> = [];
const Title:string = 'Shard Modules';
const Body:string = 'Configure Shard modules from here. Only admins should access this UI. §cRed§r modules are currently disabled, §2green§r modules are currently enabled, & the §upurple§r modules are unavailable.';




function BuildForm() {
    const formData = new MCUI.ActionFormData()
        .title(Title)
        .body(Body)
        .header('Utility:')
        .button('§uSimple Utility')
        .button('§uTracker')
        .header('Enhancement:')
        .button('§uClutter');
    
    return formData;
};




function Callback(response:MCUI.ActionFormResponse) {
    return;
};




// Initialize form.
var Form:ShardForm = new ShardForm(
    ID,
    PemrissionLevel,
    RequiredTags,
    BuildForm,
    Callback,
);