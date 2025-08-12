import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    MC.system.run(()=>{Context.target.setGameMode(MC.GameMode.Creative)});
    return undefined;
};




// Initialize Command.
export const Command = new ShardCommand(
    'c',
    'Creative mode.',
    [],
    [],
    MC.CommandPermissionLevel.Admin,
    [],
    Callback,
);