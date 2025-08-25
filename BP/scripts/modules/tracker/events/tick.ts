import {world, system, Player, Entity} from '@minecraft/server';
import ShardEventListener from '../../../ShardAPI/event_listener';
import {Dictionary} from '../../../ShardAPI/CONST';
import {GetAllEntities} from '../../../ShardAPI/util';
import {Scoreboards, scoreboardsReady} from '../module';




function Callback(data:Dictionary<any>) {
    if (scoreboardsReady == false) {return data};

    if (!data.allEntities) {data.allEntities = GetAllEntities()};
    const allEntities = data.allEntities as Array<Entity>;


    allEntities.forEach(entity => {
        // Add 1 tick to "time played" scoreboard.
        Scoreboards['sh.tk.timePlayed.t'].addScore(entity, 1);
        // Transfer to seconds.
        if (Scoreboards['sh.tk.timePlayed.t'].getScore(entity) >= 20) {
            Scoreboards['sh.tk.timePlayed.t'].setScore(entity, 0);
            Scoreboards['sh.tk.timePlayed.s'].addScore(entity, 1);
        };
        // Transfer to minutes.
        if (Scoreboards['sh.tk.timePlayed.s'].getScore(entity) >= 60) {
            Scoreboards['sh.tk.timePlayed.s'].setScore(entity, 0);
            Scoreboards['sh.tk.timePlayed.m'].addScore(entity, 1);
        };
        // Transfer to hours.
        if (Scoreboards['sh.tk.timePlayed.m'].getScore(entity) >= 60) {
            Scoreboards['sh.tk.timePlayed.m'].setScore(entity, 0);
            Scoreboards['sh.tk.timePlayed.h'].addScore(entity, 1);
        };
        // Transfer to days.
        if (Scoreboards['sh.tk.timePlayed.h'].getScore(entity) >= 24) {
            Scoreboards['sh.tk.timePlayed.h'].setScore(entity, 0);
            Scoreboards['sh.tk.timePlayed.d'].addScore(entity, 1);
        };
    });

    return data;
};




// Initialize event listener.
export const EventListener:ShardEventListener = new ShardEventListener(
    'shard',
    'after',
    'tick',
    Callback,
);