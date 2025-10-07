// Copyright (c) 2025 PhosXD

import {system, world, RawMessage, CustomCommandOrigin, CustomCommandSource, CustomCommandResult} from '@minecraft/server';
import {Dictionary, CommandNamespace} from './CONST';
import {ShardListener} from './listener';
import * as ShardEventServer from './event_server';
import {ShardCommand, GenerateCommandContext, ShardCommandResult} from './command';
import {ShardForm, ShardFormElement} from './form';
import {MCData, Deepcopy} from './util';
import * as RawMessageParser from './raw_message_parser';


export const defaultSettingElements:Array<ShardFormElement> = [
    {type:'toggle', id:'enabled', data:{display:{translate:'shard.formCommon.isEnabled'}, defaultValue:true}},
];


export const EventSources:Dictionary<any> = {
    'world': world,
    'system': system,
    'shard': ShardEventServer,
};
export const defaultPersisData:Dictionary<any> = {
    settings: {},
    commandSettings: {},
};



/**Module details for initialization.*/
export interface ShardModuleDetails {
    /**Unique module ID.*/
    id: string,
    /**Module display name.*/
    displayName: RawMessage,
    /**Brief module description.*/
    brief: RawMessage,
    /**Full module description. Put things like examples & explanations here.*/
    description?: RawMessage,
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
    defaultProperties?: Dictionary<any>,
    extraDefaultPersisData?: Dictionary<any>,
    settingElements?: Array<ShardFormElement>,
    enabledByDefault?: boolean,
};




export class ShardModule {
    /**Module details.*/
    readonly details: ShardModuleDetails;
    /**Called when the module is initialized.*/
    init: () => void;
    enabledByDefault: boolean;
    /**Event listeners.*/
    listeners: Dictionary<ShardListener>;
    /**Commands.*/
    commands: Dictionary<ShardCommand>;
    /**Command enums.*/
    commandEnums: Dictionary<Array<string>>;
    /**Forms.*/
    forms: Dictionary<ShardForm>;
    defaultProperties: Dictionary<any>;
    /**
     * (Deprecated)
     * Additional default persistent data.
    */
    extraDefaultPersisData: Dictionary<any>;
    /**Module settings that are persistently saved.*/
    settingElements: Array<ShardFormElement>;

    /**
     * (Deprecated)
     * Arbitrary data for the module. Will be lost after restart.
    */
    sessionData: Dictionary<any>;
    /**
     * (Deprecated, use properties instead)
     * 
     * Arbitrary persistent data for the module.
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
        this.settingElements = [...defaultSettingElements];
        if (data.settingElements) {this.settingElements = this.settingElements.concat(data.settingElements)};

        // Module data.
        if (data.defaultProperties) {this.defaultProperties = Deepcopy(data.defaultProperties)}
        else {this.defaultProperties = {}};
        this.sessionData = {};
        if (data.extraDefaultPersisData) {this.extraDefaultPersisData = data.extraDefaultPersisData}
        else {this.extraDefaultPersisData = {}};
        this.persisData = Deepcopy(defaultPersisData);
        this.persisData = Object.assign(this.persisData, Deepcopy(this.extraDefaultPersisData));
        this.persisData.settings = this.getDefaultSettings();
        this.enabledByDefault = true;
        if (data.enabledByDefault == false) {
            (this.settingElements[0].data as any).defaultValue = false;
            this.enabledByDefault = false;
        };
        this.persisDataReady = false;
        this.worldReady = false;

        // Import children.
        (async () => {
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
        // Update properties.
        system.run(()=>{
            // persis
            let storedData = this.getData();
            if (storedData) {this.persisData = Object.assign(this.persisData, storedData)};
            this.persisDataReady = true;
            // prop
            Object.keys(this.defaultProperties).forEach(key => {
                const currentValue = this.getProperty(key);
                const newValue = this.defaultProperties[key];
                // Override current property if mismatched type.
                if (typeof currentValue !== typeof newValue) {
                    this.setProperty(key, newValue);
                };
            });
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
        this.persisData.settings.enabled = true;
        this.saveData();
    };


    /**Disable this module, prevents all child events & commands from running.*/
    disable(): void {
        this.persisData.settings.enabled = false;
        this.saveData();
    };


