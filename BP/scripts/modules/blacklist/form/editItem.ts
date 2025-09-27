import {CommandPermissionLevel} from '@minecraft/server';
import {ShardForm, ShardFormBuilder, ShardFormElement, ShardFormModalResponse} from '../../../Shard/form';
import {ShardCommandContext} from '../../../Shard/command';
import {Module, BlacklistItem} from '../module';


function Builder(context:ShardCommandContext, ...args) {
    const itemName:string = args[0];
    const item:BlacklistItem = Module.persisData.items[itemName];
    const message:string = args[1];
    const defaults:BlacklistItem = {
        typeId: '',
        enchantments: [],
    }
    if (item) {
        defaults.typeId = item.typeId;
        if (item.enchantments) {defaults.enchantments = item.enchantments};
    };

    const elements:Array<ShardFormElement> = [];
    elements.push({type:'title', id:'title', data:{display:{rawtext:[Module.details.displayName, {text:' - '}, {translate:'shard.blacklist.form.editItem.title'}]}}});
    if (message) {
        elements.push({type:'label', id:'message', data:{display:message}});
    };
    elements.push({type:'textBox', id:'name', data:{display:{translate:'shard.general.name'}, placeholder:{translate:'shard.formCommon.enterUniqueName'}, defaultValue:itemName}});
    elements.push({type:'textBox', id:'typeId', data:{display:{translate:'shard.blacklist.form.editItem.typeId'}, placeholder:{translate:'shard.blacklist.form.editItem.typeId.placeholder'}, defaultValue:defaults.typeId}});
    elements.push({type:'toggle', id:'remove', data:{display:{translate:'shard.blacklist.form.editItem.remove'}, defaultValue:false}});
    return new ShardFormBuilder({type:'modal'}, {elements:elements, callbackArgs:[itemName]});
};


function Callback(context:ShardCommandContext, response:ShardFormModalResponse, ...args) {
    const name = args[0];
    const newName:string = response.map.name;
    const typeId:string = response.map.typeId;
    const remove:boolean = response.map.remove;

    // Remove item & return to parent form.
    if (remove) {
        delete Module.persisData.items[name];
        Module.saveData();
        Module.forms.items.show(context);
        return;
    };
    // Reshow with error if name is taken.
    if (Module.persisData.items[newName] && newName != name) {
        MAIN.show(context, [name, {translate:'shard.formCommon.duplicateName'}]);
        return;
    };

    // Edit item.
    if (newName != name && name != undefined) {
        Module.persisData.items[newName] = Module.persisData.items[name];
        delete Module.persisData.items[name];
    }
    else {
        Module.persisData.items[newName] = {
            typeId: typeId,
        } as BlacklistItem;
    };
    Module.saveData();

    // Return to parent form.
    Module.forms.items.show(context);
};




// Initialize form.
export const MAIN = new ShardForm(
    {id:'editItem', permissionLevel:CommandPermissionLevel.GameDirectors},
    {buildForm:Builder, callback:Callback},
);