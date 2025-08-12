import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    if (Context.targetType !== 'player') {return undefined};
    MC.system.run(()=>{Context.target.setGameMode(MC.GameMode.Spectator)});
    return undefined;
};




// Initialize Command.
export const Command = new ShardCommand(
    'sp',
    'Spectator mode.',
    [],
    [],
    MC.CommandPermissionLevel.Admin,
    [],
    Callback,
);