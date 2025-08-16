import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';
import {RenderCuboid} from '../module';
import {LocationToString, FixVector3} from '../../../ShardAPI/util';
import {ParticleOptions} from '../module';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    const targets:Array<MC.Entity> = Options[0];
    const location:MC.Vector3 = Options[1];
    const color:MC.RGBA = {red:Options[3].x, green:Options[3].y, blue:Options[3].z, alpha:Options[4]};
    const lifetime:number = Options[5];
    const particleOptions:ParticleOptions = {size_x_fade_in:Options[6], size_x_sustain:Options[7], size_x_fade_out:Options[8], size_y_fade_in:Options[9], size_y_sustain:Options[10], size_y_fade_out:Options[11], alpha_fade_in:Options[12], alpha_sustain:Options[13], alpha_fade_out:Options[14]};

    let count:number = 0;
    targets.forEach(entity => {
        if (entity.typeId !== 'minecraft:player') {return};
        count += 1;
        MC.system.run(()=>{RenderCuboid(location, entity as MC.Player, color, Options[2], particleOptions, lifetime)});
    });

    return {message:{translate:'shard.draw.cmd.drawcuboid.success', with:[LocationToString(FixVector3(location,2)), String(count)]}, status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'drawcuboid',
    'Renders a cuboid for the targets.',
    [
        {name:'targets', type:MC.CustomCommandParamType.EntitySelector},
        {name:'location', type:MC.CustomCommandParamType.Location},
        {name:'size', type:MC.CustomCommandParamType.Location},
        {name:'colorRGB', type:MC.CustomCommandParamType.Location},
        {name:'opacity', type:MC.CustomCommandParamType.Float},
        {name:'lifetime', type:MC.CustomCommandParamType.Float},
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
    MC.CommandPermissionLevel.GameDirectors,
    [],
    Callback,
);