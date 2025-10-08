<div align="middle">

[![Release](https://img.shields.io/github/v/release/phosxd/mc-shard)](https://github.com/phosxd/mc-shard/releases)
[![Release](https://img.shields.io/badge/Join_us!-gray?style=flat&logo=discord)](https://dsc.gg/mc-shard)

<img src="./assets/banner.png" align=""></img>

**Source version**: `0.3-dev`

Shard is an upcoming all-in-one add-on for servers & realms! With a fully modular & customizable design, Shard will have a vast multitude of management, utility, fun, survival+, & moderation modules soon.

This is not a complete build! Although the ground-work is out of the way, there are still many things subject to change & with incomplete implementations.

Please refer to [COPYING.md](./COPYING.md) for copyright details.

</div>

---

# Installation:
Shard is only available for Minecraft Bedrock 1.21.100 or higher.

**1.** Download the latest release from [Github](https://github.com/phosxd/mc-shard/releases).

Do not use the source code `BP` & `RP` packs as they use TypeScript files that need to be compiled to JavaScript.

**2.** Open the downloaded `.mcaddon` file with Minecraft, or unzip then drag the `BP` & `RP` folders to their respective locations in your Minecraft directory.

**3.** Apply the packs to your world. Make sure to apply the resource pack AND the behavior pack, one cannot work without the other.

**You do NOT need**:
- Beta-APIs.
- Any experimental features enabled.
- BDS software.

**You DO need**:
- Cheats enabled.

If you followed the instructions perfectly, upon entering your world you should receive a pretty "This server is running Shard" message.

# Usage:

<details>
<summary><b>Getting started</b></summary>

To get started, type `/sh:` in chat (but do not send) to view auto-completes for every command for every Shard module.

You can configure modules by using the `/module <module>` command. Disabling a module will disable all it's commands & events. You can also configure settings for individual commands.

There are plenty of features to play around with & so many more to come! If you need any help, join the Discord & we will try our best.

</details>

<details>
<summary><b>Utility Modules</b></summary>

## `core`:
Provides essential functionality for the add-on. Cannot be disabled.

**Settings:**
- `Send welcome message?`

**Commands:**
- `/discord`: Get the Discord invite. Link can be changed in command's settings.
- `/chain`: Run 2 commands in sequence.
- `/condition`: Run command if condition returns trye.
- `/repeat`: Repeat a command.
- `/eval`: Run code with variable formatting. Intended for developer use only.
- `/hc.load`: Load hard-copy data.
- `/hc.print.entity`: Print an entity as a hard-copy. Some components, & entity variants are not copied.
- `/module`: Configure a module.
- `/module.data.print`: Print module data. Deprecating.
- `/module.data.load`: Load custom module data. Deprecating.
- `/module.property`: Set or print module property. Set value to "undefined" to delete.
- `/module.property.ids`: List all module properties.
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

**Commands:**
- `/c, /s, /a, /p`: Change game-mode.
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
- `/inventory`: Manage player or global inventories.
- `/inventory.list`: List all saved inventories.

## `display`:
Provides tools for interacting with display entities for holographic text & bossbars.

**Commands:**
- `/adddisplay`: Summon a new display entity.

</details>

<details>
<summary><b>Functional Modules</b></summary>

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
- `sh.st.is[Jumping,Sneaking,Sprinting,Swimming,Falling,Flying,Gliding,Climbing,Sleeping,Emoting]`

## `clutter`:
Removes large groups of entities.

**Settings:**
- `Group radius`: Radius size of entity groups.
- `Count threshold`: Amount of entities that need to be in a group to be removed.
- `Countdown`: Countdown before entities are removed.
- `Countdown text`: Countdown text displayed at entity groups.
- `Exclude named?`: Excludes all named entities.
- `Include items?`: Include all items & xp orbs.
- `Include projectiles?`: Include entities like arrow, snowball, ender pearl, & wind charge.
- `Include passive mobs?`: Include entities like cow, pig, sheep, & chicken.
- `Include hostile mobs?`: Include mobs like zombie, creeper, skeleton, & spider.

## `blacklist`:
Removes blacklisted items from normal players.

**Commands:**
- `/blacklist`: Manage the blacklist.
- `/blacklistpreset`: Load a blacklist preset.

## `border`:
Provides border tools. This is mostly unfinished as there is only 1 style & no support for non-inverted borders yet.

**Upcoming Features:**
- `More Border Styles`
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
- `Player Use Item`
- `Player Drop Item`
- `Explosion`

**Commands:**
- `/addregion`: Add a new region.
- `/removeregion`: Remove a region.
- `/editregion`: Edit a region.
- `/listregions`: List all regions.

## `event`:
Run advanced commands on world events.

**Events:**
- `playerDimensionChange`
- `playerPlaceBlock`
- `playerBreakBlock`
- `playerInteractWithBlock`
- `playerInteractWithEntity`
- `playerUseItem`
- `playerDropItem`
- `playerSpawn`
- `entityDie`
- `explosion`
- `buttonPush`

**Upcoming Events:**
- `playerStartSprint` / `playerStopSprint`
- `playerStartJump` / `playerStopJump`
- `playerStartSneak` / `playerStopSneak`

**Commands:**
- `/addevent`: Add a new event.
- `/removeevent`: Remove an event.
- `/editevent`: Edit an event.
- `/listevents`: List all events.
- `/eventvariables`: List all variables for an event. For advanced users.

</details>

<details>
<summary><b>Anti-Cheat Modules</b></summary>

## `antixray`:
Prevents Xray from finding valueable ores.

**Settings:**
- `Spoof Distance`
- `Spoof Interval`

**Commands:**
- `/antixray.forcespoof`: Force spoof all ores in volume.
- `/antixray.unspoof`: Unspoof all ores in volume.
- `/antixray.wipespoofs`: Unspoof all ores in the world. At least 1 ticking-area slot must be available!

</details>

<details>
<summary><b>Other Modules</b></summary>

## `draw`:
Provides tools for rendering shapes in the world using particles.

**Commands:**
- `/drawcuboid`: Renders a cuboid for the targets. "options" expects valid JSON, see "/sh:drawoptions" for option list.
- `/drawoptions`: List all drawing options.

## `generator`:
Provides tools for generating custom terrain.

**Upcoming features:**
- `3D noise capability`
- `UI for custom terrain editor`

**Commands:**
- `/foreachblock`: Run a command on every block in the volume.
- `/generate`: Generate custom terrain.
- `/addterrain`: Add custom terrain. Expects a valid `Terrain` JSON Object.
- `/removeterrain`: Remove custom terrain.

</details>

<details>
<summary><b>Upcoming Modules</b></summary>

Join the Discord to see more potential modules. There are plently more modules that I have not listed here or on the Discord because either I am not sure I want to make it, or it may only be possible with Beta-APIs.
- `sidebar`: Manages the right sidebar visible to all players. Includes commands for editing & modifying it.
- `capitator`: Quickly mine trees & ores. Would work with durability, silk touch, & fortune.

</details>
