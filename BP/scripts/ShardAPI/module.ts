import * as ShardAPI from './ShardAPI';
import ShardEvent from './event';
import ShardCommand from './command';
import ShardForm from './form';

export default class ShardModule {
    id: string;
    displayName: string;
    init: Function;
    events: Array<ShardEvent>;
    commands: Array<ShardCommand>;
    forms: Array<ShardForm>;

    constructor(id:string, displayName:string, init:Function, events:Array<ShardEvent>, commands:Array<ShardCommand>, forms:Array<ShardForm>) {
        this.id = id;
        this.displayName = displayName;
        this.init = init;
        this.events = events;
        this.commands = commands;
        this.forms = forms;
    };
};