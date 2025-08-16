import {MC, MCUI} from './CONST';


/**Form build callbacks must return this.*/
export default interface ShardFormBuildResult {
    data: MCUI.ActionFormData|MCUI.ModalFormData|MCUI.MessageFormData,
    callbackArgs: Array<any>,
};