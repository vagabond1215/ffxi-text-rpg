# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Read order

1. `AGENTS.md` — direct-`main` workflow, autonomous-session budget, scope boundaries, and handoff protocol.
2. `docs/DEVELOPMENT_DIRECTION.md` — authoritative design north star.
3. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-setting, naming, legacy-data, provenance, scale, and content-pack policy.
4. `docs/ROADMAP.md` — current implementation sequence and milestone gates.
5. `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — version protocol.
6. `docs/TRANSITIONAL_ARCHITECTURE.md` — temporary seams that must not harden into final design.
7. `docs/ARCHITECTURE.md` — current module boundaries.
8. `js/text/version.js` — authoritative active version values.
9. This handoff, then relevant runtime/data/tests for the next bounded unit.

Older planning documents preserve useful history but do not override the files above.

## Current Git workflow

The repository is in an early single-maintainer development phase. Per `AGENTS.md`, **continue directly on `main` by default**.

Do not create a branch/PR merely as ceremony. Use isolation if the user asks, a tool requires it, or the change is unusually risky enough that isolation materially helps.

Remote branch deletion is not exposed by the current GitHub connector, so stale remote branches remain a manual repository-maintenance task. Do not create replacement cleanup branches.

## Autonomous work-session limit

`AGENTS.md` sets the operating guardrail:

- maximum autonomous session: **2 hours 45 minutes**;
- **2:15** stabilization checkpoint;
- **2:30** start no new implementation unit;
- by **2:45** persist a coherent state, update this handoff, and report;
- if elapsed time cannot be measured reliably, use the fallback maximum of **6 autonomous work cycles**, reserving cycle 6 for stabilization/handoff.

A new user message starts a new budget. Roadmap `Next` sections do not authorize an endless autonomous chain.

## Product identity

Working title: **Hearth & Horizon**.

This is an original text-first persistent fantasy life RPG about one continuous character building livelihood, skills, relationships, reputation, material capability, home/infrastructure, and geographic reach across a connected fantasy world.

Earlier FFXI-derived material is **legacy research/reference/migration material**, not canonical world content.

Core laws:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

## Current baseline

```text
Product:      0.6.200.1
Package:      0.6.200
Account Save: 4
Game State:   5
Data:         20
Benchmark:    1
Codename:     Character Capabilities
```

`js/text/version.js` is authoritative.

## Completed sequence

The coherent sequence on `main` is now:

- 0.4 foundation/versioning/ordered migrations/ActionResult/semantic events/stabilization;
- 0.5.100 deterministic world clock;
- 0.5.200 pause/speed controls;
- 0.5.300 canonical timed tasks;
- 0.5.400 deterministic interrupt model;
- 0.5.500 day boundaries/end-of-day review;
- 0.5.550 original-world identity/stable-ID migration;
- 0.5.600 persistent projects and resource provenance;
- 0.5.650 ecology, gathering-source, and population substrate;
- 0.5.700 canonical routes and scheduled transport substrate;
- 0.5.800 regional content packs, candidate normalization, and scalable validation;
- 0.5.900 explicit simulation/content-substrate exit gate;
- 0.6.100 continuous-character stats and progression;
- 0.6.200 character-owned skills/proficiencies/capability ownership and eligibility.

**Phase 0.5 is complete. Phase 0.6 is active through 0.6.200.** Do not reopen earlier tracks broadly unless a concrete regression requires it.

## 0.6.100 — character stats and progression status

The track is **complete enough to exit**.

### Continuous-character stat state

`js/text/systems/characterStatEngine.js` defines a versioned character-owned stat contract:

```text
CHARACTER_STAT_STATE_VERSION = 1
CHARACTER_STAT_MODEL_ID       = continuous-character-core-v1
confidence                    = provisional
```

`player.statState` owns:

- canonical ancestry ID;
- persistent growth rank;
- original-design base attributes;
- original-design base HP/MP/TP capacity;
- explicit provenance/confidence metadata.

Persistent base growth follows the **highest attained discipline training level**, not whatever discipline is active at the moment. Changing to a lower training record does not shrink the character's base growth state.

The balance numbers are deliberately provisional original design. They are not presented as final balance or copied historical formulas.

### Active discipline is contextual

`getActiveDisciplineStatContext()` derives contextual attribute/resource/training focus from the active discipline. Its metadata explicitly states:

```text
capabilityGate: false
```

The player combat profile now composes:

```text
continuous-character base
  + active-discipline context
  + equipment modifiers
  + status modifiers
