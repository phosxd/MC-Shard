import {CommandPermissionLevel, Entity} from '@minecraft/server';
import {ShardForm, ShardFormBuilder, ShardFormElement, ShardFormModalResponse} from '../../../Shard/form';
import {ShardCommandContext} from '../../../Shard/command';;
import {Module} from '../module';




function Builder(context:ShardCommandContext, ...args):ShardFormBuilder {
    const textDisplay:Entity = args[0];

    const elements:Array<ShardFormElement> = [];
    elements.push({type:'title', id:'title', data:{display:Module.details.displayName}});
    elements.push({type:'textBox', id:'text', data:{display:{translate:'shard.textdisplay.form.edit.text'}, placeholder:{translate:'shard.textdisplay.form.edit.textPlaceholder'}, defaultValue:textDisplay.nameTag}});
    elements.push({type:'toggle', id:'isBossbar', data:{display:{translate:'shard.textdisplay.form.edit.isBossbar'}, defaultValue:textDisplay.getProperty('shard:mode') == 'bossbar'}});
    elements.push({type:'toggle', id:'killToggle', data:{display:{translate:'shard.textdisplay.form.edit.killToggle'}, defaultValue:false}});
    return new ShardFormBuilder({type:'modal'}, {elements:elements, callbackArgs:args});
};


function Callback(context:ShardCommandContext, response:ShardFormModalResponse, ...args) {
    const textDisplay:Entity = args[0];
    // Kill if toggled.
    if (response.map.killToggle) {
        textDisplay.remove();
        return;
    };
    // Set bossbar mode.
    if (response.map.isBossbar) {
        textDisplay.triggerEvent('shard:bossbar_range_3');
    }
    else {textDisplay.triggerEvent('shard:text_display')};
    // Rename.
    textDisplay.nameTag = response.map.text;
};




// Initialize form.
export const MAIN = new ShardForm(
    {
        id: 'edit',
        permissionLevel: CommandPermissionLevel.Admin,
    },
    {
        buildForm: Builder,
        callback: Callback,
    },
);