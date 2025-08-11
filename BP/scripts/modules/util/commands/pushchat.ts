export {Command};
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    if (Context.targetType !== 'player') {return undefined};
    return {message:'\n'.repeat(80), status:MC.CustomCommandStatus.Success};
};




// Initialize Command.
var Command = new ShardCommand(
    'pushchat',
    'Pushes all previous chat messages off-screen.',
    [],
    [],
    MC.CommandPermissionLevel.GameDirectors,
    [],
    Callback,
);