import {MC} from './CONST';

//export type CommandSourceType = 'world'|'block'|'entity'|'player';
//export type CommandSource = MC.Block|MC.Entity|MC.Player;


export default class ShardCommandContext {
    source: MC.Block|MC.Entity|MC.Player; // The original executor of the command (If using slash commands, wil be the same as target).
    sourceType: 'world'|'block'|'entity'|'player';
    target: MC.Block|MC.Entity|MC.Player; // The target executor of the command.
    targetType: 'world'|'block'|'entity'|'player';
    dimension: MC.Dimension; // Dimension.
    location: MC.Vector3; // Location.
    rotation: MC.Vector2; // Rotation.


    constructor(source:MC.Block|MC.Entity|MC.Player, sourceType:'world'|'block'|'entity'|'player', target:MC.Block|MC.Entity|MC.Player, targetType:'world'|'block'|'entity'|'player', dimension:MC.Dimension, location:MC.Vector3, rotation:MC.Vector2) {
        this.source = source;
        this.sourceType = sourceType;
        this.target = target;
        this.targetType = targetType;
        this.dimension = dimension;
        this.location = location;
        this.rotation = rotation;
    };


    /**Generate new context from an `Entity`, `Player`, or `Block`. */
    static generate = (from:MC.Block|MC.Entity|MC.Player) => {
        let source: MC.Block|MC.Entity|MC.Player;
        let sourceType;
        let target: MC.Block|MC.Entity|MC.Player;
        let targetType;
        let dimension: MC.Dimension|undefined;
        let location: MC.Vector3|undefined;
        let rotation: MC.Vector2|undefined;

        if (from instanceof MC.Player || from instanceof MC.Entity) {
            source = from;
            sourceType = 'entity';
            if (source.typeId == 'minecraft:player') {sourceType = 'player'};
            target = source;
            targetType = sourceType;
            dimension = source.dimension;
            location = source.location;
            rotation = source.getRotation();
        }
        else if (from instanceof MC.Block) {
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