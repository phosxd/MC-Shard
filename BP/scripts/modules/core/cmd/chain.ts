import {system, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {StringifyVector} from '../../../util/vector';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const firstCommand:string = args[0];
    const secondCommand:string = args[1];
    let delayTicks:number = args[2];
    if (!delayTicks) {delayTicks = 0};

    if (['player','entity'].includes(context.sourceType)) {
        const entity = context.sourceEntity;
        system.run(()=>{
            if (!entity.isValid) {return};
            entity.runCommand(firstCommand);
        });
        system.runTimeout(()=>{
            if (!entity.isValid) {return};
            entity.runCommand(secondCommand);
        },delayTicks);
    }
    else if (context.sourceType == 'block') {
        const block = context.sourceBlock;
        system.run(()=>{
            block.dimension.runCommand(`execute positioned ${StringifyVector(block.location)} run ${firstCommand}`);
        });
        system.runTimeout(()=>{
            block.dimension.runCommand(`execute positioned ${StringifyVector(block.location)} run ${secondCommand}`);
        },delayTicks);
    };

    return undefined;
};




// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'chain',
        brief: 'shard.core.cmd.chain.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'firstCommand', type:CustomCommandParamType.String},
            {name:'secondCommand', type:CustomCommandParamType.String},
        ],
        optionalParameters: [
            {name:'delayTicks', type:CustomCommandParamType.Integer},
        ],
    },
    {callback: Callback},
);