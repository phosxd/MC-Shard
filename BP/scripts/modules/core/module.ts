import {Dictionary} from '../../Shard/CONST';
import {ShardModule} from '../../Shard/module';
import {ShardListener} from '../../Shard/listener';
import {ShardCommand} from '../../Shard/command';
import {ShardForm} from '../../Shard/form';
// Import events.
import * as event_playerSpawn from './events/playerSpawn';
// Import commands.
import CommandEnums from './commandEnums';
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
var Listeners:Dictionary<ShardListener> = {
    playerSpawn: event_playerSpawn.Listener,
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
    {
        id: 'core',
        displayName: {translate:'shard.core.displayName'},
        brief: {translate:'shard.core.brief'},
    },
    {
        init: Init,
        listeners: Listeners,
        commands: Commands,
        commandEnums: CommandEnums,
        forms: Forms,
        mainForm: form_main.Form,
    },
);