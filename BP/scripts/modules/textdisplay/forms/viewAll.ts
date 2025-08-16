import ShardForm from '../../../ShardAPI/form';
import ShardModule from '../../../ShardAPI/module';
import ShardCommandContext from '../../../ShardAPI/command_context';
import ShardFormBuildResult from '../../../ShardAPI/form_build_result';
import {MC, MCUI} from '../../../ShardAPI/CONST';
import {Module} from '../module';




function BuildForm(context:ShardCommandContext, ...args):ShardFormBuildResult {
    // Get all text display entities.
    let textDisplays:Array<MC.Entity> = MC.world.getDimension('overworld').getEntities({type:'shard:text_display'});
    textDisplays = textDisplays.concat(MC.world.getDimension('nether').getEntities({type:'shard:text_display'}));
    textDisplays = textDisplays.concat(MC.world.getDimension('the_end').getEntities({type:'shard:text_display'}));

    // Create form data.
    const formData = new MCUI.ActionFormData()
        .title(Module.displayName)
        .body({translate:'shard.textdisplay.form.viewAll.body'})
    textDisplays.forEach(entity => {
        formData.button(entity.nameTag)
    });
    formData.button({translate:'shard.formCommon.done'});

    return {data:formData, callbackArgs:[textDisplays]}
};


function Callback(context:ShardCommandContext, response:MCUI.ActionFormResponse, ...args) {
    const textDisplays:Array<MC.Entity> = args[0];
    if (response.selection == textDisplays.length) {return}; // Done button.
    const textDisplay:MC.Entity = textDisplays[response.selection];
    // Teleport to the text display.
    context.target.teleport(textDisplay.location, {dimension:textDisplay.dimension});
};




// Initialize form.
export const Form:ShardForm = new ShardForm(
    'main',
    MC.CommandPermissionLevel.Admin,
    [],
    BuildForm,
    Callback,
);