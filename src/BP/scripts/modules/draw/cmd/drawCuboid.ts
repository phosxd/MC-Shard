import {system, CommandPermissionLevel, CustomCommandParamType, Entity, Player, Vector3, RGBA} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {RenderCuboid} from '../module';
import {StringifyVector, RoundVector} from '../../../util/vector';
import {ParticleOptions} from '../module';


function Callback(_context:ShardCommandContext, args:Array<any>) {
    const targets:Array<Entity> = args[0];
    const location:Vector3 = args[1];
    const size:Vector3 = args[2];
    const color:RGBA = {red:args[3].x, green:args[3].y, blue:args[3].z, alpha:args[4]};
    const lifetime:number = args[5];
    const rawParticleOptions:string = args[6];
    let particleOptions:ParticleOptions = {};
    if (rawParticleOptions) {particleOptions = JSON.parse(rawParticleOptions)};

    let count:number = 0;
    targets.forEach(entity => {
        if (entity.typeId !== 'minecraft:player') {return};
        count += 1;
        system.run(()=>{RenderCuboid(location, entity as Player, color, size, particleOptions, lifetime)});
    });

    return {message:{translate:'shard.draw.cmd.drawCuboid.success', with:[StringifyVector(RoundVector(location)), String(count)]}, status:0};
};




// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'drawcuboid',
        brief: 'shard.draw.cmd.drawCuboid.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'targets', type:CustomCommandParamType.EntitySelector},
            {name:'location', type:CustomCommandParamType.Location},
            {name:'size', type:CustomCommandParamType.Location},
            {name:'colorRGB', type:CustomCommandParamType.Location},
            {name:'opacity', type:CustomCommandParamType.Float},
            {name:'lifetime', type:CustomCommandParamType.Float},
        ],
        optionalParameters: [
            {name:'options', type:CustomCommandParamType.String},
        ],
    },
    {callback: Callback},
);