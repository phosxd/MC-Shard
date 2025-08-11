/**Using this until custom commands support returning raw-text in their reply messages.
 * I am currently using my own raw-text parser to simulate raw-text so that when support comes it's a clean switch.
 * 
 * All texts are also defined in `RP/texts`. Command texts can be found there too, however they are not used.
*/
export const LANG = {
    shard: {
        misc: {
            commandModuleDisabled: '§cEnable the §e%s§c module to use this command.',
            commandDisabled: '§cThis command is disabled.',
            commandUnavailable: '§cThis command is unavailable.',
        },
        core: {
            displayName: '§0[§5Shard§0]§r',
            description: 'Handles core functionality & module management.',
            cmd: {
                discord: {
                    success: '§9dsc.gg/mc-shard',
                },
                module: {
                    info: '§5ID: §e%s§r\n§5Description: §e%s§r\n§5Commands: §r%s§r',
                    disabled: 'Disabled module §e%s§r.',
                    cannotDisable: 'Cannot disable §e%s§r module.',
                    enabled: 'Enabled module §e%s§r.',
                    clearData: 'Deleted all data for the §e%s§r module.',
                    printData: 'Printing all data for the §e%s§r module. Data can be accessed in server logs.',
                },
            },
        },
        util: {
            displayName: '§0[§5Simple Utility§0]§r',
            description: 'Provides various helpful commands.',
            cmd: {
                drain: {
                    success: 'Removing all liquid blocks in a radius of %s. This may take a while if using a large radius.',
                    radiusOutOfBounds: 'Radius must be between 1 & 50.',
                },
                dupe: {
                    success: 'Duplicated %s §e%s§r.',
                    noItem: '§cYou need to be holding an item.',
                },
                eat: {
                    success: 'Replenished %s entities.',
                },
                enflame: {
                    success: 'Set %s entities on fire for %s seconds.',
                    extinguish: 'Removed fire from %s entities.',
                },
                explode: {
                    success: 'Created a new explosion at %s.',
                },
                freeze: {
                    success: 'Froze %s entities for %s seconds.',
                },
                heal: {
                    success: 'Healed %s entities.',
                },
                push: {
                    success: 'Applied an impulse to %s entities.',
                },
                pushchat: {},
                rename: {
                    successEntity: 'Renamed %s entities to "%s".',
                    successItem: 'Renamed items held by %s entities to "%s".',
                },
                setslot: {
                    success: 'Set %s players\' slot to %s.',
                    slotIndexOutOfRange: 'Slot index must be between 0 & 8.',
                },
            },
        },
    },
};


/**Returns the item from LANG using the standard MC translation path format.*/
export function translate(path:string):any {
    let splitPath:Array<string> = path.split('.');
    let current = LANG;
    splitPath.forEach(item => {
        current = current[item];
    });

    return current;
};