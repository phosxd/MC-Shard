import {ShardModule} from '../../Shard/module';


// Instantiate Module.
export const Module = new ShardModule(
    {
        id: 'util',
        displayName: {translate:'shard.util.displayName'},
        brief: {translate:'shard.util.brief'},
    },
    {
        childPaths: [
            'event/entityDie',
            'event/tick',
            'cmd/a',
            'cmd/c',
            'cmd/despawn',
            'cmd/drain',
            'cmd/dupe',
            'cmd/eat',
            'cmd/enflame',
            'cmd/explode',
            'cmd/freeze',
            'cmd/heal',
            'cmd/push',
        ],
        extraDefaultPersisData: {
            frozenEntities: {},
        },
    },
);
