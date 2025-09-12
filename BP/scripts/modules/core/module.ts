import {system} from '@minecraft/server';
import {Dictionary} from '../../Shard/CONST';
import {ShardModule} from '../../Shard/module';
import CommandEnums from './commandEnums';
//import * as mainForm from './forms/main';


export var Modules:Dictionary<ShardModule>;
// Import modules after they have all initialized.
system.runTimeout(()=>{
    import('../modules').then(modules => {
        Modules = modules.Modules;
    });
},10);


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
        //mainForm: mainForm.MAIN,
        settingElements: [
            {type:'toggle', id:'sendWelcomeMessage', data:{display:'shard.core.setting.sendWelcomeMessage', defaultValue:true}},
        ],
    },
);