# FFXI Text RPG

A text-first fantasy life RPG foundation inspired by the weight, preparation, progression, jobs, equipment, travel, and earned accomplishment of Final Fantasy XI.

The project is **not** intended to become a text transcription of retail FFXI. The long-term direction is a persistent life/adventure RPG built around simulated time, measurable mastery, livelihoods, projects, infrastructure, relationships, logical equipment/preparation, dangerous expeditions, and a continuous character who can develop across multiple disciplines.

Core progression law:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

The active browser UI remains canvas-first and text-led. Limited icons, tokens, meters, cards, and diagrams are welcome when they improve comprehension without creating a full graphical-world production burden.

## Read these first

For a new development session, use this order:

1. `docs/DEVELOPMENT_DIRECTION.md` — authoritative game/design direction.
2. `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — four-part product-version protocol and detailed path to 1.0.
3. `docs/ROADMAP.md` — current implementation summary and phase index.
4. `docs/THREAD_HANDOFF.md` — concise repo state and next implementation sequence.
5. `docs/ARCHITECTURE.md` — runtime/module boundaries.
6. `CHANGELOG.md` — notable historical changes.

The older `docs/planning/DEVELOPMENT_PIPELINE_AND_MILESTONES.md` is historical planning from the earlier formula/item-behavior phase. Its milestone order is superseded.

## Current version

Historical runtime baseline:

```text
App/package: 0.4.4
Account Save: 4
Game State: 3
Data: 13
Codename: Conservative Skill Gains
```

`js/text/version.js` remains the current runtime/system manifest.

A new four-part product protocol is planned:

```text
MAJOR.PHASE.TRACK.REVISION
```

Example:

```text
0.5.300.4
```

The product version will be decoupled from `package.json.version` because npm uses three-part SemVer. See `docs/VERSIONING_AND_RELEASE_ROADMAP.md` before changing version numbers.

## Running

Do not open `index.html` directly with a `file://` URL. ES module imports require serving the project over localhost.

On Windows, from the repo root:

```text
Start Server.cmd  - starts the local server
Play.cmd          - opens http://127.0.0.1:4173/
```

The older `server.cmd` remains a compatibility wrapper; `server.ps1` is also available.

Or run:

```bash
npm run serve
```

Then open:

```text
http://127.0.0.1:4173/
```

No build step is required.

Suggested local repo path for Codex desktop work:

```text
C:\Codex\ffxi-text-rpg
```

## Development

Node 20+ is recommended.

```bash
npm test
npm run benchmark
npm run check
```

## Product direction in brief

### Continuous character, not magical job switching

Jobs remain recognizable disciplines/training traditions, but changing equipment should not magically transform the character.

Long-term vocabulary:

```text
Jobs describe.
Capabilities enable.
Loadouts constrain and enhance.
```

A character may learn capabilities associated with multiple disciplines and use them when the real prerequisites are satisfied: proficiency, equipment, focus, ammunition, tools, reagents, resources, condition, preparation, and context.

Some prerequisites are hard requirements; some allow use at a penalty; some are enhancers. The current `mainJob`/support-job model is transitional and should be migrated incrementally rather than removed in a broad rewrite.

### Long fictional time, short real waiting

Simulation time and wall-clock time should be separate.

The game may contain meaningful fictional grind, but the player should be able to pause, fast-forward, advance to completion, or advance until a meaningful interrupt. End-of-day review should make slow cumulative progress legible.

### Logical resource scaling

Repeated identical construction should not become exponentially more expensive merely because another copy already exists.

Advanced resource demand should come from larger structures, renovations, specialization, logistics, automation, capacity, transport, maintenance, and prestige/regional projects.

### Life and adventure are one loop

The first representative target is **A Week Beyond the West Gate**: a multi-day slice combining origin, home foothold, livelihood, shop/economy, project progress, preparation, travel, danger/combat, recovery, end-of-day review, and a permanent accomplishment.

## Current architecture

```text
index.html
  -> js/main.js
      -> createCanvasApp(canvas)
          -> loadActiveCharacter() or createInitialState()
          -> createCommandRouter(state)
          -> createSlashCommandRouter(state)
          -> canvas layout/input/render loop
```

Game logic should remain separate from canvas/DOM rendering.

Primary areas:

```text
js/text/
  commandRouter.js
  slashCommandRouter.js
  gameState.js
  save.js
  version.js
  data/
  entities/
  systems/
  ui/
tests/
docs/
```

## Current implemented foundation

The repo already contains useful scaffolds for:

- canvas-first text UI and command adapters;
- account/character local saves;
- character creation;
- structured player/NPC/enemy entities;
- places, San d'Oria coordinates, navigation, atlas discovery, travel, and aggro;
- POIs, shops, guild hooks, and starter quest hooks;
- inventory/storage/wardrobes;
- item normalization, equipment, item inspection, buying, and selling;
- character-owned skills and deterministic skill-gain hooks;
- battle state, attacks, placeholder WS/cast actions, rewards, EXP, gil, and loot;
- status effects and wall-clock tick scaffold;
- validation, tests, benchmarks, database registry, and system version tracking.

The existing breadth is a foundation, not evidence that the product is close to complete.

## Command compatibility

The canvas input accepts bare gameplay commands and leading-slash account/menu or compatible FFXI-style commands.

Representative gameplay commands:

```text
look
stats
skills
inventory
equipment
here
move n
travel West Ronfaure
wait 60
battle
item Bronze Sword
inspect item Bronze Sword
equip Bronze Sword
shop Ashene
buy Bronze Sword
sell Bronze Sword
validate
save
```

Representative account/menu commands:

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

The normal game should eventually be discoverable through UI/actions without requiring command memorization; typed commands remain a powerful adapter and debugging interface.

## Current character creation

The current transitional flow is:

```text
/newcharacter
CharacterName
sandoria
hume
male
warrior
yes
```

Future 0.6 work moves toward origins/starting circumstances and discipline/capability progression rather than a magical current-job identity.

## Save model

Current localStorage keys:

```text
ffxiTextRpgAccounts
ffxiTextRpgAccountSession
```

Encoding:

```text
base64-json-v1
```

This is encoded storage, not strong encryption.

`reviveGameState()` currently restores object-reference compatibility after JSON load, including relinking `player.inventory` to the Inventory container.

Ordered save migrations are a required 0.4 closeout step before large amounts of new persistent simulation state are added.

## Formula policy

Current formulas are conservative scaffolds.

Formula confidence should be explicit:

- exact / sourced;
- researched approximation;
- intentional simplification;
- placeholder.

Formula refinement matters, but it no longer leads the product roadmap. Improve formulas when they materially improve a meaningful gameplay loop.

## Rebuild rules

- Keep the active runtime text-first.
- Keep game logic separate from rendering.
- Prefer small modules over giant files.
- Keep stable IDs and data-driven content where practical.
- Preserve command compatibility while letting UI actions dispatch the same gameplay semantics.
- Do not add full event sourcing merely to support lightweight semantic events.
- Do not store new saves as raw plain JSON.
- Add explicit migrations when persistent schema changes.
- Do not claim exact FFXI behavior without source/confidence notes.
- Add tests/version/docs for major runtime changes.
- Pre-1.0 backwards compatibility is not automatic; migration/reset decisions must be explicit.

## Current next implementation target

After the direction/version planning branch is reviewed and merged, the next runtime target is `0.4.200`:

1. introduce the authoritative four-part product-version field;
2. decouple it from private npm package SemVer;
3. update version display/tests/docs;
4. proceed to ordered persistence migrations (`0.4.300`);
5. then add structured action/event seams before beginning deterministic world time in 0.5.
