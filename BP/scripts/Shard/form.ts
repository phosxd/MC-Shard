import {system, CommandPermissionLevel, Player, RawMessage, Vector3} from '@minecraft/server';
import {ActionFormData, ModalFormData, MessageFormData, ActionFormResponse, ModalFormResponse, MessageFormResponse, FormCancelationReason} from '@minecraft/server-ui';
import {Dictionary} from './CONST';
import {CompareCommandPermissionLevel} from './util';
import {toRawMessage} from './raw_message_parser';
import {ShardCommandContext} from './command';



// Classes & interfaces for form builder.
// --------------------------------------


export interface ShardFormElement {
    /**Message Elements: "title", "body".
     * 
     * Action Elements: "title", "body", "label", "button".
     * 
     * Modal Elements: "title", "label", "toggle", "slider", "numberBox", "textBox".
    */
    type: 'title'|'body'|'label'|'button'|'dropdown'|'toggle'|'slider'|'numberBox'|'textBox'|'vector3Box'|'numberArray'|'textArray',
    /**Unique ID which the element is referenced by in callbacks.*/
    id: string,
    data: ShardFormTitle|ShardFormBody|ShardFormLabel|ShardFormButton|ShardFormDropdown|ShardFormToggle|ShardFormSlider|ShardFormNumberBox|ShardFormTextBox|ShardFormVector3Box|ShardFormNumberArray|ShardFormTextArray,
};


export interface ShardFormTitle {
    display: string|RawMessage,
};
export interface ShardFormBody {
    display: string|RawMessage,
};
export interface ShardFormLabel {
    display: string|RawMessage,
};
export interface ShardFormButton {
    display: string|RawMessage,
    iconPath?: string,
};
export interface ShardFormDropdown {
    display: string|RawMessage,
    items: Array<string>,
    defaultValue?: number,
    tooltip?: string|RawMessage,
};
export interface ShardFormToggle {
    display: string|RawMessage,
    defaultValue?: boolean,
    tooltip?: string|RawMessage,
};
export interface ShardFormSlider {
    display: string|RawMessage,
    min: number,
    max: number,
    /**If undefined, assume `1`.*/
    step?: number,
    defaultValue?: number,
    tooltip?: string|RawMessage,
};
export interface ShardFormNumberBox {
    display: string|RawMessage,
    float: boolean,
    min: number,
    max: number,
    placeholder: string|RawMessage,
    defaultValue?: number,
    tooltip?: string|RawMessage,
};
export interface ShardFormTextBox {
    display: string|RawMessage,
    min: number,
    max: number,
    placeholder: string|RawMessage,
    defaultValue?: string,
    tooltip?: string|RawMessage,
};
export interface ShardFormVector3Box {
    display: string|RawMessage,
    placeholder: string|RawMessage,
    defaultValue?: Vector3,
    tooltip?: string|RawMessage,
};
export interface ShardFormNumberArray {
    display: string|RawMessage,
    min: number,
    max: number,
    /**Minimum value of each item in the array.*/
    itemMin: number,
    /**Maximum value of each item in the array.*/
    itemMax: number,
    placeholder: string|RawMessage,
    defaultValue?: Array<number>,
    tooltip?: string|RawMessage,
};
export interface ShardFormTextArray {
    display: string|RawMessage,
    min: number,
    max: number,
    /**Minimum length of each item in the array.*/
    itemMin: number,
    /**Maximum length of each item in the array.*/
    itemMax: number,
    placeholder: string|RawMessage,
    defaultValue?: Array<string>,
    tooltip?: string|RawMessage,
};


export interface ShardFormModalResponse {
    /**Element response values.*/
    map: Dictionary<any>,
    /**Elements that returned error messages.*/
    errors: Dictionary<RawMessage>,
};
export interface ShardFormActionResponse {
    /**Selected button index.*/
    selection: number,
};
export interface ShardFormMessageResponse {
};


export interface ShardFormBuilderDetails {
    type: 'message'|'action'|'modal',
};


export interface ShardFormBuilderData {
    elements: Array<ShardFormElement>,
    callbackArgs: Array<any>,
};




