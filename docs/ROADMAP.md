# Roadmap

This is the current implementation summary and phase index for the text-first fantasy life RPG.

Authoritative companion documents:

- `docs/DEVELOPMENT_DIRECTION.md` — design north star.
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — detailed version protocol and path to 1.0.
- `docs/TRANSITIONAL_ARCHITECTURE.md` — temporary seams that must not harden into final design.
- `docs/PHASE_0_4_EXIT_GATE.md` — evidence for closing the foundation phase.
- `docs/THREAD_HANDOFF.md` — current implementation handoff.
- `docs/ARCHITECTURE.md` — current runtime/module boundaries.

## Current baseline

At the 0.4 exit gate:

```text
Product:      0.4.900.0
Package:      0.4.900
Account Save: 4
Game State:   3
Data:         13
Codename:     Foundation Exit Gate
```

This remains pre-alpha product development. The version is a milestone identity, not a completion percentage.

## Product direction

Core progression law:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

The intended game is a persistent, long-form fantasy life RPG where work, infrastructure, relationships, preparation, travel, danger, combat, and exploration belong to one connected simulation.

Key rules:

- simulation time and real-world waiting are separate concepts;
- identical construction does not receive arbitrary exponential cost multipliers;
- mastered chores should eventually demand less player attention;
- jobs remain recognizable disciplines, but do not magically replace the character's identity;
- learned capabilities may cross discipline boundaries when equipment/preparation/proficiency/resource/context requirements are met;
- text and imagination do most rendering while restrained icons/tokens/meters/diagrams may improve comprehension;
- FFXI contributes weight, danger, preparation, equipment, mastery, and accomplishment, but retail feature/formula replication is not the roadmap spine.

## Product phases

| Phase | Theme | Exit promise |
| --- | --- | --- |
| `0.4` | Foundation and direction lock | Architecture can accept deterministic simulation/capability work without another reset. |
| `0.5` | World time, tasks, projects | Multi-hour/day fictional work can advance, pause, interrupt, summarize, and complete without real-time waiting. |
| `0.6` | Capabilities, disciplines, origins, livelihood | One continuous character can logically mix learned disciplines through preparation/loadout and pursue a livelihood. |
| `0.7` | First complete game loop | A representative first week combines work, preparation, travel, danger, recovery, and permanent progress. |
| `0.8` | Life/infrastructure expansion | Buildings, tools, farming/gathering, crafting, taming, relationships, and logistics materially transform earlier work. |
| `0.9` | Adventure depth and release hardening | Combat/magic/content/balance/UI/persistence reach release-candidate quality. |
| `1.0` | Live Foundation | The core product promise is coherent, stable, migratable, and playable as a persistent long-form RPG. |

## 0.4 — Foundation — complete

- [x] `0.4.100` Direction and version-roadmap lock.
- [x] `0.4.200` Four-part product version separated from package SemVer; CI test/benchmark gate added.
- [x] `0.4.300` Ordered persistence migration mechanism with deterministic unsupported-version handling.
- [x] `0.4.400` Structured `ActionResult` contract; travel-start pilot.
- [x] `0.4.500` Bounded semantic-event foundation; travel start/arrival pilot.
- [x] `0.4.600` Foundation stabilization/readiness tests and transitional architecture rules.
- [x] `0.4.900` Foundation exit-gate certification, contingent on green CI for the integration PR.

Existing foundations preserved through the phase include canvas-first text UI, command adapters, accounts/saves, places/navigation/atlas/travel, POIs, inventory/equipment/items/shops, combat/rewards/status/RNG scaffolds, character-owned skills, validation, tests, benchmarks, and system-version tracking.

## 0.5 — World Time, Tasks, and Projects — next

### 0.5.100 Deterministic world clock

- [ ] Canonical simulated time stored in game state.
- [ ] Exact advancement independent of `Date.now()`.
- [ ] Derived day/date/time inspection and formatting.
- [ ] Deterministic rollover tests.
- [ ] Wall-clock `tickEngine` remains only an optional scheduler/advancement requester.

### 0.5.200 Pause and speed control

- [ ] Pause/resume semantics.
- [ ] Simulation speed settings.
- [ ] Fast-forward advances simulation rather than merely changing render timing.
- [ ] Clean scheduler/world-time boundary.

### 0.5.300 Canonical timed task model

- [ ] Shared duration representation.
- [ ] Start/progress/complete/cancel semantics where appropriate.
- [ ] Deterministic completion.
- [ ] Travel becomes one consumer rather than the template every activity must copy.

