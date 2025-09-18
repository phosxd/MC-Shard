import {Vector3} from '@minecraft/server';
import {ShardModule} from '../../Shard/module';
import {StringifyVector3} from '../../Shard/util';

export const ShortDimensionId = {
    'minecraft:overworld': 'o',
    'minecraft:nether': 'n',
    'minecraft:the_end': 'e',
};
// Due to how memory intensive this module is, spoofed blocks are stored outside of the module data but instead in dedicated dyanmic properties.
export const DmkHeader:string = 'antixray:sb';
/**Get dedicated memory key. Used for dedicated dyanmic properties.*/
export function GetDmk(dimensionId:string, location:Vector3):string {
    return DmkHeader+':'+ShortDimensionId[dimensionId]+StringifyVector3(location);
};

/**
 * Determines the cost of operations for iterations in a spoof job.
*/
export const TickCosts = {
    base: 0.05,
    checkExists: 0.1,
    checkType: 0.25,
    full: 1,
};

export const SpoofBlock = 'minecraft:purple_concrete';
/**Blocks to spoof.*/
export const ReplaceableBlocks:Array<string> = [
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
].map(value => {return 'minecraft:'+value});
/**Natural blocks that are common around ores & that are solid.*/
export const SolidBlocks:Array<string> = ReplaceableBlocks.concat([
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
].map(value => {return 'minecraft:'+value})).concat(SpoofBlock);


// Instantiate Module.
export const Module = new ShardModule(
    {
        id: 'antixray',
        displayName: {translate:'shard.antixray.displayName'},
        brief: {translate:'shard.antixray.brief'},
    },
    {
        enabledByDefault: false,
        childPaths: [
            'event/playerBreakBlock',
            'event/tick',
            'cmd/unspoof',
            'cmd/wipeDm',
        ],
        settingElements: [
            {type:'label', id:'warning', data:{display:{translate:'shard.antixray.warning'}}},
            {type:'divider', id:'warningDiv', data:{}},
            {type:'numberBox', id:'spoofRadius', data:{
                display: {translate:'shard.antixray.setting.spoofRadius'},
                tooltip: 'shard.antixray.setting.spoofRadius.tooltip',
                min:0, max:200,
                defaultValue: 25,
            }},
            {type:'numberBox', id:'spoofInterval', data:{
                display: {translate:'shard.antixray.setting.spoofInterval'},
                tooltip: 'shard.antixray.setting.spoofInterval.tooltip',
                min:1, max:100,
                defaultValue: 5,
            }},
            {type:'slider', id:'spoofSpeed', data:{
                display: {translate:'shard.antixray.setting.spoofSpeed'},
                tooltip: 'shard.antixray.setting.spoofSpeed.tooltip',
                min:1, max:40,
                defaultValue: 15,
            }},
        ],
    },
);