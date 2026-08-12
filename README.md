# FFXI Text RPG

A text-first fantasy life RPG foundation inspired by the weight, preparation, dangerous travel, equipment, mastery, jobs/disciplines, and earned accomplishment of Final Fantasy XI.

This is **not** intended to become a text transcription of retail FFXI. The long-term game is a persistent life/adventure RPG built around simulated time, measurable mastery, livelihoods, projects, infrastructure, relationships, logical loadouts, exploration, and a continuous character who can develop across multiple disciplines.

Core progression law:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

The browser UI is canvas-first and text-led. Restrained icons, tokens, meters, cards, and diagrams are welcome when they improve comprehension without turning the project into a full graphical-world production.

## Current version

At the 0.4 foundation exit gate:

```text
Product:      0.4.900.0
Package:      0.4.900
Account Save: 4
Game State:   3
Data:         13
Codename:     Foundation Exit Gate
```

Product versions use:

```text
MAJOR.PHASE.TRACK.REVISION
```

`package.json.version` remains valid three-part SemVer and normally mirrors `MAJOR.PHASE.TRACK`.

`js/text/version.js` is the authoritative runtime/system version manifest.

## Read these first

1. `docs/DEVELOPMENT_DIRECTION.md` — design north star.
2. `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — version protocol and detailed route to 1.0.
3. `docs/TRANSITIONAL_ARCHITECTURE.md` — temporary seams and migration constraints.
4. `docs/ROADMAP.md` — current phase index.
5. `docs/PHASE_0_4_EXIT_GATE.md` — evidence for closing the foundation phase.
6. `docs/THREAD_HANDOFF.md` — current repo state and immediate sequence.
7. `docs/ARCHITECTURE.md` — current runtime/module boundaries.

`docs/planning/DEVELOPMENT_PIPELINE_AND_MILESTONES.md` is superseded historical planning from the earlier formula-first direction.

## Running

Serve the repo over localhost; do not open `index.html` directly with `file://` because browser ES-module imports require an HTTP origin.

Windows launchers:

```text
Start Server.cmd
Play.cmd
```

Or:

```bash
npm run serve
```

Then open:

```text
http://127.0.0.1:4173/
```

No build step is required.

## Development gate

Use Node 20+.

```bash
npm test
npm run benchmark
npm run check
```

GitHub Actions runs the test and benchmark gate for pull requests and pushes to `main`.

## Product direction in brief

### Continuous character, not magical job switching

Long-term rule:

```text
Jobs describe.
Capabilities enable.
Loadouts constrain and enhance.
```

Jobs remain recognizable disciplines/training traditions, but changing equipment should not magically replace the character's identity or erase learned knowledge.

Capabilities may cross traditional job boundaries when their real prerequisites are met: proficiency, equipment, focus, ammunition, tools, reagents, resources, condition, preparation, context, and formal advanced training where logically required.

The current `mainJob`/support-job/current-job code remains transitional compatibility scaffolding until the 0.6 migration. See `docs/TRANSITIONAL_ARCHITECTURE.md` before expanding job-gated behavior.

### Long fictional time without unnecessary real waiting

Simulation time and wall-clock time are separate.

The game may contain substantial fictional grind while still allowing pause, fast-forward, exact advancement, advance-to-completion, and advance-until-interrupt. End-of-day review should make cumulative progress legible.

The existing `tickEngine.js` is only a wall-clock scheduler/dispatcher. It is not the canonical game calendar.

### Logical resource scaling

Repeated identical construction should not become exponentially more expensive merely because another copy already exists.

Resource demand should grow through physical scale, larger structures, upgrades, renovation, specialization, logistics, automation, capacity, transport, maintenance, quality, and ambitious regional/prestige projects.

### Life and adventure are one loop

The first representative target is **A Week Beyond the West Gate**: a multi-day slice combining origin, home foothold, livelihood, local economy, project progress, preparation, travel, danger/combat, recovery, end-of-day review, and a permanent accomplishment.

## Current architecture

```text
index.html
  -> js/main.js
      -> createCanvasApp(canvas)
          -> loadActiveCharacter() or createInitialState()
          -> createCommandRouter(state)
          -> createSlashCommandRouter(state)
          -> canvas render/input loop
```

Game logic stays separate from canvas/DOM rendering.

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

## 0.4 foundation delivered

The current foundation includes:

- canvas-first text UI and command adapters;
- account/character local saves;
- four-part product versioning separated from package SemVer;
- ordered persistence migrations;
- structured player/NPC/enemy entities;
- places, San d'Oria coordinates, navigation, atlas, travel and aggro scaffolds;
- POIs, shops, guild hooks and starter quest hooks;
- inventory/storage/wardrobes;
- item schema, equipment, inspection, buying and selling;
- character-owned skills and deterministic representative skill-gain hooks;
- battle/reward/EXP/loot/status/RNG scaffolds;
- versioned `ActionResult` with travel-start pilot;
- bounded semantic events with travel start/arrival pilot;
- validation, tests, benchmarks, CI, database registry and system-version tracking;
- explicit transitional architecture rules for world time and future capability work.

This breadth is foundation code, not evidence that the product is near content completion.

## Command compatibility

The canvas input accepts bare gameplay commands plus leading-slash account/menu or compatible FFXI-style commands.

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

Typed commands remain a powerful adapter/debug interface. Normal play should increasingly expose discoverable UI actions so command memorization is not required.

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

This is encoding, not cryptographic protection.

Ordered migrations handle registered persistent-version transitions. `reviveGameState()` remains responsible for post-JSON reference repair such as relinking `player.inventory` to the Inventory container.

## New integration seams

### ActionResult

`js/text/systems/actionResult.js` separates semantic action outcome/code/data from display prose. Non-enumerable `.message` / `.reason` aliases exist only for transitional command compatibility.

### Semantic events

`js/text/systems/semanticEventEngine.js` provides bounded observational events with stable sequential IDs/types. Events are not event sourcing and are not authoritative state history.

Travel currently emits:

```text
travel.started
travel.arrived
```

Future objectives, achievements, day summaries, projects, and relationship reactions should consume structured event data rather than parse command-log prose.

## Formula policy

Formula confidence must remain explicit:

- exact / sourced;
- researched approximation;
- intentional simplification;
- placeholder.

Formula refinement matters, but it does not lead the roadmap. Improve formulas when they materially improve a meaningful player-facing loop.

## Immediate next implementation target

After the 0.4.900 integration gate passes and merges:

```text
0.5.100 — Deterministic world clock
```

That pass should add canonical simulated time, exact deterministic advancement, derived day/time inspection, rollover tests, and **no dependency on `Date.now()` for canonical simulation state**.
