import {system, world, StructureSaveMode, Player, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {CloneInventory} from '../../../util/entity';
import {Module} from '../module';

const DummyTypeId = 'shard:inventory';
const StructureId = 'sh:inv.%.%';
const GlobalId = 'global';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const player:Player = context.sourcePlayer;
    const option:string = args[0];
    const id:string = args[1];
    const global:boolean = args[2];
    switch (option) {
        case 'save': {return saveInventory(player, id, global)};
        case 'load': {return loadInventory(player, id, global)};
        case 'delete': {return deleteInventory(player, id, global)};
        default: {return {message:{translate:'shard.error.invalidOption', with:[option]}, status:1}};
    };
};




function saveInventory(player:Player, id:string, global:boolean) {
    let holderId:string = player.id;
    if (global) {holderId = GlobalId};
    const structureId = StructureId
        .replace('%', holderId)
        .replace('%', id);
    system.run(()=>{
        // Create dummy entity to hold the inventory.
        const dummy = player.dimension.spawnEntity(DummyTypeId, player.location);
        dummy.addTag(structureId); // Add tag to identify this entity later.
        CloneInventory(player, dummy, true);
        // Create new structure to save the dummy in.
        world.structureManager.delete(structureId); // Delete previous structure if it exists.
        world.structureManager.createFromWorld(
            structureId, player.dimension, dummy.location, dummy.location,
            {includeBlocks:false, includeEntities:true, saveMode:StructureSaveMode.World},
        );
        // Remove dummy entity.
        dummy.remove();
        // Update cached IDs.
        if (!Module.persisData.inventoryIds[holderId]) {
            Module.persisData.inventoryIds[holderId] = [];
        };
        if (!Module.persisData.inventoryIds[holderId].includes(id)) {
            Module.persisData.inventoryIds[holderId].push(id);
            Module.saveData();
        };
    });
    // Return message.
    return {message:{translate:'shard.util.cmd.inventory.saveSuccess', with:[String(global), id]}, status:0};
};


function loadInventory(player:Player, id:string, global:boolean) {
    let holderId:string = player.id;
    let holderName:string = player.name
    if (global) {
        holderId = GlobalId;
        holderName = GlobalId;
    };
    const structureId = StructureId
        .replace('%', holderId)
        .replace('%', id);
    // Throw error if inventory does not exist.
    if (!Module.persisData.inventoryIds[holderId] || !Module.persisData.inventoryIds[holderId].includes(id)) {return {message:{translate:'shard.util.cmd.inventory.doesNotExist', with:[id, holderName]}, status:1}};
    system.run(()=>{
        // Place the saved structure.
        world.structureManager.place(
            structureId, player.dimension, player.location,
            {includeBlocks:false, includeEntities:true}
        );
        // Get dummy entity & clone inventory to player.
        const dummy = player.dimension.getEntities({tags:[structureId]})[0];
        CloneInventory(dummy, player, true);
        dummy.remove();
    });
    // Return message.
    return {message:{translate:'shard.util.cmd.inventory.loadSuccess', with:[String(global), id]}, status:0};
};


function deleteInventory(player:Player, id:string, global:boolean) {
    let holderId:string = player.id;
    let holderName:string = player.name
    if (global) {
        holderId = GlobalId;
        holderName = GlobalId;
    };
    const structureId = StructureId
        .replace('%', holderId)
        .replace('%', id);
    // Throw error if inventory does not exist.
    if (!Module.persisData.inventoryIds[holderId] || !Module.persisData.inventoryIds[holderId].includes(id)) {return {message:{translate:'shard.util.cmd.inventory.doesNotExist', with:[id, holderName]}, status:1}};
    system.run(()=>{
        // Delete the saved structure & cached ID.
        world.structureManager.delete(structureId);
        const index = Module.persisData.inventoryIds[holderId].indexOf(id);
        Module.persisData.inventoryIds[holderId] = Module.persisData.inventoryIds[holderId].filter(value=>{
            return value != id;
        });
    });
    // Return message.
    return {message:{translate:'shard.util.cmd.inventory.deleteSuccess', with:[id, holderName]}, status:0};
};




// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'inventory',
        brief: 'shard.util.cmd.inventory.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'sh:inventoryOption', type:CustomCommandParamType.Enum},
            {name:'id', type:CustomCommandParamType.String},
        ],
        optionalParameters: [
            {name:'global', type:CustomCommandParamType.Boolean},
        ],
    },
    {callback: Callback},
);