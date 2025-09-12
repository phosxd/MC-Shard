import {system, CommandPermissionLevel, CustomCommandParamType, Vector3} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {LocationToString, RoundVector3} from '../../../Shard/util';
import {Module, BossbarEvent} from '../module';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const location:Vector3 = args[0];
    const text:string = args[1];
    const isBossbar:boolean = args[2];
    let spawnOptions:any = {};
    if (isBossbar) {spawnOptions.spawnEvent = BossbarEvent};
    system.run(()=>{
        const display = context.dimension.spawnEntity('shard:display', location, spawnOptions);
        display.nameTag = text;
    });
    return {message:{translate:'shard.display.cmd.addDisplay.success', with:[text, LocationToString(RoundVector3(location))]}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'adddisplay',
        brief: 'shard.display.cmd.addDisplay.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'location', type:CustomCommandParamType.Location},
            {name:'text', type:CustomCommandParamType.String},
        ],
        optionalParameters: [
            {name:'isBossbar', type:CustomCommandParamType.Boolean},
        ],
    },
    {callback: Callback},
);