import {system, Player, Entity, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';

const min_slot:number = 0;
const max_slot:number = 8;




function Callback(_context:ShardCommandContext, args:Array<any>) {
    const targets:Array<Entity> = args[0];
    const slot:number = args[1];
    // Return error if slot index is out of range.
    if (slot > max_slot || slot < min_slot) {
        return {message:{translate:'shard.util.cmd.setSlot.slotIndexOutOfRange'}, status:1};
    };
    // Apply to targets.
    let count:number = 0;
    targets.forEach(entity => {
        if (entity.typeId !== 'minecraft:player') {return};
        const player = entity as Player;
        system.run(()=>{
            if (!player.isValid) {return};
            player.selectedSlotIndex = slot;
        });
        count += 1;
    });

    return {message:{translate:'shard.util.cmd.setSlot.success', with:[String(count), String(slot)]}, status:0};
};




// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'setslot',
        brief: 'shard.util.cmd.setSlot.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'targets', type:CustomCommandParamType.EntitySelector},
            {name:'slotIndex', type:CustomCommandParamType.Integer},
        ],
    },
    {callback: Callback},
);