### 0.5.400 Interrupt model

- [ ] Advance-until-event.
- [ ] Deterministic interrupt priority.
- [ ] Combat/exhaustion/tool failure/project completion hooks or placeholders.

### 0.5.500 Day boundary and end-of-day review

- [ ] Day transition.
- [ ] Configurable EoD auto-pause.
- [ ] Structured daily summary data.
- [ ] Review/continue/save/inspect flow.

### 0.5.600 Persistent projects

- [ ] Material requirements.
- [ ] Accumulated labor/time.
- [ ] Visible progress.
- [ ] Completion events.
- [ ] No arbitrary duplicate-building exponential multiplier.

### 0.5.700 Time-cost integration pilot

- [ ] Travel on canonical time.
- [ ] At least one non-travel work activity on canonical time.
- [ ] Energy/fatigue hooks where appropriate.
- [ ] Fast-forward through low-information periods without missing meaningful interrupts.

### 0.5.900 Exit gate

0.5 closes when multi-hour/multi-day fictional activities can be advanced safely, reach day boundaries, produce readable progress, and complete persistent projects without depending on real-world waiting.

## 0.6 — Character Capability, Disciplines, Origins, Livelihood

- [ ] `0.6.100` Learned capability/proficiency model independent of current equipment.
- [ ] `0.6.200` Jobs represented as disciplines/classifications rather than magical active states.
- [ ] `0.6.300` Hard/soft/enhancing equipment and preparation requirements.
- [ ] `0.6.400` Cross-discipline ability access when actual prerequisites are satisfied.
- [ ] `0.6.500` Origin-based starting circumstances/loadouts.
- [ ] `0.6.600` First complete livelihood loop.
- [ ] `0.6.700` Loadout/capability UX.
- [ ] `0.6.900` Capability/livelihood exit gate.

Transitional rule until this phase lands:

```text
Jobs describe.
Capabilities enable.
Loadouts constrain and enhance.
```

Do not deepen the current `mainJob` scaffold into the final ability-lock model.

## 0.7 — First Complete Representative Game

Working slice: **A Week Beyond the West Gate**.

The slice should combine:

- multiple origins;
- a modest foothold/home-base context;
- one livelihood/gathering/economy loop;
- one persistent material/labor project;
- simulated days and EoD review;
- preparation/loadout decisions;
- one meaningful West Gate expedition;
- travel danger and combat;
- recovery/return-home loop;
- measurable capability growth;
- one permanent end-of-week accomplishment/unlock;
- UI/action discoverability without requiring command memorization.

0.7 should be judged primarily by whether this connected loop is compelling enough to continue playing.

## 0.8 — Long-form Life Expansion

Planned focus:

- construction/renovation/capacity/efficiency upgrades;
- farming and gathering depth;
- crafting, tools and facilities;
- taming/husbandry with practical value;
- relationships and reputation;
- logistics and labor-saving infrastructure;
- additional discipline/livelihood interactions;
- resource/economy sink balancing based on scale and ambition rather than arbitrary multipliers.

## 0.9 — Adventure Depth and Release Hardening

Planned focus:

- deeper enemy/combat behavior;
- structured magic/advanced capabilities consistent with the loadout model;
- second dense region proving scalable content architecture;
- long-form progression/economy balance;
- UI/accessibility/readability hardening;
- save migration/compatibility hardening;
- deterministic simulation/content validation/performance;
- content-complete beta and release-candidate freeze.

## 1.0 — Live Foundation

1.0 is a compatibility/product promise, not an assertion that all possible content is finished.

A 1.0 player should be able to establish a persistent character, learn across disciplines, prepare logical loadouts, live through simulated days, pursue livelihoods and projects, build useful infrastructure, travel and fight, form meaningful relationships/reputation, experience representative creature/taming systems if retained, explore at least two dense regions, and save/load under an explicit migration contract.

## Formula policy

Formula confidence categories remain:

- exact / sourced;
- researched approximation;
- intentional simplification;
- placeholder.

Refine formulas when they materially improve a meaningful player-facing loop. Do not block simulation time, capabilities, livelihoods, projects, objectives, or the representative slice merely to chase retail-exact math.

## Immediate next pass

After the 0.4.900 exit-gate PR is green and merged:

```text
0.5.100 — Deterministic world clock
```

Keep that pass narrow: exact simulated time state, exact advancement, formatting/inspection, rollover tests, and no dependence on wall-clock time for canonical simulation state.
