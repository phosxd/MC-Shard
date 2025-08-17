import {ActionFormData, ModalFormData, MessageFormData} from '@minecraft/server-ui';


/**Form build callbacks must return this.*/
export default interface ShardFormBuildResult {
    data: ActionFormData|ModalFormData|MessageFormData,
    callbackArgs: Array<any>,
};