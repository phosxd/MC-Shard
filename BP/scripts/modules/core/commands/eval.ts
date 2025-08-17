import {CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    let code:string = Options[0];
    return {message:eval(code), status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'eval',
    'Run TypeScript code in an uncontrolled environment. Intended for developer use only.',
    [
        {name:'code', type:CustomCommandParamType.String},
    ],
    [],
    CommandPermissionLevel.GameDirectors,
    [],
    Callback,
);