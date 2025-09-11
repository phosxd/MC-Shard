Shard is an upcoming all-in-one add-on for servers & realms! With a fully modular & customizable design, Shard will have a vast multitude of management, utility, fun, survival+, & moderation modules soon.

This is not a complete build! Although the ground-work is out of the way, there are still many things subject to change & with incomplete implementations.

Version: **0.2** (in-dev).

# Installation:
Shard is only available for Minecraft Bedrock 1.21.100 or higher.
- Download the latest release on [Github](https://github.com/phosxd/mc-shard) or [Discord](https://dsc.gg/mc-shard).
- Double click or open the downloaded `.mcaddon` file.
- Apply the pack to your world. Make sure to apply the resource pack AND the behavior pack.

You DO NOT need:
- Beta-APIs.
- Any experimental features enabled.

You DO need:
- Cheats enabled.

If you followed the instructions perfectly, when entering your world you should receive a pretty "This server is running Shard" message.

# Getting started:
To get started, type `/sh:` in chat (but do not send) to view auto-completes for every command for every Shard module.

You can configure modules by using the `/module <module>` command. Disabling a module will disable all it's commands & events. You can also configure settings for individual commands.

There are plenty of features to play around with & so many more to come! If you need any help, join the Discord & we will try our best.

# Modules:
## `core`:
Provides essential functionality for the add-on. Cannot be disabled.

**Commands:**
- `/discord`: Get the Discord invite. Link can be changed in settings.
- `/eval`: Run TypeScript code in an uncontrolled environment. Intended for developer use only.
- `/hc.load`: Load hard-copy data. If text is too long, use a command block.
- `/hc.print.entity`: Print an entity as a hard-copy. Some components, & entity variants are not copied.
- `/module`: Configure a module.
- `/module.data.print`: Print module data.
- `/module.data.load`: Load custom module data.
- `/repeat`: Repeats a command.
- `/shard`: Shard info.
- `/shardmemory`: Shard memory info.


## `util`:
Provides various useful & handy commands. Not finished, more commands will be added.
Some commands may also be removed from this module & re-implemented in other modules.

**Upcoming Commands:**
- `/lore`: Add lore text to an item.
- `/signtext`: Replace the text of a sign.
- `/cloneentity`: Clone an entity with all it's properties.
- `/qcopy`: Save the targeted block.
- `/qpaste`: Load the saved block.
- `/qrotate`: Rotate the targeted block.
- `/inventory`: Save or load an inventory.
- `/hotbar`: Save or load a hotbar.

**Commands:**
- `/c, /s, /a, /sp`: Change user's game-mode. Far quicker than `/gamemode`.
- `/pushchat`: Pushes all previous chat messages off-screen.
- `/suicide`: Kill's the user. Useful if stuck.
- `/despawn`: Remove entities without death animations & without dropping loot/XP. Cannot use on players.
- `/heal`: Heals all health.
- `/eat`: Replenishes all hunger bars.
- `/setslot`: Set the selected hotbar slot.
- `/up`: Teleport up with a platform.
- `/thru`: Teleport through a wall 3 blocks or less thick.
- `/drain`: Remove liquid blocks in a radius.
- `/push`: Pushes an entity towards the location. Cannot be applied to items. May be unreliable when applied to players.
- `/enflame`: Set entities on fire. Enflame with 0 time to remove fire.
- `/freeze`: Freezes an entity so it cannot move or turn. Freeze with 0 time to unfreeze.
- `/explode`: Create an explosion.
- `/repair`: Repair the item in your hand.
- `/dupe`: Duplicate the item in your hand.
- `/rename`: Rename entities or held items.

## `tracker`:
Provides entity statistics & current entity state tracking. Data is stored in scoreboards, or "sh.st" tags. Tracker tags must be applied to entities you want to track.

**Upcoming Features:**
- `/stats`: Command to view stats of an entity.

**Scoreboards:**
- `sh.tk.timePlayed.tt`: Time played in total ticks.
- `sh.tk.timePlayed.t`: Time played in ticks.
- `sh.tk.timePlayed.s`: Time played in seconds.
- `sh.tk.timePlayed.m`: Time played in minutes.
- `sh.tk.timePlayed.h`: Time played in hours.
- `sh.tk.timePlayed.d`: Time played in days.
- `sh.tk.playerJoins`: Player join count.
- `sh.tk.playerDeaths`: Player death count.
- `sh.tk.holdingSlot`: Slot index the player is holding.
- `sh.tk.health`: Entity health.

**Trackers:**
- `sh.tk.timePlayed`
- `sh.tk.playerJoins`
- `sh.tk.playerDeaths`
- `sh.tk.holdingSlot`
- `sh.tk.health`
- `sh.tk.mobileState`

**States:**
- `sh.st.is[Jumping,Sneaking,Sprinting,Swimming,Falling,Flying,Gliding,Climbing,Sleeping,Emoting`

## `textdisplay`:
Provides tools for interacting with text display entities for holographic text & bossbars.

## `border`:
Provides border tools. This is mostly unfinished as there is no style editor & only 1 default style ("hidden"). There is also no support for non-inverted borders yet.

**Upcoming Features:**
- `Border Style Editor`: In the `border` module settings there will be UI where you can create border styles with options like flat color, physical blocks as border, particles, & render distance.
- `Border Message`: In `border` module settings you will be able to set the message that the player sees when colliding with a border.

**Commands:**
- `/addborder`: Add a new border. Set inverted for world border.
- `/removeborder`: Remove a border.
- `/listborders`: List all borders.

## `region`:
Provides regions to edit world mutability & player abilities. Can also run commands on region events.

**Events:**
- `Tick` / `Entity Tick`
- `Entity Enter` / `Entity Exit`
- `Player Place Block`
- `Player Break Block`
- `Player Interact With Block`
- `Player Drop Item`
- `Explosion`

**Commands:**
- `/addregion`: Add a new region.
- `/removeregion`: Remove a region.
- `/listregions`: List all regions.

## `draw`:
Provides tools for rendering shapes in the world using particles.

**Commands:**
- `/drawcuboid`: Renders a cuboid for the targets. "options" expects valid JSON, see "/sh:drawoptions" for option list.
- `/drawoptions`: List all drawing options.

# Upcoming Modules:
Join the Discord to see more potential modules. There are plently more modules that I have not listed here or on the Discord because either I am not sure I want to make it, or it may only be possible with Beta-APIs.
- `clutter`: Removes dense groups of entities over a certain threshold. Can be configured to target or ignore certain entities.
- `blacklist`: Blacklist certain entities, items, & blocks for regular players. Includes commands for summoning entities that wont be cleared by the blacklist.
- `sidebar`: Manages the right sidebar visible to all players. Includes commands for editing & modifying it.
