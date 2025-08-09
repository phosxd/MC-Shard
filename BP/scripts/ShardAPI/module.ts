import {MC, Dictionary, CommandNamespace} from './CONST';
import ShardEventListener from './event_listener';
import ShardCommand from './command';
import ShardCommandContext from './command_context';
import ShardForm from './form';
import {MCData} from './util';

const defaultPersisData:Dictionary<any> = {
    enabled: true,
}
const commandDisabledMessage:string = '§cEnable the §e{module}§c module to use this command.';




export default class ShardModule {
    id: string;
    displayName: string; // How the module will appear in text.
    init: () => void; // Called when the module is initialized.
    eventListeners: Dictionary<ShardEventListener>;
    commands: Dictionary<ShardCommand>;
    forms: Dictionary<ShardForm>;
    mainForm: ShardForm; // Main form for this module.
    extraDefaultPersisData: Dictionary<any>;

    sessionData: Dictionary<any>; // Arbitrary data for the module.
    persisData: Dictionary<any>; // Arbitrary persistent data for the module.
    persisDataReady: boolean; // Determines whether or not persisData is ready to be accessed.


    constructor(id:string, displayName:string, init:()=>void, eventListeners:Dictionary<ShardEventListener>, commands:Dictionary<ShardCommand>, forms:Dictionary<ShardForm>, mainForm:ShardForm, extraDefaultPersisData:Dictionary<any>={}) {
        this.id = id;
        this.displayName = displayName;
        this.init = init;
        this.eventListeners = eventListeners;
        this.commands = commands;
        this.forms = forms;
        this.mainForm = mainForm;
        this.sessionData = {};
        this.persisData = defaultPersisData;
        Object.assign(this.persisData, extraDefaultPersisData);
        this.persisDataReady = false;

        // Get persistent data in an "after" context.
        MC.system.run(()=>{
           let storedData = this.getData();
           if (storedData) {this.persisData = storedData};
           this.persisDataReady = true;
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


    enable() {
        this.persisData.enabled = true;
    };


    disable() {
        this.persisData.enabled = false;
    };


    // Get persistent data.
    getData() {
        return MCData.get(this.id);
    };

    
    setData(data:Dictionary<any>) {
        this.persisData = data;
        MCData.set(this.id, data);
    };


    resetData() {
        this.setData(Object.assign(Object.assign({},this.extraDefaultPersisData), defaultPersisData));
    };


    // Save persistent data.
    saveData() {
        MCData.set(this.id, this.persisData);
    };


    // Passthrough for all slash commands of this module.
    // Handles converting Slash Command parameters to Shard Command parameters.
    slashCommandPassthrough(Command:ShardCommand, Origin:MC.CustomCommandOrigin, ...Options) {
        if (this.persisData.enabled == false) {
            return {message:commandDisabledMessage.replace('{module}',this.id), status:MC.CustomCommandStatus.Failure};
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
        let result = Command.execute(context, Options);

        // Modify result message to include module name.
        if (result !== undefined) {
            result.message = `${this.displayName} ${result.message}`;
        };
        return result;
    };
};