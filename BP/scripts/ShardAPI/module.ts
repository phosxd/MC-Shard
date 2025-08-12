import {MC, Dictionary, CommandNamespace} from './CONST';
import ShardEventListener from './event_listener';
import * as ShardEventServer from './event_server';
import ShardCommand from './command';
import ShardCommandContext from './command_context';
import ShardCommandResult from './command_result';
import ShardForm from './form';
import {MCData} from './util';
import * as RawMessageParser from './raw_message_parser';


const EventSources:Dictionary<any> = {
    'world': MC.world,
    'system': MC.system,
    'shard': ShardEventServer,
};
const defaultPersisData:Dictionary<any> = {
    enabled: true,
};




export default class ShardModule {
    /**Unique string identifier.*/
    readonly id: string;
    /**Module display name.*/
    displayName: MC.RawMessage;
    /**Brief module description.*/
    description: MC.RawMessage;
    /**Called when the module is initialized.*/
    init: () => void;
    eventListeners: Dictionary<ShardEventListener>;
    commands: Dictionary<ShardCommand>;
    forms: Dictionary<ShardForm>;
    /**Main form for the module.*/
    mainForm: ShardForm;
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


    constructor(id:string, displayName:MC.RawMessage, description:MC.RawMessage, init:()=>void, eventListeners:Dictionary<ShardEventListener>, commands:Dictionary<ShardCommand>, forms:Dictionary<ShardForm>, mainForm:ShardForm, extraDefaultPersisData:Dictionary<any>={}) {
        this.id = id;
        this.displayName = displayName;
        this.description = description;
        this.init = init;
        this.eventListeners = eventListeners;
        this.commands = commands;
        this.forms = forms;
        this.mainForm = mainForm;
        this.sessionData = {};
        this.persisData = defaultPersisData;
        Object.assign(this.persisData, extraDefaultPersisData);
        this.persisDataReady = false;
        this.worldReady = false;

        // Get persistent data in an "after" context.
        MC.system.run(()=>{
           let storedData = this.getData();
           if (storedData) {this.persisData = storedData};
           this.persisDataReady = true;
        });

        // Flag world as ready when ready.
        MC.world.afterEvents.worldLoad.subscribe(event => {
            this.worldReady = true;
        });

        // Register event listeners.
        Object.keys(this.eventListeners).forEach(key => {
            let listener = this.eventListeners[key];
            EventSources[listener.source][`${listener.type}Events`][listener.eventId].subscribe(this.eventListenerPassthrough.bind(this, listener));
        });


        // Register custom commands & their enums.
        MC.system.beforeEvents.startup.subscribe(event => {
            Object.keys(this.commands).forEach(key => {
                let command = this.commands[key];
                // Register enums.
                for (let key in command.registerEnums) {
                    let values:Array<string> = command.registerEnums[key];
                    if (values == undefined) {return};
                    event.customCommandRegistry.registerEnum(CommandNamespace+':'+key, values);
                };
                // Register command.
                event.customCommandRegistry.registerCommand({
                    name: CommandNamespace+':'+command.id,
                    description: command.description,
                    permissionLevel: command.permissionLevel,
                    mandatoryParameters: command.mandatoryParameters,
                    optionalParameters: command.optionalParameters,
                }, this.slashCommandPassthrough.bind(this, command));
            });
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
        return MCData.get(this.id);
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
        MCData.set(this.id, this.persisData);
    };




    /**Passthrough for all event listeners of this module.*/
    eventListenerPassthrough(Listener:ShardEventListener, ...args):void {
        if (this.persisData.enabled == false) {return};
        Listener.callback(...args);
    };


    /**Passthrough for all slash commands of this module.
     * 
     * Handles converting Slash Command parameters to Shard Command parameters.
    */
    slashCommandPassthrough(Command:ShardCommand, Origin:MC.CustomCommandOrigin, ...Options):MC.CustomCommandResult|undefined {
        // Return error message if module disabled.
        if (this.persisData.enabled == false) {
            return {message:RawMessageParser.rawMessageToString({translate:'shard.misc.commandModuleDisabled', with:[this.id]}), status:1};
        };

        let source: MC.Block|MC.Entity|MC.Player|undefined;
        let sourceType;
        let target: MC.Block|MC.Entity|MC.Player|undefined;
        let targetType;
        let dimension: MC.Dimension|undefined;
        let location: MC.Vector3|undefined;
        let rotation: MC.Vector2|undefined;

        if (Origin.sourceType == MC.CustomCommandSource.Entity) {
            source = Origin.sourceEntity;
            sourceType = ShardCommandContext.SourceTypes.entity;
            if (source.typeId == 'minecraft:player') {sourceType = ShardCommandContext.SourceTypes.player};
            target = source;
            targetType = sourceType;
            dimension = source.dimension;
            location = source.location;
            rotation = source.getRotation();
        }
        else if (Origin.sourceType == MC.CustomCommandSource.Block) {
            source = Origin.sourceBlock;
            sourceType = ShardCommandContext.SourceTypes.block;
            target = source;
            targetType = sourceType;
            dimension = source.dimension;
            location = source.location;
            rotation = {x:0,y:0};
        }
        else if (Origin.sourceType == MC.CustomCommandSource.NPCDialogue) {
            source = Origin.initiator;
            sourceType = ShardCommandContext.SourceTypes.entity;
            target = source;
            targetType = sourceType;
            dimension = source.dimension;
            location = source.location;
            rotation = source.getRotation();
        }
        else if (Origin.sourceType == MC.CustomCommandSource.Server) {
            source = undefined;
            sourceType = ShardCommandContext.SourceTypes.world;
            target = source;
            targetType = sourceType;
            dimension = undefined;
            location = undefined;
            rotation = undefined;
        };

        let context = new ShardCommandContext(source, sourceType, target, targetType, dimension, location, rotation);
        let result:ShardCommandResult|undefined = Command.execute(context, Options);

        // Modify result message to include module name.
        if (result !== undefined) {
            let resultMessage:MC.RawMessage;
            // If result.message is a string, turn into raw-message.
            if (typeof result.message == 'string') {resultMessage = {text:result.message}}
            else {resultMessage = result.message};
            // Apply module display name then return message.
            const newMessage = {rawtext: [this.displayName, {text:' '}, resultMessage]};
            return {message:RawMessageParser.rawMessageToString(newMessage), status:result.status};
        };

        return undefined;
    };
};