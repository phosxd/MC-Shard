import {MC, MCUI} from './CONST';
import {CompareCommandPermissionLevel} from './util';
import ShardCommandContext from './command_context';
import ShardFormBuildResult from './form_build_result';


export default class ShardForm {
    id: string;
    permissionLevel: MC.CommandPermissionLevel;
    requiredTags: Array<string>;
    buildForm: (context:ShardCommandContext, ...args) => ShardFormBuildResult;
    callback: (context:ShardCommandContext, response:MCUI.ActionFormResponse|MCUI.ModalFormResponse|MCUI.MessageFormResponse, ...args) => void;


    constructor(id:string, permissionLevel:MC.CommandPermissionLevel, requiredTags:Array<string>, buildForm:(context:ShardCommandContext, ...args) => ShardFormBuildResult, callback:(context:ShardCommandContext, response:MCUI.ActionFormResponse|MCUI.ModalFormResponse|MCUI.MessageFormResponse, ...args) => void) {
        this.id = id;
        this.permissionLevel = permissionLevel;
        this.requiredTags = requiredTags;
        this.buildForm = buildForm;
        this.callback = callback;
    };


    /**Show the form UI to the context target, then calls `callback`.*/
    show(context:ShardCommandContext, ...args) {
        if (context.targetType !== 'player') {return};
        if (CompareCommandPermissionLevel(context.target.commandPermissionLevel, this.permissionLevel) == false) {return};
        
        // Run in an "after" context.
        MC.system.run(()=>{
            const formBuildResult:ShardFormBuildResult = this.buildForm(context, ...args);
            formBuildResult.data.show(context.target).then(response => {
                // If player cannot open the form, queue & retry every half second.
                if (response.cancelationReason == MCUI.FormCancelationReason.UserBusy) {
                    MC.system.runTimeout(this.show.bind(this,context.target), 10);
                }
                // If player closed, do nothing then return.
                else if (response.cancelationReason == MCUI.FormCancelationReason.UserClosed) {
                    return;
                };
                // Callback.
                this.callback(context, response, ...formBuildResult.callbackArgs);
            });
        });
    };
};