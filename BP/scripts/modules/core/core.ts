export default Module;
import {ShardModule, ShardEvent, ShardCommand, ShardForm} from '../module_list';

// Import commands.
import * as command_help from './commands/help';

// Define module properties.
const ID:string = 'shard';
const DisplayName:string = '§0[§5Shard§0]§r';
var Events:Array<ShardEvent> = [];
var Commands:Array<ShardCommand> = [
    command_help.default,
];
var Forms:Array<ShardForm> = [];




// Init callback.
function Init() {
    console.warn('shard core init');
};





// Instantiate Module.
var Module:ShardModule = new ShardModule(
    ID,
    DisplayName,
    Init,
    Events,
    Commands,
    Forms,
);
