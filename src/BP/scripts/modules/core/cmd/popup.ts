import {CommandPermissionLevel, CustomCommandParamType, Player} from '@minecraft/server';
import {ShardCommand, ShardCommandContext, GenerateCommandContext} from '../../../Shard/command';
import {Module} from '../module';


function Callback(_context:ShardCommandContext, args:Array<any>) {
    const targets:Array<Player> = args[0];
    const title:string = args[1];
    const body:string = args[2];
    targets.forEach(player => { 
        Module.forms.popup.show(GenerateCommandContext(player), [{text:title}, {text:body.replaceAll('\\n','\n')}]);
    });
    return {message:{translate:'shard.core.cmd.popup.success', with:[String(targets.length)]}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'popup',
        brief: 'shard.core.cmd.popup.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'targets', type:CustomCommandParamType.PlayerSelector},
            {name:'title', type:CustomCommandParamType.String},
            {name:'body', type:CustomCommandParamType.String},
        ],
    },
    {callback: Callback},
);