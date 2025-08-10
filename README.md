Shard is an upcoming all-in-one add-on for servers & realms! With a fully modular & customizable design, Shard will have a vast multitude of management, utility, fun, survival+, & moderation modules soon.

Version: 0.0.1.

# Installation:
Shard is only available for Minecraft Bedrock 1.21.100 or higher.
- Download the latest release on [Github](https://github.com/phosxd/mc-shard) or [Discord](https://dsc.gg/mc-shard).
- Double click or open the downloaded `.mcaddon` file.
- Apply the pack to your world.

You DO NOT need:
- Beta-APIs.
- Any experimental features enabled.

You DO need:
- Cheats enabled.

If you followed the instructions perfectly, when enetering your world you should receive a pretty "This server is running Shard" message.

# Getting started:
To get started, type `/sh:` in chat (but do not send) to view auto-completes for every command for every Shard module.

You can configure modules by using the `/module <module>` command. With this you can toggle, print data & reset data. Disabling a module will also disable all it's commands. There is not yet a feature to disable individual commands.

There are a bunch of useful commands from the `util` module to play around with to start off. Just remember this version of Shard is an early alpha & there are only a few features currently available.

# Modules:
## `core`:
Provides essential functionality for the add-on. Cannot be disabled.
**Commands:**
- `/shard`: Open the Shard menu.
- `/module`: Configure a module.
- `/discord`: Get the Shard Discord invite. (This will be editable to be any Discord you want).
## `util`:
Provides various useful & handy commands. Not finished, more commands will be added.

**Upcoming Commands:**
- `/rename`: Rename an entity or item.
- `/lore`: Add lore text to an item.
- `/signtext`: Replace the text of a sign.
- `/setslot`: Set a player's selected slot.
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
- `/heal`: Heals all health.
- `/eat`: Replenishes all hunger bars.
- `/up`: Teleport up with a platform.
- `/thru`: Teleport through a wall 3 blocks or less thick.
- `/drain`: Remove liquid blocks in a radius.
- `/push`: Pushes an entity towards the location. Cannot be applied to items. May be unreliable when applied to players.
- `/enflame`: Sets entities on fire.
- `/deflame`: Removes fire from entities.
- `/freeze`: Freezes an entity so it cannot move or turn. Freeze with 0 time to unfreeze.
- `/explode`: Create an explosion.
- `/repair`: Repair the item in your hand.
- `/dupe`: Duplicate the item in your hand.

# Upcoming Modules:
Join the Discord to see more potential modules. There are plently more modules that I have not listed here or on the Discord because either I am not sure I want to make it, or it may only be possible with Beta-APIs.
- `tracker`: Uses scoreboards & tags to track entity statistics, actions, & current state.
- `clutter`: Removes dense groups of entities over a certain threshold. Can be configured to target or ignore certain entities.
- `worldborder`: Adds a world-border for each dimension, with customizable particles & animations.
- `spy`: Implments commands for spying on players unnoticed, or for taking a peek inside player inventories. Great for trolling 👀
- `blacklist`: Blacklist certain entities, items, & blocks for regular players. Includes commands for summoning entities that wont be cleared by the blacklist.
- `sidebar`: Manages the right sidebar visible to all players. Includes commands for editing & modifying it.
- `hologram`: Implements commands & UI for creating/managing hologram text boxes.
- `region`: Manage & create regions that affect world mutability & player abilities.
