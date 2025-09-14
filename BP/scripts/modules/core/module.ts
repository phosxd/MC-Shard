import {system} from '@minecraft/server';
import {Dictionary} from '../../Shard/CONST';
import {ShardModule} from '../../Shard/module';
import CommandEnums from './commandEnums';


// Instantiate Module.
export const Module = new ShardModule(
    {
        id: 'core',
        displayName: {translate:'shard.core.displayName'},
        brief: {translate:'shard.core.brief'},
    },
    {
        childPaths: [
            'event/playerSpawn',
            'cmd/discord',
            'cmd/eval',
            'cmd/hcLoad',
            'cmd/hcPrintEntity',
            'cmd/module',
            'cmd/moduleDataLoad',
            'cmd/moduleDataPrint',
            'cmd/repeat',
            'cmd/shard',
            'cmd/shardMemory',
            'form/module',
            'form/moduleCommands',
            'form/moduleCommandSettings',
            'form/moduleSettings',
            'form/shard',
        ],
        commandEnums: CommandEnums,
        settingElements: [
            {type:'toggle', id:'sendWelcomeMessage', data:{display:'shard.core.setting.sendWelcomeMessage', defaultValue:true}},
        ],
    },
);