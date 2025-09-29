import {CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {Dictionary} from '../../../Shard/CONST';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {Module, BlacklistItem} from '../module';

export const creativeModePreset: Dictionary<BlacklistItem> = Object.freeze({
    'Mob Spawner': {typeId: 'mob_spawner'},
    'Reinforced Deepslate': {typeId: 'reinforced_deepslate'},
    'Bedrock': {typeId: 'bedrock'},
    'Barrier': {typeId: 'barrier'},
    'Command Block': {typeId: 'command_block'},
    'Repeating Command Block': {typeId: 'repeating_command_block'},
    'Chain Command Block': {typeId: 'chain_command_block'},
    'Structure Block': {typeId: 'structure_block'},
    'Spawn Egg': {typeId: 'spawn_egg'},
});


function Callback(_context:ShardCommandContext, args:Array<any>) {
    const preset:string = args[0];
    if (preset == 'empty') {
        Module.persisData.items = {};
    }
    else if (preset == 'creativeMode') {
        Module.persisData.items = Object.assign({}, creativeModePreset);
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