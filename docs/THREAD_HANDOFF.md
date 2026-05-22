# Thread Handoff

This file is the first document a new ChatGPT/Codex thread should read before continuing work on this repo.

## Project intent

The repo is being reset into a text-first, expandable FFXI-inspired RPG foundation. The active runtime should stay text based. Graphical/non-text systems should not be rebuilt unless explicitly requested.

Core design goals:

- Stable and expandable frame first.
- Slash-command browser UI.
- Local account and character save slots.
- Zone coordinate grids with unknown unvisited grids.
- Zone atlas reveals visited grids only.
- Resource bars, visual tick timer metadata, and 8-button nav keypad metadata.
- Travel by foot can trigger grid-based aggro based on spawn rules, count, and aggro type.
- Action controls should separate auto attack, weapon skills, magic, items, travel, interaction, etc.
- Backwards compatibility should not be considered until explicitly requested.

Suggested local repo path for Codex desktop work:

```text
C:\Codex\ffxi-text-rpg
```

## Current version state

Authoritative file:

```text
js/text/version.js
```

Current state at handoff:

```text
App/package: 0.4.1
Account Save: 3
Game State: 2
Data: 9
Codename: Slash UI Account Saves
```

Major active system versions:

```text
slashCommands: 0.4.1
accountSaves: 0.4.1
saveEncoding: 0.4.1
statEngine: 0.4.0
equipmentCommands: 0.4.0
equipmentCatalog: 0.4.0
inventoryContainers: 0.5.1
inventoryTransfers: 0.5.1
itemSchema: 0.5.1
itemStacking: 0.5.1
battleEngine: 0.5.0
combatActions: 0.5.0
battleRewards: 0.5.0
loot: 0.5.0
shops/shopTransactions: 0.3.7
pois/poiDiscovery/poiFastTravel: 0.3.4
travel/gridMovement/aggro: 0.3.3
```

## Development commands

```bash
npm test
npm run benchmark
npm run check
```

Use Node 20+.

## UI command model

The browser UI uses slash commands.

Main commands:

```text
/menu
/commands
/help
/newcharacter
/characters
/load <name|number>
/save
/account
/reset
```

Gameplay examples:

```text
/look
/stats
/inventory
/equipment
/containers
/container inventory
/transfer Bronze Sword from inventory to wardrobe1
/equip Bronze Sword
/unequip mainHand to wardrobe1
/here
/talk Ashene
/shop Ashene
/buy Bronze Sword
/zonefast
/move n
/travel West Ronfaure
/wait 60
/validate
```

Bare commands are rejected by the browser slash router except while character-creation prompts are active. Internal engine tests may still call the bare command router directly.

FFXI macro-style commands such as `/macrohelp`, `/ma`, `/ja`, `/ws`, `/item`, `/equipset`, `/recast`, and `/echo` are preserved with their leading slash and routed through the FFXI command adapter.

## Character creation flow

Start with:

```text
/newcharacter
```

While prompts are active, answers do not use `/`. Current prompt order is name, nation, race, sex, starting job, then confirmation:

```text
CharacterName
sandoria
hume
male
warrior
yes
```

When confirmed, the character is saved automatically.

## Save/account model

File:

```text
js/text/save.js
```

LocalStorage key:

```text
ffxiTextRpgAccount
```

Encoding:

```text
base64-json-v1
```

Important caveat: this is encoded, not strong encryption. It avoids plain JSON in localStorage but is not secure against browser/devtools access. Real encryption should use a password-derived key or platform key later.

Save structure includes:

- account profile
- last active character ID
- character summary records
- encoded full character game states

Legacy migration:

- Old raw `ffxiTextRpgSave` is read only if no account save exists.
- Valid legacy saves are migrated into the encoded account model.
- Save load must call `reviveGameState()` to relink `player.inventory` to `player.inventoryState.containers.inventory.items`.

## Current browser entry path

```text
index.html
  -> js/main.js
      -> loadActiveCharacter() or createInitialState()
      -> createSlashCommandRouter(state)
          -> createCommandRouter(state)
      -> createTopBar(...)
      -> createSidebar(...)
      -> createTextShell(...)
```

Relevant UI files:

```text
js/main.js
js/text/slashCommandRouter.js
js/text/topBar.js
js/text/textShell.js
js/text/sidebar.js
js/text/uiPanels.js
css/style.css
```

## Core systems already implemented

### World and travel

Files:

```text
js/text/data/maps.js
js/text/data/places.js
js/text/systems/atlasEngine.js
js/text/systems/travelEngine.js
js/text/systems/aggroEngine.js
```

Implemented:

- starter cities and starter outdoor/dungeon hooks
- coordinate grids
- connection grids
- zone graph
- direct travel command
- travel restrictions scaffold
- atlas discovery with unknown unvisited grids
- 8-way grid movement
- foot-travel aggro scaffold

