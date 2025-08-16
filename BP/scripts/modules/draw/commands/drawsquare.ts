import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {MC} from '../../../ShardAPI/CONST';
import {RenderSquare} from '../module';
import {LocationToString, FixVector3} from '../../../ShardAPI/util';
import {ParticleOptions} from '../module';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    const targets:Array<MC.Entity> = Options[0];
    const location:MC.Vector3 = Options[1];
    const direction:string = Options[4];
    const color:MC.RGBA = {red:Options[5].x, green:Options[5].y, blue:Options[5].z, alpha:Options[6]};
    const lifetime:number = Options[7];
    const particleOptions:ParticleOptions = {size_x_fade_in:Options[8], size_x_sustain:Options[9], size_x_fade_out:Options[10], size_x:Options[2], size_y_fade_in:Options[11], size_y_sustain:Options[12], size_y_fade_out:Options[13], size_y:Options[3], alpha_fade_in:Options[14], alpha_sustain:Options[15], alpha_fade_out:Options[16]};

    let count:number = 0;
    targets.forEach(entity => {
        if (entity.typeId !== 'minecraft:player') {return};
        count += 1;
        MC.system.run(()=>{RenderSquare(location, entity as MC.Player, color, direction as 'north'|'east'|'south'|'west'|'up'|'down', particleOptions, lifetime)});
    });

    return {message:{translate:'shard.draw.cmd.drawsquare.success', with:[LocationToString(FixVector3(location,2)), String(count)]}, status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'drawsquare',
    'Renders a square for the targets.',
    [
        {name:'targets', type:MC.CustomCommandParamType.EntitySelector},
        {name:'location', type:MC.CustomCommandParamType.Location},
        {name:'sizeX', type:MC.CustomCommandParamType.Float},
        {name:'sizeY', type:MC.CustomCommandParamType.Float},
        {name:'sh:facingDirection', type:MC.CustomCommandParamType.Enum},
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
    {
        'facingDirection': [
            'north',
            'east',
            'south',
            'west',
            'up',
            'down',
        ],
    },
);