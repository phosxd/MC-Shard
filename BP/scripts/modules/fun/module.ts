import {Dictionary} from '../../ShardAPI/CONST';
import ShardModule from '../../ShardAPI/module';
import ShardEventListener from '../../ShardAPI/event_listener';
import {ShardCommand} from '../../ShardAPI/command';
import ShardForm from '../../ShardAPI/form';
// Import commands.
import * as command_crash from './commands/crash';
import * as command_party from './commands/party';
// Import forms.
import * as form_main from './forms/main';




// Define module properties.
var EventListeners:Dictionary<ShardEventListener> = {
};
var Commands:Dictionary<ShardCommand> = {
    crash: command_crash.Command,
    party: command_party.Command,
};
var Forms:Dictionary<ShardForm> = {
};


/**Currently partying players.*/
export var partying:Array<string> = [];




// Init callback.
function Init() {};





// Instantiate Module.
export const Module:ShardModule = new ShardModule(
    'fun', // ID
    {translate:'shard.fun.displayName'}, // Display name
    {translate:'shard.fun.description'}, // Description
    Init,
    EventListeners,
    Commands,
    Forms,
    form_main.Form,
);