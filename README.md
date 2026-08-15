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

Navigation law:

```text
Use fine movement where movement itself creates decisions.
Use named localities and actions where destinations and relationships create decisions.
```

## Current version

```text
Product:      0.6.500.1
Package:      0.6.500
Account Save: 4
Game State:   5
Data:         23
Benchmark:    1
Codename:     Equipment and Tool Breadth
```

`js/text/version.js` is authoritative for runtime/subsystem versions. Product versions use `MAJOR.PHASE.TRACK.REVISION`; `package.json.version` remains three-part SemVer and normally mirrors `MAJOR.PHASE.TRACK`.

## Milestone state

**Phase 0.5 — Simulation and Content Substrate is complete. Phase 0.6 is active through 0.6.500.**

The current integrated foundation includes:

- deterministic fictional time, pause/speed, timed tasks, interrupts, day review, routes, scheduled transport, projects, ecology, provenance, and scalable content-pack validation;
- one continuous character whose learned skills/capabilities persist across discipline changes;
- original executable magic/ability definitions separated from capability ownership;
- Combat 2.0 structured actions, canonical readiness/recovery timing, timed-cast interruption, canonical status expiry, and an original enemy active-ability seam;
- semantic DOM/CSS browser presentation with contextual actions and a single-screen character creator;
- named safe-settlement locality navigation that omits the exploration map/compass, while wilderness retains the acquired-knowledge map and directional movement;
- representative original weapons, armor, accessories, travel gear, and usable field tools whose equipped tags satisfy practical capability/gathering requirements.

This remains **pre-alpha systems development**, not content completion. The next bounded track is `0.6.600`: gathering/hunting/processing/crafting/cooking/salvage loops built on canonical time, tools, capability/proficiency, provenance, and resource sinks.

## Original-world anchors

- **Thornwall** and the **Elderwood**;
- **Brasshaven** and the **Redstone Reach**;
- **Mistmere** and the **Starfen**;
- future central trade hub **Waymeet**.

Canonical ancestries are **Human, Lethari, Miri, Veyra, and Korren**. Disciplines are training traditions rather than magical class transformations.

## Player interface

The player-facing UI is a **world interface**, not a permanent command console.

The active browser shell is semantic DOM/CSS:

```text
index.html
  -> js/main.js
      -> createDomApp(host)
          -> authoritative game/save/command/intent services
          -> createGameViewModel(state, uiState)
          -> renderDomApp(...)
```

Primary information navigation currently includes Scene, Character, Spellbook, Journal, Codex, Craft, and World. Contextual actions stay small and situation-dependent. The bottom Search-or-act field remains a typed-command/power-user adapter; it is not yet a full fuzzy entity/action search engine.

### Settlement/locality navigation

Safe guarded city areas use named destinations and locality actions. The active renderer does not emit a local exploration map or D-pad there. Crossing between adjacent localities consumes authored coarse fictional time and remains interruptible.

### Exploration navigation

Wilderness/dungeons and other terrain-sensitive spaces retain directional movement and a discovery-relative SVG map. Authored coordinates, undiscovered total extent, and hidden placement inside authored bounds are simulation data and are not automatically exposed to the player.

Higher-resolution shaped exploration cartography remains a later presentation/content option; it is no longer needed simply to make ordinary city interaction usable.

### Character creation

The active creator keeps name, ancestry, sex, origin, and starting discipline on one screen with a live starting profile. Starting discipline is initial training, not permanent class identity or a universal capability gate.

## Character, combat, and equipment model

### One person, many disciplines

`characterStatEngine.js`, progression/skill systems, `data/capabilities.js`, and `capabilityEngine.js` keep character ownership separate from active training context. A discipline may teach or improve something without owning the learned capability forever.

### Original active abilities

`data/abilities.js` + `abilityEngine.js` own executable effects, targeting, costs, timed activation, cooldowns, and interruption. Capability records own learned/use prerequisites. These responsibilities remain separate.

### Combat 2.0

