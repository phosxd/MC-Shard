// Class for ShardCommands.
export default class ShardCommand {
    id: string;
    triggers: Array<string>;
    requiredTags: Array<string>;
    callback: Function;

    constructor(id:string, triggers:Array<string>, requiredTags:Array<string>, callback:Function) {
        this.id = id;
        this.triggers = triggers;
        this.requiredTags = requiredTags;
        this.callback = callback;
    };

    execute(ShardAPI) {
        this.callback();
    };
};