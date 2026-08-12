# Hearth & Horizon

**Working title.** Hearth & Horizon is a text-first persistent fantasy life RPG about one continuous character building skills, livelihood, relationships, reputation, material capability, home/infrastructure, and geographic reach across a connected original fantasy world.

Earlier versions of this repository grew from FFXI-derived experiments. Those files may remain only as explicit research, migration, compatibility, or comparison material. They are **not canonical world content**.

Core progression law:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

Core capability law:

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

The browser presentation is canvas-first and text-led. Prose carries most of the world while restrained maps, icons, meters, cards, and diagrams improve comprehension without requiring a full graphical-world production.

## Current version

```text
Product:      0.5.650.1
Package:      0.5.650
Account Save: 4
Game State:   5
Data:         17
Codename:     Ecology Substrate
```

Product versions use `MAJOR.PHASE.TRACK.REVISION`. `package.json.version` remains valid three-part SemVer and normally mirrors `MAJOR.PHASE.TRACK`. `js/text/version.js` is authoritative for runtime/system versions.

## Current milestone state

The `0.5.650` ecology, gathering-source, and population substrate is implemented on `main`.

The current layer now includes canonical creature families and species separated from encounter instances; place-bound population records with habitat, density, rarity, aggression/sense/social metadata and deterministic respawn; representative flora, mineral, and fishing sources; canonical raw-resource item templates cross-linked to source provenance and sinks; persistent depletion state driven only by canonical world time; deterministic day/time/flag appearance conditions; explicit rare/named hooks that do not depend on arbitrary appearance rolls; and cross-reference validation across species, families, places, populations, sources, actions, and item outputs.

Seed encounter templates now carry canonical `speciesId` references. Existing `places.js` spawn-rule arrays remain a transitional encounter-placement layer rather than the final population authority; migrating encounter selection to population-driven spawning is intentionally bounded follow-up work rather than a reason to generate large ecology catalogs now.

The preceding `0.5.600` substrate remains in place: persistent projects, provenance-aware defeated-enemy resource opportunities, timed recovery actions, and physical/economic/social source metadata.

### Original-world anchors

- **Thornwall** and the **Elderwood**;
- **Brasshaven** and the **Redstone Reach**;
- **Mistmere** and the **Starfen**;
- future central trade hub **Waymeet**.

Canonical ancestries are **Human, Lethari, Miri, Veyra, and Korren**. The transitional starting disciplines are **Vanguard, Pugilist, Lifewarden, Elementalist, Spellblade, and Shadowhand**.

### Deliberate compatibility debt

The project does not erase compatibility tokens by inventing replacement canon without design support:

- `gil` remains the current currency term until an original currency design is deliberately chosen;
- historical localStorage key names remain for save compatibility;
- some legacy-shaped POI hook IDs remain while dependent shop/quest/guild references are migrated atomically;
- `legacyIdentity`, save migrations, `legacyRecoveredData`, and `ffxi*` research modules retain historical names because their purpose is explicitly compatibility/reference work;
- legacy command aliases may still be accepted at adapter boundaries, while canonical help and new runtime records use original-world vocabulary.

## Read these first

1. `AGENTS.md` — repository operating rules and session limits.
2. `docs/DEVELOPMENT_DIRECTION.md` — design north star.
3. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-world naming, legacy boundaries, provenance, and content-scale policy.
4. `docs/ROADMAP.md` — current implementation status and sequence.
5. `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — product/schema version protocol and release gates.
6. `docs/TRANSITIONAL_ARCHITECTURE.md` — temporary seams and migration constraints.
7. `docs/ARCHITECTURE.md` — runtime/module boundaries.
8. `docs/THREAD_HANDOFF.md` — implementation handoff state.

Older planning documents can preserve useful history but do not override these files.

## Running

Serve the repository over localhost; do not open `index.html` directly with `file://` because browser ES-module imports require an HTTP origin.

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

No build step is required for local play.

## Development gate

Use Node 20+.

```bash
npm test
npm run benchmark
npm run check
```

GitHub Actions runs test/build checks for pushes to `main`. During the current early single-maintainer phase, repository work normally proceeds directly on `main`; branch/PR ceremony can be tightened when collaboration or release risk makes it useful.

## Product direction in brief

### One person, many disciplines

A discipline is a training tradition, not a magical identity swap. Learned techniques, spells, recipes, and practical capabilities ultimately belong to the continuous character. Actual use depends on real prerequisites such as proficiency, equipment, tools, ammunition, reagents, resources, injury/status, terrain, preparation, and formal training where the fiction requires it.

