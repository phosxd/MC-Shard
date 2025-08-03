import * as ShardAPI from './ShardAPI/ShardAPI';
import ShardModule from './ShardAPI/module';
import * as ModuleList from './modules/module_list';

// Import Modules.
// ---------------
function init() {
    ModuleList.List.forEach(shardModule => {
        shardModule.init();
    });
};