import {system, world, RGBA} from '@minecraft/server';
import {Dictionary, AlignedArea} from '../../ShardAPI/CONST';
import ShardModule from '../../ShardAPI/module';
import ShardEventListener from '../../ShardAPI/event_listener';
import ShardCommand from '../../ShardAPI/command';
import ShardForm from '../../ShardAPI/form';
// Import events.
import * as event_tick from './events/tick';
// Import commands.
import * as command_addborder from './commands/addborder';
import * as command_removeborder from './commands/removeborder';
import * as command_listborders from './commands/listborders';
// Import forms.
import * as form_main from './forms/main';


export interface Border {
    name: string,
    dimensionId: string,
    area: AlignedArea,
    inverted: boolean,
    styleId: string,
    damage: number, // How much damage entities take when outside the border.
};


export interface BorderStyle {
    type: 'none',//|'flat'|'particle'|'physical',
    name: string,
    styleFlat?: {
        color: RGBA,
    },
    styleParticle?: {
        particle: string,
    },
    stylePhysical?: {
        block: string,
        thickness: number,
    }
    renderOptions?: {
        visibleDistance: number, // "-1" is unlimited.
    },
};




// Default border styles.
export const defaultBorderStyles:Dictionary<BorderStyle> = {
    hidden: {
        type: 'none',
        name: 'hidden',
    },
};


// Define module properties.
var EventListeners:Dictionary<ShardEventListener> = {
    tick: event_tick.EventListener,
};
var Commands:Dictionary<ShardCommand> = {
    addborder: command_addborder.Command,
    removeborder: command_removeborder.Command,
    listborders: command_listborders.Command,
};
var Forms:Dictionary<ShardForm> = {
};
const ExtraDefaultPersisData:Dictionary<any> = {
    borders: {},
    borderStyles: defaultBorderStyles,
};




// Init callback.
function Init() {};





// Instantiate Module.
export const Module:ShardModule = new ShardModule(
    'border', // ID
    {translate:'shard.border.displayName'}, // Display name
    {translate:'shard.border.description'}, // Description
    Init,
    EventListeners,
    Commands,
    Forms,
    form_main.Form,
    ExtraDefaultPersisData,
);