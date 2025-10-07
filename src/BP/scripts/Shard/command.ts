// Copyright (c) 2025 PhosXD

import {World, CustomCommandParameter, CommandPermissionLevel, Dimension, RawMessage, Vector3, Vector2, CustomCommandStatus, Block, Entity, Player} from '@minecraft/server';
import {ShardFormElement} from './form';
import {StringFormatCommon} from '../util/string';
import {Dictionary} from './CONST';


export const defaultSettingElements:Array<ShardFormElement> = [
    {type:'toggle', id:'enabled', data:{display:{translate:'shard.formCommon.isEnabled'}, defaultValue:true}},
    {type:'toggle', id:'showModuleTag', data:{display:{translate:'shard.misc.moduleCommandSetting.showModuleTag'}, defaultValue:true}},
    {type:'textArray', id:'requiredTags', data:{
        display: {translate:'shard.misc.moduleCommandSetting.requiredTags'},
        placeholder: {translate:'shard.misc.moduleCommandSetting.requiredTagsPlaceholder'},
        min: 0,
        max: 10,
        itemMin: 1,
        itemMax: 32,
        defaultValue: [],
    }},
];


/**Command callbacks must return this. Allows rawtext.*/
export interface ShardCommandResult {
    message?: RawMessage|string,
    status: CustomCommandStatus,
};


/**Command details for initialization.*/
export interface ShardCommandDetails {
    /**Unique command ID.*/
    id: string,
    /**Breif command description.*/
    brief: string,
    /**More detailed command description.*/
    description?: string,
    /**Optional parameters for the command.*/
    optionalParameters?: Array<CustomCommandParameter>,
    /**Required parameters for the command.*/
    mandatoryParameters?: Array<CustomCommandParameter>,
    /**Determines which actors the command is visible to.*/
    permissionLevel: CommandPermissionLevel,
    /**If true, command cannot be disabled.*/
    important?: boolean,
};


export interface ShardCommandData {
    callback: (context:ShardCommandContext, ...args) => ShardCommandResult|undefined|void,
    /**Form elements linked to command settings.*/
    settingElements?: Array<ShardFormElement>,
};


/**Shard command context.*/
export interface ShardCommandContext {
    sourceType: 'world'|'player'|'entity'|'block',
    sourcePlayer?: Player,
    sourceEntity?: Entity,
    sourceBlock?: Block,
    dimension: Dimension,
    location?: Vector3,
    rotation?: Vector2,

    /**Deprecated.*/
    target: Block|Entity|Player,
    /**Deprecated.*/
    targetType: 'world'|'block'|'entity'|'player';
};


/**Generate new context from an `Entity`, `Player`, or `Block`. */
export function GenerateCommandContext(from:Block|Entity|Player|World):ShardCommandContext {
    let sourceType;
    let sourcePlayer: Player;
    let sourceEntity: Entity;
    let sourceBlock: Block;
    let dimension: Dimension;
    let location: Vector3;
    let rotation: Vector2;
    let target: Block|Entity|Player;
    let targetType;

    if (from instanceof Entity) {
        sourceType = 'entity';
        sourceEntity = from;
        dimension = sourceEntity.dimension;
        location = sourceEntity.location;
        rotation = sourceEntity.getRotation();
        target = sourceEntity;
        targetType = sourceType;
    };
    if (from instanceof Player) {
        sourceType = 'player';
        sourcePlayer = from;
        targetType = sourceType;
    };
    if (from instanceof Block) {
        sourceType = 'block';
        sourceBlock = from;
        dimension = sourceBlock.dimension;
        location = sourceBlock.location;
        rotation = {x:0,y:0};
        target = sourceBlock;
        targetType = sourceType;
    };
    if (from instanceof World) {
        sourceType = 'world';
        dimension = from.getDimension('overworld');
        location = from.getDefaultSpawnLocation();
        targetType = sourceType;
    };

    return {
        sourceType: sourceType,
        sourcePlayer: sourcePlayer,
        sourceEntity: sourceEntity,
        sourceBlock: sourceBlock,
        dimension: dimension,
        location: location,
        rotation: rotation,
        target: target,
        targetType: targetType,
    };
};




/**Class for custom commands.*/
export class ShardCommand {
    /**Command's constant details.*/
    readonly details: ShardCommandDetails;
    /**Command settings that are persistently saved in parent module.*/
    settingElements: Array<ShardFormElement>;
    /**Called when the command is run.*/
    callback: (context:ShardCommandContext, args) => ShardCommandResult|undefined|void;


    /**Called when command is run without proper permissions.*/
    illegalCallback(_context:ShardCommandContext, _args): ShardCommandResult {
        return {message:{translate:'shard.misc.missingPermission'}, status:1};
    };


    constructor(details:ShardCommandDetails, data:ShardCommandData) {
        this.details = details;
        this.callback = data.callback;
        this.settingElements = [...defaultSettingElements];
        if (data.settingElements) {this.settingElements = this.settingElements.concat(data.settingElements)};
    };


    /**Executes the command.*/
    execute(context:ShardCommandContext, args): ShardCommandResult|undefined|void {
        const newArgs = [];
        // Format string args.
        args.forEach(arg => {
            if (typeof arg == 'string') {
                newArgs.push(StringFormatCommon(arg));
            }
            else {newArgs.push(arg)};
        });
        // Return callback result.
        return this.callback(context, newArgs);
    };


    /**Get default settings for this command.*/
    getDefaultSettings():Dictionary<any> {
        const settings = {};
        this.settingElements.forEach(element => {
            const elementData = element.data as Dictionary<any>;
            // Apply default value if available.
            if (!elementData.defaultValue) {settings[element.id] = undefined}
            else {settings[element.id] = elementData.defaultValue};
        });
        return settings;
    };
};