import {CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {CommandNamespace} from '../../../Shard/CONST';
import {Modules} from '../../modules';


function Callback(_context:ShardCommandContext, args:Array<any>) {
    const moduleId:string = args[0];
    const propertyId:string = args[1];
    let value:string = args[2];
    // Get module.
    const module = Modules[moduleId];
    if (!module) {return};
    // Get property.
    const property = module.getProperty(propertyId);
    // Set property.
    if (value) {
        if (value == 'undefined') {
            module.setProperty(propertyId, undefined);
        }
        else {
            module.setProperty(propertyId, JSON.parse(value))
        };
    }
    // Print.
    else {
        if (property == undefined) {console.warn('undefined')}
        else {
            console.warn(JSON.stringify(property).replaceAll('"','\\"').replaceAll('\\\\"','\\\\\\"'));
        };
    };
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'module.property',
        brief: 'shard.core.cmd.moduleProperty.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:CommandNamespace+':'+'module', type:CustomCommandParamType.Enum},
            {name:'propertyId', type:CustomCommandParamType.String},
        ],
        optionalParameters: [
            {name:'value', type:CustomCommandParamType.String},
        ],
    },
    {callback: Callback},
);