`combatTurnEngine.js` maintains structured action history and a fictional-time readiness timeline. `combatSimulationEngine.js` composes enemy-ready and ability-completion interrupts through the canonical simulation engine, allowing enemy actions to interleave with timed casts. `statusEngine.js` reconciles finite status expiry against canonical world time.

### Equipment and field tools

`data/equipmentCatalog.js` now includes representative equipment breadth plus:

```text
Field Knife        -> cutting / practical recovery
Prospector Pick    -> mining
Woodsman Hatchet   -> woodcutting
Digging Spade      -> digging
Reed Sickle        -> cutting
Marsh Fishing Rod  -> fishing
```

`equipmentToolEngine.js` resolves equipped item tags for capability/gathering requirements. New original equipment is authored without active-discipline restrictions by default. Older starter `allowedJobs` fields remain bounded compatibility debt.

Representative settlement shops sell the new gear as normalized equipment, so bought tools enter the same inventory/equip/loadout systems used elsewhere.

## Fictional time and resources

Simulation time and wall-clock time are separate. Canonical fictional seconds drive tasks, projects, ecology regeneration, transport schedules, travel arrival, combat recovery, timed abilities, status expiry, interrupt discovery, and day review.

A defeated creature does not automatically manufacture finished materials in inventory. Combat/environmental gathering creates physical resource opportunities or provenance-bearing raw materials that should flow through processing, use, wear, recycling/salvage, and replacement loops.

Desired material flow remains:

```text
world source
  -> raw material
  -> processing
  -> component/ingredient
  -> finished good
  -> use/wear/consumption
  -> repair/recycling/salvage or replacement
```

`0.6.600` is the next track that turns more of this chain into playable work.

## Deliberate compatibility debt

Do not erase compatibility tokens by inventing replacement canon without design support:

- `gil` remains current currency terminology until an original currency design is deliberately chosen;
- historical localStorage keys remain for save compatibility;
- some legacy-shaped POI hook IDs remain while dependent references use them internally;
- `places.js` connections remain bounded fallback/locality adjacency where canonical routes are not the appropriate authority;
- encounter `spawnRules` remain transitional beside canonical ecology populations;
- `mainJobId`, `player.jobs`, `raceId`, and related persisted/internal names remain compatibility seams;
- older starter equipment eligibility still contains discipline-shaped fields; new original gear should not copy that pattern by default;
- historical FFXI research modules remain bounded reference/migration surfaces;
- Canvas UI modules remain regression/reference code but are not the active browser entry point.

## Read these first

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/DEVELOPMENT_DIRECTION.md`
4. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
5. `docs/ROADMAP.md`
6. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
7. `docs/TRANSITIONAL_ARCHITECTURE.md`
8. `docs/ARCHITECTURE.md`
9. `docs/LOCALITY_AND_EXPLORATION_MODEL.md`
10. `js/text/version.js`

## Running

Serve over localhost; do not open `index.html` via `file://` because browser ES-module imports require an HTTP origin.

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

GitHub Actions runs test/build checks for pushes to `main`. During the current early single-maintainer phase, work normally proceeds directly on `main`; branch/PR protections can be tightened when collaboration/release risk requires them.

## Immediate sequence

```text
0.5.900  Simulation/content-substrate exit gate              COMPLETE
0.6.100  Character stats and progression                     COMPLETE
0.6.200  Skills/proficiencies/disciplines/capabilities       COMPLETE
0.6.250  Player interface architecture                       COMPLETE
0.6.300  Original magic and active ability engine            COMPLETE
0.6.400  Combat 2.0                                          COMPLETE
0.6.450  Locality and exploration navigation                 COMPLETE
0.6.500  Equipment and field-tool breadth                    COMPLETE
0.6.600  Gathering/processing/crafting/cooking/salvage       NEXT
0.6.700  Ecology/regional content breadth
0.6.800  Persistent companion/party foundation
0.6.900  Integrated-mechanics exit gate
```