/**Class for generating the form layout.*/
export class ShardFormBuilder {
    readonly details: ShardFormBuilderDetails;
    elements: Array<ShardFormElement>;
    callbackArgs: Array<any>;
    errors: Dictionary<RawMessage>;


    constructor(details:ShardFormBuilderDetails, data:ShardFormBuilderData) {
        this.details = details;
        this.elements = data.elements;
        this.callbackArgs = data.callbackArgs;
        this.errors = {};
    };


    /**Generate a Shard form response from a Minecraft form response.*/
    generateResponse(response:MessageFormResponse|ActionFormResponse|ModalFormResponse):ShardFormMessageResponse|ShardFormActionResponse|ShardFormModalResponse {
        switch (this.details.type) {
            case 'message': {return this.generateMessageResponse(response)};
            case 'action': {return this.generateActionResponse(response)};
            case 'modal': {return this.generateModalResponse(response)};
        };
    };


    /**Generates a Shard message form response.*/
    generateMessageResponse(response:MessageFormResponse):ShardFormMessageResponse {
        const shardResponse:ShardFormMessageResponse = {};
        return shardResponse;
    };


    /**Generates a Shard action form response.*/
    generateActionResponse(response:ActionFormResponse):ShardFormActionResponse {
        const shardResponse:ShardFormActionResponse = {
            selection: response.selection,
        };
        return shardResponse;
    };


    /**Generates a Shard modal form response.*/
    generateModalResponse(response:ModalFormResponse):ShardFormModalResponse {
        const shardResponse:ShardFormModalResponse = {
            map: {},
            errors: {},
        };
        let index:number = Object.keys(this.errors).length; // Starts where the error labels end.

        // Elements.
        this.elements.forEach(element => {
            // Label element returns value `undefined` in `modal` forms. This needs to be accounted for.
            if (element.type == 'label') {
                index += 1;
            };
            // Ignore visual elements.
            if (['title','body','label'].includes(element.type)) {return};

            // Toggle element.
            if (element.type == 'toggle') {
                shardResponse.map[element.id] = response.formValues[index] as boolean;
            };
            // Dropdown element.
            if (element.type == 'dropdown') {
                shardResponse.map[element.id] = response.formValues[index] as number;
            };
            // Slider element.
            if (element.type == 'slider') {
                const elementData = element.data as ShardFormSlider;
                const elementDisplay = toRawMessage(element.data.display);
                // Get value.
                const value = response.formValues[index] as number;
                shardResponse.map[element.id] = value;
                // Out of range error.
                if (value > elementData.max || value < elementData.min) {
                    shardResponse.errors[element.id] = {translate:'shard.formError.outOfRange',
                    with:{rawtext:[elementDisplay, {text:String(elementData.min)}, {text:String(elementData.max)}]},
                }};
                // Invalid step error.
                if (value%elementData.step !== 1) {
                    shardResponse.errors[element.id] = {translate:'shard.formError.invalidStep',
                    with:{rawtext:[elementDisplay, {text:String(elementData.step)}]},
                }};
            };
            // Number box element.
            if (element.type == 'numberBox') {
                const elementData = element.data as ShardFormNumberBox;
                const elementDisplay = toRawMessage(element.data.display);
                // Get value.
                const value = response.formValues[index] as number;
                shardResponse.map[element.id] = value;
                // Out of range error.
                if (value > elementData.max || value < elementData.min) {
                    shardResponse.errors[element.id] = {translate:'shard.formError.outOfRange',
                    with:{rawtext:[elementDisplay, {text:String(elementData.min)}, {text:String(elementData.max)}]},
                }};
            };
            // Text box element.
            if (element.type == 'textBox') {
                const elementData = element.data as ShardFormTextBox;
                const elementDisplay = toRawMessage(element.data.display);
                // Get value.
                const value = response.formValues[index] as string;
                shardResponse.map[element.id] = value;
                // Out of range error.
                if (value.length > elementData.max || value.length < elementData.min) {
                    shardResponse.errors[element.id] = {translate:'shard.formError.outOfRangeLength',
                    with:{rawtext:[elementDisplay, {text:String(elementData.min)}, {text:String(elementData.max)}]},
                }};
            };
            // Number array element.
            if (element.type == 'numberArray') {
                const elementData = element.data as ShardFormNumberArray;
                const elementDisplay = toRawMessage(element.data.display);
                // Get value.
                const rawValue = response.formValues[index] as string;
                const value = rawValue.replaceAll(' ','').split(',').filter((value)=>{return value.length > 0}).map(Number);
                shardResponse.map[element.id] = value;
                // Out of range error.
                if (value.length > elementData.max || value.length < elementData.min) {
                    shardResponse.errors[element.id] = {translate:'shard.formError.outOfRangeArray',
                    with:{rawtext:[elementDisplay, {text:String(elementData.min)}, {text:String(elementData.max)}]},
                }};
                // Out of range item error.
                value.forEach(rawItem => {
                    const item = (rawItem as any) as number;
                    if (item > elementData.itemMax || item < elementData.itemMin) {
                        shardResponse.errors[element.id] = {translate:'shard.formError.outOfRangeArrayItem',
                        with:{rawtext:[elementDisplay, {text:String(elementData.itemMin)}, {text:String(elementData.itemMax)}]},
                    }};
                });
            };
            // Text array element.
            if (element.type == 'textArray') {
                const elementData = element.data as ShardFormNumberArray;
                const elementDisplay = toRawMessage(element.data.display);
                // Get value.
                const rawValue = response.formValues[index] as string;
                const value = rawValue.replaceAll(' ','').split(',').filter((value)=>{return value.length > 0});
                shardResponse.map[element.id] = value;
                // Out of range error.
                if (value.length > elementData.max || value.length < elementData.min) {
                    shardResponse.errors[element.id] = {translate:'shard.formError.outOfRangeArray',
                    with:{rawtext:[elementDisplay, {text:String(elementData.min)}, {text:String(elementData.max)}]},
                }};
                // Out of range item error.
                value.forEach(rawItem => {
                    const item = (rawItem as any) as string;
                    if (item.length > elementData.itemMax || item.length < elementData.itemMin) {
                        shardResponse.errors[element.id] = {translate:'shard.formError.outOfRangeArrayItemLength',
                        with:{rawtext:[elementDisplay, {text:String(elementData.itemMin)}, {text:String(elementData.itemMax)}]},
                    }};
                });
            };
            index += 1;
        });

        return shardResponse;
    };


