import {CommandPermissionLevel, Vector3} from '@minecraft/server';
import {ShardForm, ShardFormBuilder, ShardFormElement, ShardFormModalResponse} from '../../../Shard/form';
import {ShardCommandContext} from '../../../Shard/command';
import {LocationToString, AlignArea} from '../../../Shard/util';
import {Module, Region} from '../module';


function Builder(context:ShardCommandContext, ...args) {
    const regionName:string = args[0];
    const region:Region = Module.persisData.regions[regionName];
    if (!region) {return};
    const message:string = args[1];

    const elements:Array<ShardFormElement> = [];
    elements.push({type:'title', id:'title', data:{display:{rawtext:[Module.details.displayName, {text:' - '}, {translate:'shard.region.form.edit.title'}]}}});
    if (message) {
        elements.push({type:'title', id:'message', data:{display:message}});
    };
    elements.push({type:'textBox', id:'name', data:{display:{translate:'shard.region.form.edit.name'}, placeholder:{translate:'shard.region.form.edit.namePlaceholder'}, defaultValue:region.name}});
    elements.push({type:'vector3Box', id:'start', data:{display:{translate:'shard.region.form.edit.start'}, placeholder:{translate:'shard.region.form.edit.startPlaceholder'}, defaultValue:LocationToString(region.area.start)}});
    elements.push({type:'vector3Box', id:'end', data:{display:{translate:'shard.region.form.edit.end'}, placeholder:{translate:'shard.region.form.edit.endPlaceholder'}, defaultValue:LocationToString(region.area.end)}});
    elements.push({type:'toggle', id:'inverted', data:{display:{translate:'shard.region.form.edit.inverted'}, defaultValue:region.inverted}});
    return new ShardFormBuilder({type:'modal'}, {elements:elements, callbackArgs:[regionName]});
};


function Callback(context:ShardCommandContext, response:ShardFormModalResponse, ...args) {
    const regionName:string = args[0];
    const newName:string = response.map.name
    const start:Vector3 = response.map.start;
    const end:Vector3 = response.map.end;
    const inverted:boolean = response.map.inverted;

    // Edit region.
    if (newName !== regionName) {
        Module.persisData.regions[newName] = Module.persisData.regions[regionName];
        delete Module.persisData.regions[regionName];
    };
    Module.persisData.regions[newName].name = newName;
    Module.persisData.regions[newName].area = AlignArea({start:start, end:end});
    Module.persisData.regions[newName].inverted = inverted;
    Module.saveData();

    // Return to parent form.
    Module.forms.edit.show(context, [regionName]);
};




// Initialize form.
export const MAIN = new ShardForm(
    {id:'editGeneral', permissionLevel:CommandPermissionLevel.Admin},
    {buildForm:Builder, callback:Callback},
);