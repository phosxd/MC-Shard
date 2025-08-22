import {system, CommandPermissionLevel, CustomCommandParamType, Entity, Player, Vector3, RGBA} from '@minecraft/server';
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {RenderSquare} from '../module';
import {LocationToString, FixVector3} from '../../../ShardAPI/util';
import {ParticleOptions} from '../module';




function Callback(Context:ShardCommandContext, Options:Array<any>) {
    const targets:Array<Entity> = Options[0];
    const location:Vector3 = Options[1];
    const direction:string = Options[4];
    const color:RGBA = {red:Options[5].x, green:Options[5].y, blue:Options[5].z, alpha:Options[6]};
    const lifetime:number = Options[7];
    const particleOptions:ParticleOptions = {size_x_fade_in:Options[8], size_x_sustain:Options[9], size_x_fade_out:Options[10], size_x:Options[2], size_y_fade_in:Options[11], size_y_sustain:Options[12], size_y_fade_out:Options[13], size_y:Options[3], alpha_fade_in:Options[14], alpha_sustain:Options[15], alpha_fade_out:Options[16]};

    let count:number = 0;
    targets.forEach(entity => {
        if (entity.typeId !== 'minecraft:player') {return};
        count += 1;
        system.run(()=>{RenderSquare(location, entity as Player, color, direction as 'north'|'east'|'south'|'west'|'up'|'down', particleOptions, lifetime)});
    });

    return {message:{translate:'shard.draw.cmd.drawsquare.success', with:[LocationToString(location), String(count)]}, status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'drawsquare',
    'Renders a square for the targets.',
    [
        {name:'targets', type:CustomCommandParamType.EntitySelector},
        {name:'location', type:CustomCommandParamType.Location},
        {name:'sizeX', type:CustomCommandParamType.Float},
        {name:'sizeY', type:CustomCommandParamType.Float},
        {name:'sh:facingDirection', type:CustomCommandParamType.Enum},
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