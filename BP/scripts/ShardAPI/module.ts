import {system, world, RawMessage, CustomCommandOrigin, CustomCommandSource, CustomCommandResult} from '@minecraft/server';
import {Dictionary, CommandNamespace} from './CONST';
import ShardEventListener from './event_listener';
import * as ShardEventServer from './event_server';
import {ShardCommand, ShardCommandContext, ShardCommandResult} from './command';
import ShardForm from './form';
import {MCData} from './util';
import * as RawMessageParser from './raw_message_parser';


export const EventSources:Dictionary<any> = {
    'world': world,
    'system': system,
    'shard': ShardEventServer,
};
export const defaultPersisData:Dictionary<any> = {
    enabled: true,
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
    /**Features or other modules that this module depends on.*/
    dependencies?: {
        features?: Array<string>,
        modules?: Array<string>
    },
};


export interface ShardModuleData {
    init: ()=>void,
    eventListeners: Dictionary<ShardEventListener>,
    commands: Dictionary<ShardCommand>,
    commandEnums: Dictionary<Array<string>>,
    forms: Dictionary<ShardForm>,
    mainForm: ShardForm,
    extraDefaultPersisData?: Dictionary<any>,
};




export class ShardModule {
    /**Module details.*/
    readonly details: ShardModuleDetails;
    /**Called when the module is initialized.*/
    init: () => void;
    /**Event listeners.*/
    eventListeners: Dictionary<ShardEventListener>;
    /**Commands.*/
    commands: Dictionary<ShardCommand>;
    /**Command enums.*/
    commandEnums: Dictionary<Array<string>>;
    /**Forms.*/
    forms: Dictionary<ShardForm>;
    /**Main form for this module.*/
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
        this.eventListeners = data.eventListeners;
        this.commands = data.commands;
        this.commandEnums = data.commandEnums;
        this.forms = data.forms;
        this.mainForm = data.mainForm;

        this.sessionData = {};
        if (data.extraDefaultPersisData) {this.extraDefaultPersisData = data.extraDefaultPersisData}
        else {this.extraDefaultPersisData = {}};
        this.persisData = Object.assign({}, defaultPersisData);
        Object.assign(this.persisData, data.extraDefaultPersisData);
        this.persisDataReady = false;
        this.worldReady = false;

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
        Object.keys(this.eventListeners).forEach(key => {
            let listener = this.eventListeners[key];
            EventSources[listener.source][`${listener.type}Events`][listener.eventId].subscribe(this.eventListenerPassthrough.bind(this, listener));
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
            };
        });


        // Init.
        this.init();
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


    resetData():void {
        this.setData(Object.assign(Object.assign({},this.extraDefaultPersisData), defaultPersisData));
    };


    /**Save `persisData` using `MCData` API in `ShardAPI/util`*/
    saveData():void {
        MCData.set(this.details.id, this.persisData);
    };




    /**Passthrough for all event listeners of this module.*/
    eventListenerPassthrough(Listener:ShardEventListener, ...args) {
        if (this.persisData.enabled == false) {return};
        return Listener.callback(...args);
    };


    /**Passthrough for all slash commands of this module.*/
    slashCommandPassthrough(Command:ShardCommand, Origin:CustomCommandOrigin, ...args):CustomCommandResult|undefined {
        // Return error message if module disabled.
        if (this.persisData.enabled == false) {
            return {message:RawMessageParser.rawMessageToString({translate:'shard.misc.commandModuleDisabled', with:[this.details.id]}), status:1};
        };

        let context:ShardCommandContext

        if (Origin.sourceEntity) {context = ShardCommandContext.generate(Origin.sourceEntity)}
        else if (Origin.initiator) {context = ShardCommandContext.generate(Origin.initiator)}
        else if (Origin.sourceBlock) {context = ShardCommandContext.generate(Origin.sourceBlock)}
        else if (Origin.sourceType == CustomCommandSource.Server) {
            context = new ShardCommandContext(
                undefined,
                'world',
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
            );
        };

        let result:ShardCommandResult|undefined = Command.execute(context, args);

        // Modify result message to include module name.
        if (result !== undefined) {
            let resultMessage:RawMessage;
            // If result.message is a string, turn into raw-message.
            if (typeof result.message == 'string') {resultMessage = {text:result.message}}
            else {resultMessage = result.message};
            // Apply module display name then return message.
            const newMessage = {rawtext: [this.details.displayName, {text:' '}, resultMessage]};
            return {message:RawMessageParser.rawMessageToString(newMessage), status:result.status};
        };

        return undefined;
    };
};