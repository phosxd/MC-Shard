import {system, CommandPermissionLevel, RawMessage} from '@minecraft/server';
import {ModalFormData, ModalFormResponse} from '@minecraft/server-ui';
import {Dictionary} from '../../../ShardAPI/CONST';
import ShardForm from '../../../ShardAPI/form';
import {ShardCommandContext} from '../../../ShardAPI/command';
import {LocationToString, StringToLocation, AlignArea} from '../../../ShardAPI/util';
import {Module, Region, RegionCommand, commandEventIndexMap} from '../module';




function BuildForm(context:ShardCommandContext, ...args) {
    const valueIndexMap:Dictionary<number> = {};
    let valueIndex:number = -1;

    const regionName:string = args[0];
    const region:Region = Module.persisData.regions[regionName];
    if (!region) {return};
    const message:string = args[1];

    const formData = new ModalFormData()
        .title({rawtext:[Module.displayName, {text:' - '}, {translate:'shard.region.form.addCommand.title'}]});
    // Add message if given.
    if (message) {
        formData.label(message);
        valueIndex += 1;
    };
    formData.textField({translate:'shard.region.form.addCommand.name'}, {translate:'shard.region.form.addCommand.namePlaceholder'});
    formData.dropdown({translate:'shard.region.form.addCommand.event'}, [
            {translate:'shard.region.form.addCommand.event.tick'},
            {translate:'shard.region.form.addCommand.event.tickEntity'},
        ], {defaultValueIndex:0, tooltip:{translate:'shard.region.form.addCommand.eventTooltip'}});
    formData.textField({translate:'shard.region.form.addCommand.command'}, {translate:'shard.region.form.addCommand.commandPlaceholder'});
    valueIndex += 1;
    Object.assign(valueIndexMap, {
        name: valueIndex,
        eventIdIndex: valueIndex+1,
        command: valueIndex+2,
    });
    valueIndex += 2;
    
    return {data:formData, callbackArgs:[regionName, valueIndexMap]};
};




function Callback(context:ShardCommandContext, response:ModalFormResponse, ...args) {
    const regionName:string = args[0];
    const valueIndexMap:Dictionary<number> = args[1];
    const name:string = response.formValues[valueIndexMap.name] as string;
    const eventIdIndex:number = response.formValues[valueIndexMap.eventIdIndex] as number;
    const eventId:string = commandEventIndexMap[eventIdIndex];
    const command:string = response.formValues[valueIndexMap.command] as string;

    // Rehow with error if name is taken.
    if (Module.persisData.regions[regionName].commands[name]) {
        Form.show(context, regionName, {translate:'shard.formCommon.duplicateName'});
        return;
    };
    // Reshow with error if command is too short.
    if (command.length < 2) {
        Form.show(context, regionName, {translate:'shard.region.form.addCommand.invalidCommandLength', with:['3']});
        return;
    };

    // Add comamnd.
    Module.persisData.regions[regionName].commands[name] = {
        event: eventId,
        command: command,
    };
    Module.saveData();

    // Return to parent form.
    Module.forms.commands.show(context, regionName);
};




// Initialize form.
export const Form:ShardForm = new ShardForm(
    'addCommand',
    CommandPermissionLevel.Admin,
    [],
    BuildForm,
    Callback,
);