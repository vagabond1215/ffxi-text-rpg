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

## Current version

```text
Product:      0.5.900.1
Package:      0.5.900
Account Save: 4
Game State:   5
Data:         19
Benchmark:    1
Codename:     Simulation Substrate Gate
```

`js/text/version.js` is authoritative for runtime and subsystem versions. Product versions use `MAJOR.PHASE.TRACK.REVISION`; `package.json.version` remains three-part SemVer and normally mirrors `MAJOR.PHASE.TRACK`.

## Milestone state

**Phase 0.5 — Simulation and Content Substrate is complete.**

The repository now has one deterministic simulation authority for fictional time; pause/speed control; timed tasks; advance-until-interrupt behavior; day boundaries and structured reviews; original-world IDs and bounded legacy adapters; persistent projects; physical/economic/social resource provenance; persistent defeated-creature resource opportunities; canonical ecology families/species/populations and environmental gathering sources; canonical routes and scheduled transport; regional/shared content-pack manifests; stable-ID ownership and dependency validation; review-only legacy candidate normalization; generated hundreds-record validation fixtures; and an explicit simulation-substrate readiness gate.

`js/text/systems/simulationSubstrateGate.js` evaluates the 0.5 exit contract as seven structured groups: deterministic simulation, original-world identity, projects/provenance, ecology/gathering, routes/transport, regional content/scale, and persistence compatibility. The production gate is green at `0.5.900.1`.

This remains **pre-alpha foundation breadth, not content completion**. The next phase integrates substantial character/mechanics content rather than treating the substrate as a finished game.

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
- `places.js` connection records remain a bounded fallback for travel paths not yet represented by canonical route records;
- encounter `spawnRules` remain a bounded transitional placement layer beside canonical ecology populations;
- `mainJobId` and related historical property names remain transitional while 0.6 moves capability ownership toward the continuous character;
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
8. `js/text/version.js` — authoritative active version values.
9. `docs/THREAD_HANDOFF.md` — implementation handoff state.

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

The current `mainJobId`-shaped scaffold remains transitional. **0.6.100** starts by strengthening canonical character stats/progression without turning discipline labels into universal capability gates; **0.6.200** then deepens skills, proficiencies, disciplines, and capabilities.

### Long fictional time without needless real waiting

Simulation time and wall-clock time are separate. Canonical fictional seconds drive tasks, projects, ecology regeneration, transport schedules, travel arrival, rare/time-window conditions, interrupt discovery, and day review. Wall-clock ticks are only scheduler input.

### Travel is world activity, not a menu teleport

Canonical routes carry stable stops, fictional duration, distance, hazards, transport compatibility, cargo/encumbrance hooks, and map/knowledge metadata. Walking a route creates a timed task whose completion is derived from world time. Scheduled services use deterministic departure cadence and arrival rather than wall-clock waiting.

### Resource provenance instead of reward confetti

A defeated creature does not automatically manufacture finished crafting materials in inventory. Combat can create a body, carried-goods opportunity, or salvage opportunity. Environmental gathering uses the same provenance model, with depletion and regeneration driven by canonical time.

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

### Regional content is a validated graph

`data/contentPackSchema.js`, `data/regionalContentPacks.js`, `systems/contentPackValidator.js`, and `data/legacyCandidateNormalizer.js` establish the 0.5.800 content architecture. Packs own human-meaningful stable IDs, declare dependencies, and cross-reference geography, routes/services, ecology, resources/items, NPCs, shops, recipes, quests, and relationships.

Legacy/reference normalization only produces review candidates. Successful parsing cannot make historical content canonical. Validation catches ownership conflicts, dangling references, source/sink failures, route topology problems, undeclared cross-pack dependencies, and legacy IDs leaking into canonical packs without explicit adapters.

Generated fixtures currently prove validation over hundreds of interconnected records before broad hand-authored expansion begins.

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

Important current substrate files include:

```text
js/text/data/ecologyCatalog.js
js/text/data/resourceItems.js
js/text/data/routeCatalog.js
js/text/data/contentPackSchema.js
js/text/data/regionalContentPacks.js
js/text/data/legacyCandidateNormalizer.js
js/text/systems/ecologyEngine.js
js/text/systems/transportEngine.js
js/text/systems/contentPackValidator.js
js/text/systems/simulationSubstrateGate.js
```

## Save model

Historical localStorage keys are retained under compatibility policy:

```text
ffxiTextRpgAccounts
ffxiTextRpgAccountSession
```

Encoding is `base64-json-v1`; this is encoding, not cryptographic protection. Ordered migrations handle registered persistence-version transitions, while `reviveGameState()` repairs post-JSON references such as inventory-container links.

Account Save remains v4 and Game State remains v5. The 0.5.800 content-pack contracts advanced the canonical Data contract to v19; the 0.5.900 readiness gate adds no persisted data shape and therefore does not bump Data or Game State.

## Immediate implementation sequence

```text
0.5.550  Original-world identity and stable-ID migration      COMPLETE
0.5.600  Resource provenance + persistent projects           COMPLETE
0.5.650  Ecology, gathering sources, spawn populations       COMPLETE
0.5.700  Timed routes + scheduled caravans/transport         COMPLETE
0.5.800  Regional content packs + normalization/validation   COMPLETE
0.5.900  Simulation/content-substrate exit gate              COMPLETE
0.6.100  Character stats and progression                     NEXT
```

The next bounded unit is `0.6.100`: consolidate the canonical character-stat/progression contract around the continuous character, identify and quarantine historical formula dependencies, add original-world progression metadata and migration-safe adapters, and prove representative progression behavior before opening the broader capabilities track.
