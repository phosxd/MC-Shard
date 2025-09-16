import {ModuleNames} from '../../Shard/CONST';
export default {
    module: ModuleNames,
    moduleAction: [
        'info',
        'disable',
        'enable',
        'reset',
    ],
    operator: [
        'equalTo',
        'notEqualTo',
        'lessThanOrEqualTo',
        'moreThanOrEqualTo',
        'lessThan',
        'moreThan',
        '==',
        '!=',
        '<=',
        '>=',
        '<',
        '>',
    ],
};