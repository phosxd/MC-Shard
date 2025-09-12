import {ShardModule} from '../../Shard/module';

export const BossbarEvent = 'shard:bossbar_range_3';
export const TextEvent = 'shard:text';


// Instantiate Module.
export const Module = new ShardModule(
    {
        id: 'display',
        displayName: {translate:'shard.display.displayName'},
        brief: {translate:'shard.display.brief'},
    },
    {
        childPaths: [
            'event/playerInteractWithEntity',
            'cmd/addDisplay',
            'form/edit',
        ],
    },
);
