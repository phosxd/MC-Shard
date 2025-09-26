export const VectorSymbols = 'xyzw';
export interface AnyVector {
    [key:string]: number,
};


/**
 * Create new vector with a custom size & default value.
 * Size is only effective up to 4.
*/
export function NewVector(size:number, defaultValue:number):AnyVector {
    let newVector = {};
    for (let i=0; i < size; i++) {
        if (!VectorSymbols[i]) {break};
        newVector[VectorSymbols[i]] = defaultValue;
    };
    return newVector;
};


/**
 * Returns `string` representation of the vector.
 * 
 * Example:
 * ```
 * StringifyVector({x:1, y:2}); // Returns "1 2".
 * StringifyVector({x:1, y:2, z:3}); // Returns "1 2 3".
 * StringifyVector({w:1, x:2, y:3, z:4}); // Returns "1 2 3 4".
 * ```
*/
export function StringifyVector(vector, separator:string=' '): string {
    let result:Array<string> = [];
    for (const key of VectorSymbols.split('')) {
        if (vector[key] == undefined) {continue};
        result.push(String(vector[key]));
    };
    return result.join(separator);
};


/**
 * Converts `str` to a vector.
*/
export function StringToVector(str:string, enforceLength?:number): {status:number, vector?} {
    let newVector = {};
    if (str == undefined) {return {status:1}};
    const splitStr:Array<string> = str.split(' ');
    let index = -1;
    for (const value of splitStr) {
        index += 1;
        if (isNaN(Number(value))) {return {status:1}};
        newVector[VectorSymbols[index]] = Number(value);
    };
    if (index == -1) {return {status:1}};
    if (enforceLength && index+1 != enforceLength) {return {status:1}};
    return {status:0, vector:newVector};
};


/**
 * Returns a new vector with added values.
 * 
 * @param a `AnyVector`.
 * @param b `AnyVector` or `number`.
*/
export function AddVector(a, b) {
    if (typeof b == 'number') {
        b = NewVector(Object.keys(a).length, b);
    };
    let newVector = {};
    for (const key of Object.keys(a)) {
        newVector[key] = a[key]+b[key];
    };
    return newVector;
};


/**
 * Returns a new vector with multiplied values.
 * 
 * @param a `AnyVector`.
 * @param b `AnyVector` or `number`.
*/
export function MultiplyVector(a, b) {
    if (typeof b == 'number') {
        b = NewVector(Object.keys(a).length, b);
    };
    let newVector = {};
    for (const key of Object.keys(a)) {
        newVector[key] = a[key]*b[key];
    };
    return newVector;
};


/**
 * Returns a new vector with divided values.
 * 
 * @param a `AnyVector`.
 * @param b `AnyVector` or `number`.
*/
export function DivideVector(a, b) {
    if (typeof b == 'number') {
        b = NewVector(Object.keys(a).length, b);
    };
    let newVector = {};
    for (const key of Object.keys(a)) {
        newVector[key] = a[key]/b[key];
    };
    return newVector;
};


/**
 * Returns a new vector with normalized values.
 * 
 * @param vector `AnyVector`.
*/
export function NormalizeVector(vector) {
    // Setup new vector.
    let newVector = {};
    let combinedValues = 0;
    for (const key of Object.keys(vector)) {
        newVector[key] = 0;
        combinedValues += vector[key]**2;
    };
    // Calculate.
    const length = Math.sqrt(combinedValues);
    if (length !== 0) {
        for (const key of Object.keys(vector)) {
            newVector[key] = vector[key]/length;
        };
    };
    return newVector;
};


/**
 * Returns a new vector with rounded values.
 * 
 * @param vector `AnyVector`.
*/
export function RoundVector(vector) {
    let newVector = {};
    for (const key of Object.keys(vector)) {
        newVector[key] = Math.round(vector[key]);
    };
    return newVector;
};


/**
 * Returns a new vector with floored values.
 * 
 * @param vector `AnyVector`.
*/
export function FloorVector(vector) {
    let newVector = {};
    for (const key of Object.keys(vector)) {
        newVector[key] = Math.floor(vector[key]);
    };
    return newVector;
};


/**
 * Returns a new vector with fixed precision values.
 * 
 * @param vector `AnyVector`.
*/
export function FixVector(vector, precision:number) {
    let newVector = {};
    for (const key of Object.keys(vector)) {
        newVector[key] = Number((vector[key] as number).toPrecision(precision));
    };
    return newVector;
};


/**
 * Returns a new vector with sign flipped values.
 * 
 * @param vector `AnyVector`.
*/
export function FlipVector(vector) {
    let newVector = {};
    for (const key of Object.keys(vector)) {
        newVector[key] = -vector[key];
    };
    return newVector;
};