### POIs, shops, guilds, quests

Files:

```text
js/text/data/pointsOfInterest.js
js/text/data/shopCatalogs.js
js/text/data/guildServices.js
js/text/data/questHooks.js
js/text/systems/poiEngine.js
js/text/systems/shopEngine.js
```

Implemented:

- starter-city POIs
- current-grid POI actions
- POI discovery
- same-zone POI fast travel
- starter shop catalogs
- starter guild service/recipe previews
- starter quest/mission hooks
- buying from shops into Inventory

Selling is intentionally not implemented yet.

### Inventory, items, storage, wardrobes

Files:

```text
js/text/data/itemSchema.js
js/text/data/inventoryContainers.js
js/text/data/mogHouseFurniture.js
js/text/systems/inventoryEngine.js
```

Implemented containers:

```text
Inventory
Mog Safe
Mog Safe 2
Storage
Mog Locker
Mog Satchel
Mog Sack
Mog Case
Mog Wardrobe 1-8
```

Rules:

- Inventory accessible anywhere.
- Mog Safe and Storage require Mog House context.
- Storage capacity is derived from placed furniture.
- Satchel/Sack/Case exist but are locked by default.
- Wardrobe 1 is unlocked by default, equipment-only, accessible anywhere.
- Wardrobes 2-8 exist but are locked by default.
- Item normalization adds kind, quantity, stackable, maxStack, tags, source, flags, modifiers, and equipmentSlot fields.
- Stackable consumables/materials/misc items merge into existing stacks when possible.
- Container transfers are atomic and enforce source access, destination access, capacity, item-kind, and stack rules.

Temporary limitation: Mog House is currently a boolean access context, not a real zone/interior yet.

### Equipment and stats

Files:

```text
js/text/data/equipmentCatalog.js
js/text/systems/equipmentEngine.js
js/text/systems/statEngine.js
```

Implemented:

- equip from Inventory or accessible Wardrobe
- unequip to valid destination container
- replacement gear returns safely
- slot inference from `equipmentSlot` or tags
- starter equipment modifiers affect combat profile

Starter gear bonuses are conservative placeholders, not exact FFXI formulas. Equipment validation by job/race/level is still pending.

### Combat, rewards, and actions

Files:

```text
js/text/data/lootTables.js
js/text/systems/battleEngine.js
js/text/systems/combatActionEngine.js
js/text/systems/rewardEngine.js
js/text/systems/rng.js
js/text/systems/statusEngine.js
js/text/systems/tickEngine.js
```

Implemented:

- basic encounter/battle state
- deterministic RNG injection for battle attacks and tests
- basic attack flow
- placeholder weapon skill/cast commands
- starter loot tables
- victory reward resolution for EXP, gil, loot rolls, Inventory insertion, and duplicate payout prevention
- status lifecycle scaffold
- tick engine scaffold

Not implemented yet:

- EXP tables and level-up rules
- enemy AI turn depth
- death/KO flow
- real magic/recast/cast-time integration

## Important tests

```text
tests/saveAccount.test.js
tests/slashCommandRouter.test.js
tests/equipmentEngine.test.js
tests/inventoryEngine.test.js
tests/itemSchema.test.js
tests/rewardEngine.test.js
tests/rngEngine.test.js
tests/shopEngine.test.js
tests/poiEngine.test.js
tests/travelEngine.test.js
tests/atlasAndControls.test.js
tests/characterCreation.test.js
tests/uiPanels.test.js
```

New work should add tests in the same style using Node's built-in `node:test`.

## Documentation status

Updated for this handoff:

```text
README.md
docs/ARCHITECTURE.md
docs/ROADMAP.md
docs/THREAD_HANDOFF.md
CHANGELOG.md
```

Still useful but may need future refresh as systems deepen:

```text
docs/BASELINE_PIPELINE.md
docs/SYSTEM_CATALOG.md
docs/RESEARCH_REFERENCES.md
```

## Current recommended next pass

The next best implementation pass is progression:

1. Add EXP table data and level-up rules.
2. Update player/job progression containers when rewards grant EXP.
3. Refresh HP/MP/resources and EXP-to-next after level-up.
4. Add tests for no level-up, single level-up, multi-level-up, and level-cap behavior.
5. Update README, THREAD_HANDOFF, CHANGELOG, version map, and benchmark coverage if progression logic becomes runtime-heavy.

## Rules for future agents

- Do not reintroduce graphical map/image systems unless explicitly requested.
- Do not remove slash command UI behavior.
- Do not store new saves as raw plain JSON.
- Do not break `player.inventory` compatibility without updating save revive logic and tests.
- Do not add exact FFXI formulas unless sourced and documented.
- Do not skip tests/version/docs for major runtime changes.
- Backwards compatibility is out of scope unless the user says otherwise.
