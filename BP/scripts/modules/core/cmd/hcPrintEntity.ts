import {system, CommandPermissionLevel, CustomCommandParamType, Entity} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {EntityToObject} from '../../../util/entity';
import {ItemStackToObject} from '../../../util/item';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const targets:Array<Entity> = args[0];
    const rawStrings:boolean = args[1];
    // Return error if incorrect target count.
    if (targets.length !== 1) {return {message:{translate:'shard.core.cmd.hcPrintEntity'}, status:1}};
    const target = targets[0];

    system.run(()=>{
        let compiled;
        let compiledString: string;
        if (target.typeId == 'minecraft:item') {
            compiled = {type:'item', data:ItemStackToObject(target.getComponent('item').itemStack)};
        }
        else {
            compiled = {type:'entity', data:EntityToObject(target)};
        };
        compiledString = JSON.stringify(compiled);
        // 2 layer string reformatting.
        if (!rawStrings) {
            compiledString = compiledString.replaceAll('"','\\"').replaceAll('\\\\"','\\\\\\"');
        };
        // Print.
        console.warn(compiledString);
    });

    return undefined;
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'hc.print.entity',
        brief: 'shard.core.cmd.hcPrintEntity.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'targets', type:CustomCommandParamType.EntitySelector},
        ],
        optionalParameters: [
            {name:'rawStrings', type:CustomCommandParamType.Boolean},
        ],
    },
    {callback: Callback},
);