export {MC, MCUI, EventIds, MCData, ready};
import * as MC from '@minecraft/server';
import * as MCUI from '@minecraft/server-ui';

enum EventIds {
    onTick,
    beforeWeatherChange,
    beforeExplosion,
    afterGameRuleChange,
    afterWeatherChange,
    afterExplosion,

    // Player Events.
    onPlayerFirstJoin,
    beforePlayerLeave,
    beforePlayerInteractWithEntity,
    beforePlayerInteractWithBlock,
    beforePlayerBreakBlock,
    beforePlayerGameModeChange,
    afterPlayerSpawn,
    afterPlayerJoin,
    afterPlayerLeave,
    afterPlayerInteractWithEntity,
    afterPlayerInteractWithBlock,
    afterPlayerPlaceBlock,
    afterPlayerBreakBlock,
    afterPlayerButtonInput,
    afterPlayerDimensionChange,
    afterPlayerGameModeChange,
    afterPlayerInputModeChange,
    afterPlayerEmote,

    // Item Events.
    beforeItemUse,
    afterItemUse,
    afterItemStartUse,
    afterItemStopUse,
    afterItemStartUseOn,
    afterItemStopUseOn,
    afterItemRelease,
    afterItemCompleteUse,

    // Block Events.
    afterBlockExplode,
    afterButtonPush,
    afterLeverAction,
    afterTripWireTrip,
    afterTargetBlockHit,
    afterPistonActivate,
    afterPressurePlatePop,
    afterPressurePlatePush,

    // Entity Events.
    beforeEntityRemove,
    afterEntitySpawn,
    afterEntityLoad,
    afterEntityRemove,
    afterEntityDie,
    afterEntityHurt,
    afterEntityHealthChanged,
    afterEntityHitEntity,
    afterEntityHitBlock,
    afterProjectileHitEntity,
    afterProjectileHitBlock,
};

var ready:boolean = false; // Determines whether or not the API is ready to be used.
MC.system.run(() => {
    ready = true;
    MC.world.beforeEvents
    MC.world.afterEvents.
});



// API for persistent data.
const MCData:Object = {
    // Get persistent data.
    'get': (key:string, Holder=MC.world) => {
        let result:Array<any> = [];
        let i = -1;
        while (true) {
            i += 1;
            let x = Holder.getDynamicProperty(`${key}[${i}]`);
            if (x === undefined) {break}
            else {result.push(x)};
        };
        if (result.length === 0) {return undefined};
        //console.warn(result.join(''));
        return JSON.parse(result.join(''));
    },

    // Set persistent data.
    'set': (key:string, value, Holder = MC.world) => {
        if (typeof value !== 'object') {
            console.warn(`ERROR MCData.set: "value" should be an object.`);
            return;
        };
        let stringValue = JSON.stringify(value);
        // Dynamic properties must be split when they are large enough due to the limits imposed by the Minecraft Server API.
        let parts = Math.round(stringValue.length / 9500);
        if (parts < 1) { parts = 1; };
        let splitValue = UTL.SplitString(stringValue, parts);
        for (let i:number = 0; i < parts; i++) {
            Holder.setDynamicProperty(`${key}[${i}]`, splitValue[i]);
        };
    },
};



function BindEvent(eventId:)