    build():MessageFormData|ActionFormData|ModalFormData {
        switch (this.details.type) {
            case 'message': {return this.buildMessage()};
            case 'action': {return this.buildAction()};
            case 'modal': {return this.buildModal()};
        };
    };


    buildMessage():ActionFormData {
        const formData = new ActionFormData();
        this.elements.forEach(element => {
            if (element.type == 'title') {
                formData.title(element.data.display);
            };
            if (element.type == 'body') {
                formData.body(element.data.display);
            };
        });
        return formData;
    };


    buildAction():ActionFormData {
        const formData = new ActionFormData();
        this.elements.forEach(element => {
            if (element.type == 'title') {
                formData.title(element.data.display);
            };
            if (element.type == 'body') {
                formData.body(element.data.display);
            };
            if (element.type == 'label') {
                formData.label(element.data.display);
            };
            if (element.type == 'button') {
                const elementData = element.data as ShardFormButton;
                formData.button(elementData.display, elementData.iconPath);
            };
        });
        return formData;
    };


    buildModal():ModalFormData {
        const formData = new ModalFormData();
        // Apply error messages.
        Object.keys(this.errors).sort().forEach(key => {
            const error = this.errors[key];
            formData.label(error);
        });
        // Apply elements.
        this.elements.forEach(element => {
            if (element.type == 'title') {
                formData.title(element.data.display);
            };
            if (element.type == 'label') {
                formData.label(element.data.display);
            };
            if (element.type == 'toggle') {
                const elementData = element.data as ShardFormToggle;
                formData.toggle(element.data.display, {defaultValue:elementData.defaultValue, tooltip:elementData.tooltip});
            };
            if (element.type == 'slider') {
                const elementData = element.data as ShardFormSlider;
                formData.slider(element.data.display, elementData.min, elementData.max, {valueStep:elementData.step, defaultValue:elementData.defaultValue, tooltip:elementData.tooltip});
            };
            if (['numberBox','textBox','numberArray','textArray'].includes(element.type)) {
                const elementData = element.data as ShardFormNumberBox|ShardFormTextBox;
                formData.textField(element.data.display, elementData.placeholder, {defaultValue:String(elementData.defaultValue), tooltip:elementData.tooltip});
            };
        });
        return formData;
    };
};



