import {system, CommandPermissionLevel, RawMessage} from '@minecraft/server';
import {ModalFormData, ModalFormResponse} from '@minecraft/server-ui';
import {Dictionary} from '../../../ShardAPI/CONST';
import ShardForm from '../../../ShardAPI/form';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {LocationToString, StringToLocation, AlignArea} from '../../../ShardAPI/util';
import {Module, Region, RegionCommand} from '../module';


const commandEventIndexMap = [
    'tick',
    'onEnter',
    'onExit',
]




function BuildForm(context:ShardCommandContext, ...args) {
    const regionName:string = args[0];
    const region:Region = Module.persisData.regions[regionName];
    if (!region) {return};
    const regionCommandKey:string = args[1];
    const regionCommand:RegionCommand = region.commands[regionCommandKey];

    const formData = new ModalFormData()
        .title({rawtext:[Module.displayName, {text:' - '}, {translate:'shard.region.form.addCommand.title'}]})
        .textField({translate:'shard.region.form.addCommand.name'}, {translate:'shard.region.form.addCommand.namePlaceholder'}, {defaultValue:regionCommandKey})
        .dropdown({translate:'shard.region.form.addCommand.event'}, [
            {translate:'shard.region.form.addCommand.event.tick'},
        ], {defaultValueIndex:commandEventIndexMap.indexOf(regionCommand.event)})
        .textField({translate:'shard.region.addCommand.command'}, {translate:'shard.region.addCommand.commandPlaceholder'}, {defaultValue:regionCommand.command});
    
    return {data:formData, callbackArgs:[regionName, regionCommandKey]};
};




function Callback(context:ShardCommandContext, response:ModalFormResponse, ...args) {
    const regionName:string = args[0];

    // Return to parent form.
    Module.forms.edit.show(context, regionName);
};




// Initialize form.
export const Form:ShardForm = new ShardForm(
    'addCommand',
    CommandPermissionLevel.Admin,
    [],
    BuildForm,
    Callback,
);