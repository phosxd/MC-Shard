/**
 * Using this until custom commands support returning raw-text in their reply messages.
 * I am currently using my own raw-text parser to simulate raw-text so that when support comes it's a clean switch.
 * 
 * All texts are also defined in `RP/texts`. Command texts can be found there too, however they are not used.
*/
export const LANG = {
    shard: {
        misc: {
            commandModuleDisabled: '§cEnable the §7%s§c module to use this command.',
            commandDisabled: '§cThis command is disabled.',
            commandUnavailable: '§cThis command is unavailable.',
            missingPermission: '§cYou do not have permission to do this.',
            targetLocationOutOfBounds: '§cTarget location is out of bounds.',
            targetLocationObstructed: '§cTarget location is obstructed.',
            createDuplicateName: '§cCannot create with duplicate name.',
            createInvalidParam: '§cCannot create with invalid %s.',
            playerNotFound: '§cCannot find player.',
            woosh: 'Woosh!',
        },
        error: {
            playerNotFound: '§cCannot find player.',
            missingPermission: '§cYou do not have permission to do this.',
            commandDisabled: '§cThis command is disabled.',
            commandModuleDisabled: '§cEnable the §7%s§c module to use this command.',
            invalidOption: '§c"%s" is not a valid option.',
            duplicateName: '§cExpected unique name.',
            invalidName: '§cName contains invalid characters.',
            outOfRange: '§c"%s" should be between %s & %s.',
            outOfRangeLength: '§c"%s" length should be between %s & %s.',
            outOfRangeArray: '§c"%s" item count should be between %s & %s.',
            outOfRangeArrayItem: '§c"%s" item value should be between %s & %s.',
            outOfRangeArrayItemLength: '§c"%s" item length should be between %s & %s.',
            invalidStep: '§c"%s" expected a step of %s.',
            invalidNumber: '§c"%s" expected a valid number.',
            invalidLocation: '§c"%s" expected a valid location.',
            invalidSelector: '§c"%s" expected a valid entity selector.',
            invalidCharacters: '§c"%s" contains invalid characters.',
        },
        core: {
            displayName: '§r[§dShard§r]',
            brief: 'Handles core functionality & module management.',
            cmd: {
                discord: {
                    success: '§9%s',
                },
                eval: {
                    success: 'Running the code now.',
                },
                module: {
                    info: '\n§5ID: §7%s§r\n§5Description: §7%s§r\n§5Commands: §r%s§r',
                    disabled: 'Disabled module §7%s§r.',
                    cannotDisable: '§cCannot disable §7%s§c module.',
                    enabled: 'Enabled module §7%s§r.',
                    clearData: 'Deleted all data for the §7%s§r module.',
                },
                shardMemory: {
                    success: '\n§5Disk Space Used: §7%sMB (%s Bytes)§r\n§4If disk space is over 5MB, something may be wrong & you should try clearing data on some modules.',
                },
                popup: {
                    success: 'Sent popup to %s clients.',
                },
            },
        },
        util: {
            displayName: '§r[§gSimple Utility§r]',
            brief: 'Provides various helpful commands.',
            common: {
                noItem: '§cYou need to be holding an item.',
            },
            cmd: {
                despawn: {
                    success: 'Removed %s entities.',
                },
                disenchant: {
                    success: 'Disenchanted §7%s§r.',
                    noEnchantable: '§7%s§c cannot be disenchanted.',
                    invalidEnchantment: '§7%s§c is not a valid enchantment.'
                },
                drain: {
                    success: 'Removing all liquid blocks in a radius of %s. This may take a while if using a large radius.',
                    radiusOutOfBounds: '§cRadius must be between 1 & 50.',
                },
                dupe: {
                    success: 'Duplicated %s §7%s§r.',
                },
                durability: {
                    success: 'Set durability damage to §7%s/%s§r.',
                    noDurability: '§7%s§c does not have durability.',
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
                inventory: {
                    saveSuccess: 'Saved (global?: %s) inventory as §7%s§r.',
                    loadSuccess: 'Loaded (global?: %s) inventory §7%s§r.',
                    deleteSuccess: 'Deleted inventory §7%s§r for %s.',
                    doesNotExist: '§cInventory §7%s§c does not exist for "§7%s§c".',
                    couldNotLoad: '§cCould not load saved inventory §7%s§c from "§7%s§c". Data may be corrupted or missing.',
                },
                inventoryList: {
                    success: 'All saved inventories: %s',
                },
                push: {
                    success: 'Applied an impulse to %s entities.',
                },
                rename: {
                    successEntity: 'Renamed %s entities to "§7%s§r".',
                    successItem: 'Renamed items held by %s entities to "§7%s§r".',
                },
                setSlot: {
                    success: 'Set %s players\' slot to %s.',
                    slotIndexOutOfRange: 'Slot index must be between 0 & 8.',
                },
                repair: {
                    success: 'Repaired §7%s§r.',
                    failure: '§7%s§c cannot be repaired.',
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
        display: {
            displayName: '§0[§5Display§0]§r',
            brief: 'Provides tools for interacting with display entities for holographic text & bossbars.',
            cmd: {
                addDisplay: {
                    success: 'Summoned "%s" at %s.',
                },
            },
        },
        blacklist: {
            displayName: '§r[§gBlacklist§r]',
            brief: 'Removes blacklisted items from normal players.',
            cmd: {
                blacklistPreset: {
                    success: 'Loaded preset §7%s§r.',
                },
            },
        },
        clutter: {
            displayName: '§r[§gClutter§r]',
            brief: 'Removes large groups of entities.',
        },
        border: {
            displayName: '§r[§gBorder§r]',
            brief: 'Provides border functionality.',
            cmd: {
                addBorder: {
                    success: 'Added new border "§7%s§r" starting from %s & ending at %s.',
                    nameTaken: '§cCannot create border with duplicate name.',
                    invalidStyle: '§cCannot create border with invalid style. Available styles: %s.',
                },
                removeBorder: {
                    success: 'Removed border "§7%s§r".',
                    doesNotExist: '§cCannot delete a border that does not exist.',
                },
                listBorders: {
                    success: 'All Borders: %s',
                    none: '§cThere are currently no borders.',
                },
            },
            form: {},
        },
        region: {
            displayName: '§r[§gRegion§r]',
            brief: 'Provides regions to edit world mutability & player abilities.',
            cmd: {
                addRegion: {
                    success: 'Added new region "§7%s§r" starting from %s & ending at %s.',
                    nameTaken: '§cCannot create region with duplicate name.',
                },
                editRegion: {
                    doesNotExist: ' §cCannot edit a region that does not exist.',
                },
                removeRegion: {
                    success: 'Removed region "§7%s§r".',
                    doesNotExist: '§cCannot delete a region that does not exist.',
                },
                listRegions: {
                    success: 'All Regions: %s',
                    none: '§cThere are currently no regions.',
                },
            },
            form: {},
        },
        draw: {
            displayName: '§r[§cD§7r§aa§9w§r]',
            brief: 'Provides tools for rendering shapes in the world using particles.',
            cmd: {
                drawCuboid: {
                    success: 'Rendering cuboid at %s for %s clients.',
                },
                drawOptions: {
                    success: 'All drawing options:\n- §7alpha_fade_in\n§r- §7alpha_sustain\n§r- §7alpha_fade_out\n§r- §7size_x_fade_in\n§r- §7size_x_sustain\n§r- §7size_x_fade_out\n§r- §7size_y_fade_in\n§r- §7size_y_sustain\n§r- §7size_y_fade_out',
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
                    alreadyPartying: '§cCannot do that now.',
                },
            },
        },
        event: {
            displayName: '§r[§gEvent§r]',
            brief: 'Run advanced commands on world events.',
            cmd: {
                addEvent: {
                    success: 'Added new event "§7%s§r".',
                },
                removeEvent: {
                    success: 'Removed event "§7%s§r".',
                    doesNotExist: '§cCannot delete an event that does not exist.',
                },
                editEvent: {
                    success: 'Edit an event.',
                    doesNotExist: '§cCannot edit an event that does not exist.',
                },
                listEvents: {
                    none: '§cThere are currently no events.',
                    success: 'All Events: %s',
                },
                eventVariables: {
                    success: 'Variables can be used in event commands (E.g. "${player.name}" or "${player.hasTag(\'example\')}").\nVariables for "§7%s§r": %s',
                },
            },
        },
        antixray: {
            displayName: '§r[§4Anti-Xray§r]',
            brief: 'Prevents Xray from finding valueable ores.',
            cmd: {
                forceSpoof: {
                    success: 'Force spoofing all ores between %s & %s. Result will be sent after complete.',
                    result: '§aForce spoofed %s ores.',
                },
                unspoof: {
                    success: 'Unspoofing all ores between %s & %s. Result will be sent after complete.',
                    result: '§aUnspoofed %s ores.',
                },
                wipeSpoofs: {
                    success: 'Unspoofing all ores in the world. Result will be sent after complete.',
                    inProgress: '§cUnspoofing already in progress. §7%s/%s§c complete.',
                    failed:'§cCould not finish unspoofing job for an unknown reason. Try again.',
                },
            }
        },
        capitator: {
            displayName: '§r[§2Capitator§r]',
            brief: 'Quickly mine trees & ores',
        },
        generator: {
            displayName: '§r[§6Generator§r]',
            brief: 'Provides tools for generating custom terrain.',
            cmd: {
                forEachBlock: {
                    success: 'Running now.',
                },
                generate: {
                    success: 'Running now.',
                },
                smoothen: {
                    success: 'Running now.',
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