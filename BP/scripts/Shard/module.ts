import {system, world, RawMessage, CustomCommandOrigin, CustomCommandSource, CustomCommandResult} from '@minecraft/server';
import {Dictionary, CommandNamespace} from './CONST';
import {ShardListener} from './listener';
import * as ShardEventServer from './event_server';
import {ShardCommand, ShardCommandContext, ShardCommandResult} from './command';
import {ShardForm} from './form';
import {MCData} from './util';
import * as RawMessageParser from './raw_message_parser';


export const EventSources:Dictionary<any> = {
    'world': world,
    'system': system,
    'shard': ShardEventServer,
};
export const defaultPersisData:Dictionary<any> = {
    enabled: true,
    commandSettings: {}
};



/**Module details for initialization.*/
export interface ShardModuleDetails {
    /**Unique module ID.*/
    id: string,
    /**Module display name.*/
    displayName: RawMessage,
    /**Brief module description.*/
    brief: RawMessage,
    /**Features or other modules that this module depends on.*/
    dependencies?: {
        features?: Array<string>,
        modules?: Array<string>
    },
};


export interface ShardModuleData {
    init?: ()=>void,
    childPaths: Array<string>,
    commandEnums?: Dictionary<Array<string>>,
    mainForm?: ShardForm,
    extraDefaultPersisData?: Dictionary<any>,
};




export class ShardModule {
    /**Module details.*/
    readonly details: ShardModuleDetails;
    /**Called when the module is initialized.*/
    init: () => void;
    /**Event listeners.*/
    listeners: Dictionary<ShardListener>;
    /**Commands.*/
    commands: Dictionary<ShardCommand>;
    /**Command enums.*/
    commandEnums: Dictionary<Array<string>>;
    /**Forms.*/
    forms: Dictionary<ShardForm>;
    /**Main form for this module. Can be undefined.*/
    mainForm: ShardForm;
    /**Additional default persistent data.*/
    extraDefaultPersisData: Dictionary<any>;

    /**Arbitrary data for the module. Will be lost after restart.*/
    sessionData: Dictionary<any>;
    /**Arbitrary persistent data for the module.
     * 
     * Use `saveData` to save this to MC `world` dynamic properties.
    */
    persisData: Dictionary<any>;
    /**Determines whether or not `persisData` is ready to be accessed.*/
    persisDataReady: boolean;
    /** Determines whether or not `world` from `@minecraft/server` is ready to be accessed.
     * 
     * Feature is not fully implemented, do not rely on this.
    */
    worldReady: boolean 


    constructor(details:ShardModuleDetails, data:ShardModuleData) {
        this.details = details;
        this.init = data.init;
        if (data.commandEnums) {this.commandEnums = data.commandEnums}
        else {this.commandEnums = {}};
        this.mainForm = data.mainForm;

        this.sessionData = {};
        if (data.extraDefaultPersisData) {this.extraDefaultPersisData = data.extraDefaultPersisData}
        else {this.extraDefaultPersisData = {}};
        this.persisData = Object.assign({}, defaultPersisData);
        Object.assign(this.persisData, this.extraDefaultPersisData);
        this.persisDataReady = false;
        this.worldReady = false;

        (async () => {
            // Import children.
            this.listeners = {};
            this.commands = {};
            this.forms = {};
            let promises = [];
            if (data.childPaths) {
                data.childPaths.forEach(path => {
                    promises.push(import(`../modules/${this.details.id}/${path}`).then(file => {
                        const child = file.MAIN;
                        if (!child) {
                            console.warn(`§cModule "${this.details.id}" child "${path}" does not export a "MAIN" object. Skipping initialization.`);
                            return;
                        };
                        if (child instanceof ShardListener) {this.listeners[child.details.eventId] = child}
                        else if (child instanceof ShardCommand) {this.commands[child.details.id] = child}
                        else if (child instanceof ShardForm) {this.forms[child.details.id] = child};
                    }));
                });
            };

            // Wait for all children to be imported.
            await Promise.all(promises);
            // Continue with the rest of module init.
            this.afterChildImports();
        })();
    };


