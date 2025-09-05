import {world, CommandPermissionLevel, Entity} from '@minecraft/server';
import {ShardForm, ShardFormBuilder, ShardFormElement, ShardFormActionResponse} from '../../../Shard/form';
import {ShardCommandContext} from '../../../Shard/command';
import {Module} from '../module';




function Builder(context:ShardCommandContext, ...args):ShardFormBuilder {
    // Get all text display entities.
    let textDisplays:Array<Entity> = world.getDimension('overworld').getEntities({type:'shard:text_display'});
    textDisplays = textDisplays.concat(world.getDimension('nether').getEntities({type:'shard:text_display'}));
    textDisplays = textDisplays.concat(world.getDimension('the_end').getEntities({type:'shard:text_display'}));

    const elements:Array<ShardFormElement> = [];
    elements.push({type:'title', id:'title', data:{display:Module.details.displayName}});
    elements.push({type:'body', id:'body', data:{display:{translate:'shard.textdisplay.form.viewAll.body'}}});
    textDisplays.forEach(entity => {
        elements.push({type:'button', id:`>${entity.nameTag}`, data:{display:entity.nameTag}});
    });
    elements.push({type:'button', id:'done', data:{display:{translate:'shard.formCommon.done'}}});

    return new ShardFormBuilder({type:'action'}, {elements:elements, callbackArgs:[textDisplays]});
};


function Callback(context:ShardCommandContext, response:ShardFormActionResponse, ...args) {
    const textDisplays:Array<Entity> = args[0];

    // Return to parent form if done button.
    if (response.selection == textDisplays.length) {
        Module.mainForm.show(context);
        return;
    };

    const textDisplay:Entity = textDisplays[response.selection];
    // Teleport to the text display.
    const target = context.target as Entity;
    target.teleport(textDisplay.location, {dimension:textDisplay.dimension});
};




// Initialize form.
export const MAIN = new ShardForm(
    {
        id: 'viewAll',
        permissionLevel: CommandPermissionLevel.Admin,
    },
    {
        buildForm: Builder,
        callback: Callback,
    },
);