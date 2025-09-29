import {} from '@minecraft/server';
import {Dictionary} from '../Shard/CONST';
import {StringifyVector} from './vector';


/**
 * Split `str` into equal parts.
*/
export function StringEqualSplit(value:string, parts:number) {
    let result:Array<string> = [];
    const partLength = Math.floor(value.length/parts);
    const remainder = value.length%parts;
    let startIndex:number = 0;
    for (let i:number = 0; i < parts; i++) {
        const length:number = partLength + (i<remainder?1:0);
        result.push(value.slice(startIndex, startIndex+length));
        startIndex += length;
    };

    return result;
};


/**
 * Formats the `str` with common variables.
 * 
 * List:
 * - `$n` = '\n'
*/
export function StringFormatCommon(str:string):string {
    let result = str
        .replaceAll('$n','\n')
    ;
    return result;
};


/**
 * Formats the `str`.
 * 
 * @param {boolean} rawResults If true, will not tamper with the formatting results. Otherwise certain values may be changed to suit strings.
*/
export function StringFormat(str:string, env:Dictionary<any>, rawResults:boolean=false):string {
    let result = str;
    const originalParts:Array<string> = [];
    // Parse `str` for parts to format.
    let foundSign:boolean = false;
    let buffer:string = '';
    for (const index in str.split('')){
        const char = str[index]
        if (!foundSign && char != '$') {continue};
        if (!foundSign && char == '$') {
            foundSign = true;
        }
        else if (buffer.length == 1 && char != '{') {
            foundSign = false;
            buffer = '';
            continue;
        }
        else if (char == '}') {
            originalParts.push(buffer+char);
            foundSign = false;
            buffer = '';
            continue;
        }
        buffer += char;
    };
    // Replace original parts.
    originalParts.forEach(part => {
        const code = part
            .slice(2, -1) // Removes "${" & "}".
            .replaceAll('!!(', '{').replaceAll(')!!', '}')
        ;
        let controlledScope = new Function(...Object.keys(env), `try {return ${code}} catch {};`);
        let evalResult = controlledScope(...Object.values(env));
        // Edit eval result to have string friendly values.
        switch (typeof(evalResult)) {
            case 'object': {
                // Vector3
                if (evalResult.x && evalResult.y && evalResult.z) {
                    evalResult = StringifyVector(evalResult);
                }
                // Vector2
                else if (evalResult.x && evalResult.y && !evalResult.z) {
                    evalResult = StringifyVector(evalResult);
                };
                break;
            };
            case 'undefined': {
                evalResult = '';
            };
        };
        // Apply result.
        result = result.replace(part, String(evalResult));
    });

    return result;
};