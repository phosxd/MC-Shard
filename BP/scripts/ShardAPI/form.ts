import {system, CommandPermissionLevel, Player, RawMessage} from '@minecraft/server';
import {ActionFormData, ModalFormData, MessageFormData, ActionFormResponse, ModalFormResponse, MessageFormResponse, FormCancelationReason} from '@minecraft/server-ui';
import {CompareCommandPermissionLevel} from './util';
import {ShardCommandContext} from './command';



/**Form build callbacks must return this.*/
export interface ShardFormBuildResult {
    data: ActionFormData|ModalFormData|MessageFormData,
    callbackArgs: Array<any>,
};


export interface ShardFormDetails {
    /**Unique form ID.*/
    id: string,
    permissionLevel: CommandPermissionLevel,
};


export interface ShardFormData {
    buildForm: (context:ShardCommandContext, ...args) => ShardFormBuildResult,
    callback: (context:ShardCommandContext, response:ActionFormResponse|ModalFormResponse|MessageFormResponse, ...args) => void,
    onClosed?: (context:ShardCommandContext, response:ActionFormResponse|ModalFormResponse|MessageFormResponse, ...args) => void,
};



export class ShardForm {
    readonly details: ShardFormDetails;
    buildForm: (context:ShardCommandContext, ...args) => ShardFormBuildResult;
    callback: (context:ShardCommandContext, response:ActionFormResponse|ModalFormResponse|MessageFormResponse, ...args) => void;
    onClosed: (context:ShardCommandContext, response:ActionFormResponse|ModalFormResponse|MessageFormResponse, ...args) => void;


    constructor(details:ShardFormDetails, data:ShardFormData) {
        this.details = details;
        this.buildForm = data.buildForm;
        this.callback = data.callback;
        if (data.onClosed) {this.onClosed = data.onClosed}
        else {this.onClosed = ()=>{}};
    };


    /**Show the form UI to the context target, then calls `callback`.*/
    show(context:ShardCommandContext, ...args) {
        if (context.targetType !== 'player') {return};
        const target = context.target as Player;
        if (CompareCommandPermissionLevel(target.commandPermissionLevel, this.details.permissionLevel) == false) {return};
        
        // Run in an "after" context.
        system.run(()=>{
            // Build form.
            const formBuildResult:ShardFormBuildResult = this.buildForm(context, ...args);
            // Show form.
            formBuildResult.data.show(target).then(response => {
                // If player cannot open the form, queue & retry every half second.
                if (response.cancelationReason == FormCancelationReason.UserBusy) {
                    system.runTimeout(this.show.bind(this,context.target), 10);
                }
                // If player closed, call close callback.
                else if (response.cancelationReason == FormCancelationReason.UserClosed) {
                    if (this.onClosed) {
                        this.onClosed(context, response, ...formBuildResult.callbackArgs);
                    };
                    return;
                };
                // Callback.
                this.callback(context, response, ...formBuildResult.callbackArgs);
            });
        });
    };
};