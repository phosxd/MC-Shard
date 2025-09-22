import {system, Entity, Vector3, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {LocationToString} from '../../../Shard/util';

const default_radius:number = 4; // TNT explosion radius.
const default_breakBlocks:boolean = true;
const default_causeFire:boolean = false;
const default_allowUnderwater:boolean = false;


function Callback(context:ShardCommandContext, args:Array<any>) {
    const location:Vector3 = args[0];
    let radius:number = args[1];
    let breakBlocks:boolean = args[2];
    let causeFire:boolean = args[3];
    let allowUnderwater:boolean = args[4];
    let source:Array<Entity> = args[5];
    // Set undefined parameters to default.
    if (radius == undefined) {radius = default_radius};
    if (breakBlocks == undefined) {breakBlocks = default_breakBlocks};
    if (causeFire == undefined) {causeFire = default_causeFire};
    if (allowUnderwater == undefined) {allowUnderwater = default_allowUnderwater};
    if (source == undefined) {source = []};

    // Create explosion.
    system.run(()=>{
        context.dimension.createExplosion(location, radius, {breaksBlocks:breakBlocks, causesFire:causeFire, allowUnderwater:allowUnderwater, source:source[0]});
    });

    return {message:{translate:'shard.util.cmd.explode.success', with:[LocationToString(location)]}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'explode',
        brief: 'shard.util.cmd.explode.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'location', type:CustomCommandParamType.Location},
        ],
        optionalParameters: [
            {name:'radius', type:CustomCommandParamType.Float},
            {name:'breakBlocks', type:CustomCommandParamType.Boolean},
            {name:'causeFire', type:CustomCommandParamType.Boolean},
            {name:'allowUnderwater', type:CustomCommandParamType.Boolean},
            {name:'source', type:CustomCommandParamType.EntitySelector},
        ],
    },
    {callback: Callback},
);