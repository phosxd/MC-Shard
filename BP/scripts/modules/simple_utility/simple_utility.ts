export default Module;
import {ShardEvent, ShardModule} from '../module_list';

const ID:string = 'simple_utility';
const DisplayName:string = 'Simple Utility';

function Init() {
    console.warn('simple utility init');
};

const Events = 

var Module:ShardModule = new ShardModule(
    ID,
    DisplayName,
    Init,
    Events,
    Commands,
    Forms,
);
