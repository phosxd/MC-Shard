import {MC, Dictionary} from '../../ShardAPI/CONST';
import ShardModule from '../../ShardAPI/module';
import ShardEventListener from '../../ShardAPI/event_listener';
import ShardCommand from '../../ShardAPI/command';
import ShardForm from '../../ShardAPI/form';

// Import events.
import * as event_tick from './events/tick';
// Import commands.
import * as command_pushchat from './commands/pushchat';
import * as command_up from './commands/up';
import * as command_thru from './commands/thru';
import * as command_drain from './commands/drain';
import * as command_c from './commands/c';
import * as command_s from './commands/s';
import * as command_a from './commands/a';
import * as command_sp from './commands/sp';
import * as command_push from './commands/push';
import * as command_heal from './commands/heal';
import * as command_eat from './commands/eat';
import * as command_enflame from './commands/enflame';
import * as command_deflame from './commands/deflame';
import * as command_explode from './commands/explode';
import * as command_freeze from './commands/freeze';
import * as command_suicide from './commands/suicide';
import * as command_dupe from './commands/dupe';
import * as command_repair from './commands/repair';
// Import forms.
import * as form_main from './forms/main';


// Define module properties.
const ID:string = 'util';
const DisplayName:string = '§0[§5Simple Utility§0]§r';
const EventListeners:Dictionary<ShardEventListener> = {
    tick: event_tick.EventListener,
};
const Commands:Dictionary<ShardCommand> = {
    pushchat: command_pushchat.Command,
    up: command_up.Command,
    thru: command_thru.Command,
    drain: command_drain.Command,
    c: command_c.Command,
    s: command_s.Command,
    a: command_a.Command,
    sp: command_sp.Command,
    push: command_push.Command,
    heal: command_heal.Command,
    eat: command_eat.Command,
    enflame: command_enflame.Command,
    deflame: command_deflame.Command,
    explode: command_explode.Command,
    freeze: command_freeze.Command,
    suicide: command_suicide.Command,
    dupe: command_dupe.Command,
    repair: command_repair.Command,
};
const Forms:Dictionary<ShardForm> = {
};
const ExtraDefaultPersisData:Dictionary<any> = {
    frozenEntities: {},
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
    ExtraDefaultPersisData,
);
