import {world, CommandPermissionLevel, Entity} from '@minecraft/server';
import {ActionFormData, ActionFormResponse} from '@minecraft/server-ui';
import ShardForm from '../../../ShardAPI/form';
import {ShardCommandContext} from '../../../ShardAPI/command';
import ShardFormBuildResult from '../../../ShardAPI/form_build_result';
import {Module} from '../module';




function BuildForm(context:ShardCommandContext, ...args):ShardFormBuildResult {
    // Get all text display entities.
    let textDisplays:Array<Entity> = world.getDimension('overworld').getEntities({type:'shard:text_display'});
    textDisplays = textDisplays.concat(world.getDimension('nether').getEntities({type:'shard:text_display'}));
    textDisplays = textDisplays.concat(world.getDimension('the_end').getEntities({type:'shard:text_display'}));

    // Create form data.
    const formData = new ActionFormData()
        .title(Module.displayName)
        .body({translate:'shard.textdisplay.form.viewAll.body'})
    textDisplays.forEach(entity => {
        formData.button(entity.nameTag)
    });
    formData.button({translate:'shard.formCommon.done'});

    return {data:formData, callbackArgs:[textDisplays]}
};


function Callback(context:ShardCommandContext, response:ActionFormResponse, ...args) {
    const textDisplays:Array<Entity> = args[0];
    if (response.selection == textDisplays.length) {return}; // Done button.
    const textDisplay:Entity = textDisplays[response.selection];
    // Teleport to the text display.
    const target = context.target as Entity;
    target.teleport(textDisplay.location, {dimension:textDisplay.dimension});
};




// Initialize form.
export const Form:ShardForm = new ShardForm(
    'main',
    CommandPermissionLevel.Admin,
    [],
    BuildForm,
    Callback,
);