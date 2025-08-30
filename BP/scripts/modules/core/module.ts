import {Dictionary} from '../../ShardAPI/CONST';
import ShardModule from '../../ShardAPI/module';
import ShardEventListener from '../../ShardAPI/event_listener';
import ShardCommand from '../../ShardAPI/command';
import ShardForm from '../../ShardAPI/form';
// Import events.
import * as event_playerSpawn from './events/playerSpawn';
// Import commands.
import * as command_shard from './commands/shard';
import * as command_discord from './commands/discord';
import * as command_eval from './commands/eval';
import * as command_module from './commands/module';
// Import forms.
import * as form_main from './forms/main';
import * as form_shard from './forms/shard';
import * as form_module from './forms/module';
import * as form_module_commands from './forms/module_commands';
import * as form_module_command_settings from './forms/module_command_settings';




// Define module properties.
var EventListeners:Dictionary<ShardEventListener> = {
    playerSpawn: event_playerSpawn.EventListener,
};
var Commands:Dictionary<ShardCommand> = {
    shard: command_shard.Command,
    discord: command_discord.Command,
    eval: command_eval.Command,
    module: command_module.Command,
};
var Forms:Dictionary<ShardForm> = {
    shard: form_shard.Form,
    module: form_module.Form,
    module_commands: form_module_commands.Form,
    module_command_settings: form_module_command_settings.Form,
};




// Init callback.
function Init() {};





// Instantiate Module.
export const Module:ShardModule = new ShardModule(
    'core', // ID
    {translate:'shard.core.displayName'}, // Display name
    {translate:'shard.core.description'}, // Description
    Init,
    EventListeners,
    Commands,
    Forms,
    form_main.Form,
);