import {RawMessage, CustomCommandStatus} from '@minecraft/server';


/**Command callbacks must return this. Allows rawtext.*/
export default interface ShardCommandResult {
    message?: RawMessage|string,
    status: CustomCommandStatus,
};