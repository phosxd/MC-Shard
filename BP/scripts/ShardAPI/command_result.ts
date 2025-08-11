import {MC} from './CONST';


/**Command callbacks must return this. Allows rawtext.*/
export default interface ShardCommandResult {
    message?: MC.RawMessage|string,
    status: MC.CustomCommandStatus,
};