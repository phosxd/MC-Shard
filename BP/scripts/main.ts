// This is the initial file for Shard.
// Initializes all other required files.
//
// Navigate to the "CONST" file under "ShardAPI" to configure hard-coded values.


import './ShardAPI/CONST';
import './ShardAPI/LANG';
import './ShardAPI/util';
import './ShardAPI/raw_message_parser';

// Interfaces.
import './ShardAPI/command_context';
import './ShardAPI/command_result';
import './ShardAPI/form_build_result';

// Classes.
import './ShardAPI/module';
import './ShardAPI/event_listener';
import './ShardAPI/command';
import './ShardAPI/form';

// Init modules.
import './modules/modules';