    /**Get persistent module property.*/
    getProperty(id): any {
        return MCData.get(`${this.details.id}:${id}`);
    };


    /**Get all persistent property IDs.*/
    getPropertyIds(): Array<string> {
        return world.getDynamicPropertyIds().filter(id => {
            return id.startsWith(`${this.details.id}:`);
        });
    };


    /**Set persistent module property. Set undefined to delete.*/
    setProperty(id, value:Dictionary<any>|undefined): any {
        return MCData.set(`${this.details.id}:${id}`, value);
    };


    /**Get persistent data saved in MC `world` dynamic properties.
     * (Deprecated)
    */
    getData(): Dictionary<any>|undefined {
        return MCData.get(this.details.id);
    };

    
    /**Set `persisData` then save it with `saveData`.
     * (Deprecated)
    */
    setData(data:Dictionary<any>): void {
        this.persisData = data;
        this.saveData();
    };


    /**Resets module persistent data to it's default state.
     * (Deprecated)
    */
    resetData(): void {
        let newData = Object.assign({}, Deepcopy(defaultPersisData));
        newData = Object.assign(newData, Deepcopy(this.extraDefaultPersisData));
        newData.settings = this.getDefaultSettings();
        newData.settings.enabled = this.enabledByDefault;
        // Add default command settings.
        for (const key in this.commands) {
            const command = this.commands[key];
            newData.commandSettings[command.details.id] = command.getDefaultSettings();
        };
        // Apply.
        this.setData(newData);
    };


    /**
     * Save `persisData` using `MCData` API in `ShardAPI/util`.
     * (Deprecated)
    */
    saveData(): void {
        MCData.set(this.details.id, this.persisData);
    };


    /**Get default settings for this module.*/
    getDefaultSettings(): Dictionary<any> {
        const settings = {};
        this.settingElements.forEach(element => {
            const elementData = element.data as Dictionary<any>;
            settings[element.id] = elementData.defaultValue;
        });
        return settings;
    };




    /**Passthrough for all event listeners of this module.*/
    listenerPassthrough(listener:ShardListener, ...args): void {
        if (!this.persisData.settings.enabled) {return};
        listener.callback(...args);
    };


    /**Passthrough for all slash commands of this module.*/
    slashCommandPassthrough(Command:ShardCommand, Origin:CustomCommandOrigin, ...args): CustomCommandResult|undefined {
        // Return error message if module disabled.
        if (!this.persisData.settings.enabled) {
            return {message:RawMessageParser.rawMessageToString({translate:'shard.misc.commandModuleDisabled', with:[this.details.id]}), status:1};
        };
        const commandSettings:Dictionary<any> = this.persisData.commandSettings[Command.details.id];
        // Return error message if command disabled.
        if (!commandSettings.enabled && !Command.details.important) {
            return {message:RawMessageParser.rawMessageToString({translate:'shard.misc.commandDisabled'}), status:1};
        };
        // If entity executed, check if it has any of the required tags.
        if (Origin.sourceEntity && !Command.details.important) {
            let hasTag:boolean = false;
            commandSettings.requiredTags.forEach(tag => {
                if (Origin.sourceEntity.hasTag(tag)) {hasTag = true};
            });
            if (!hasTag && commandSettings.requiredTags.length != 0) {
                return {message:RawMessageParser.rawMessageToString({translate:'shard.misc.missingPermission'}), status:1};
            };
        };

        // Generate context.
        let source;
        switch (Origin.sourceType) {
            case 'Entity': {
                source = Origin.sourceEntity;
                break;
            };
            case 'Block': {
                source = Origin.sourceBlock;
                break;
            };
            case 'NPCDialogue': {
                source = Origin.initiator;
                break;
            };
            case 'Server': {
                source = world;
                break;
            };
        };
        const context = GenerateCommandContext(source);
        // Run command
        const result = Command.execute(context, args);

        // Return command output.
        if (result) {
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