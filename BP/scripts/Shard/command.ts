import {CustomCommandParameter, CommandPermissionLevel, Dimension, RawMessage, Vector3, Vector2, CustomCommandStatus, Block, Entity, Player} from '@minecraft/server';
import {ShardFormElement} from './form';
import {Dictionary} from './CONST';


export const defaultSettingElements:Array<ShardFormElement> = [
    {type:'toggle', id:'enabled', data:{display:{translate:'shard.formCommon.isEnabled'}, defaultValue:true}},
    {type:'toggle', id:'showModuleTag', data:{display:{translate:'shard.misc.moduleCommandSetting.showModuleTag'}, defaultValue:true}},
    {type:'textArray', id:'requiredTags', data:{
        display: {translate:'shard.misc.moduleCommandSetting.requiredTags'},
        placeholder: {translate:'shard.misc.moduleCommandSetting.requiredTagsPlaceholder'},
        min: 0,
        max: 10,
        itemMin: 1,
        itemMax: 32,
        defaultValue: [],
    }},
];


/**Command callbacks must return this. Allows rawtext.*/
export interface ShardCommandResult {
    message?: RawMessage|string,
    status: CustomCommandStatus,
};


/**Command details for initialization.*/
export interface ShardCommandDetails {
    /**Unique command ID.*/
    id: string,
    /**Breif command description.*/
    brief: string,
    /**More detailed command description.*/
    description?: string,
    /**Optional parameters for the command.*/
    optionalParameters?: Array<CustomCommandParameter>,
    /**Required parameters for the command.*/
    mandatoryParameters?: Array<CustomCommandParameter>,
    /**Determines which actors the command is visible to.*/
    permissionLevel: CommandPermissionLevel,
    /**If true, command cannot be disabled.*/
    important?: boolean,
};


export interface ShardCommandData {
    callback: (context:ShardCommandContext, ...args) => ShardCommandResult|undefined,
    /**Form elements linked to command settings.*/
    settingElements?: Array<ShardFormElement>,
};



/**Class for command context.*/
export class ShardCommandContext {
    source: Block|Entity|Player; // The original executor of the command (If using slash commands, wil be the same as target).
    sourceEntity: Entity;
    sourceBlock: Block;
    sourceType: string;
    target: Block|Entity|Player; // The target executor of the command.
    targetType: 'world'|'block'|'entity'|'player';
    dimension: Dimension; // Dimension.
    location: Vector3; // Location.
    rotation: Vector2; // Rotation.


    constructor(source:Block|Entity|Player, sourceType:'world'|'block'|'entity'|'player', target:Block|Entity|Player, targetType:'world'|'block'|'entity'|'player', dimension:Dimension, location:Vector3, rotation:Vector2) {
        this.source = source;
        this.sourceType = sourceType;
        this.target = target;
        this.targetType = targetType;
        this.dimension = dimension;
        this.location = location;
        this.rotation = rotation;
    };


    /**Generate new context from an `Entity`, `Player`, or `Block`. */
    static generate = (from:Block|Entity|Player) => {
        let source: Block|Entity|Player;
        let sourceType;
        let target: Block|Entity|Player;
        let targetType;
        let dimension: Dimension|undefined;
        let location: Vector3|undefined;
        let rotation: Vector2|undefined;

        if (from instanceof Player || from instanceof Entity) {
            source = from;
            sourceType = 'entity';
            if (source.typeId == 'minecraft:player') {sourceType = 'player'};
            target = source;
            targetType = sourceType;
            dimension = source.dimension;
            location = source.location;
            rotation = source.getRotation();
        }
        else if (from instanceof Block) {
            source = from;
            sourceType = 'block';
            target = source;
            targetType = sourceType;
            dimension = source.dimension;
            location = source.location;
            rotation = {x:0,y:0};
        };

        return new ShardCommandContext(source, sourceType, target, targetType, dimension, location, rotation);
    };
};




/**Class for custom commands.*/
export class ShardCommand {
    /**Command's constant details.*/
    readonly details: ShardCommandDetails;
    /**Command settings that are persistently saved.*/
    settingElements: Array<ShardFormElement>;
    /**Called when the command is run.*/
    callback: (context:ShardCommandContext, ...args) => ShardCommandResult|undefined;


    /**Called when command is run without proper permissions.*/
    illegalCallback(context:ShardCommandContext, ...args): ShardCommandResult {
        return {message:{translate:'shard.misc.missingPermission'}, status:1};
    };


    constructor(details:ShardCommandDetails, data:ShardCommandData) {
        this.details = details;
        this.callback = data.callback;
        this.settingElements = [...defaultSettingElements];
        if (data.settingElements) {this.settingElements = this.settingElements.concat(data.settingElements)};
    };


    /**Executes the command.*/
    execute(context:ShardCommandContext, ...args): ShardCommandResult|undefined {
        return this.callback(context, ...args);
    };


    /**Get default settings for this command.*/
    getDefaultSettings():Dictionary<any> {
        const settings = {};
        this.settingElements.forEach(element => {
            const elementData = element.data as Dictionary<any>;
            // Apply default value if available.
            if (!elementData.defaultValue) {settings[element.id] = undefined}
            else {settings[element.id] = elementData.defaultValue};
        });
        return settings;
    };
};