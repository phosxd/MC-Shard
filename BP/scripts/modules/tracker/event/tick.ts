import {Player} from '@minecraft/server';
import {ShardListener} from '../../../Shard/listener';
import {Dictionary} from '../../../Shard/CONST';
import {GetAllEntities} from '../../../Shard/util';
import {Scoreboards, scoreboardsReady} from '../module';




function Callback(data:Dictionary<any>) {
    if (scoreboardsReady == false) {return data};

    GetAllEntities({tags:['sh.tk.timePlayed']}).forEach(entity => {
        // Add 1 tick to "time played" scoreboard.
        Scoreboards['sh.tk.timePlayed.t'].addScore(entity, 1);
        Scoreboards['sh.tk.timePlayed.tt'].addScore(entity, 1);
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

    GetAllEntities({tags:['sh.tk.mobileState']}).forEach(entity => {
        if (entity.isClimbing) {entity.addTag('sh.st.isClimbing')}
        else {entity.removeTag('sh.st.isClimbing')};
        if (entity.isFalling) {entity.addTag('sh.st.isFalling')}
        else {entity.removeTag('sh.st.isFalling')};
        if (entity.isSleeping) {entity.addTag('sh.st.isSleeping')}
        else {entity.removeTag('sh.st.isSleeping')};
        if (entity.isSneaking) {entity.addTag('sh.st.isSneaking')}
        else {entity.removeTag('sh.st.isSneaking')};
        if (entity.isSprinting) {entity.addTag('sh.st.isSprinting')}
        else {entity.removeTag('sh.st.isSprinting')};
        if (entity.isSwimming) {entity.addTag('sh.st.isSwimming')}
        else {entity.removeTag('sh.st.isSwimming')};
        // Player only tags.
        if (entity.typeId !== 'minecraft:player') {return};
        const player = entity as Player;
        if (player.isEmoting) {player.addTag('sh.st.isEmoting')}
        else {player.removeTag('sh.st.isEmoting')};
        if (player.isFlying) {player.addTag('sh.st.isFlying')}
        else {player.removeTag('sh.st.isFlying')};
        if (player.isGliding) {player.addTag('sh.st.isGliding')}
        else {player.removeTag('sh.st.isGliding')};
        if (player.isJumping) {player.addTag('sh.st.isJumping')}
        else {player.removeTag('sh.st.isJumping')};
    });

    return data;
};




// Initialize event listener.
export const MAIN = new ShardListener(
    {source:'shard', type:'after', eventId:'tick'},
    {callback: Callback},
);