import {system, CommandPermissionLevel, CustomCommandParamType, Entity, Player, Vector3, RGBA} from '@minecraft/server';
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {RenderCuboid} from '../module';
import {LocationToString, FixVector3} from '../../../ShardAPI/util';
import {ParticleOptions} from '../module';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    const targets:Array<Entity> = Options[0];
    const location:Vector3 = Options[1];
    const color:RGBA = {red:Options[3].x, green:Options[3].y, blue:Options[3].z, alpha:Options[4]};
    const lifetime:number = Options[5];
    const particleOptions:ParticleOptions = {size_x_fade_in:Options[6], size_x_sustain:Options[7], size_x_fade_out:Options[8], size_y_fade_in:Options[9], size_y_sustain:Options[10], size_y_fade_out:Options[11], alpha_fade_in:Options[12], alpha_sustain:Options[13], alpha_fade_out:Options[14]};

    let count:number = 0;
    targets.forEach(entity => {
        if (entity.typeId !== 'minecraft:player') {return};
        count += 1;
        system.run(()=>{RenderCuboid(location, entity as Player, color, Options[2], particleOptions, lifetime)});
    });

    return {message:{translate:'shard.draw.cmd.drawcuboid.success', with:[LocationToString(FixVector3(location,2)), String(count)]}, status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'drawcuboid',
    'Renders a cuboid for the targets.',
    [
        {name:'targets', type:CustomCommandParamType.EntitySelector},
        {name:'location', type:CustomCommandParamType.Location},
        {name:'size', type:CustomCommandParamType.Location},
        {name:'colorRGB', type:CustomCommandParamType.Location},
        {name:'opacity', type:CustomCommandParamType.Float},
        {name:'lifetime', type:CustomCommandParamType.Float},
    ],
    [
        //{name:'sizeXFadeIn', type:MC.CustomCommandParamType.Float},
        //{name:'sizeXSustain', type:MC.CustomCommandParamType.Float},
        //{name:'sizeXFadeOut', type:MC.CustomCommandParamType.Float},
        //{name:'sizeYFadeIn', type:MC.CustomCommandParamType.Float},
        //{name:'sizeYSustain', type:MC.CustomCommandParamType.Float},
        //{name:'sizeYFadeOut', type:MC.CustomCommandParamType.Float},
        //{name:'alphaFadeIn', type:MC.CustomCommandParamType.Float},
        //{name:'alphaSustain', type:MC.CustomCommandParamType.Float},
        //{name:'alphaFadeOut', type:MC.CustomCommandParamType.Float},
    ],
    CommandPermissionLevel.GameDirectors,
    [],
    Callback,
);