# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Required read order

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/DEVELOPMENT_DIRECTION.md`
4. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
5. `docs/ROADMAP.md`
6. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
7. Relevant architecture/runtime/data/tests, especially `docs/ARCHITECTURE.md`, `docs/LOCALITY_AND_EXPLORATION_MODEL.md`, `docs/QUALITY_GATES.md`, `docs/PERFORMANCE_BUDGET.md`, and `js/text/version.js`.

## Workflow

Work directly on `main` by default. Treat each prompt as a bounded work order. Follow the `AGENTS.md` autonomous-session guardrail and update this handoff at the end of substantive work.

This repository is still early/single-maintainer pre-alpha development. A coherent incremental commit may temporarily fail while the bounded unit is being assembled, but milestone checkpoints should be validated and known failures recorded. Do not create routine branches/PRs unless explicitly requested or later repository protection requires them.

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

```text
Use fine movement where movement itself creates decisions.
Use named localities and actions where destinations and relationships create decisions.
```

Maps represent acquired character knowledge, not omniscient authored geography. Resources have physical/economic/social provenance. Canonical fictional time is separate from wall-clock scheduling.

### Hard map/privacy rule

**Authored coordinates are simulation/internal data only and must not be player-facing.** A player-facing map may render discovered or locally knowable geometry, but it must not expose raw authored coordinates, undiscovered total extent, or the character's hidden relative placement inside authored bounds.

Internal `state.position`, atlas keys, topology edges, POI coordinates, route-stop coordinates, and other simulation geometry remain valid implementation data. Presentation translates those into knowledge-relative geometry and human world descriptions.

## Current baseline

```text
Product:      0.6.500.1
Package:      0.6.500
Account Save: 4
Game State:   5
Data:         23
Benchmark:    1
Codename:     Equipment and Tool Breadth
Compatibility: migrate-supported-save-versions
```

Phase 0.5 is complete. Phase 0.6 is active through **0.6.500**.

Completed sequence through this handoff:

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
- 0.6.200.2 bounded Canvas usability refinement;
- 0.6.250 semantic DOM player-interface architecture;
- 0.6.300 original magic and active ability engine;
- **0.6.400.2 Combat 2.0**;
- **0.6.450.1 locality and exploration navigation**;
- **0.6.500.1 equipment and tool breadth**.

## 0.6.400 Combat 2.0 — complete

The Combat 2.0 contract now unifies basic attacks, canonical abilities, bounded legacy cast/technique adapters, and enemy actions behind structured combat action records rather than display prose.

Primary files:

```text
js/text/systems/battleEngine.js
js/text/systems/combatActionEngine.js
js/text/systems/combatTurnEngine.js
js/text/systems/combatSimulationEngine.js
js/text/systems/abilityEngine.js
js/text/systems/statusEngine.js
js/text/data/enemyAbilities.js
```

### Combat contract v2

```js
battle.contract = {
  version: 2,
  actionSequence,
  actions,
  lastActionId,
  timeline: {
    startedAtWorldSeconds,
    readyAtByActorId
  }
}
```

Structured actions emit:

```text
combat.action.resolved
```

Current canonical timing constants in `combatTurnEngine.js`:

```text
player basic recovery: 3 fictional seconds
enemy basic recovery:  4 fictional seconds
enemy opening delay:    3 fictional seconds
```

Legacy cast/technique adapters currently use bounded recovery values on top of the same timeline.

### Combat time and interruption

There is no second combat clock. Readiness is absolute canonical fictional time.

`provideCombatInterrupts()` contributes enemy-ready events to `advanceSimulationUntilInterrupt()`. `combatSimulationEngine.advanceCombatSimulation()` composes combat and ability interrupt providers. A timed player ability can therefore be struck/interrupted by an enemy before cast completion.

The active DOM shell routes battle `wait` through `combatSimulationEngine` instead of bypassing combat interrupts.

### Status timing

Finite statuses can carry:

```text
appliedAtWorldSeconds
expiresAtWorldSeconds
```

`reconcileStatusesAtWorldTime()` lazily anchors older finite statuses and expires them against canonical fictional time.

### Deterministic battle identity

New encounters use additive `state.combatSequence` and IDs such as:

```text
battle-000001
enemy-...-encounter-000001
```

The older `Date.now()` battle identity scaffold is no longer runtime authority for new encounters.

### Original enemy active ability

`data/enemyAbilities.js` begins the original enemy active-ability catalog with:

```text
enemy-ability-rushing-cleave
Rushing Cleave
```

Redfang Raider owns it. Current selection policy intentionally proves deterministic enemy active-ability execution without pretending enemy AI breadth is complete.

### Combat bounded limitations

- Enemy tactical policy is deliberately small.
- AoE/ground targeting, richer resistance/accuracy layers, formations, party tactics, and broad enemy technique catalogs remain later depth/breadth work.
- `combatActionEngine.castSpell()` and transitional weapon-technique behavior remain bounded compatibility adapters.
- Only one active player ability activation is currently supported at once.

Do not reopen the canonical readiness/interruption clock without a concrete contradiction.

## 0.6.450 Locality and exploration navigation — complete

The accepted navigation distinction is now active behavior, not merely design direction.

Primary file:

```text
js/text/systems/localityEngine.js
```

Current semantic modes:

```text
locality     -> named settlement destinations + locality/POI actions
exploration  -> discovery map + directional movement
route        -> journey/progress + travel controls
combat       -> combat state + tactical actions
```

### Safe settlements

Existing danger-0 city/city-interior/travel-hub `place` records act as locality nodes. No redundant city-geography database was added.

Thornwall, Brasshaven, and Mistmere starter city place graphs now support named locality navigation. The active DOM renderer **omits** local-map and D-pad markup in safe locality mode. City UI is driven by named adjacent destinations and semantic POI actions.

`performLocalityPoiAction()` may use the POI's internal coordinate to satisfy old location-sensitive systems, but the coordinate is not player-facing navigation identity.

### Locality time

Ordinary browsing is free. Adjacent locality crossing consumes the authored connection `travelSeconds` through `advanceSimulationUntilInterrupt()`. If interrupted before completion, the player remains at the origin locality.

Safe therefore means ordinary ambient danger is suppressed; it does not mean world time is suspended or events cannot occur.

### Exploration

Wilderness/dungeons retain the acquired-knowledge SVG minimap, legal directional movement, keyboard controls, and atlas privacy. Higher-resolution shaped/seam-compatible cartography remains a valid later exploration presentation project, but it is not required to make ordinary cities usable.

See `docs/LOCALITY_AND_EXPLORATION_MODEL.md` for the stable contract.

## 0.6.500 Equipment and Tool Breadth — complete

Equipment breadth now proves usable world tools and general gear rather than merely adding catalog rows.

Primary files:

```text
js/text/data/equipmentCatalog.js
js/text/systems/equipmentToolEngine.js
js/text/systems/equipmentEngine.js
js/text/systems/equipmentEligibilityEngine.js
js/text/data/shopCatalogs.js
js/text/systems/shopEngine.js
js/text/systems/ecologyEngine.js
```

### Equipment catalog v3

Representative breadth now includes weapons, armor, shield/accessory/travel gear, and original field tools.

Field tools:

```text
Field Knife        -> cutting, dagger
Prospector Pick    -> mining
Woodsman Hatchet   -> woodcutting, axe
Digging Spade      -> digging
Reed Sickle        -> cutting
Marsh Fishing Rod  -> fishing
```

General gear added includes Iron Buckler, Road Cloak, Field Belt, Brass Ring, Traveler Boots, Leather Vest, Traveler Gloves, and Leather Trousers.

### Tool/loadout authority

`equipmentToolEngine.js` exposes equipped item tags as a shared loadout requirement source.

Consequences already proven:

- an Elementalist can equip a Field Knife and satisfy the learned Field Dressing practical capability without changing discipline;
- an equipped Prospector Pick automatically satisfies the mining tool requirement for the Redstone copper seam;
- ecology gathering still accepts explicit contextual `toolTags` as a bounded adapter, but equipped gear is now the normal player loadout seam.

### Shops

Shop catalog v2 stocks field tools and broader gear. Purchases recognized as equipment/tool pass through `enrichEquipmentItem()` before inventory insertion and can be equipped normally.

Player-facing catalog/shop text was moved to original-world wording. Stable legacy-shaped POI IDs remain internal compatibility seams.

### Equipment gating direction

New original equipment in this track defaults to `allowedJobs: []`. Do **not** copy active-discipline gating into new gear by default.

Older starter weapons/bronze armor still contain discipline-shaped `allowedJobs` compatibility fields. Migrate them incrementally when concrete loadout/capability requirements are available; do not perform an unbounded cleanup.

### Equipment bounded limitations

This is representative systems breadth, not a final item game. Durability/repair, ammunition depth, charge consumption, broad enchantment use, large tiered equipment progression, and finished economic balance remain future work.

## Validation checkpoint

Authoritative runtime/version checkpoint before documentation-only synchronization:

```text
3a30909e20ba279475803c691041f2d2d61f09f0
```

GitHub Actions on that head completed successfully:

```text
tests       421
pass        421
fail        0
cancelled   0
skipped     0
```

Build/deploy checks:

```text
test                  success
build                 success
report-build-status   success
deploy                success
```

Benchmark at Product `0.6.500.1` / Package `0.6.500` / Data `23`:

```text
create 1,000 player combat profiles:              421.358 ms | 0.421358 ms/op
create 1,000 enemy combat profiles:               115.202 ms | 0.115202 ms/op
resolve 1,000 basic attacks:                      499.732 ms | 0.499732 ms/op
run 10,000 tick dispatches with 5 subscribers:     47.547 ms | 0.004755 ms/op
resolve 10,000 direct travel route lookups:      6714.249 ms | 0.671425 ms/op
```

The recurring GitHub Actions warning about Node 20 action-runtime deprecation remains warning-only. The workflow runner forces affected action internals to Node 24 while `setup-node` still installs configured Node 20.20.2 for project test/benchmark execution.

Documentation synchronization follows that green runtime checkpoint; verify the latest docs-only head checks when starting the next session.

## Compatibility / intentional debt

Do not clean these opportunistically unless directly in scope:

- `gil` remains current currency terminology until deliberate original currency design.
- Historical localStorage keys remain for save compatibility.
- Legacy-shaped POI stable IDs remain where catalogs depend on them.
- `player.jobs`, `mainJobId`, `raceId`, `nationId`, and related internal/persisted names remain compatibility seams.
- Historical FFXI research modules remain bounded reference surfaces.
- Canvas modules remain regression/reference code; the active browser UI is semantic DOM.
- Some DOM information views still bridge to command output until dedicated presentation models exist.
- Search-or-act is command-capable, not true fuzzy cross-database/entity/action search.
- `places.js` spawn rules and some place connections remain transitional/fallback seams.
- Older starter equipment eligibility remains discipline-shaped compatibility debt; new original equipment should prefer concrete loadout/capability requirements.
- Existing `bronze-pick` is a legacy-shaped combat starter item; **Prospector Pick** is the canonical field mining tool added by 0.6.500.
- Gathering remains relatively atomic; 0.6.600 is where timed work/processing/crafting loops should deepen it.
- High-resolution shaped exploration cartography is deferred until terrain-sensitive content justifies the authoring cost.

## Next bounded target

Start **0.6.600 — Gathering, hunting, processing, crafting, cooking, and salvage**. Do not skip directly into mass content generation.

Recommended first unit:

1. audit current ecology gathering, resource opportunities/recovery, projects/timed tasks, inventory/provenance/sinks, capabilities/proficiencies, equipment-tool tags, and representative recipes/content packs;
2. define process/work records separately from finished item records;
3. turn representative gathering/recovery into timed proficiency/tool-aware work where appropriate;
4. implement one small source -> raw material -> processing -> component/ingredient -> finished-use/sink chain;
5. prove representative crafting and cooking through canonical tasks, workstations/tools, proficiency/capability, and resource consumption;
6. establish salvage/recycling without magical duplication;
7. preserve locality/exploration navigation, canonical fictional time, resource provenance, regional content ownership, and continuous-character capability semantics;
8. validate/version/benchmark/document and stop at a coherent `0.6.600` boundary.

Following tracks remain `0.6.700` ecology/regional content breadth, `0.6.800` persistent companion/party foundation, and `0.6.900` integrated-mechanics exit gate.
