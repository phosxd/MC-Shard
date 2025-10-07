import {CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {CommandNamespace} from '../../../Shard/CONST';
import {Modules} from '../../modules';


function Callback(_context:ShardCommandContext, args:Array<any>) {
    const moduleId:string = args[0];
    // Get module.
    const module = Modules[moduleId];
    if (!module) {return};
    // Get property IDs.
    const propertyIds = module.getPropertyIds();

    let list:string = '';
    propertyIds.forEach(id => {
        list += `\n§r- §7${id}`;
    });
    return {message:{translate:'shard.core.cmd.modulePropertyIds.success', with:[list]}, status:0};
};


// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'module.property.ids',
        brief: 'shard.core.cmd.modulePropertyIds.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:CommandNamespace+':'+'module', type:CustomCommandParamType.Enum},
        ],
    },
    {callback: Callback},
);