import {system, CommandPermissionLevel, Player} from '@minecraft/server';
import {ActionFormResponse, ModalFormResponse, MessageFormResponse, FormCancelationReason} from '@minecraft/server-ui';
import {CompareCommandPermissionLevel} from './util';
import ShardCommandContext from './command_context';
import ShardFormBuildResult from './form_build_result';


export default class ShardForm {
    id: string;
    permissionLevel: CommandPermissionLevel;
    requiredTags: Array<string>;
    buildForm: (context:ShardCommandContext, ...args) => ShardFormBuildResult;
    callback: (context:ShardCommandContext, response:ActionFormResponse|ModalFormResponse|MessageFormResponse, ...args) => void;


    constructor(id:string, permissionLevel:CommandPermissionLevel, requiredTags:Array<string>, buildForm:(context:ShardCommandContext, ...args) => ShardFormBuildResult, callback:(context:ShardCommandContext, response:ActionFormResponse|ModalFormResponse|MessageFormResponse, ...args) => void) {
        this.id = id;
        this.permissionLevel = permissionLevel;
        this.requiredTags = requiredTags;
        this.buildForm = buildForm;
        this.callback = callback;
    };


    /**Show the form UI to the context target, then calls `callback`.*/
    show(context:ShardCommandContext, ...args) {
        if (context.targetType !== 'player') {return};
        const target = context.target as Player;
        if (CompareCommandPermissionLevel(target.commandPermissionLevel, this.permissionLevel) == false) {return};
        
        // Run in an "after" context.
        system.run(()=>{
            const formBuildResult:ShardFormBuildResult = this.buildForm(context, ...args);
            formBuildResult.data.show(target).then(response => {
                // If player cannot open the form, queue & retry every half second.
                if (response.cancelationReason == FormCancelationReason.UserBusy) {
                    system.runTimeout(this.show.bind(this,context.target), 10);
                }
                // If player closed, do nothing then return.
                else if (response.cancelationReason == FormCancelationReason.UserClosed) {
                    return;
                };
                // Callback.
                this.callback(context, response, ...formBuildResult.callbackArgs);
            });
        });
    };
};