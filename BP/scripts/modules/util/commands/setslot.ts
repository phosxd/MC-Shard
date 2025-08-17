import {system, Player, Entity, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';

const min_slot:number = 0;
const max_slot:number = 8;




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    let targets:Array<Entity> = Options[0];
    let slot:number = Number(Options[1]);
    // Return error if slot index is out of range.
    if (slot > max_slot || slot < min_slot) {
        return {message:{translate:'shard.util.cmd.setslot.slotIndexOutOfRange'}, status:1};
    };
    // Apply to targets.
    let count:number = 0;
    targets.forEach(entity => {
        if (entity.typeId !== 'minecraft:player') {return};
        const player:Player = entity as Player;
        system.run(()=>{
            player.selectedSlotIndex = slot;
        });
        count += 1;
    });

    return {message:{translate:'shard.util.cmd.setslot.success', with:[String(count), String(slot)]}, status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'setslot',
    'Set the selected hotbar slot.',
    [
        {name:'targets', type:CustomCommandParamType.EntitySelector},
        {name:'slotIndex', type:CustomCommandParamType.Integer},
    ],
    [],
    CommandPermissionLevel.GameDirectors,
    [],
    Callback,
);