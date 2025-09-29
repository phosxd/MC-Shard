import {world, Block, Vector3} from '@minecraft/server';
import {ShardModule} from '../../Shard/module';
import {ShortDimensionId} from '../../Shard/CONST';
import {StringifyVector} from '../../util/vector';
import {GetBlockNeighbors} from '../../util/block';

// Due to how memory intensive this module is, spoofed blocks are stored outside of the module data but instead in dedicated dyanmic properties.
export const DmkHeader:string = 'antixray:sb';
/**Get dedicated memory key. Used for dedicated dyanmic properties.*/
export function GetDmk(dimensionId:string, location:Vector3):string {
    return DmkHeader+':'+ShortDimensionId[dimensionId]+StringifyVector(location);
};

export const SpoofVolumeChunkSize = 16;
export const SpoofVolumeChunkSizeHalf = SpoofVolumeChunkSize/2;
/**Block used in place of spoofed blocks.*/
export const SpoofBlock = 'minecraft:purple_concrete';
/**
 * Blocks that can be spoofed.
 * Removing or changing order of items will cause spoofed blocks to become unrecoverable or switch types.
*/
export const ReplaceableBlocks = Object.freeze([
    'coal_ore',
    'copper_ore',
    'iron_ore',
    'gold_ore',
    'lapis_ore',
    'redstone_ore',
    'diamond_ore',
    'emerald_ore',
    'deepslate_coal_ore',
    'deepslate_copper_ore',
    'deepslate_iron_ore',
    'deepslate_gold_ore',
    'deepslate_lapis_ore',
    'deepslate_redstone_ore',
    'deepslate_diamond_ore',
    'deepslate_emerald_ore',
    'quartz_ore',
    'nether_gold_ore',
    'ancient_debris',
    'lit_redstone_ore',
    'lit_deepslate_redstone_ore',
    'raw_copper_block',
    'raw_iron_block',
    'raw_gold_block',
].map(value => {return 'minecraft:'+value}));
/**
 * Natural blocks that are common around ores & that are solid.
 * Used to determine if a replaceable block is exposed.
*/
export const SolidBlocks = Object.freeze(ReplaceableBlocks.concat([
    'bedrock',
    'dirt',
    'stone',
    'diorite',
    'granite',
    'andesite',
    'cobblestone',
    'deepslate',
    'cobbled_deepslate',
    'tuff',
    'gravel',
    'sand',
    'sandstone',
    'netherrack',
    'blackstone',
    'basalt',
    'magma',
].map(value => {return 'minecraft:'+value})).concat(SpoofBlock));


export function UnspoofBlock(block:Block, includeNeighbors:boolean=false) {
    // Get spoofed block at location.
    const key = GetDmk(block.dimension.id, block.location);
    const spoofedBlock = world.getDynamicProperty(key) as number;
    // Return if doesn't exist.
    if (spoofedBlock == undefined) {return};
    // Restore original block & remove spoofed block data.
    if (ReplaceableBlocks[spoofedBlock] != undefined) {block.setType(ReplaceableBlocks[spoofedBlock])};
    world.setDynamicProperty(key, undefined);

    // Run on neighbors.
    if (includeNeighbors) {
        GetBlockNeighbors(block).forEach(block => {
            if (!block) {return};
            if (block.typeId !== SpoofBlock) {return};
            UnspoofBlock(block, false);
        });
    };
};




// Instantiate Module.
export const Module = new ShardModule(
    {
        id: 'antixray',
        displayName: {translate:'shard.antixray.displayName'},
        brief: {translate:'shard.antixray.brief'},
        description: {translate:'shard.antixray.description'},
    },
    {
        enabledByDefault: false,
        childPaths: [
            'event/explosion',
            'event/playerBreakBlock',
            'event/tick',
            'cmd/forceSpoof',
            'cmd/unspoof',
            'cmd/wipeSpoofs',
        ],
        settingElements: [
            {type:'slider', id:'spoofDistance', data:{
                display: {translate:'shard.antixray.setting.spoofDistance'},
                tooltip: 'shard.antixray.setting.spoofDistance.tooltip',
                min:0, max:128, step:16,
                defaultValue: 48,
            }},
            {type:'numberBox', id:'spoofInterval', data:{
                display: {translate:'shard.antixray.setting.spoofInterval'},
                tooltip: 'shard.antixray.setting.spoofInterval.tooltip',
                min:1, max:100,
                defaultValue: 5,
            }},
        ],
    },
);