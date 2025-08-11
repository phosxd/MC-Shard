import {MC, Dictionary} from '../../ShardAPI/CONST';
import ShardModule from '../../ShardAPI/module';
import ShardEventListener from '../../ShardAPI/event_listener';
import ShardCommand from '../../ShardAPI/command';
import ShardForm from '../../ShardAPI/form';

// Import events.
import * as event_tick from './events/tick';
import * as event_entityDie from './events/entityDie';
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
import * as command_explode from './commands/explode';
import * as command_freeze from './commands/freeze';
import * as command_suicide from './commands/suicide';
import * as command_dupe from './commands/dupe';
import * as command_repair from './commands/repair';
import * as command_rename from './commands/rename';
import * as command_setslot from './commands/setslot';
// Import forms.
import * as form_main from './forms/main';


// Define module properties.
const EventListeners:Dictionary<ShardEventListener> = {
    tick: event_tick.EventListener,
    entityDie: event_entityDie.EventListener,
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
    explode: command_explode.Command,
    freeze: command_freeze.Command,
    suicide: command_suicide.Command,
    dupe: command_dupe.Command,
    repair: command_repair.Command,
    rename: command_rename.Command,
    setslot: command_setslot.Command,
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
    'util',
    {translate:'shard.util.displayName'},
    {translate:'shard.util.description'},
    Init,
    EventListeners,
    Commands,
    Forms,
    form_main.Form,
    ExtraDefaultPersisData,
);
