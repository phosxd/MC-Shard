import {MC, MCUI} from './CONST';


export default class ShardForm {
    id: string;
    permissionLevel: MC.CommandPermissionLevel;
    requiredTags: Array<string>;
    buildForm: () => MCUI.ActionFormData|MCUI.ModalFormData|MCUI.MessageFormData;
    callback: (response:MCUI.ActionFormResponse|MCUI.ModalFormResponse|MCUI.MessageFormResponse) => void;


    constructor(id:string, permissionLevel:MC.CommandPermissionLevel, requiredTags:Array<string>, buildForm:() => MCUI.ActionFormData|MCUI.ModalFormData|MCUI.MessageFormData, callback:(response:MCUI.ActionFormResponse|MCUI.ModalFormResponse|MCUI.MessageFormResponse) => void) {
        this.id = id;
        this.permissionLevel = permissionLevel;
        this.requiredTags = requiredTags;
        this.buildForm = buildForm;
        this.callback = callback;
    };


    show(player:MC.Player) {
        // Run in an "after" context.
        MC.system.run(()=>{
            this.buildForm().show(player).then(response => {
                // If player cannot open the form, queue & retry every half second.
                if(response.cancelationReason == MCUI.FormCancelationReason.UserBusy) {
                    MC.system.runTimeout(this.show.bind(this,player), 10);
                };
                // Callback.
                this.callback(response);
            });
        });
    };
};