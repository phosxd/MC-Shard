import {ShardModule} from '../../Shard/module';
import CommandEnums from './commandEnums';


// Instantiate Module.
export const Module = new ShardModule(
    {
        id: 'template',
        displayName: {text:'[Template]'},
        brief: {text:'Module template.'},
    },
    {
        childPaths: [
            'event/example',
            'cmd/example',
            'form/example'
        ],
        commandEnums: CommandEnums,
        settingElements: [
            {type:'toggle', id:'exampleSetting', data:{display:'Example Setting', defaultValue:true}},
        ],
    },
);