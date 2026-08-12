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
Product:      0.6.200.2
Package:      0.6.200
Account Save: 4
Game State:   5
Data:         20
Benchmark:    1
Codename:     Character Capabilities
```

`js/text/version.js` is authoritative for runtime and subsystem versions. Product versions use `MAJOR.PHASE.TRACK.REVISION`; `package.json.version` remains three-part SemVer and normally mirrors `MAJOR.PHASE.TRACK`.

## Milestone state

**Phase 0.5 — Simulation and Content Substrate is complete. Phase 0.6 is active through 0.6.200.**

The completed simulation substrate includes deterministic fictional time, pause/speed control, timed tasks, advance-until-interrupt behavior, day boundaries/reviews, original-world IDs, projects, resource provenance, ecology/gathering populations, canonical routes/scheduled transport, regional content packs, scalable validation, and an explicit historical 0.5 readiness gate.

`0.6.100` established character-owned stats and progression. A player now owns a versioned original-design stat state whose persistent base growth follows the highest attained discipline training rank; the active discipline supplies contextual training/stat modifiers rather than owning the person. Lifetime training progress is tracked across discipline records. Historical FFXI stat formulas remain callable at explicit research/reference boundaries but are no longer authoritative for canonical player runtime stats.

`0.6.200` established a character-owned capability layer. Disciplines can provide learning paths, but learned capabilities persist on the continuous character. Capability use checks concrete prerequisites—learned proficiency, equipment, tools, preparation, resources, flags, and world/action context—rather than universally checking the currently active discipline. Skill training caps constrain new gain without erasing already learned proficiency when the player changes discipline.

`0.6.200.2` is a focused canvas-UI usability revision. Character creation now uses shorter ancestry/origin/discipline wording and wrapped descriptions; the travel sidebar has a discovery-driven local minimap backed by the existing atlas knowledge model; the D-pad is compact and centered below it; flat action buttons are grouped into Character, Spellbook, Codex, World, Crafting, Combat, and System menus; and the right pane permanently shows character resources, attributes, and derived combat stats at a glance. Planned Codex/Crafting entries are disabled structural placeholders rather than claims of implemented gameplay systems.

This remains **pre-alpha foundation and representative mechanics, not content completion**. The next bounded track is `0.6.300`, which will establish original magic and executable active-ability contracts without opening the full Combat 2.0 rewrite.

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
- `mainJobId`, `player.jobs`, `raceId`, and related persisted/internal property names remain compatibility seams while ownership semantics move to the continuous character;
- current equipment eligibility and skill-cap data still use discipline-shaped compatibility fields where a later capability migration is required;
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

The current runtime now reflects this distinction in two places. `characterStatEngine.js` owns persistent character base growth independently from the currently active discipline, and `capabilityEngine.js` separates **how a capability is learned** from **whether its concrete use requirements are currently satisfied**. The historical `mainJobId` field remains an internal compatibility identifier, not a new universal permission boundary.

### Character progression is persistent

`player.progression.character` tracks character-level training history while per-discipline records preserve discipline-specific levels and EXP. Changing active discipline can change contextual modifiers or the window in which a proficiency can improve, but it cannot erase previously learned character proficiency or reduce the character's persistent base-growth rank.

Canonical player combat profiles are now produced from the original provisional character model plus active-discipline context, equipment, and status modifiers. Historical FFXI grade/formula modules remain available for comparison tests only; combat-profile metadata explicitly reports that they are not runtime authority.

### Capabilities are owned; prerequisites are checked at use time

`data/capabilities.js` and `systems/capabilityEngine.js` establish representative technique/practical capability contracts. A capability can have one or more discipline learning paths or an open learning path. Once learned it lives in `player.progression.capabilities`, independent of the active discipline.

Use eligibility can require:

- character-owned learned proficiency;
- compatible main-hand/equipment tags;
- tool capabilities;
- preparation tags;
- resources such as TP/MP/HP;
- flags or contextual conditions;
- an appropriate action/world context.

The initial capability records are representative substrate, not a mass-authored technique catalog. Execution/effect definitions remain a separate concern for `0.6.300` and later combat integration.

### Maps are acquired knowledge

The canvas local minimap is intentionally derived from the same per-place atlas discoveries used by navigation. It begins sparse and reveals cells/connections as movement discovers them instead of exposing a complete authoritative world layout. The minimap is a player-knowledge view, not a second geography database or a new save schema.

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

`data/contentPackSchema.js`, `data/regionalContentPacks.js`, `systems/contentPackValidator.js`, and `data/legacyCandidateNormalizer.js` establish the regional-content architecture. Packs own human-meaningful stable IDs, declare dependencies, and cross-reference geography, routes/services, ecology, resources/items, NPCs, shops, recipes, quests, and relationships.

Legacy/reference normalization only produces review candidates. Successful parsing cannot make historical content canonical. Generated fixtures prove validation over hundreds of interconnected records before broad hand-authored expansion.

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
js/text/systems/characterStatEngine.js
js/text/systems/progressionEngine.js
js/text/systems/skillProgressionEngine.js
js/text/data/capabilities.js
js/text/systems/capabilityEngine.js
js/text/ui/minimapModel.js
js/text/ui/canvasLayout.js
js/text/ui/canvasRenderer.js
js/text/data/ecologyCatalog.js
js/text/data/routeCatalog.js
js/text/data/contentPackSchema.js
js/text/data/regionalContentPacks.js
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

Account Save remains v4 and Game State remains v5. Character stat/progression and capability state are additive/lazily repairable Game State v5 fields. Data advanced from v19 to **v20** for the canonical capability learning/use contract; the `0.6.200.2` UI revision adds no persistence or Data contract.

## Immediate implementation sequence

```text
0.5.900  Simulation/content-substrate exit gate              COMPLETE
0.6.100  Character stats and progression                     COMPLETE
0.6.200  Skills/proficiencies/disciplines/capabilities       COMPLETE
0.6.300  Original magic and active ability engine            NEXT
0.6.400  Combat 2.0
0.6.500  Canonical item/equipment/tool breadth
0.6.600  Gathering/hunting/processing/crafting/cooking
0.6.700  Ecology and regional creature/resource content
0.6.800  AI party/companion foundation
0.6.900  Integrated-mechanics exit gate
```

The next bounded unit is `0.6.300`: establish original executable ability/magic definitions, targeting/cost/cast/recast/effect contracts, deterministic action/event seams, and representative original techniques/spells. Keep character capability ownership distinct from executable effects and preserve the existing combat scaffold behind adapters until `0.6.400`.
