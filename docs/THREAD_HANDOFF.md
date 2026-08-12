# Thread Handoff

This file is the first document a new ChatGPT/Codex thread should read before continuing work on this repo.

## Read order

Before planning implementation, read:

1. `docs/DEVELOPMENT_DIRECTION.md` — authoritative design north star.
2. `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — authoritative product-version protocol and path to 1.0.
3. `docs/ROADMAP.md` — current implementation summary and release-phase index.
4. `docs/ARCHITECTURE.md` — runtime/module boundaries.
5. `js/text/version.js` — current runtime/system version state.

`docs/planning/DEVELOPMENT_PIPELINE_AND_MILESTONES.md` is historical planning from the earlier formula/item-behavior direction. Its recommended milestone order is superseded.

## Project intent

The project is a text-first fantasy life RPG with FFXI-inspired weight, preparation, danger, jobs/disciplines, equipment, travel, and earned accomplishment.

It is **not** intended to become a text transcription of retail FFXI.

The long-term product combines:

- persistent character/life progression;
- simulated days and long fictional timescales;
- measurable mastery and efficiency gains;
- livelihoods, projects, construction, infrastructure, relationships, and taming;
- dangerous expeditions, combat, travel, equipment, and magic;
- text/tabletop-style presentation with limited icons/tokens/meters/diagrams;
- deterministic/testable simulation systems.

Core progression law:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

Avoid arbitrary exponential costs for repeated identical work. Increase resource demand through physical scale, upgrades, specialization, logistics, infrastructure, and more ambitious projects.

Simulation time and wall-clock time are separate concepts. Fictional grind may be substantial; avoid unnecessary real-world waiting by supporting pause/fast-forward/advance semantics and end-of-day review.

## Jobs/disciplines direction

The current `mainJob`/support-job/current-job architecture is transitional.

Long-term rule:

```text
Jobs describe.
Capabilities enable.
Loadouts constrain and enhance.
```

Jobs remain recognizable disciplines/training traditions, but equipment does not magically transform the character into another job.

Ability eligibility should gradually depend on:

- learned capability;
- proficiency/mastery;
- equipment;
- hard/soft requirements;
- focus/ammunition/reagents/tools;
- resources;
- status/condition;
- preparation;
- context;
- formal advanced training where logically required.

Characters may use capabilities associated with several disciplines at once when prerequisites are satisfied. Balance comes from loadout, resource, preparation, proficiency, encumbrance, and action-economy tradeoffs rather than one universal support-job slot.

Do not rip the existing job code out in a broad rewrite. Migrate behind tested interfaces during the 0.6 capability phase.

## Current version state

Historical runtime baseline:

```text
App/package: 0.4.4
Account Save: 4
Game State: 3
Data: 13
Codename: Conservative Skill Gains
```

The historical `0.4.4` build remains on the old three-part application/package scheme.

The new product protocol is:

```text
MAJOR.PHASE.TRACK.REVISION
```

Example:

```text
0.5.300.4
```

Do not place a four-numeric-segment version directly into `package.json.version`; npm uses three-part SemVer. Product/package version separation is the next versioning implementation target.

See `docs/VERSIONING_AND_RELEASE_ROADMAP.md` for the complete protocol.

## Current recommended runtime sequence

From the current foundation:

1. `0.4.200` — product/package version-manifest separation;
2. `0.4.300` — ordered persistence migrations;
3. `0.4.400` — structured action-result contract;
4. `0.4.500` — lightweight semantic events;
5. close 0.4 without rewriting current systems;
6. 0.5 — deterministic world time, pause/fast-forward, tasks, interrupts, end-of-day, projects;
7. 0.6 — continuous-character capabilities, jobs as disciplines, origins, first livelihood;
8. 0.7 — first complete life/adventure vertical slice, **A Week Beyond the West Gate**;
9. 0.8 — construction/life/infrastructure/taming/relationships/crafting/logistics depth;
10. 0.9 — adventure/magic/content expansion, balance, persistence, UI, release hardening;
11. 1.0 — Live Foundation.

Formula refinement is still important, but it no longer leads the roadmap. Refine formulas when they materially improve an already-meaningful player-facing loop.

## Development commands

```bash
npm test
npm run benchmark
npm run check
```

Use Node 20+.

## Current browser entry path

```text
index.html
  -> js/main.js
      -> createCanvasApp(canvas)
          -> loadActiveCharacter() or createInitialState()
          -> createCommandRouter(state)
          -> createSlashCommandRouter(state)
          -> canvas layout/input/render loop
