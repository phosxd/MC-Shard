import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';
import {LocationToString} from '../../../ShardAPI/util';

const default_radius:number = 4; // TNT explosion radius.
const default_breakBlocks:boolean = true;
const default_causeFire:boolean = false;
const default_allowUnderwater:boolean = false;




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    let location:MC.Vector3 = Options[0];
    let radius:number = Options[1];
    let breakBlocks:boolean = Options[2];
    let causeFire:boolean = Options[3];
    let allowUnderwater:boolean = Options[4];
    let source:Array<MC.Entity> = Options[5];
    let dimension = Context.target.dimension;
    // If no context target, set dimension to overworld.
    if (Context.targetType == ShardCommandContext.SourceTypes.world) {
        dimension = MC.world.getDimension('overworld');
    };
    // Set undefined parameters to default.
    if (radius == undefined) {radius = default_radius};
    if (breakBlocks == undefined) {breakBlocks = default_breakBlocks};
    if (causeFire == undefined) {causeFire = default_causeFire};
    if (allowUnderwater == undefined) {allowUnderwater = default_allowUnderwater};
    if (source == undefined) {source = []};

    // Create explosion.
    MC.system.run(()=>{
        Context.target.dimension.createExplosion(location, radius, {breaksBlocks:breakBlocks, causesFire:causeFire, allowUnderwater:allowUnderwater, source:source[0]});
    });

    return {message:{translate:'shard.util.cmd.explode.success', with:[LocationToString(location)]}, status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'explode',
    'Create an explosion.',
    [
        {name:'location', type:MC.CustomCommandParamType.Location},
    ],
    [
        {name:'radius', type:MC.CustomCommandParamType.Float},
        {name:'breakBlocks', type:MC.CustomCommandParamType.Boolean},
        {name:'causeFire', type:MC.CustomCommandParamType.Boolean},
        {name:'allowUnderwater', type:MC.CustomCommandParamType.Boolean},
        {name:'source', type:MC.CustomCommandParamType.EntitySelector},
    ],
    MC.CommandPermissionLevel.GameDirectors,
    [],
    Callback,
);