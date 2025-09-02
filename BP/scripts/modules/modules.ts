import {ModuleNames, Dictionary} from '../ShardAPI/CONST';
import ShardModule from '../ShardAPI/module';


// Import modules then assign to `Modules`.
export var Modules:Dictionary<ShardModule> = {};
ModuleNames.forEach(name => {
    import(`./${name}/module`).then(module => {
        Modules[module.Module.details.id] = module.Module;
    });
});
