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
            missingPermission: '§cYou do not have permission to do this.',
            targetLocationOutOfBounds: '§cTarget location is out of bounds.',
            targetLocationObstructed: '§cTarget location is obstructed.',
            woosh: 'Woosh!',
            moduleOption: {
                commands: 'Commands',
                settings: 'Settings',
            },
        },
        formCommon: {
            done: 'Done',
            dismiss: 'Dismiss',
            okay: 'Okay',
            yes: 'Yes',
            no: 'No',
        },
        core: {
            displayName: '§r[§dShard§r]',
            brief: 'Handles core functionality & module management.',
            cmd: {
                discord: {
                    success: '§9%s',
                },
                eval: {
                    run: 'Running provided code now.',
                },
                module: {
                    info: '\n§5ID: §e%s§r\n§5Description: §e%s§r\n§5Commands: §r%s§r',
                    disabled: 'Disabled module §e%s§r.',
                    cannotDisable: 'Cannot disable §e%s§r module.',
                    enabled: 'Enabled module §e%s§r.',
                    clearData: 'Deleted all data for the §e%s§r module.',
                    printData: 'Printing all data for the §e%s§r module. Data can be accessed in server logs.',
                },
                shardMemory: {
                    success: '\n§5Disk Space Used: §e%sMB (%s Bytes)§r\n§4If disk space is over 5MB, something may be wrong & you should try clearing data on some modules.',
                },
            },
        },
        util: {
            displayName: '§r[§gSimple Utility§r]',
            brief: 'Provides various helpful commands.',
            cmd: {
                despawn: {
                    success: 'Removed %s entities.',
                },
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
                rename: {
                    successEntity: 'Renamed %s entities to "%s".',
                    successItem: 'Renamed items held by %s entities to "%s".',
                },
                setSlot: {
                    success: 'Set %s players\' slot to %s.',
                    slotIndexOutOfRange: 'Slot index must be between 0 & 8.',
                },
                repair: {
                    success: 'Repaired §e%s§r.',
                    failure: '§e%s§c cannot be repaired.',
                    noItem: '§cYou need to be holding an item.',
                },
                thru: {
                    noBlocks: 'No blocks in range to teleport through.',
                    tooThick: 'Wall is too thick to teleport through.',
                },
            },
        },
        tracker: {
            displayName: '§r[§3Tracker§r]',
            brief: 'Provides entity statistics & current entity state tracking.',
        },
        textdisplay: {
            displayName: '§0[§5Text Display§0]§r',
            brief: 'Provides tools for interacting with text display entities for holographic text & bossbars.',
        },
        border: {
            displayName: '§r[§gBorder§r]',
            brief: 'Provides border tools.',
            cmd: {
                addBorder: {
                    success: 'Added new border "§e%s§r" starting from %s & ending at %s.',
                    nameTaken: '§cCannot create border with duplicate name.',
                    invalidStyle: '§cCannot create border with invalid style. Available styles: %s.',
                    mustBeInverted: '§cNormal borders are not yet supported, only inverted borders should be created.',
                },
                removeBorder: {
                    success: 'Removed border "§e%s§r".',
                    doesNotExist: '§cCannot delete a border that does not exist.',
                },
                listBorders: {
                    success: 'All Borders: %s',
                    noBorders: '§cThere are currently no borders.',
                },
            },
            form: {},
        },
        region: {
            displayName: '§r[§gRegion§r]',
            brief: 'Provides regions to edit world mutability & player abilities.',
            cmd: {
                addRegion: {
                    success: 'Added new region "§e%s§r" starting from %s & ending at %s.',
                    nameTaken: '§cCannot create border with duplicate name.',
                },
                editRegion: {
                    doesNotExist: ' §cCannot edit a region that does not exist.',
                },
                removeRegion: {
                    success: 'Removed region "§e%s§r".',
                    doesNotExist: '§cCannot delete a region that does not exist.',
                },
                listRegions: {
                    success: 'All Regions: %s',
                    noRegions: '§cThere are currently no regions.',
                },
            },
            form: {},
        },
        draw: {
            displayName: '§r[§cD§er§aa§9w§r]',
            brief: 'Provides tools for rendering shapes in the world using particles.',
            cmd: {
                drawsquare: {
                    success: 'Rendering sqaure at %s for %s clients.',
                },
                drawcuboid: {
                    success: 'Rendering cuboid at %s for %s clients.',
                },
            },
        },
        fun: {
            displayName: '§r[§dFun§r]',
            brief: 'Some silly stuff.',
            cmd: {
                crash: {
                    success: 'Well, you asked for this...',
                },
                party: {
                    success: 'Now partying with %s friends!',
                    noFriends: 'Trying to party by yourself? Sadge...',
                    alreadyPartying: '§cYou are already partying!',
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