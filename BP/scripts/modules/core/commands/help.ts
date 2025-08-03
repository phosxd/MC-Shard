export default Command;
import {ShardCommand} from '../../module_list';

// Define command properties.
const ID:string = 'shard:help';
const Triggers:Array<string> = [
    'shard:help',
    'help',
];
const RequiredTags:Array<string> = [];




function Callback(Context, Options) {
    if (Context.targetType !== Context.TargetTypes.player) {return};

    const help_message = 'test';
    Context.target.sendMessage(help_message);
};




// Initialize Command.
var Command = new ShardCommand(
    ID,
    Triggers,
    RequiredTags,
    Callback,
);