```

The active UI is canvas-first. Game logic should remain independent of canvas/DOM rendering.

## UI command model

The left canvas sidebar uses direct navigation intents and command-backed gameplay/global actions.

The bottom canvas input accepts bare command-router commands and leading-slash commands where `slashCommandRouter.js` owns account/menu behavior.

Representative commands:

```text
character
stats
job
skills
inventory
equipment
maps
look
here
battle
help
validate
save
move n
travel West Ronfaure
wait 60
item Bronze Sword
inspect item Bronze Sword
equip Bronze Sword
shop Ashene
buy Bronze Sword
sell Bronze Sword
```

Account/menu commands include:

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

FFXI macro-style commands such as `/ma`, `/ja`, `/ws`, `/item`, `/equipset`, `/recast`, and `/echo` remain compatible adapters where supported.

## Current character creation

Current flow is still transitional:

```text
/newcharacter
CharacterName
sandoria
hume
male
warrior
yes
```

The future 0.6 direction replaces a simple starting-job emphasis with origins/starting circumstances while preserving logical discipline training.

## Save/account model

Current files/state:

```text
js/text/save.js
ffxiTextRpgAccounts
ffxiTextRpgAccountSession
base64-json-v1
```

The payload is encoded, not cryptographically protected.

Important current compatibility rule:

`reviveGameState()` relinks:

```text
player.inventory
```

to:

```text
player.inventoryState.containers.inventory.items
```

after JSON load.

Do not add large amounts of new persistent simulation state before the ordered migration mechanism planned for `0.4.300`.

## Core systems already implemented

### World/travel

Implemented foundations include:

- starter cities and wilderness/dungeon hooks;
- San d'Oria alphanumeric topology;
- coordinate navigation and atlas discovery;
- zone graph and travel restrictions scaffold;
- grid movement;
- foot-travel aggro scaffold;
- POI discovery and same-zone fast travel.

### Inventory/items/equipment/economy

Implemented foundations include:

- Inventory, Mog Safe/Safe 2, Storage, Locker, Satchel, Sack, Case, Wardrobes 1-8;
- container access/capacity/stacking rules;
- item normalization/schema;
- equipment eligibility and stat modifiers;
- item inspection;
- shop buying/selling;
- metadata-only latent/enchantment/charge/ranged-ammo behavior.

### Skills/progression

Implemented foundations include:

- character-owned current skills in `player.progression.skills`;
- sparse skill cap scaffolds;
- deterministic +1 gain hooks for representative combat/cast actions;
- EXP/leveling/reward/loot scaffolds.

Current skill caps and formulas are not authoritative retail FFXI data.

### Combat/status/ticks

Implemented foundations include:

- battle state;
- deterministic RNG injection;
- basic attacks;
- placeholder weapon skill/cast actions;
- rewards;
- status lifecycle;
- wall-clock tick scaffold.

The current tick engine is not the final world-time engine. 0.5 should separate deterministic simulation time from wall-clock scheduling.

## Important architectural rules

- Keep active runtime text-first.
- Limited icons/tokens/meters/diagrams are acceptable; do not rebuild a full graphical world unless explicitly requested.
- Keep logic independent of rendering.
- Keep command input/UI buttons as adapters into the same gameplay actions.
- Prefer small modules and data-driven stable IDs.
- Do not implement full event sourcing merely because semantic events are added.
- Add explicit migrations when persistent schema changes.
- Do not store new saves as raw plain JSON.
- Preserve `player.inventory` compatibility until deliberately migrated with tests.
- Use formula confidence labels: exact/sourced, researched approximation, intentional simplification, placeholder.
- Add tests/version/docs for major runtime changes.
- Do not treat backwards compatibility as guaranteed pre-1.0; migration/reset decisions must still be explicit.

## Important tests

Representative current tests include:

```text
tests/saveAccount.test.js
tests/pipeline.test.js
tests/slashCommandRouter.test.js
tests/canvasUi.test.js
tests/equipmentEngine.test.js
tests/equipmentValidation.test.js
tests/inventoryEngine.test.js
tests/itemSchema.test.js
tests/rewardEngine.test.js
tests/rngEngine.test.js
tests/shopEngine.test.js
tests/skillCaps.test.js
tests/skillProgressionEngine.test.js
tests/skillCommandRouter.test.js
tests/skillProgressionValidation.test.js
tests/combatActionEngine.test.js
tests/poiEngine.test.js
tests/travelEngine.test.js
tests/atlasAndControls.test.js
tests/characterCreation.test.js
tests/uiPanels.test.js
```

Use Node's built-in `node:test` style for new tests.

## First representative gameplay target

Working 0.7 vertical slice: **A Week Beyond the West Gate**.

It should combine:

- multiple origins;
- a modest starting foothold;
- one livelihood/gathering loop;
- local economy;
- one persistent material/labor project;
- simulated days and end-of-day review;
- preparation;
- one meaningful expedition;
- travel danger and combat;
- recovery/return-home loop;
- measurable capability growth;
- one permanent end-of-week accomplishment/unlock.

The goal is to prove that life-building and adventure are one connected game rather than separate minigames.
