import {ShardModule} from '../../Shard/module';
import * as mainForm from './form/main';


// Instantiate Module.
export const Module = new ShardModule(
    {
        id: 'textdisplay',
        displayName: {translate:'shard.textdisplay.displayName'},
        brief: {translate:'shard.textdisplay.brief'},
    },
    {
        childPaths: [
            'event/playerInteractWithEntity',
            'form/edit',
            'form/viewAll',
        ],
        mainForm: mainForm.MAIN,
    }
);
