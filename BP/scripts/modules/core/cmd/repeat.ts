import {system, CommandPermissionLevel, CustomCommandParamType} from '@minecraft/server';
import {ShardCommand, ShardCommandContext} from '../../../Shard/command';
import {LocationToString} from '../../../Shard/util';


function Callback(context:ShardCommandContext, args:Array<any>) {
    const userCommand:string = args[0];
    const times:number = args[1];
    let interval:number = args[2];
    if (!interval) {interval = 0};
    // Quit if times less than 1.
    if (times < 1) {return undefined};
    
    const commandParts:Array<string> = [];
    /**Randomized tag used to locate the entity that used the command, within the command itself.*/
    const randomizedTag:string = `sh:locator:${Math.random()}`;

    // Add extra command parameters if user is an entity.
    if (['entity','player'].includes(context.sourceType)) {
        // Add randomized tag to user.
        system.run(()=>{
            context.sourceEntity.addTag(randomizedTag);
        });
        // Remove randomized tag from user, after all command iterations.
        system.runTimeout(()=>{
            context.sourceEntity.removeTag(randomizedTag);
        }, (interval*times)+1);
        // Add command parameter.
        commandParts.push(`as @e[tag=${randomizedTag}] at @e[tag=${randomizedTag}]`);
    };
    // Add extra command parameters if user is a block.
    if (context.sourceType == 'block') {
        const block = context.sourceBlock;
        commandParts.push(`positioned ${LocationToString(block.location)}`);
    };

    // Finalize the command then start executing it.
    const command = 'execute '+commandParts.join(' ')+' run '+userCommand;
    let iteration:number = 0;
    while (iteration < times) {
        system.runTimeout(()=>{
            context.dimension.runCommand(command);
        }, interval*iteration); // If interval is undefined, theres no tickDelay.
        iteration += 1;
    };

    return undefined;
};




// Initialize Command.
export const MAIN = new ShardCommand(
    {
        id: 'repeat',
        brief: 'shard.core.cmd.repeat.brief',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {name:'command', type:CustomCommandParamType.String},
            {name:'times', type:CustomCommandParamType.Integer},
        ],
        optionalParameters: [
            {name:'intervalTicks', type:CustomCommandParamType.Integer},
        ],
    },
    {callback: Callback},
);