    /**Runs after children are imported.*/
    afterChildImports() {
        // Get persistent data in an "after" context.
        system.run(()=>{
           let storedData = this.getData();
           if (storedData) {this.persisData = storedData};
           this.persisDataReady = true;
        });

        // Flag world as ready when ready.
        world.afterEvents.worldLoad.subscribe(event => {
            this.worldReady = true;
        });

        // Register event listeners.
        Object.keys(this.listeners).forEach(key => {
            let listener = this.listeners[key];
            EventSources[listener.details.source][`${listener.details.type}Events`][listener.details.eventId].subscribe(this.listenerPassthrough.bind(this, listener));
        });


        // Register custom commands & custom enums.
        system.beforeEvents.startup.subscribe(event => {
            // Register enums.
            for (const key in this.commandEnums) {
                const values:Array<string> = this.commandEnums[key];
                event.customCommandRegistry.registerEnum(CommandNamespace+':'+key, values);
            };
            // Register commands.
            for (const key in this.commands) {
                const command:ShardCommand = this.commands[key];
                event.customCommandRegistry.registerCommand({
                    name: CommandNamespace+':'+command.details.id,
                    description: command.details.brief,
                    permissionLevel: command.details.permissionLevel,
                    mandatoryParameters: command.details.mandatoryParameters,
                    optionalParameters: command.details.optionalParameters,
                }, this.slashCommandPassthrough.bind(this, command));
                // Update settings after `persisData` initialization.
                const settings = command.getDefaultSettings();
                system.run(()=>{
                    // Add any previously saved data.
                    const previousData = this.persisData.commandSettings[command.details.id];
                    if (previousData) {
                        Object.assign(settings, previousData);
                    };
                    // Set new data.
                    this.persisData.commandSettings[command.details.id] = settings;
                    this.saveData();
                });
            };
        });


        // Module custom init.
        if (this.init) {this.init()};
    };




    /**Enable this module, allowing all child events & commands to run.*/
    enable() {
        this.persisData.enabled = true;
    };


    /**Disable this module, prevents all child events & commands from running.*/
    disable(): void {
        this.persisData.enabled = false;
    };


    /**Get persistent data saved in MC `world` dynamic properties.*/
    getData():Dictionary<any>|undefined {
        return MCData.get(this.details.id);
    };

    
    /**Set `persisData` then save it with `saveData`.*/
    setData(data:Dictionary<any>):void {
        this.persisData = data;
        this.saveData()
    };


    /**Resets module persistent data to it's default state.*/
    resetData():void {
        const newData = Object.assign(Object.assign({},this.extraDefaultPersisData), defaultPersisData);
        // Add default command setting.
        for (const key in this.commands) {
            const command = this.commands[key];
            newData.commandSettings[command.details.id] = command.getDefaultSettings();
        };
        // Apply.
        this.setData(newData);
    };


    /**Save `persisData` using `MCData` API in `ShardAPI/util`*/
    saveData():void {
        MCData.set(this.details.id, this.persisData);
    };




    /**Passthrough for all event listeners of this module.*/
    listenerPassthrough(listener:ShardListener, ...args) {
        if (this.persisData.enabled == false) {return};
        return listener.callback(...args);
    };


    /**Passthrough for all slash commands of this module.*/
    slashCommandPassthrough(Command:ShardCommand, Origin:CustomCommandOrigin, ...args):CustomCommandResult|undefined {
        // Return error message if module disabled.
        if (this.persisData.enabled == false) {
            return {message:RawMessageParser.rawMessageToString({translate:'shard.misc.commandModuleDisabled', with:[this.details.id]}), status:1};
        };
        const commandSettings:Dictionary<any> = this.persisData.commandSettings[Command.details.id];
        // Return error message if command disabled.
        if (commandSettings.enabled == false && !Command.details.important) {
            return {message:RawMessageParser.rawMessageToString({translate:'shard.misc.commandDisabled'}), status:1};
        };
        // If entity executed, check if it has any of the required tags.
        if (Origin.sourceEntity && !Command.details.important) {
            let hasTag:boolean = false;
            commandSettings.requiredTags.forEach(tag => {
                if (Origin.sourceEntity.hasTag(tag)) {hasTag = true};
            });
            if (!hasTag && commandSettings.requiredTags.length > 0) {
                return {message:RawMessageParser.rawMessageToString({translate:'shard.misc.missingPermission'}), status:1};
            };
        };

        // Generate context.
        let context:ShardCommandContext
        if (Origin.sourceEntity) {context = ShardCommandContext.generate(Origin.sourceEntity)}
        else if (Origin.initiator) {context = ShardCommandContext.generate(Origin.initiator)}
        else if (Origin.sourceBlock) {context = ShardCommandContext.generate(Origin.sourceBlock)}
        else if (Origin.sourceType == CustomCommandSource.Server) {context = new ShardCommandContext(undefined,'world',undefined,undefined,undefined,undefined,undefined)};

        let result:ShardCommandResult|undefined = Command.execute(context, args);

        // Return command output.
        if (result !== undefined) {
            let resultMessage:RawMessage;
            // If result.message is a string, turn into raw-message.
            if (typeof result.message == 'string') {resultMessage = {text:result.message}}
            else {resultMessage = result.message};
            // Add module tag then return message.
            let newMessage = resultMessage;
            if (commandSettings.showModuleTag) {newMessage = {rawtext: [this.details.displayName, {text:' '}, resultMessage]}};
            return {message:RawMessageParser.rawMessageToString(newMessage), status:result.status};
        };

        return undefined;
    };
};