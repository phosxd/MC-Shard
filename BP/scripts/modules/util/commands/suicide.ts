import {system, Player, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    if (Context.targetType !== 'player') {return undefined};
    const player:Player = Context.target as Player;
    system.run(()=>{
        player.kill();
    });
    return undefined;
};




// Initialize Command.
export const Command = new ShardCommand(
    'suicide',
    'Kills you. Helpful when stuck somewhere.',
    [],
    [],
    CommandPermissionLevel.Any,
    [],
    Callback,
);