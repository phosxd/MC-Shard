import {ShardModule} from '../../Shard/module';

export const entityGroupTag:string = 'sh.clutter.groupped';
export const exclusionTag:string = 'sh.clutter.exclude';


// Instantiate Module.
export const Module = new ShardModule(
    {
        id: 'clutter',
        displayName: {translate:'shard.clutter.displayName'},
        brief: {translate:'shard.clutter.brief'},
        description: {translate:'shard.clutter.description'},
    },
    {
        enabledByDefault: false,
        childPaths: [
            'event/tick',
        ],
        settingElements: [
            {type:'numberBox', id:'groupRadius', data:{
                display: {translate:'shard.clutter.setting.groupRadius'},
                tooltip: 'shard.clutter.setting.groupRadiusTooltip',
                min:1, max:10,
                defaultValue: 2.5,
            }},
            {type:'slider', id:'threshold', data:{
                display: {translate:'shard.clutter.setting.threshold'},
                tooltip: 'shard.clutter.setting.thresholdTooltip',
                min:2, max:50,
                defaultValue: 7,
            }},
            {type:'slider', id:'countdown', data:{
                display: {translate:'shard.clutter.setting.countdown'},
                tooltip: 'shard.clutter.setting.countdownTooltip',
                min:0, max:60,
                defaultValue: 10,
            }},
            {type:'textBox', id:'countdownText', data:{
                display: {translate:'shard.clutter.setting.countdownText'},
                tooltip: 'shard.clutter.setting.countdownTextTooltip',
                placeholder: 'shard.clutter.setting.countdownTextPlaceholder',
                min:3, max:250,
                defaultValue: 'Removing entities: §7{time}s',
            }},
            {type:'divider', id:'div1', data:{}},
            {type:'toggle', id:'excludeNamed', data:{
                display: {translate:'shard.clutter.setting.excludeNamed'},
                tooltip: 'shard.clutter.setting.excludeNamedTooltip',
                defaultValue: false,
            }},
            {type:'toggle', id:'includeItems', data:{
                display: {translate:'shard.clutter.setting.includeItems'},
                tooltip: 'shard.clutter.setting.includeItemsTooltip',
                defaultValue: true,
            }},
            {type:'toggle', id:'includeProjectiles', data:{
                display: {translate:'shard.clutter.setting.includeProjectiles'},
                tooltip: 'shard.clutter.setting.includeProjectilesTooltip',
                defaultValue: true,
            }},
            {type:'toggle', id:'includePassiveMobs', data:{
                display: {translate:'shard.clutter.setting.includePassiveMobs'},
                tooltip: 'shard.clutter.setting.includePassiveMobsTooltip',
                defaultValue: false,
            }},
            {type:'toggle', id:'includeHostileMobs', data:{
                display: {translate:'shard.clutter.setting.includeHostileMobs'},
                tooltip: 'shard.clutter.setting.includeHostileMobsTooltip',
                defaultValue: false,
            }},
        ],
    },
);