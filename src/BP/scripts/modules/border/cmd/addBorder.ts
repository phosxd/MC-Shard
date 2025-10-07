import {Vector3, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {AlignedArea} from '../../../Shard/CONST';
import {AlignArea} from '../../../Shard/util';
import {RoundVector, StringifyVector} from '../../../util/vector';
import {Module, Border} from '../module';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const name:string = args[0];
    const start:Vector3 = args[1];
    const end:Vector3 = args[2];
    const inverted:boolean = args[3];
    const damage:number = args[4];
    let styleId:string = args[5];
    if (!styleId) {styleId = 'hidden'};
    const area:AlignedArea = AlignArea({start:start, end:end});

    const currentBorder = Module.persisData.borders[name];
    if (currentBorder) {return {message:{translate:'shard.misc.createDuplicateName'}, status:1}};
    const style = Module.persisData.borderStyles[styleId];
    if (!style) {return {message:{translate:'shard.border.cmd.addBorder.invalidStyle', with:['"'+Object.keys(Module.persisData.borderStyles).join('", "')+'"']}, status:1}};

    const newBorder:Border = {
        name: name,
        dimensionId: context.dimension.id,
        area: area,
        inverted: inverted,
        damage: damage,
        styleId: styleId,
    };
    Module.persisData.borders[name] = newBorder;
    Module.saveData();

    return {message:{translate:'shard.border.cmd.addBorder.success', with:[name, StringifyVector(RoundVector(start)), StringifyVector(RoundVector(end))]}, status:0};
};




// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'addborder',
        brief: 'shard.border.cmd.addBorder.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'name', type:CustomCommandParamType.String},
            {name:'start', type:CustomCommandParamType.Location},
            {name:'end', type:CustomCommandParamType.Location},
            {name:'inverted', type:CustomCommandParamType.Boolean},
            {name:'damage', type:CustomCommandParamType.Float},
        ],
        optionalParameters: [
            {name:'style', type:CustomCommandParamType.String},
        ],
    },
    {callback: Callback},
);