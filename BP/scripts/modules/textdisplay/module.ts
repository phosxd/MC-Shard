import {ShardModule} from '../../Shard/module';
import * as mainForm from './forms/main';


// Instantiate Module.
export const Module = new ShardModule(
    {
        id: 'textdisplay',
        displayName: {translate:'shard.textdisplay.displayName'},
        brief: {translate:'shard.textdisplay.brief'},
    },
    {
        childPaths: [
            'events/playerInteractWithEntity',
            'forms/edit',
            'forms/viewAll',
        ],
        mainForm: mainForm.MAIN,
    }
);
