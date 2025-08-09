import {Dictionary} from '../../ShardAPI/CONST';
import ShardModule from '../../ShardAPI/module';
import ShardEventListener from '../../ShardAPI/event_listener';
import ShardCommand from '../../ShardAPI/command';
import ShardForm from '../../ShardAPI/form';
// Import events.
import * as event_playerJoin from './events/playerJoin';
// Import commands.
import * as command_shard from './commands/shard';
import * as command_discord from './commands/discord';
import * as command_module from './commands/module';
// Import forms.
import * as form_main from './forms/main';
import * as form_modules from './forms/modules';




// Define module properties.
const ID:string = 'shard';
const DisplayName:string = '§0[§5Shard§0]§r';
var EventListeners:Dictionary<ShardEventListener> = {
    playerJoin: event_playerJoin.EventListener,
};
var Commands:Dictionary<ShardCommand> = {
    shard: command_shard.Command,
    discord: command_discord.Command,
    module: command_module.Command,
};
var Forms:Dictionary<ShardForm> = {
    modules: form_modules.Form,
};




// Init callback.
function Init() {};





// Instantiate Module.
export const Module:ShardModule = new ShardModule(
    ID,
    DisplayName,
    Init,
    EventListeners,
    Commands,
    Forms,
    form_main.Form,
);
