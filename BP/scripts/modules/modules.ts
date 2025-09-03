import {ModuleNames, Dictionary} from '../Shard/CONST';
import {ShardModule} from '../Shard/module';


// Import modules then assign to `Modules`.
export var Modules:Dictionary<ShardModule> = {};
ModuleNames.forEach(name => {
    import(`./${name}/module`).then(module => {
        Modules[module.Module.details.id] = module.Module;
    });
});
