import {Dimension, Vector2, Vector3, Block, Entity, Player} from '@minecraft/server';

//export type CommandSourceType = 'world'|'block'|'entity'|'player';
//export type CommandSource = MC.Block|MC.Entity|MC.Player;


export default class ShardCommandContext {
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