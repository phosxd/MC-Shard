import {CustomCommandParameter, CommandPermissionLevel, Dimension, RawMessage, Vector3, Vector2, CustomCommandStatus, Block, Entity, Player} from '@minecraft/server';
import {Dictionary} from './CONST';
import {CompareCommandPermissionLevel} from './util';


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
};


export interface ShardCommandData {
    callback: (context:ShardCommandContext, ...args) => ShardCommandResult|undefined,
    settings?: Array<ShardCommandSetting>,
};


/**Command setting parameter.*/
export interface ShardCommandSetting {
    /**ID for this setting.*/
    id: string,
    /**Displayed setting name.*/
    displayName: string,
    /**Breif description of the setting.*/
    brief?: string,
    /**Setting type.*/
    type: 'boolean'|'slider'|'integer'|'float'|'string'|'enum',
    boolean?: {
        defaultValue: boolean,
    },
    slider?: {
        min: number,
        max: number,
        /**Should not be smaller than 1/100 of `max`, otherwise UI may break.*/
        step: number,
        defaultValue: number,
    },
    integer?: {
        defaultValue: number,
    },
    float?: {
        defaultValue: number,
    },
    string?: {
        min: number,
        max: number,
        /**How the string is expected to be formatted.*/
        type?: 'any'|'ascii',
        defaultValue: string,
    },
    enum?: {
        options: Array<string>,
        defaultValue: number,
    },
};



/**Class for command context.*/
export class ShardCommandContext {
    source: Block|Entity|Player; // The original executor of the command (If using slash commands, wil be the same as target).
    sourceType: 'world'|'block'|'entity'|'player';
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
    settings: Array<ShardCommandSetting>;
    /**Called when the command is run.*/
    callback: (context:ShardCommandContext, ...args) => ShardCommandResult|undefined;


    /**Called when command is run without proper permissions.*/
    illegalCallback(context:ShardCommandContext, ...args): ShardCommandResult {
        return {message:{translate:'shard.misc.missingPermission'}, status:1};
    };


    constructor(details:ShardCommandDetails, data:ShardCommandData) {
        this.details = details;
        this.callback = data.callback;
        if (data.settings) {this.settings = data.settings}
        else {this.settings = []};
    };


    /**Executes the command after checking player permissions.*/
    execute(context:ShardCommandContext, ...args): ShardCommandResult|undefined {
        return this.callback(context, ...args);
    };
};