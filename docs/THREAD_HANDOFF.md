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
Save: 3
Data: 7
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
inventoryContainers: 0.3.8
inventoryTransfers: 0.3.8
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

## Character creation flow

Start with:

```text
/newcharacter
```

While prompts are active, answers do not use `/`:

```text
sandoria
hume
male
warrior
CharacterName
```

When completed, the character is saved automatically.

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
      -> createSidebar(...)
      -> createTextShell(...)
```

Relevant UI files:

```text
js/main.js
js/text/slashCommandRouter.js
js/text/textShell.js
js/text/sidebar.js
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

### Inventory, storage, wardrobes

Files:

```text
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
- Container transfers are atomic and enforce source access, destination access, capacity, and item-kind rules.

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

Starter gear bonuses are conservative placeholders, not exact FFXI formulas.

### Combat and actions

Files:

```text
js/text/systems/battleEngine.js
js/text/systems/combatActionEngine.js
js/text/systems/statusEngine.js
js/text/systems/tickEngine.js
```

Implemented:

- basic encounter/battle state
- basic attack flow
- placeholder weapon skill/cast commands
- status lifecycle scaffold
- tick engine scaffold

Not implemented yet:

- battle rewards
- enemy AI turn depth
- EXP/gil/loot roll handling
- death/KO flow
- real magic/recast/cast-time integration

## Tests added during recent passes

Important test files:

```text
tests/saveAccount.test.js
tests/slashCommandRouter.test.js
tests/equipmentEngine.test.js
tests/inventoryEngine.test.js
tests/shopEngine.test.js
tests/poiEngine.test.js
tests/travelEngine.test.js
tests/atlasAndControls.test.js
tests/characterCreation.test.js
```

New work should add tests in the same style using Node's built-in `node:test`.

## Documentation status

Updated for this handoff:

```text
README.md
docs/ARCHITECTURE.md
docs/ROADMAP.md
docs/THREAD_HANDOFF.md
```

Still useful but may need future refresh as systems deepen:

```text
docs/BASELINE_PIPELINE.md
docs/SYSTEM_CATALOG.md
docs/RESEARCH_REFERENCES.md
CHANGELOG.md
```

## Current recommended next pass

The user paused battle rewards and asked to make the UI usable. Continue UI hardening before returning to deeper combat systems.

Recommended next pass:

1. Add visible character-slot cards/buttons in the browser UI.
2. Add a clearer main menu panel instead of relying only on terminal text.
3. Add command chips/buttons for common slash commands.
4. Improve save/load UI feedback.
5. Add tests for any new UI command wrappers or save-slot helpers.

After UI hardening, resume game-system work with:

1. Battle rewards: EXP, gil, loot.
2. Loot table schema and drop roll engine.
3. Inventory insertion through existing container rules.
4. Level-up rules and EXP-to-next handling.

## Rules for future agents

- Do not reintroduce graphical map/image systems unless explicitly requested.
- Do not remove slash command UI behavior.
- Do not store new saves as raw plain JSON.
- Do not break `player.inventory` compatibility without updating save revive logic and tests.
- Do not add exact FFXI formulas unless sourced and documented.
- Do not skip tests/version/docs for major runtime changes.
- Backwards compatibility is out of scope unless the user says otherwise.
