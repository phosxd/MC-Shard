import {CommandPermissionLevel} from '@minecraft/server';
import {ShardForm, ShardFormBuilder, ShardFormElement, ShardFormModalResponse} from '../../../Shard/form';
import {ShardCommandContext} from '../../../Shard/command';
import {Module, Region, RegionRule, commandEventIndexMap} from '../module';


function Builder(context:ShardCommandContext, ...args) {
    const regionName:string = args[0];
    const region:Region = Module.persisData.regions[regionName];
    if (!region) {return};
    const ruleName:string = args[1];
    const rule:RegionRule = region.rules[ruleName];
    const message:string = args[2];
    const defaults:any = {
        name: ruleName,
        tags: {
            anyOf: [],
            allOf: [],
        },
        blockTypes: {
            anyOf: [],
            allOf: [],
        },
    };
    if (rule) {
        defaults.tags = rule.tags;
        defaults.blockTypes = rule.blockTypes;
        defaults.command = rule.command;
        defaults.eventIdIndex = commandEventIndexMap.indexOf(rule.eventId);
        if (defaults.eventIdIndex == -1) {defaults.eventIdIndex = 0};
        defaults.revert = rule.revert;
    };

    const elements:Array<ShardFormElement> = [];
    elements.push({type:'title', id:'title', data:{display:{rawtext:[Module.details.displayName, {text:' - '}, {translate:'shard.region.form.editRule.title'}]}}});
    if (message) {
        elements.push({type:'label', id:'message', data:{display:message}});
    };
    elements.push({type:'textBox', id:'name', data:{display:{translate:'shard.general.name'}, placeholder:{translate:'shard.formCommon.enterUniqueName'}, defaultValue:defaults.name}});
    elements.push({type:'dropdown', id:'eventIdIndex', data:{
        display:{translate:'shard.region.form.editRule.event'},
        items: [
            {translate:'shard.region.form.editRule.event.tick'},
            {translate:'shard.region.form.editRule.event.entityTick'},
            {translate:'shard.region.form.editRule.event.entityEnter'},
            {translate:'shard.region.form.editRule.event.entityExit'},
            {translate:'shard.region.form.editRule.event.playerPlaceBlock'},
            {translate:'shard.region.form.editRule.event.playerBreakBlock'},
            {translate:'shard.region.form.editRule.event.playerInteractWithBlock'},
            {translate:'shard.region.form.editRule.event.playerDropItem'},
            {translate:'shard.region.form.editRule.event.explosion'},
        ],
        defaultValue: defaults.eventIdIndex,
        tooltip: {translate:'shard.region.form.editRule.eventTooltip'},
    } as any});
    elements.push({type:'textArray', id:'tags', data:{
        display: {translate:'shard.region.form.editRule.tags'},
        placeholder: {translate:'shard.region.form.editRule.tagsPlaceholder'},
        tooltip: {translate:'shard.region.form.editRule.tagsTooltip'},
        min: 0,
        max: 10,
        itemMin: 1,
        itemMax: 32,
        defaultValue: defaults.tags.anyOf.concat(defaults.tags.allOf),
    }});
    elements.push({type:'textArray', id:'blockTypes', data:{
        display: {translate:'shard.region.form.editRule.blockTypes'},
        placeholder: {translate:'shard.region.form.editRule.blockTypesPlaceholder'},
        tooltip: {translate:'shard.region.form.editRule.blockTypesTooltip'},
        min: 0,
        max: 64,
        itemMin: 1,
        itemMax: 64,
        defaultValue: defaults.blockTypes.anyOf.concat(defaults.blockTypes.allOf),
    }});
    elements.push({type:'textBox', id:'command', data:{display:{translate:'shard.region.form.editRule.command'}, placeholder:{translate:'shard.region.form.editRule.commandPlaceholder'}, defaultValue:defaults.command}});
    elements.push({type:'toggle', id:'revert', data:{display:{translate:'shard.region.form.editRule.revert'}, tooltip:{translate:'shard.region.form.editRule.revertTooltip'}, defaultValue:defaults.revert}});
    elements.push({type:'toggle', id:'remove', data:{display:{translate:'shard.region.form.editRule.remove'}, defaultValue:false}});
    return new ShardFormBuilder({type:'modal'}, {elements:elements, callbackArgs:[regionName, ruleName]});
};


function Callback(context:ShardCommandContext, response:ShardFormModalResponse, ...args) {
    const regionName:string = args[0];
    const name:string = args[1];
    const newName:string = response.map.name;
    const eventIdIndex:number = response.map.eventIdIndex;
    const eventId:string = commandEventIndexMap[eventIdIndex];
    const tags:Array<string> = response.map.tags;
    const blockTypes:Array<string> = response.map.blockTypes;
    const command:string = response.map.command;
    const revert:boolean = response.map.revert;
    const remove:boolean = response.map.remove;

    // Remove rule & return to parent form.
    if (remove) {
        delete Module.persisData.regions[regionName].rules[name];
        Module.saveData();
        Module.forms.rules.show(context, [regionName]);
        return;
    };
    // Reshow with error if name is taken.
    if (Module.persisData.regions[regionName].rules[newName] && newName != name) {
        MAIN.show(context, [regionName, name, {translate:'shard.formCommon.duplicateName'}]);
        return;
    };

    // Edit rule.
    if (newName != name && name != undefined) {
        Module.persisData.regions[regionName].rules[newName] = Module.persisData.regions[regionName].rules[name];
        delete Module.persisData.regions[regionName].rules[name];
    }
    else {
        Module.persisData.regions[regionName].rules[newName] = {
            eventId: eventId,
            tags: {
                anyOf: tags.filter((value)=>{if (value.startsWith('!')) {return false}; return true;}),
                allOf: tags.filter((value)=>{if (value.startsWith('!')) {return true}; return false;}),
            },
            blockTypes: {
                anyOf: blockTypes.filter((value)=>{if (value.startsWith('!')) {return false}; return true;}),
                allOf: blockTypes.filter((value)=>{if (value.startsWith('!')) {return true}; return false;}),
            },
            command: command,
            revert: revert,
        } as RegionRule;
    };
    Module.saveData();

    // Return to parent form.
    Module.forms.rules.show(context, [regionName]);
};




// Initialize form.
export const MAIN = new ShardForm(
    {id:'editRule', permissionLevel:CommandPermissionLevel.Admin},
    {buildForm:Builder, callback:Callback},
);