// Classes & interfaces for form.
// ------------------------------


export interface ShardFormDetails {
    /**Unique form ID.*/
    id: string,
    permissionLevel: CommandPermissionLevel,
};


export interface ShardFormData {
    buildForm: (context:ShardCommandContext, ...args) => ShardFormBuilder,
    callback: (context:ShardCommandContext, response:ShardFormMessageResponse|ShardFormActionResponse|ShardFormModalResponse, ...args) => void,
    onClosed?: (context:ShardCommandContext, response:ShardFormMessageResponse|ShardFormActionResponse|ShardFormModalResponse, ...args) => void,
    onError?: (context:ShardCommandContext, response:ShardFormMessageResponse|ShardFormActionResponse|ShardFormModalResponse, ...args) => void,
};




export class ShardForm {
    readonly details: ShardFormDetails;
    buildForm: (context:ShardCommandContext, ...args) => ShardFormBuilder;
    callback: (context:ShardCommandContext, response:ShardFormMessageResponse|ShardFormActionResponse|ShardFormModalResponse, ...args) => void;
    onClosed: (context:ShardCommandContext, response:ShardFormMessageResponse|ShardFormActionResponse|ShardFormModalResponse, ...args) => void;
    onError: (context:ShardCommandContext, response:ShardFormMessageResponse|ShardFormActionResponse|ShardFormModalResponse, ...args) => void;


    constructor(details:ShardFormDetails, data:ShardFormData) {
        this.details = details;
        this.buildForm = data.buildForm;
        this.callback = data.callback;
        if (data.onClosed) {this.onClosed = data.onClosed}
        if (data.onError) {this.onError = data.onError}
    };


    /**Show the form UI to the context target, then calls `callback`.*/
    show(context:ShardCommandContext, args:Array<any>=[], builder?:ShardFormBuilder):void {
        if (context.targetType !== 'player') {return};
        const target = context.target as Player;
        if (CompareCommandPermissionLevel(target.commandPermissionLevel, this.details.permissionLevel) == false) {return};
        
        // Run in an "after" context.
        system.run(()=>{
            // Build form, if none suplied.
            if (!builder) {builder = this.buildForm(context, ...args)};
            // Show form.
            builder.build().show(target).then(response => {
                const shardResponse = builder.generateResponse(response);
                // If player cannot open the form, queue & retry every half second.
                if (response.cancelationReason == FormCancelationReason.UserBusy) {
                    system.runTimeout(this.show.bind(this,context, builder.callbackArgs), 10);
                }
                // If player closed, call `onClosed`.
                else if (response.cancelationReason == FormCancelationReason.UserClosed) {
                    if (this.onClosed) {
                        this.onClosed(context, shardResponse, ...builder.callbackArgs);
                    };
                    return;
                };
                // If any errors in form response, retry & call `onError`.
                if (builder.details.type == 'modal') {
                    const shardModalResponse = shardResponse as ShardFormModalResponse;
                    if (Object.keys(shardModalResponse.errors).length !== 0) {
                        builder.errors = shardModalResponse.errors;
                        if (this.onError) {
                            this.onError(context, shardResponse, ...builder.callbackArgs);
                        };
                        this.show(context, args, builder);
                        return;
                    };
                };
                // Callback.
                this.callback(context, shardResponse, ...builder.callbackArgs);
            });
        });
    };
};