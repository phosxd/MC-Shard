import {system, Entity, Block, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {StringifyVector3} from '../../../Shard/util';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const valueA:string = args[0];
    const operator:string = args[1];
    const valueB:string = args[2];
    const command:string = args[3];
    const numberValueA = Number(valueA);
    const numberValueB = Number(valueB);
    let validNumbers:boolean = true;
    if (isNaN(numberValueA) || isNaN(numberValueB)) {validNumbers = false};
    let passed:boolean = false;

    // Check condition.
    if (operator == 'equalTo' || operator == '==') {
        if (valueA == valueB) {passed = true};
    }
    else if (operator == 'notEqualTo' || operator == '!=') {
        if (valueA != valueB) {passed = true};
    }
    else if (operator == 'lessThanOrEqualTo' || operator == '<=') {
        if (validNumbers) {
            if (numberValueA <= numberValueB) {passed = true};
        }
        else {
            if (valueA.length <= valueB.length) {passed = true};
        };
    }
    else if (operator == 'moreThanOrEqualTo' || operator == '>=') {
        if (validNumbers) {
            if (numberValueA >= numberValueB) {passed = true};
        }
        else {
            if (valueA.length >= valueB.length) {passed = true};
        };
    }
    if (operator == 'lessThan' || operator == '<') {
        if (validNumbers) {
            if (numberValueA < numberValueB) {passed = true};
        }
        else {
            if (valueA.length < valueB.length) {passed = true};
        };
    }
    else if (operator == 'moreThan' || operator == '>') {
        if (validNumbers) {
            if (numberValueA > numberValueB) {passed = true};
        }
        else {
            if (valueA.length > valueB.length) {passed = true};
        };
    };

    if (passed == false) {return undefined};

    // Run command.
    if (['player','entity'].includes(context.targetType)) {
        const entity = context.target as Entity;
        system.run(()=>{
            if (!entity.isValid) {return};
            entity.runCommand(command);
        });
    }
    else if (context.targetType == 'block') {
        const block = context.target as Block;
        system.run(()=>{
            block.dimension.runCommand(`execute positioned ${StringifyVector3(block.location)} run ${command}`);
        });
    };

    return undefined;
};




// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'condition',
        brief: 'shard.core.cmd.condition.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'a', type:CustomCommandParamType.String},
            {name:'sh:operator', type:CustomCommandParamType.Enum},
            {name:'b', type:CustomCommandParamType.String},
            {name:'command', type:CustomCommandParamType.String},
        ],
    },
    {callback: Callback},
);