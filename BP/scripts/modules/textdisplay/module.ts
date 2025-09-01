import {Dictionary} from '../../ShardAPI/CONST';
import ShardModule from '../../ShardAPI/module';
import ShardEventListener from '../../ShardAPI/event_listener';
import {ShardCommand} from '../../ShardAPI/command';
import ShardForm from '../../ShardAPI/form';

// Import events.
import * as event_playerInteractWithEntity from './events/playerInteractWithEntity';
// Import forms.
import * as form_main from './forms/main';
import * as form_viewAll from './forms/viewAll';
import * as form_edit from './forms/edit';


// Define module properties.
const EventListeners:Dictionary<ShardEventListener> = {
    playerInteractWithEntity: event_playerInteractWithEntity.EventListener,
};
const Commands:Dictionary<ShardCommand> = {
};
const Forms:Dictionary<ShardForm> = {
    viewAll: form_viewAll.Form,
    edit: form_edit.Form,
};
const ExtraDefaultPersisData:Dictionary<any> = {
};




// Init callback.
function Init() {};





// Instantiate Module.
export const Module:ShardModule = new ShardModule(
    'textdisplay',
    {translate:'shard.textdisplay.displayName'},
    {translate:'shard.textdisplay.description'},
    Init,
    EventListeners,
    Commands,
    Forms,
    form_main.Form,
    ExtraDefaultPersisData,
);
