import {system, world, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../ShardAPI/command';
system;
world;




function Callback(context:ShardCommandContext, args:Array<any>) {
    let code:string = args[0];
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