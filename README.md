# Hearth & Horizon

**Working title.** This repository is a text-first persistent fantasy life RPG about building one continuous character and life across a connected world of settlements, roads, wilderness, livelihoods, relationships, trade, exploration, and danger.

Earlier versions of the project grew from FFXI-derived experiments. Those files may remain temporarily as research, migration, or comparison material, but the canonical game is now an **original setting with original world identifiers, cultures, disciplines, creatures, NPCs, quests, and content databases**.

Core progression law:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

The browser presentation is canvas-first and text-led. Prose and imagination render most of the world; restrained maps, icons, tokens, meters, cards, and diagrams can improve comprehension without turning the project into a full graphical-world production.

## Current version

```text
Product:      0.5.500.0
Package:      0.5.500
Account Save: 4
Game State:   4
Data:         13
Codename:     Day Boundary Review
```

Product versions use:

```text
MAJOR.PHASE.TRACK.REVISION
```

`package.json.version` remains valid three-part SemVer and normally mirrors `MAJOR.PHASE.TRACK`.

`js/text/version.js` is the authoritative runtime/system version manifest.

## Read these first

1. `docs/DEVELOPMENT_DIRECTION.md` — design north star.
2. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-world naming, legacy-data boundaries, resource provenance, content scale, and content-pack rules.
3. `docs/ROADMAP.md` — current phase and implementation sequence.
4. `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — detailed version/release gates.
5. `docs/TRANSITIONAL_ARCHITECTURE.md` — temporary seams and migration constraints.
6. `docs/ARCHITECTURE.md` — current runtime/module boundaries.
7. `docs/THREAD_HANDOFF.md` — implementation handoff notes.

Older planning documents may describe superseded FFXI-oriented or formula-first assumptions and should not override the authoritative files above.

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

### One person, many disciplines

Long-term rule:

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

The current job-switch scaffold is transitional. A learned technique, spell, recipe, or practical capability ultimately belongs to the character. Actual use depends on real prerequisites such as proficiency, equipment, focus, ammunition, tools, reagents, resources, injury/status, terrain/context, and formal advanced training where the fiction requires it.

### Long fictional time without needless real waiting

Simulation time and wall-clock time are separate.

The game can contain substantial fictional grind while still allowing pause, fast-forward, exact deterministic advancement, timed tasks, advance-until-interrupt, and end-of-day review.

Current main includes:

- canonical deterministic world time;
- pause and simulation speed control;
- canonical timed tasks;
- deterministic simulation interrupts;
- structured day boundaries and end-of-day review.

### A home base, not a one-city game

The player may establish a room, home, workshop, farm, camp, or other foothold. That base matters for storage, recovery, preparation, relationships, and production, but the world extends well beyond it.

The target world contains multiple major cities, smaller settlements, roads, wilderness, mines, ports, ruins, dungeons, caravans, ferries, mounts/pack logistics, trade routes, and regional economies.

Internal data partitions support maps and simulation, but player-facing travel should usually read as continuous geography rather than artificial `ZONE LOADING` screens.

### Maps are knowledge

Maps can be owned, purchased, discovered, incomplete, or supplemented by exploration and NPC directions.

The player should discover routes, landmarks, hazards, resources, services, and shortcuts rather than automatically possessing omniscient world navigation.

### Resource provenance instead of reward confetti

A defeated creature should not automatically manufacture finished crafting materials in inventory.

Depending on context, rewards may require:

- searching carried belongings;
- skinning/butchering/plucking;
- recovering bone, horn, shell, glands, venom, or other useful parts;
- dismantling constructs;
- mining/logging/foraging/fishing/trapping;
- salvage;
- crafting/processing;
- commerce, wages, contracts, reputation, or quest rewards.

Tools, time, proficiency, condition, carrying capacity, and player choice should matter.

### Materials circulate through the economy

```text
world source
  -> raw material
  -> processing
  -> component/ingredient
  -> finished good
  -> use/wear/consumption
  -> repair/recycling/salvage or replacement
```

Items should have intentional sources and sinks. Gathering, crafting, cooking, shops, quests, construction, equipment, travel, and regional trade should consume the same material world.

### Content breadth is an engineering requirement

The intended game ultimately needs hundreds to thousands of interconnected records: places, NPCs, creatures, flora/resources, items, recipes, abilities, quests, relationships, shops, and transport routes.

The project therefore does not treat content as a late decorative layer. Mechanics and representative content grow together, with regional content packs and cross-reference validation rather than a few toy records or giant unvalidated files.

## Original setting migration

The immediate next runtime track is:

```text
0.5.550 — Original-world identity and canonical nomenclature
```

Before high-volume content databases are expanded, current inherited world/race/job/currency/creature/NPC terminology and stable IDs will be migrated to the original setting described in `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`.

The initial world anchors are:

- **Thornwall** and the **Elderwood** region;
- **Brasshaven** and the **Redstone Reach**;
- **Mistmere** and the **Starfen**;
- future central trade hub **Waymeet**.

These are starting anchors, not the whole world.

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

## What is implemented versus what is still sparse

The repository already has useful foundations for:

- account/character local saves and ordered migrations;
- structured player/NPC/enemy entities;
- places, maps, coordinates, navigation, travel, and aggro;
- POIs, shops, guild/quest hooks;
- inventory/storage/wardrobes;
- item schema, equipment, inspection, buying/selling;
- character-owned skills and progression scaffolds;
- battle/reward/EXP/status/RNG scaffolds;
- `ActionResult` and semantic events;
- canonical simulation time/tasks/interrupts/day review;
- validation, tests, benchmarks, CI, database registry, and system-version tracking.

This is **foundation breadth, not content completion**. Current canonical monster, item, shop, quest, magic, relationship, companion, crafting, and regional catalogs are far below the intended scale and several still carry inherited naming that will be migrated before expansion.

See `docs/SYSTEM_CATALOG.md` for a system-by-system status audit.

## Command compatibility

Typed commands remain a powerful adapter/debug interface. Normal play should increasingly expose discoverable UI actions so command memorization is not required.

Current examples may still contain inherited names until the 0.5.550 migration lands. After that track, examples and saved identifiers should use only canonical original-world vocabulary except inside explicit legacy adapters/migration tests.

## Save model

Current localStorage keys still use historical project identifiers and may be migrated later under an explicit compatibility plan:

```text
ffxiTextRpgAccounts
ffxiTextRpgAccountSession
```

Encoding:

```text
base64-json-v1
```

This is encoding, not cryptographic protection.

Ordered migrations handle registered persistent-version transitions. `reviveGameState()` remains responsible for post-JSON reference repair such as relinking inventory container references.

## Formula and research policy

Formula confidence stays explicit:

- exact/sourced;
- researched approximation;
- intentional simplification;
- placeholder.

Historical games may inform research, pacing, or structural comparisons, but they do not define canonical names, balance, or content. Formula refinement matters when it materially improves a real player-facing loop at representative data scale.

## Immediate implementation sequence

```text
0.5.550  Original-world names and stable-ID/save migration
0.5.600  Resource provenance, body processing, persistent projects
0.5.650  Ecology, gathering sources, spawn populations
0.5.700  Timed routes and scheduled caravans/transport
0.5.800  Regional content packs, normalization tools, cross-reference validation
0.5.900  Simulation/content-substrate exit gate
```

High-volume item/monster/quest/recipe generation starts only after the canonical identity migration is complete.
