import {system,world, Dimension, Entity, ItemStack, Vector2, Vector3, ItemLockMode, Enchantment, EnchantmentType} from '@minecraft/server';
import {Dictionary} from '../../Shard/CONST';
import {ShardModule} from '../../Shard/module';
import {ItemStackToObject, ObjectToItemStack, ItemStackObject} from '../../util/item';
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
            'form/module_command_settings',
            'form/module_commands',
            'form/module',
            'form/shard',
        ],
        commandEnums: CommandEnums,
        //mainForm: mainForm.MAIN,
    },
);