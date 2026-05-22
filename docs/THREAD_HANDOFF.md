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
Data: 12
Codename: Slash UI Account Saves
```

Major active system versions:

```text
slashCommands: 0.4.1
accountSaves: 0.4.1
saveEncoding: 0.4.1
statEngine: 0.4.0
equipmentCommands: 0.5.0
equipmentEligibility: 0.5.0
itemInspection: 0.5.0
equipmentCatalog: 0.6.0
inventoryContainers: 0.5.1
inventoryTransfers: 0.5.1
itemSchema: 0.6.0
itemStacking: 0.5.1
skillCaps: 0.5.0
battleEngine: 0.5.0
combatActions: 0.5.0
battleRewards: 0.5.2
progression: 0.5.3
expTables: 0.5.2
jobSwitching: 0.5.3
leveling: 0.5.3
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
/item Bronze Sword
/inspect item Bronze Sword
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
js/text/data/skillCaps.js
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
- Item normalization adds kind, quantity, stackable, maxStack, tags, source, template metadata, family/archetype/subtype, requirements, flags, effects, latent/enchantment/augment scaffolds, charges, modifiers, and equipmentSlot/allowedSlots fields.
- Stackable consumables/materials/misc items merge into existing stacks when possible.
- Container transfers are atomic and enforce source access, destination access, capacity, item-kind, and stack rules.
- Sparse skill rank/cap helpers exist for later combat and magic skill progression.

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
- eligibility validation by job, race, level, allowed slot, two-handed/offhand conflicts, and ranged/ammo slot constraints
- `item <query>` and `inspect item <query>` for text-first item template/runtime inspection
- starter equipment modifiers affect combat profile

Starter gear bonuses, eligibility, and delay values are conservative placeholders or intentional simplifications, not exact FFXI formulas.

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

- enemy AI turn depth
- death/KO flow
- real magic/recast/cast-time integration
- combat/magic skill-up pacing and skill-cap use in damage or magic formulas

## Important tests

```text
tests/saveAccount.test.js
tests/slashCommandRouter.test.js
tests/equipmentEngine.test.js
tests/equipmentValidation.test.js
tests/inventoryEngine.test.js
tests/itemSchema.test.js
tests/rewardEngine.test.js
tests/rngEngine.test.js
tests/shopEngine.test.js
tests/skillCaps.test.js
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

The next best implementation pass is combat/skill integration:

1. Add current combat/magic skill state without changing the cap schema.
2. Add isolated skill-gain hooks, but avoid random pacing until the rule is tested and confidence-labeled.
3. Decide how skill caps feed combat and magic formulas before touching battle command handlers.
4. Add item behavior modules for latent effects, enchantments, charges, ranged/ammo, and sell restrictions.
5. Keep formula-sensitive values labeled as exact, approximate, simplified, or placeholder.

Important: `skillCaps.js` is scaffold-only. Do not wire those caps into combat or magic calculations until player current skill state exists and the cap/skill-gain flow is covered by tests.

## Rules for future agents

- Do not reintroduce graphical map/image systems unless explicitly requested.
- Do not remove slash command UI behavior.
- Do not store new saves as raw plain JSON.
- Do not break `player.inventory` compatibility without updating save revive logic and tests.
- Do not add exact FFXI formulas unless sourced and documented.
- Do not skip tests/version/docs for major runtime changes.
- Backwards compatibility is out of scope unless the user says otherwise.
