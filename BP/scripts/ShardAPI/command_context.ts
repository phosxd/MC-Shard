import {MC} from './CONST';
enum SourceTypes {
    world = 'world',
    block = 'block',
    entity = 'entity',
    player = 'player',
};


export default class ShardCommandContext {
    static SourceTypes = SourceTypes;
    source: MC.Block|MC.Entity|MC.Player|undefined;
    sourceType: SourceTypes;
    target: MC.Block|MC.Entity|MC.Player|undefined;
    targetType: SourceTypes;
    dimension: MC.Dimension;
    location: MC.Vector3;
    rotation: MC.Vector2;


    constructor(source:MC.Block|MC.Entity|MC.Player|undefined, sourceType:SourceTypes, target:MC.Block|MC.Entity|MC.Player|undefined, targetType:SourceTypes, dimension:MC.Dimension, location:MC.Vector3, rotation:MC.Vector2) {
        this.source = source;
        this.sourceType = sourceType;
        this.target = target;
        this.targetType = targetType;
        this.dimension = dimension;
        this.location = location;
        this.rotation = rotation;
    }
};