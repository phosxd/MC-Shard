import {MC, MCUI} from './CONST';
import {CompareCommandPermissionLevel} from './util';
import ShardCommandContext from './command_context';


export default class ShardForm {
    id: string;
    permissionLevel: MC.CommandPermissionLevel;
    requiredTags: Array<string>;
    buildForm: (context:ShardCommandContext, ...args) => MCUI.ActionFormData|MCUI.ModalFormData|MCUI.MessageFormData;
    callback: (context:ShardCommandContext, response:MCUI.ActionFormResponse|MCUI.ModalFormResponse|MCUI.MessageFormResponse, ...args) => void;


    constructor(id:string, permissionLevel:MC.CommandPermissionLevel, requiredTags:Array<string>, buildForm:(context:ShardCommandContext, ...args) => MCUI.ActionFormData|MCUI.ModalFormData|MCUI.MessageFormData, callback:(context:ShardCommandContext, response:MCUI.ActionFormResponse|MCUI.ModalFormResponse|MCUI.MessageFormResponse, ...args) => void) {
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
            this.buildForm(context, ...args).show(context.target).then(response => {
                // If player cannot open the form, queue & retry every half second.
                if(response.cancelationReason == MCUI.FormCancelationReason.UserBusy) {
                    MC.system.runTimeout(this.show.bind(this,context.target), 10);
                };
                // Callback.
                this.callback(context, response, ...args);
            });
        });
    };
};