```

This moves ownership away from class/job identity without requiring an atomic rename of every persisted `player.jobs`/`mainJobId` property.

### Character-level progression

`js/text/systems/progressionEngine.js` adds:

```text
CHARACTER_PROGRESSION_STATE_VERSION = 1
```

and character-owned training metadata under:

```text
player.progression.character
```

It records lifetime EXP and highest attained discipline level while preserving per-discipline EXP/level records. EXP earned while a discipline is active advances that training record and lifetime character training history.

### Historical stat research boundary

`ffxiStatFormula.js`, `inferredJobResourceFormula.js`, and historical grade data remain usable for explicit research/comparison tests. They no longer determine canonical player runtime base stats.

Player combat-profile metadata now includes:

```text
historicalReferenceRuntimeAuthority: false
```

Tests assert that historical profiles can still be calculated while differing from the canonical runtime profile.

### Persistence/version impact

```text
Product             0.5.900.1 -> 0.6.100.1
Package             0.5.900   -> 0.6.100
Account Save        4         unchanged
Game State          5         unchanged
Data                19        unchanged
characterStats       new       0.1.0
playerEntity         ->        0.7.0
statEngine           ->        0.5.0
progression          ->        0.6.0
disciplineSwitching  ->        0.6.0
leveling             ->        0.6.0
```

No persistence migration was required because the new character stat/progression fields are additive and can be reconstructed deterministically for existing Game State v5 records.

## 0.6.200 — skills, proficiencies, disciplines, and capabilities status

The track is **complete enough to exit**.

### Capability catalog

`js/text/data/capabilities.js` defines capability catalog v1. Current representative records include:

- `technique-guarded-cut`;
- `technique-shadow-feint`;
- `practical-field-dressing`;
- `practical-ore-survey`.

These are substrate examples, not a finished technique catalog.

Every capability separates:

```text
learning requirements
```

from:

```text
use requirements
```

Learning can be open or satisfied by one of multiple discipline training paths. Use requirements can independently check action/world context, learned proficiency, equipment/main-hand tags, tool tags, preparation tags, flags, and resources.

### Character-owned capability state

`js/text/systems/capabilityEngine.js` defines:

```text
CAPABILITY_STATE_VERSION = 1
```

with additive state under:

```text
player.progression.capabilities
```

Known capability records preserve capability ID, learning source, optional canonical world-time observation, and the discipline training path that originally qualified the learning.

Once learned, the capability remains owned by the character even after active-discipline switching.

### Discipline learning does not become a use gate

The capability engine can resolve eligible historical/inactive discipline training when learning a capability. After learning, `canUseCapability()` checks concrete prerequisites and returns:

```text
disciplineUseGate: false
```

A technique learned while training Shadowhand, for example, can remain usable under Vanguard if its learned proficiency, equipment, resource, and context requirements are actually satisfied.

### Character proficiency is non-destructive

`js/text/systems/skillProgressionEngine.js` still uses the current discipline's sparse cap table as a **training window**, but `addLearnedSkill()` no longer clamps stored character proficiency downward.

Example invariant:

```text
learned axe = 20
switch to discipline with axe training cap = 0
attempt +1 gain
=> learned axe remains 20; gained = 0
```

This is important: a discipline can constrain what improves now without erasing what the continuous character already learned.

Structured skill-gain results expose `trainingCap`; older `cap` fields/display wording remain compatibility aliases while command tests migrate incrementally.

### Capability data versus executable abilities

Database registry now contains:

```text
capabilities [seeded 0.1.0]
```

for character ownership/learning/use eligibility.

`abilities` remains planned and is explicitly described as future executable active/passive effect definitions. Do **not** merge these two responsibilities. A character capability may enable an executable effect, but ownership/prerequisite semantics and effect execution are separate contracts.

### 0.6.200 persistence/version impact

```text
Product             0.6.100.1 -> 0.6.200.1
Package             0.6.100   -> 0.6.200
Account Save        4         unchanged
Game State          5         unchanged
Data                19        -> 20
capabilities         new       0.1.0
playerEntity         0.7.0    -> 0.8.0
skillProgression     0.5.3    -> 0.6.0
```

Data advanced because the canonical capability catalog/learning-use contract is a new canonical data shape. Game State did not advance because `progression.capabilities` lazily initializes when absent and existing v5 state remains interpretable.

## Historical 0.5 gate compatibility

Advancing product version to 0.6 initially exposed an overly strict assumption in `simulationSubstrateGate.js`: its product-identity check treated exact `0.5.900.x` as the only valid ready state.

The gate now tests a semantic historical minimum:

```text
product >= 0.5.900.0
```

so the completed 0.5 readiness contract remains green in later phases. A regression test proves a pre-0.5.900 product still fails the historical gate.

## Validation checkpoint

Final runtime/version integration head for the 0.6.200 contract:

```text
d145af43f00d6e2216827898d2a5c15b224e284d
```

GitHub Actions test job `94281246089` completed successfully on 2026-08-12.

Exact result:

```text
tests       368
pass        368
fail        0
cancelled   0
skipped     0
todo        0
```

Benchmark from the same green integration head:

```text
Product: 0.6.200.1
Package: 0.6.200
Account Save: 4
Game State: 5
Data: 20
Benchmark: 1
Codename: Character Capabilities

