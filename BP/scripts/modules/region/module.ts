import {system, world, RGBA} from '@minecraft/server';
import {Dictionary, AlignedArea} from '../../ShardAPI/CONST';
import ShardModule from '../../ShardAPI/module';
import ShardEventListener from '../../ShardAPI/event_listener';
import ShardCommand from '../../ShardAPI/command';
import ShardForm from '../../ShardAPI/form';
// Import events.
import * as event_tick from './events/tick';
// Import commands.
import * as command_addregion from './commands/addregion';
import * as command_removeregion from './commands/removeregion';
import * as command_listregions from './commands/listregions';
import * as command_editregion from './commands/editregion';
// Import forms.
import * as form_main from './forms/main';
import * as form_edit from './forms/edit';
import * as form_editGeneral from './forms/editGeneral';
import * as form_commands from './forms/commands';
import * as form_addCommand from './forms/addCommand';
import * as form_editCommand from './forms/editCommand';


export interface Region {
    name: string,
    dimensionId: string,
    area: AlignedArea,
    inverted: boolean,
    commands: RegionCommand,
};

export interface RegionCommand {
    event: string,
    command: string,
};

export const commandEventIndexMap = [
    'tick',
    'tickEntity',
    'onEnter',
    'onExit',
];


// Define module properties.
var EventListeners:Dictionary<ShardEventListener> = {
    tick: event_tick.EventListener,
};
var Commands:Dictionary<ShardCommand> = {
    addregions: command_addregion.Command,
    removeregions: command_removeregion.Command,
    listregions: command_listregions.Command,
    editregion: command_editregion.Command,
};
var Forms:Dictionary<ShardForm> = {
    edit: form_edit.Form,
    editGeneral: form_editGeneral.Form,
    commands: form_commands.Form,
    addCommand: form_addCommand.Form,
    editCommand: form_editCommand.Form,
};
const ExtraDefaultPersisData:Dictionary<any> = {
    regions: {},
};




// Init callback.
function Init() {};





// Instantiate Module.
export const Module:ShardModule = new ShardModule(
    'region', // ID
    {translate:'shard.region.displayName'}, // Display name
    {translate:'shard.region.description'}, // Description
    Init,
    EventListeners,
    Commands,
    Forms,
    form_main.Form,
    ExtraDefaultPersisData,
);