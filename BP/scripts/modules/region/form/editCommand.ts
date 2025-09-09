import {CommandPermissionLevel} from '@minecraft/server';
import {ShardForm, ShardFormBuilder, ShardFormElement, ShardFormModalResponse} from '../../../Shard/form';
import {ShardCommandContext} from '../../../Shard/command';
import {Module, Region, RegionCommand, commandEventIndexMap} from '../module';


function Builder(context:ShardCommandContext, ...args) {
    const regionName:string = args[0];
    const region:Region = Module.persisData.regions[regionName];
    if (!region) {return};
    const commandName:string = args[1];
    const command:RegionCommand = region.commands[commandName];
    const message:string = args[2];

    const elements:Array<ShardFormElement> = [];
    elements.push({type:'title', id:'title', data:{display:{rawtext:[Module.details.displayName, {text:' - '}, {translate:'shard.region.form.addCommand.title'}]}}});
    if (message) {
        elements.push({type:'label', id:'message', data:{display:message}});
    };
    elements.push({type:'textBox', id:'name', data:{display:{translate:'shard.region.form.addCommand.name'}, placeholder:{translate:'shard.region.form.addCommand.namePlaceholder'}, defaultValue:commandName}});
    elements.push({type:'dropdown', id:'eventIdIndex', data:{
        display:{translate:'shard.region.form.addCommand.event'},
        items: [
            {translate:'shard.region.form.addCommand.event.tick'},
            {translate:'shard.region.form.addCommand.event.tickEntity'},
        ],
        defaultValue: commandEventIndexMap.indexOf(command.event),
        tooltip: {translate:'shard.region.form.addCommand.eventTooltip'},
    } as any});
    elements.push({type:'textBox', id:'command', data:{display:{translate:'shard.region.form.addCommand.command'}, placeholder:{translate:'shard.region.form.addCommand.commandPlaceholder'}, defaultValue:command.command}});
    elements.push({type:'toggle', id:'remove', data:{display:{translate:'shard.region.form.addCommand.remove'}, defaultValue:false}});
    return new ShardFormBuilder({type:'modal'}, {elements:elements, callbackArgs:[regionName, commandName]});
};


function Callback(context:ShardCommandContext, response:ShardFormModalResponse, ...args) {
    const regionName:string = args[0];
    const name:string = args[1];
    const newName:string = response.map.name;
    const eventIdIndex:number = response.map.eventIdIndex;
    const eventId:string = commandEventIndexMap[eventIdIndex];
    const command:string = response.map.command;
    const remove:boolean = response.map.remove;

    // Remove command & return to parent form.
    if (remove) {
        delete Module.persisData.regions[regionName].commands[name];
        Module.forms.commands.show(context, [regionName]);
        return;
    };
    // Reshow with error if name is taken.
    if (Module.persisData.regions[regionName].commands[newName] && newName != name) {
        MAIN.show(context, [regionName, name, {translate:'shard.formCommon.duplicateName'}]);
        return;
    };
    // Reshow with error if command is too short.
    if (command.length < 2) {
        MAIN.show(context, [regionName, name, {translate:'shard.region.form.addCommand.invalidCommandLength', with:['3']}]);
        return;
    };

    // Edit comamnd.
    if (newName != name) {
        Module.persisData.regions[regionName].commands[newName] = Module.persisData.regions[regionName].commands[name];
        delete Module.persisData.regions[regionName].commands[name];
    };
    Module.persisData.regions[regionName].commands[newName] = {
        event: eventId,
        command: command,
    } as RegionCommand;
    Module.saveData();

    // Return to parent form.
    Module.forms.commands.show(context, [regionName]);
};




// Initialize form.
export const MAIN = new ShardForm(
    {id:'editCommand', permissionLevel:CommandPermissionLevel.Admin},
    {buildForm:Builder, callback:Callback},
);