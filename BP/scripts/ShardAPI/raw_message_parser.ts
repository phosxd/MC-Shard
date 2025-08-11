import {MC} from './CONST';
import {translate} from './LANG';


/**Attempts to replicate the functionality you would get if you sent a raw message in Minecraft.
 * 
 * `score` parameter has no effect.
 * 
 * Translating with a raw message with parameters other than "rawtext" will have no affect.
*/
export function rawMessageToString(message:MC.RawMessage):string {
    let parsed:string = '';

    if (message.text) {
        parsed += message.text;
    };

    if (message.rawtext) {
        message.rawtext.forEach(item => {
            parsed += rawMessageToString(item);
        });
    };

    if (message.translate) {
        let translation:string = translate(message.translate);
        if (message.with) {
            if (message.with instanceof Array) {
                message.with.forEach(item => {
                    translation = translation.replace('%s',item);
                });
            }
            // Translate to a raw message with rawtext parameter.
            else if (message.with.rawtext) {
                message.with.rawtext.forEach(item => {
                    translation = translation.replace('%s',rawMessageToString(item));
                });
            };
        };
        parsed += translation;
    };

    return parsed;
};