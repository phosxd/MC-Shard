import {ShardModule} from '../../Shard/module';


/**Currently partying players.*/
export var partying:Array<string> = [];


// Instantiate Module.
export const Module = new ShardModule(
    {
        id: 'fun',
        displayName: {translate:'shard.fun.displayName'},
        brief: {translate:'shard.fun.brief'},
    },
    {
        childPaths: [
            'cmd/crash',
            'cmd/party',
        ],
    },
);