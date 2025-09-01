import {CustomCommandParameter, CommandPermissionLevel, Dimension, RawMessage, Vector3, Vector2, CustomCommandStatus, Block, Entity, Player} from '@minecraft/server';
import {Dictionary} from './CONST';
import {CompareCommandPermissionLevel} from './util';


/**Command callbacks must return this. Allows rawtext.*/
export interface ShardCommandResult {
    message?: RawMessage|string,
    status: CustomCommandStatus,
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
    id: string;
    description: string;
    mandatoryParameters: Array<CustomCommandParameter>;
    optionalParameters: Array<CustomCommandParameter>;
    permissionLevel: CommandPermissionLevel;
    requiredTags: Array<string>;
    callback: (Context:ShardCommandContext, Options) => ShardCommandResult|undefined;
    registerEnums:Dictionary<Array<string>>;


    /**Called when command is run without proper permissions.*/
    illegal_callback(context:ShardCommandContext, options:Array<any>): ShardCommandResult {
        return {message:{translate:'shard.misc.missingPermission'}, status:1};
    };


    constructor(id:string, description:string, mandatoryParameters:Array<CustomCommandParameter>, optionalParameters:Array<CustomCommandParameter>, permissionLevel:CommandPermissionLevel, requiredTags:Array<string>, callback:(Context:ShardCommandContext, Options) => ShardCommandResult|undefined, registerEnums?:Dictionary<Array<string>>) {
        this.id = id;
        this.description = description;
        this.mandatoryParameters = mandatoryParameters;
        this.optionalParameters = optionalParameters;
        this.permissionLevel = permissionLevel;
        this.requiredTags = requiredTags;
        this.callback = callback;
        this.registerEnums = registerEnums;
    };


    /**Executes the command after checking player permissions.*/
    execute(context:ShardCommandContext, options:Array<any>): ShardCommandResult|undefined {
        return this.callback(context, options);
    };
};