# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Required read order

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/DEVELOPMENT_DIRECTION.md`
4. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
5. `docs/ROADMAP.md`
6. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
7. Relevant architecture/runtime/data/tests, especially `docs/ARCHITECTURE.md` and `js/text/version.js`.

## Workflow

Work directly on `main` by default. Treat each prompt as a bounded work order. Follow the `AGENTS.md` autonomous-session guardrail and update this handoff at the end of substantive work.

## Product laws

Working title: **Hearth & Horizon**. Earlier FFXI-derived material is legacy research/reference/migration material, not canonical world content.

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

Maps represent acquired character knowledge, not omniscient authored geography.

### Hard map/privacy rule

**Authored coordinates are simulation/internal data only and must not be player-facing.** The local map must render only discovered or locally knowable geometry and fit/recenter that known portion inside the viewport. It must not reveal the character's relative position inside undiscovered authored bounds, nor reveal total authored map extent before play has justified that knowledge.

Internal `state.position`, atlas keys, topology edges, POI coordinates, route-stop coordinates, and other simulation geometry remain valid implementation data. Presentation layers must translate those into knowledge-relative geometry and human world descriptions.

## Current baseline

```text
Product:      0.6.300.1
Package:      0.6.300
Account Save: 4
Game State:   5
Data:         21
Benchmark:    1
Codename:     Original Magic and Abilities
```

Phase 0.5 is complete. Phase 0.6 is active through 0.6.300. The next planned mechanics track is `0.6.400 — Combat 2.0`, but do not reopen or rewrite the map/UI architecture merely as part of that track.

## Completed implementation sequence

- 0.4 foundation/versioning/ordered migrations/ActionResult/semantic events;
- 0.5.100 deterministic world clock;
- 0.5.200 pause/speed controls;
- 0.5.300 canonical timed tasks;
- 0.5.400 deterministic interrupt model;
- 0.5.500 day boundaries/end-of-day review;
- 0.5.550 original-world identity/stable-ID migration;
- 0.5.600 persistent projects/resource provenance;
- 0.5.650 ecology/gathering/populations;
- 0.5.700 canonical routes/scheduled transport;
- 0.5.800 regional content packs/normalization/scalable validation;
- 0.5.900 simulation/content-substrate exit gate;
- 0.6.100 continuous-character stats/progression;
- 0.6.200 character-owned skills/proficiencies/capabilities;
- 0.6.200.2 bounded canvas usability refinement;
- 0.6.250 semantic DOM player-interface architecture;
- 0.6.300 original magic and active ability engine.

## 0.6.300 magic/ability state

Canonical executable ability/effect data is separate from character capability ownership. `capabilityEngine` owns learned/use prerequisites; `abilityEngine` owns concrete activation, costs, targeting, effects, fictional-time activation/cooldowns, interruption, and lifecycle events.

Original spell traditions include Embercraft, Vital Weave, and Ward Lore. Representative executable records include Ember Dart, Mending Thread, Stone Ward, Guarded Cut, and Waymark Reading. No historical spell names were promoted into canonical ability data.

Current ability policy: costs are spent when activation begins; non-instant activation creates a canonical timed task; successful resolution starts cooldown; interruption cancels the activation task, retains already-spent resources, and does not start cooldown. Only one active player ability activation is supported in this first contract.

Waymark Reading must report only already-acquired place/atlas knowledge. It must not expose authored coordinates, hidden total topology, or undiscovered authored placement.

Lifecycle events:

```text
ability.started
ability.resolved
ability.interrupted
```

`invoke <ability>` is the bounded keyboard/power-user adapter. Old `cast` and transitional weapon-technique behavior remain compatibility seams for Combat 2.0.

## Discovery-safe local map correction — 2026-08-13

The local map privacy regression was traced to `js/text/ui/minimapModel.js`: visited cells were being projected against full authored topology bounds. A one-cell map could therefore reveal that the character was globally near an edge, center, top, or bottom, and the UI also exposed authored total-map counts and raw coordinate labels.

The correction now on `main` does the following:

- computes the minimap viewport from **discovered cells plus locally knowable path stubs only**;
- rebases visible geometry to a knowledge-relative local origin on every render;
- derives `model.width`/`model.height` from that visible knowledge instead of authored bounds;
- uses synthetic presentation labels such as `Current area` / `Known area N` rather than authored coordinate identifiers;
- hides authored total size as `?` instead of exposing values such as `1/32 explored`;
- keeps the known portion centered/fitted by the existing DOM SVG and Canvas viewport scaling without revealing where it sits in the undiscovered authored map;
- retains raw coordinates in internal simulation state and a separate `describeInternalCoordinate()` helper for internal/debug compatibility;
- keeps the shared player-facing coordinate description generic (`local area` / `unknown area`);
- removes coordinate output from player-facing atlas, POI, character, place-layout, DOM, and legacy panel surfaces;
- keeps the transitional Canvas snapshot's raw coordinate only as internal regression/debug data while removing that value from Canvas rendering.

Important map/privacy commits include:

```text
c6cf1584351e4a1efb1ac30c5e3b1b64148c7a1a  Fit minimap viewport to discovered geometry
2c5b39709d51dde3b98aced15f8149e008e2a38b  Remove coordinate identifiers from minimap view model
5316225b0fa625ec99637652780a17508f535c83  Make coordinate descriptions player safe
b95b3da7ceaf5db71910ca83f4359ea8c74780b8  Keep atlas extent and coordinates undisclosed
e7cbb8525695a9181ed8abbab9775e764a97834d  Remove coordinate data from player-facing POI text
317fb51db80c5f6b7821b53e8604dd36129e0dad  Hide authored local-map extents from place descriptions
82d03b19552c0f4c5359375b55ae23664333a19e  Add internal coordinate formatter
cc1130570214164b833f9acf1edb8eda3109a4c6  Keep canvas coordinates internal to snapshot state
5ba9b5b9a2142e9419ecdd2bf43a8227140c0383  Remove coordinate labels from legacy panels
```

### Grid minimap rendering regression and repair — 2026-08-13

A second, separate rendering defect was found after the discovery-safe projection shipped. Grid-based places could render as a solid-color SVG with no visible map geometry.

Root cause: `atlasEngine` serializes internal numeric grid positions through `coordinateKey({ x, y })` as strings such as `"2,2"`. `minimapModel.createGridModel()` later called `parseCoordinate()` on those keys, but `parseCoordinate()` only accepted authored alpha topology strings or numeric coordinate objects. Every grid atlas key therefore parsed to `null`, leaving `map.cells` empty. The renderer was functioning, but it had no drawable geometry beyond its background.

Repair:

- `parseCoordinate()` now round-trips the existing internal numeric key serialization (`"x,y"`) back to a numeric coordinate object;
- this is an internal parser correction only; `describeCoordinate()` remains player-safe and no numeric coordinate is exposed by the UI;
- the discovery-relative minimap continues to rebase the parsed point to its known local origin rather than using authored map width/height;
- `tests/minimapGridRendering.test.js` explicitly creates a Brasshaven grid-map discovery, requires a drawable current-position SVG circle, verifies the rendered map is rebased to the local known origin, keeps total extent as `?`, and asserts the internal coordinate string does not appear in rendered HTML.

Repair commits:

```text
a776959ac3387882c0021567ea220bf1356d15f0  Parse internal grid atlas coordinate keys
3092f1e91ba75231c626520a8b9d7682d107266f  Cover grid minimap rendering regression
```

### Latest validation checkpoint

Runtime/test head:

```text
3092f1e91ba75231c626520a8b9d7682d107266f
```

GitHub Actions completed successfully on 2026-08-13:

```text
tests       398
pass        398
fail        0
cancelled   0
skipped     0
todo        0
```

The new grid-minimap regression is test 205 in that run and passed. Benchmark, Pages `build`, `report-build-status`, and `deploy` also completed successfully. The deployed build therefore contains the numeric-grid parsing repair.

The recurring Actions warning about Node 20 action-runtime deprecation remains warning-only; project tests/benchmark use Node 20.20.2.

## Map/privacy follow-up rules

Do not regress these behaviors:

- Do not use authored topology bounds to size the player-facing minimap.
- Do not print internal coordinates in DOM headers, Canvas panels, atlas prose, POI prose, movement/travel prose, character summaries, or normal command output.
- Do not expose `getNavigableCoordinateKeys(...).length` as map completion before the character has earned full-map knowledge.
- Internal coordinate assertions are valid in simulation/navigation tests.
- A future full-map/completeness feature may reveal total extent only through an explicit knowledge contract; do not infer it from authored data automatically.
- Local path stubs may be shown when they represent immediately knowable exits/paths from already-known cells; they must still be projected relative to visible knowledge.
- Grid map rendering must round-trip internal atlas keys into drawable geometry without placing the resulting known geometry against authored bounds.
- The active browser shell is semantic DOM. Canvas remains bounded compatibility/regression/reference code.

## Intentional debt entering 0.6.400

- `combatActionEngine.castSpell()` remains the old placeholder adapter until Combat 2.0.
- Transitional combat-technique/recovered weapon-skill command behavior remains bounded.
- Only one active ability activation is supported; there is no generalized action queue/concurrency model yet.
- Enemy canonical ability selection/execution, AoE/ground targeting, resistance/accuracy layers, and final tactical timing belong to 0.6.400.
- Status records can carry duration metadata, but status-expiry orchestration is not yet fully redesigned around world time.
- Equipment eligibility still contains discipline-shaped compatibility requirements.
- `player.jobs`, `mainJobId`, `raceId`, `nationId`, and related persisted/internal names remain compatibility seams.
- Historical FFXI research modules remain bounded reference surfaces.
- `places.js` spawn rules/place connections, `gil`, historical localStorage keys, and legacy-shaped POI hook IDs remain intentional compatibility debt.
- Some internal/debug helpers can still inspect authored coordinates; this is allowed only so long as presentation layers do not expose them.

## Next target

```text
0.6.400 — Combat 2.0
```

Recommended first bounded unit: inspect current battle topology/phase/combatants, action adapters, canonical abilities, statuses, rewards/resource opportunities, equipment/capabilities, and deterministic timing. Define a canonical encounter/combat-state contract; make canonical abilities first-class combat actions; add deterministic opponent action selection/timing/interruption/status interaction; keep skills/equipment/capabilities/preparation compositional rather than hard-gating through active discipline; migrate legacy attack/cast/technique commands behind bounded adapters; preserve victory/defeat/EXP/resource-provenance behavior; validate/version/test/benchmark/document; then stop before 0.6.500.
