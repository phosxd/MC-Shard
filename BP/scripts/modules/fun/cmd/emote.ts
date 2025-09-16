import {system, CommandPermissionLevel, CustomCommandParamType, Player} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';

const blendOutTime:number = 0.3;
const stopExpression:string = 'query.is_moving';
const animationMap = {
    sit: 'animation.player.riding.legs',
    lay: 'sleeping',
    behold: 'animation.armor_stand.entertain_pose',
    zombie: 'animation.armor_stand.zombie_pose',
    evoker: 'animation.evoker.casting',
    piglin: 'animation.piglin.celebrate_hunt_special',
    'wtf?': 'animation.fox.wiggle',
    hoolahoop: 'animation.frog.walk',
    sniff: 'animation.warden.sniff',
    ahhchoo: 'animation.warden.roar'
};


function Callback(context:ShardCommandContext, args:Array<any>) {
    if (context.targetType != 'player') {return};
    const player = context.target as Player;
    const pose = args[0];
    const animation = animationMap[pose];
    if (!animation) {return};
    system.run(()=>{
        player.playAnimation(animation, {blendOutTime:blendOutTime, stopExpression:stopExpression, controller:'entity.default'});
    });
    return undefined;
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'emote',
        brief: 'shard.fun.cmd.emote.brief',
        permissionLevel: CommandPermissionLevel.Any,
        mandatoryParameters: [
            {name:'sh:emote', type:CustomCommandParamType.Enum},
        ],
    },
    {callback: Callback},
);