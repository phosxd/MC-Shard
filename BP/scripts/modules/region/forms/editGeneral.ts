import {system, CommandPermissionLevel, RawMessage} from '@minecraft/server';
import {ModalFormData, ModalFormResponse} from '@minecraft/server-ui';
import {Dictionary} from '../../../ShardAPI/CONST';
import ShardForm from '../../../ShardAPI/form';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {LocationToString, StringToLocation, AlignArea} from '../../../ShardAPI/util';
import {Module, Region} from '../module';




function BuildForm(context:ShardCommandContext, ...args) {
    const valueIndexMap:Dictionary<number> = {};
    let valueIndex:number = -1;

    const regionName:string = args[0];
    const region:Region = Module.persisData.regions[regionName];
    if (!region) {return};
    const message:string = args[1];

    const formData = new ModalFormData()
        .title({rawtext:[Module.displayName, {text:' - '}, {translate:'shard.region.form.edit.title'}]});
    // Add message if given.
    if (message) {
        formData.label(message);
        valueIndex += 1;
    };
    formData.textField({translate:'shard.region.form.edit.name'}, {translate:'shard.region.form.edit.namePlaceholder'}, {defaultValue:region.name})
    formData.textField({translate:'shard.region.form.edit.start'}, {translate:'shard.region.form.edit.startPlaceholder'}, {defaultValue:LocationToString(region.area.start)})
    formData.textField({translate:'shard.region.form.edit.end'}, {translate:'shard.region.form.edit.endPlaceholder'}, {defaultValue:LocationToString(region.area.end)})
    formData.toggle({translate:'shard.region.form.edit.inverted'}, {defaultValue:region.inverted});
    valueIndex += 1;
    Object.assign(valueIndexMap, {
        name: valueIndex,
        start: valueIndex+1,
        end: valueIndex+2,
        inverted: valueIndex+3,
    });
    valueIndex += 3;
    
    return {data:formData, callbackArgs:[regionName, valueIndexMap]};
};




function Callback(context:ShardCommandContext, response:ModalFormResponse, ...args) {
    const regionName:string = args[0];
    const valueIndexMap:Dictionary<number> = args[1];
    const newName = response.formValues[valueIndexMap.name] as string;
    const start = StringToLocation(response.formValues[valueIndexMap.start] as string);
    const end = StringToLocation(response.formValues[valueIndexMap.end] as string);
    const inverted = response.formValues[valueIndexMap.inverted] as boolean;

    // Reshow form with error message if invalid area.
    if (start.status !== 0 || end.status !== 0) {
        system.run(()=>{
            Form.show(context, regionName, {translate:'shard.formCommon.invalidLocation'});
        });
        return;
    };

    // Edit region.
    if (newName !== regionName) {
        Module.persisData.regions[newName] = Module.persisData.regions[regionName];
        delete Module.persisData.regions[regionName];
    };
    Module.persisData.regions[newName].name = newName;
    Module.persisData.regions[newName].area = AlignArea({start:start.location, end:end.location});
    Module.persisData.regions[newName].inverted = inverted;
    Module.saveData();

    // Return to parent form.
    Module.forms.edit.show(context, regionName);
};




// Initialize form.
export const Form:ShardForm = new ShardForm(
    'editGeneral',
    CommandPermissionLevel.Admin,
    [],
    BuildForm,
    Callback,
);