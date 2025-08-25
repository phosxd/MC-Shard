import {Vector3, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import ShardCommand from '../../../ShardAPI/command';
import ShardCommandContext from '../../../ShardAPI/command_context';
import {AlignedArea} from '../../../ShardAPI/CONST';
import {AlignArea, LocationToString, RoundVector3} from '../../../ShardAPI/util';
import {Module, Border} from '../module';




function Callback(context:ShardCommandContext, args:Array<any>) {
    const name:string = args[0];
    const start:Vector3 = args[1];
    const end:Vector3 = args[2];
    const inverted:boolean = args[3];
    const damage:number = args[4];
    const styleId:string = args[5];
    const area:AlignedArea = AlignArea({start:start, end:end});

    const currentBorder = Module.persisData.borders[name];
    if (currentBorder) {return {message:{translate:'shard.border.cmd.addBorder.nameTaken'}, status:1}};
    const style = Module.persisData.borderStyles[styleId];
    if (!style) {return {message:{translate:'shard.border.cmd.addBorder.invalidStyle', with:['"'+Object.keys(Module.persisData.borderStyles).join('", "')+'"']}, status:1}};
    // I cant get non-inverted borders to not just freeze entities in place on contact, so this should only ever be used inverted.
    if (!inverted) {return {message:{translate:'shard.border.cmd.addBorder.mustBeInverted'}, status:1}};

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

    return {message:{translate:'shard.border.cmd.addBorder.success', with:[name, LocationToString(RoundVector3(start)), LocationToString(RoundVector3(end))]}, status:0};
};




// Initialize Command.
export const Command = new ShardCommand(
    'addborder',
    'Add a new border. Set inverted for world border.',
    [
        {name:'name', type:CustomCommandParamType.String},
        {name:'start', type:CustomCommandParamType.Location},
        {name:'end', type:CustomCommandParamType.Location},
        {name:'inverted', type:CustomCommandParamType.Boolean},
        {name:'damage', type:CustomCommandParamType.Float},
    ],
    [
        {name:'style', type:CustomCommandParamType.String},
    ],
    CommandPermissionLevel.GameDirectors,
    [],
    Callback,
);