import {system, CommandPermissionLevel, RawMessage} from '@minecraft/server';
import {ModalFormData, ModalFormResponse} from '@minecraft/server-ui';
import {Dictionary} from '../../../ShardAPI/CONST';
import ShardForm from '../../../ShardAPI/form';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {LocationToString, StringToLocation, AlignArea} from '../../../ShardAPI/util';
import {Module, Region, RegionCommand, commandEventIndexMap} from '../module';




function BuildForm(context:ShardCommandContext, ...args) {
    const valueIndexMap:Dictionary<number> = {};
    let valueIndex:number = -1;

    const regionName:string = args[0];
    const region:Region = Module.persisData.regions[regionName];
    if (!region) {return};
    const commandName:string = args[1];
    const command:RegionCommand = region.commands[commandName];
    const message:string = args[2];

    const formData = new ModalFormData()
        .title({rawtext:[Module.displayName, {text:' - '}, {translate:'shard.region.form.addCommand.editTitle'}]});
    // Add message if given.
    if (message) {
        formData.label(message);
        valueIndex += 1;
    };
    formData.textField({translate:'shard.region.form.addCommand.name'}, {translate:'shard.region.form.addCommand.namePlaceholder'}, {defaultValue:commandName});
    formData.dropdown({translate:'shard.region.form.addCommand.event'}, [
            {translate:'shard.region.form.addCommand.event.tick'},
            {translate:'shard.region.form.addCommand.event.tickEntity'},
        ], {defaultValueIndex:commandEventIndexMap.indexOf(command.event), tooltip:{translate:'shard.region.form.addCommand.eventTooltip'}});
    formData.textField({translate:'shard.region.form.addCommand.command'}, {translate:'shard.region.form.addCommand.commandPlaceholder'}, {defaultValue:command.command});
    formData.toggle({translate:'shard.region.form.addCommand.remove'}, {defaultValue:false});
    valueIndex += 1;
    Object.assign(valueIndexMap, {
        name: valueIndex,
        eventIdIndex: valueIndex+1,
        command: valueIndex+2,
        remove: valueIndex+3
    });
    valueIndex += 3;
    
    return {data:formData, callbackArgs:[regionName, commandName, valueIndexMap]};
};




function Callback(context:ShardCommandContext, response:ModalFormResponse, ...args) {
    const regionName:string = args[0];
    const name:string = args[1];
    const valueIndexMap:Dictionary<number> = args[2];
    const newName:string = response.formValues[valueIndexMap.name] as string;
    const eventIdIndex:number = response.formValues[valueIndexMap.eventIdIndex] as number;
    const eventId:string = commandEventIndexMap[eventIdIndex];
    const command:string = response.formValues[valueIndexMap.command] as string;
    const remove:boolean = response.formValues[valueIndexMap.remove] as boolean;

    // Remove command & return to parent form.
    if (remove) {
        delete Module.persisData.regions[regionName].commands[name];
        Module.forms.commands.show(context, regionName);
        return;
    };
    // Reshow with error if command is too short.
    if (command.length < 2) {
        Form.show(context, regionName, name, {translate:'shard.region.form.addCommand.invalidCommandLength', with:['3']});
        return;
    };

    // Edit comamnd.
    if (newName !== name) {
        Module.persisData.regions[regionName].commands[newName] = Module.persisData.regions[regionName].commands[name];
        delete Module.persisData.regions[regionName].commands[name];
    };
    Module.persisData.regions[regionName].commands[newName] = {
        event: eventId,
        command: command,
    };
    Module.saveData();

    // Return to parent form.
    Module.forms.commands.show(context, regionName);
};




// Initialize form.
export const Form:ShardForm = new ShardForm(
    'editCommand',
    CommandPermissionLevel.Admin,
    [],
    BuildForm,
    Callback,
);