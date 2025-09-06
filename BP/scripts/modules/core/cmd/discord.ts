import {CommandPermissionLevel} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {DiscordLink} from '../../../Shard/CONST';
import {Module} from '../module';




function Callback(context:ShardCommandContext, args:Array<any>) {
    const settings = Module.persisData.commandSettings[MAIN.details.id];
    return {message:{translate:'shard.core.cmd.discord.success', with:[settings.link]}, status:0};
};




// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'discord',
        brief: 'shard.core.cmd.discord.brief',
        permissionLevel: CommandPermissionLevel.Any,
    },
    {
        callback: Callback,
        settingElements: [
            {
                type:'textBox', id: 'link',
                data: {
                    display: {translate:'shard.core.cmd.discord.setting.link'},
                    placeholder: {translate:'shard.core.cmd.discord.setting.linkPlaceholder'},
                    defaultValue: DiscordLink,
                },
            },
        ],
    },
);