import {CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {Module, BlacklistItem} from '../module';

export const creativeModePreset:Array<BlacklistItem> = [
    {typeId: 'mob_spawner'},
    {typeId: 'reinforced_deepslate'},
    {typeId: 'bedrock'},
    {typeId: 'barrier'},
    {typeId: 'command_block'},
    {typeId: 'repeating_command_block'},
    {typeId: 'chain_command_block'},
    {typeId: 'structure_block'},
    {typeId: 'spawn_egg'},
];


function Callback(_context:ShardCommandContext, args:Array<any>) {
    const preset:string = args[0];
    if (preset == 'empty') {
        Module.persisData.items = [];
    }
    else if (preset == 'creativeMode') {
        Module.persisData.items = [...creativeModePreset];
    }
    else {
        return {message:{translate:'shard.misc.createInvalidParam', with:['blacklistPreset']}, status:1};
    };
    Module.saveData();
    return {message:{translate:'shard.blacklist.cmd.blacklistPreset.success', with:[preset]}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'blacklistpreset',
        brief: 'shard.blacklist.cmd.blacklistPreset.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'sh:blacklistPreset', type:CustomCommandParamType.Enum},
        ],
    },
    {callback: Callback},
);