create 1,000 player combat profiles:              429.468ms total | 0.429468ms/op
create 1,000 enemy combat profiles:               103.899ms total | 0.103899ms/op
resolve 1,000 basic attacks:                      521.802ms total | 0.521802ms/op
run 10,000 tick dispatches with 5 subscribers:     48.412ms total | 0.004841ms/op
resolve 10,000 direct travel route lookups:      6810.247ms total | 0.681025ms/op
```

The build check for that integration head completed successfully. The deployment job attached to that intermediate push was cancelled while subsequent direct-`main` documentation pushes superseded it; `report-build-status` still completed successfully. This is not a runtime test/build failure.

GitHub runner continues to emit the known non-blocking warning that Node-20-targeting checkout/setup actions are being forced under Node 24. Project commands themselves ran with Node 20.20.2.

Documentation closeout commits follow the green integration head. On continuation, refetch the newest `main` and current checks before coding.

## 0.6.200 bounded limitations / technical debt

Treat these as deliberate deferrals, not reasons to reopen the completed track broadly:

- capability records are representative substrate only;
- `capabilityEngine` evaluates ownership and use eligibility but does not yet execute generalized effects;
- placeholder spell and weapon-skill actions still exist in the current combat scaffold;
- `skillCaps.js` remains sparse/placeholder-confidence and should not be mistaken for final proficiency progression balance;
- active discipline still participates in legacy equipment eligibility; migrate incrementally toward capability/loadout requirements rather than removing every restriction in one rewrite;
- `player.jobs`, `mainJobId`, `raceId`, `nationId`, and related internal names remain save/runtime compatibility seams;
- no broad trainer/instruction/quest/preparation UI exists yet;
- no mass technique/capability catalog has been authored;
- historical FFXI reference modules remain callable at explicit research boundaries;
- `places.js` encounter `spawnRules` and place connections remain transitional seams;
- `gil`, historical localStorage keys, and legacy-shaped POI hook IDs remain intentional compatibility debt.

Do not solve these through an unbounded rewrite.

## Next target

```text
0.6.300 — Original magic and active ability engine
```

**No 0.6.300 implementation has started in the concluded session.** Start it only under a new user-authorized run budget.

Recommended first bounded unit:

1. Refetch latest `main`, checks, this handoff, roadmap, world/content policy, architecture, and version manifest before editing.
2. Inspect `combatActionEngine.js`, `battleEngine.js`, `ActionResult`/semantic-event code, timed-task/interrupt infrastructure, status effects, `data/capabilities.js`, `capabilityEngine.js`, equipment/item effect metadata, and historical spell research only as a bounded reference surface.
3. Define **executable ability/effect records separately from capability ownership**. Stable effect/ability IDs should be original-world canonical data.
4. Establish original spell schools/traditions and representative techniques with targeting, context, cost, activation/cast duration, recast/cooldown, interruption, and structured effect payloads.
5. Keep use authority compositional: a learned capability can enable an effect, while `capabilityEngine`/loadout/preparation/resource/context prerequisites still determine whether it is currently usable.
6. Route representative effects through structured `ActionResult` and semantic events without making display prose authoritative.
7. Use canonical world time/timed-task/interrupt infrastructure for non-instant activations; do not invent a parallel spell timer.
8. Preserve the existing combat-action scaffold behind bounded adapters until `0.6.400`; do not perform Combat 2.0 inside the magic/ability track.
9. Author only enough original effects to prove offensive, restorative/support, and non-combat/contextual seams. Do not mass-port historical spell catalogs or names.
10. Validate stable IDs/references/costs/effects, version Data/system contracts appropriately, run tests/benchmark, synchronize docs/handoff, and stop at the coherent 0.6.300 boundary before starting 0.6.400.

Design cautions for 0.6.300:

- capability ownership != executable effect definition;
- learning permission != current-use eligibility;
- active discipline is not a universal use gate;
- effects must be original-world content, not renamed historical spell catalogs;
- deterministic simulation time remains the only fictional-time authority;
- effect resolution must be structured and testable without parsing prose;
- representative mechanics first, breadth later;
- preserve migration compatibility and avoid a giant player-state rewrite.