The current `mainJobId`-shaped scaffold remains transitional until capability-centered progression replaces it incrementally behind migrations and tested interfaces.

### Long fictional time without needless real waiting

Simulation time and wall-clock time are separate. The game supports deterministic world time, pause, speed control, timed tasks, advance-until-interrupt semantics, and structured end-of-day review.

Current `main` includes canonical deterministic world time, pause/speed control, timed tasks, deterministic interrupts, structured day review, original-world identity/stable IDs, persistent projects, provenance-aware physical resource recovery, and ecology depletion/regeneration driven by the same canonical time authority.

### A home base, not a one-city game

The player may establish a room, home, workshop, farm, camp, or other foothold. A base matters for storage, recovery, preparation, relationships, and production, but the intended world also contains multiple cities, smaller settlements, roads, wilderness, mines, ports, ruins, dungeons, caravans, ferries, mounts/pack logistics, trade routes, and regional economies.

Internal place/data partitions support simulation and navigation. Player-facing geography should usually feel continuous rather than like artificial loading zones.

### Maps are knowledge

Maps can be acquired, discovered, incomplete, or supplemented by exploration and NPC directions. Routes, landmarks, hazards, resources, services, and shortcuts should become known through play rather than omniscient navigation.

### Resource provenance instead of reward confetti

A defeated creature should not automatically manufacture finished crafting materials in inventory. Combat can create a body, carried-goods opportunity, or salvage opportunity. Recovering useful material can then depend on searching, skinning, butchering, plucking, extracting, salvaging, tools, proficiency, condition, fictional time, carrying capacity, and player choice.

Environmental sources now use the same provenance model for representative foraging, gathering, logging, mining, and fishing records. Their availability depletes and regenerates through canonical simulation time rather than real-world timers. Commerce, wages, contracts, reputation/social rewards, crafting, and explicitly justified exceptional magic remain valid acquisition paths.

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

The intended game eventually needs hundreds to thousands of interconnected records: places, NPCs, creatures, flora/resources, items, recipes, abilities, quests, relationships, shops, and transport routes.

Mechanics and representative content therefore grow together through regional content packs, normalization, and cross-reference validation rather than a few toy records or giant unvalidated files. The ecology substrate deliberately proves several distinct families, habitats, and source types before hundreds-scale generation begins.

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

The ecology layer is currently split between `data/ecologyCatalog.js`, `data/resourceItems.js`, and `systems/ecologyEngine.js`; encounter templates remain in `data/seedEntities.js` and refer to canonical species IDs.

## Implemented foundation versus sparse content

The repository has useful foundations for account/character saves and migrations, structured entities, places/maps/navigation/travel, POIs and shops, inventory/storage/equipment, character-owned skill scaffolds, battle/EXP/status/RNG scaffolds, provenance-aware battle resources, persistent projects, ecology populations and environmental gathering sources, `ActionResult`, semantic events, deterministic simulation time/tasks/interrupts/day review, validation hooks, benchmarks, CI, and database/system-version tracking.

This is **foundation breadth, not content completion**. Canonical monster, item, shop, quest, magic, relationship, companion, crafting, gathering, and regional catalogs remain far below intended scale.

See `docs/SYSTEM_CATALOG.md` for the system-by-system audit.

## Save model

Historical localStorage keys are retained under compatibility policy:

```text
ffxiTextRpgAccounts
ffxiTextRpgAccountSession
```

Encoding is `base64-json-v1`; this is encoding, not cryptographic protection. Ordered migrations handle registered persistence-version transitions, while `reviveGameState()` repairs post-JSON references such as inventory-container links.

Project, resource-opportunity, and ecology registries are additive Game State v5 fields and lazily initialize when absent, so these tracks do not require another Game State schema bump. The canonical ecology/resource catalog advances the Data contract to v17.

## Formula and research policy

Formula confidence stays explicit: exact/sourced, researched approximation, intentional simplification, or placeholder. Historical games can inform comparison research but do not define canonical names, balance, or content.

## Immediate implementation sequence

```text
0.5.550  Original-world identity and stable-ID migration      COMPLETE
0.5.600  Resource provenance + persistent projects           COMPLETE
0.5.650  Ecology, gathering sources, spawn populations       COMPLETE
0.5.700  Timed routes + scheduled caravans/transport         NEXT
0.5.800  Regional content packs + normalization/validation
0.5.900  Simulation/content-substrate exit gate
```

The next bounded unit should establish canonical route records and timed local/overland travel as shared transport substrate, then prove scheduled caravan stops, fares/cargo allowances, deterministic departure/arrival timing, and interruption hooks before broad route generation.
