# Versioning and Release Roadmap

This document defines the product-version protocol and the planned release path from the current rough foundation to a coherent 1.0 release.

The roadmap is intentionally milestone-driven rather than calendar-driven. A version changes because its exit criteria are met, not because a date arrived or a large number of commits accumulated.

`docs/DEVELOPMENT_DIRECTION.md` is the design north star. This document translates that direction into version gates.

## Current baseline and transition

The current repository uses a legacy three-part application/package version:

```text
0.4.4
```

That number describes a very early foundation build. It should not be read as “44% complete” or as a promise that 0.5 is nearly production-ready.

The existing project is architecturally useful but still pre-alpha in product terms: it has many system scaffolds and relatively little complete game experience.

The new protocol should not retroactively renumber historical releases. `0.4.4` remains the historical baseline. The four-part product-version format begins when the version manifest is deliberately migrated in a runtime PR.

## Product version format

Use:

```text
MAJOR.PHASE.TRACK.REVISION
```

Example:

```text
0.5.300.4
```

Meaning:

| Segment | Meaning |
| --- | --- |
| `MAJOR` | Product stability/compatibility generation. `0` means pre-1.0 development; `1` begins the live compatibility contract. |
| `PHASE` | Major pre-release milestone or, after 1.0, the live feature line. Examples: `0.5`, `0.7`, `0.9`. |
| `TRACK` | Three-digit scoped sub-milestone within the phase. Planned tracks normally advance by 100: `100`, `200`, `300`, etc. |
| `REVISION` | Incremental integration counter inside the active track. It starts at `0` and increments for merged runtime changes that advance or repair that track. |

### Why the track is three digits

Using `100`, `200`, `300` leaves room to insert unforeseen work without renumbering the entire roadmap.

For example:

```text
0.6.200.x  discipline classification
0.6.250.x  inserted prerequisite refactor
0.6.300.x  equipment/preparation eligibility
```

The roadmap numbers are therefore stable labels, not estimates of effort.

## Revision handling

The fourth segment is deliberately simple.

Within one track:

```text
0.5.200.0
0.5.200.1
0.5.200.2
0.5.200.3
```

A revision increment means a merged runtime-affecting change has advanced, fixed, or hardened the current track.

When the track exit gate is met, move to the next track and reset the revision:

```text
0.5.200.7 -> 0.5.300.0
```

When the phase exit gate is met, move to the next phase:

```text
0.5.900.x -> 0.6.100.0
```

Do not bump the fourth segment for README wording, comments, planning notes, or other docs-only edits unless a release artifact itself is being corrected and the project explicitly chooses to version documentation releases.

## Product version versus package version

The project currently treats `VERSION.app` and `package.json.version` as the same value. That cannot continue unchanged because npm package versions use standard three-part SemVer while the product protocol uses four numeric segments.

At protocol adoption, separate these concepts.

Recommended model:

```text
Product/game version: 0.5.300.4
Package/tooling version: 0.5.300
```

The four-part product version is authoritative for game-development milestones.

`package.json.version` remains valid SemVer and normally mirrors `MAJOR.PHASE.TRACK`, omitting the fourth revision. Because the package is private, it does not need to change for every product revision unless tooling or package identity actually requires it.

If an exact build identity is later needed in package metadata, use valid SemVer prerelease/build metadata rather than a fourth numeric segment.

Example:

```text
0.5.300+rev.4
```

Do not place `0.5.300.4` directly into `package.json.version`.

## Other version counters

The existing independent counters remain useful and should not be collapsed into the product version.

Examples:

- Account Save
- Game State
- Data
- Benchmark
- individual system versions

These answer different questions.

### Product version

Answers:

> What coherent development milestone does this build represent?

### Game State / Account Save

Answers:

> Can persisted player data be safely read, migrated, or rejected?

Increment these only when the persisted schema/contract changes.

### Data version

Answers:

> Has the authoritative data schema/content contract changed in a way that consumers or migrations need to distinguish?

Do not bump it for every content entry.

### System versions

Answers:

> What revision of an individual subsystem's behavior or public contract is present?

System versions may continue to use ordinary three-part SemVer-like values. They do not have to match the product milestone.

## Version bump protocol

Every runtime PR should declare:

1. target product phase/track;
2. whether it increments product revision or completes a track;
3. affected system versions;
4. whether Game State, Account Save, or Data versions change;
5. migration/reset implications;
6. tests and benchmark results;
7. known limitations.

### Normal runtime change inside a track

Example:

```text
Before: 0.5.200.3
After:  0.5.200.4
```

Use when the change advances or fixes the same scoped goal.

### Track completion

Example:

```text
Before: 0.5.200.7
After:  0.5.300.0
```

Use only when the prior track's exit gate is satisfied and the codebase is ready to begin the next scoped objective.

### Phase completion

Example:

```text
Before: 0.6.900.5
After:  0.7.100.0
```

Do not enter the next phase just because planned features exist on branches. The merged `main` branch must satisfy the phase exit gate.

### Bug fixes

A bug fix that belongs to the active track increments the revision.

A critical bug discovered after the team has begun a later track should normally be fixed on the current line and documented as a regression fix. Avoid reopening historical numbering unless an actual release branch/hotfix policy exists.

### Docs-only planning

No product-version bump.

### Save-shape change

A product-version bump does not substitute for a Game State/Account Save migration decision. If persistence shape changes, bump the relevant schema counter and provide an explicit migration or deliberate reset policy.

## Milestone philosophy

Pre-1.0 versions are product-completeness gates, not marketing labels.

Each phase should leave the game materially more playable than the prior phase.

A phase is not complete because its modules exist. It is complete when the player-facing loop associated with that phase works end-to-end and is covered by tests/validation appropriate to the system.

---

# 0.4 — Foundation Closeout and Direction Lock

## Purpose

Convert the existing broad scaffold into a stable launch point for the new game direction without attempting another rewrite.

The historical baseline is `0.4.4`. The first four-part release should be made deliberately during this phase when the version manifest/protocol is implemented.

## 0.4.100 — Direction and version protocol

Planning/design deliverables:

- development north star;
- version protocol;
- updated authoritative roadmap/handoff references;
- explicit declaration that formula reconstruction is no longer the primary roadmap spine;
- jobs/discipline/capability/loadout design recorded.

This track may be documentation-only and therefore does not itself require changing the historical `0.4.4` runtime string.

## 0.4.200 — Version manifest separation

Runtime/tooling deliverables:

- introduce authoritative four-part product version field;
- decouple product version from `package.json.version`;
- update version-display tests;
- document package/product version behavior;
- retain compatibility aliases only where genuinely useful.

Suggested first four-part product version:

```text
0.4.200.0
```

## 0.4.300 — Ordered persistence migrations

Deliverables:

- explicit ordered Game State migration mechanism;
- explicit Account Save migration path where needed;
- deterministic handling of unsupported old state;
- tests for migration order and failure behavior;
- remove reliance on ad-hoc revive logic as the only compatibility strategy.

## 0.4.400 — Structured action contract

Deliverables:

- define a small `ActionResult`-style contract for engine-facing actions;
- separate semantic outcome data from display prose;
- migrate one representative action path first;
- preserve command compatibility as an adapter.

## 0.4.500 — Lightweight semantic event foundation

Deliverables:

- structured events for important game outcomes;
- stable event IDs/types;
- tests proving consumers do not parse log prose to understand game state;
- no full event-sourcing architecture.

## 0.4.600 — Current-system stabilization

Deliverables:

- preserve current inventory/equipment/travel/combat foundations;
- fix blocking regressions exposed by the new contracts;
- document transitional job/main-job assumptions;
- validate that the architecture can accept world-time and capability work without a rewrite.

## 0.4.900 — 0.4 exit gate

0.4 is complete when:

- the new direction and version protocol are authoritative;
- product/package version concepts are separated;
- ordered persistence migration exists;
- a structured action/event seam exists;
- current systems remain functional and tested;
- the next phase can build deterministic world time without depending on wall-clock behavior.

---

# 0.5 — World Time, Tasks, and Projects

## Purpose

Establish the simulation substrate for long-duration play without real-world waiting.

## 0.5.100 — Deterministic world clock

Deliverables:

- canonical world date/time state;
- deterministic time advancement independent of `Date.now()`;
- world-time formatting and inspection;
- tests for exact advancement.

## 0.5.200 — Pause and speed control

Deliverables:

- pause/resume semantics;
- simulation speed control;
- fast-forward that advances simulation rather than merely changing renderer timing;
- clean boundary between wall-clock scheduling and world-time calculation.

## 0.5.300 — Canonical timed task model

Deliverables:

- common task/action duration representation;
- start/progress/complete/cancel semantics where appropriate;
- deterministic task completion;
- travel adapted as one consumer without forcing every system into travel-specific logic.

## 0.5.400 — Interrupt model

Deliverables:

- advance-until-event;
- meaningful interrupt priority;
- combat/exhaustion/tool failure/project completion hooks or placeholders;
- tests for deterministic interrupt ordering.

## 0.5.500 — Day boundary and end-of-day review

Deliverables:

- day transition;
- configurable end-of-day auto-pause;
- structured daily summary data;
- review UI/text output;
- continue/save/inspect flow.

## 0.5.600 — Persistent project model

Deliverables:

- projects with material requirements;
- accumulated labor/time;
- progress visibility;
- completion events;
- no arbitrary exponential duplicate-building multiplier.

## 0.5.700 — Time-cost integration pilot

Deliverables:

- integrate at least travel plus one non-travel work activity with the canonical time model;
- resource/energy or fatigue hooks where appropriate;
- fast-forward through low-information periods without skipping meaningful events.

## 0.5.900 — 0.5 exit gate

0.5 is complete when the player can perform multi-hour/multi-day fictional activities, fast-forward safely, reach a day boundary, review meaningful progress, and advance a persistent project without the design depending on real-world waiting.

---

# 0.6 — Character Capability, Disciplines, Origins, and Livelihood

## Purpose

Replace magical job-switch assumptions with a continuous-character capability model and give the character a meaningful starting life.

## 0.6.100 — Capability and proficiency model

Deliverables:

- learned capabilities stored independently from current equipment;
- proficiency/mastery representation;
- capability inspection;
- migration strategy from existing character-owned skills.

## 0.6.200 — Jobs as disciplines/classifications

Deliverables:

- jobs represented as training traditions/archetypes rather than magical active states;
- discipline metadata for training, recognition, and advanced instruction;
- clear distinction between discipline identity and immediate ability eligibility;
- transitional compatibility for current job data.

## 0.6.300 — Equipment/preparation prerequisites

Deliverables:

- hard requirements;
- soft requirements with data-driven penalties;
- enhancers;
- equipment, focus, ammunition, tool, reagent, stance, and context checks where relevant.

## 0.6.400 — Cross-discipline ability access

Deliverables:

- capabilities from multiple disciplines can coexist;
- no single support-job slot as the universal gate;
- loadout/resource/preparation tradeoffs prevent unrestricted optimal use of everything at once;
- tests for valid hybrid behavior.

## 0.6.500 — Origin system

Deliverables:

- multiple starting backgrounds;
- different starting loadouts/resources/relationships/proficiencies;
- origins do not permanently lock later disciplines;
- character creation revised around starting circumstances rather than only a starting job toggle.

## 0.6.600 — First livelihood loop

Deliverables:

- one complete gathering/farming/crafting-oriented work loop;
- time, energy/resource cost, yield, proficiency growth, and sale/use of output;
- measurable improvement with mastery.

## 0.6.700 — Preparation/loadout UX

Deliverables:

- clear presentation of what the current loadout enables, weakens, or blocks;
- recognizable archetype classification may be shown as descriptive shorthand;
- the UI must not imply that equipment literally transforms the character into another person/job.

## 0.6.900 — 0.6 exit gate

0.6 is complete when one character can learn capabilities across disciplines, change effective play style through logical equipment/preparation, begin from different origins, and participate in at least one livelihood loop without magical job transformation.

---

# 0.7 — First Complete Game Loop

## Purpose

Deliver the first genuinely representative game experience: life building plus preparation plus adventure plus permanent progress.

Working slice: **A Week Beyond the West Gate**.

## 0.7.100 — Objective/quest state foundation

Deliverables:

- lightweight objective state machine;
- semantic event-driven progress;
- talk/collect/travel/kill/work/project objective types as needed by the slice;
- rewards and unlocks.

## 0.7.200 — Home-base foothold

Deliverables:

- a real starting foothold appropriate to origin;
- storage/recovery/preparation context;
- one permanent project tied to establishing or improving the foothold.

## 0.7.300 — West Gate expedition loop

Deliverables:

- prepare;
- leave the safe area;
- travel through a meaningful route;
- encounter risk;
- complete an objective;
- return with materials/rewards/state changes.

## 0.7.400 — Combat/recovery hardening for the slice

Deliverables:

- reliable target handling;
- enemy turn/AI adequate for the slice;
- KO/injury/recovery behavior;
- clear battle end cleanup;
- combat advancement compatible with world time.

## 0.7.500 — First-week progression integration

Deliverables:

- multiple simulated days;
- end-of-day summaries;
- livelihood and expedition interdependence;
- proficiency/capability gains;
- project progression;
- a permanent end-of-week accomplishment.

## 0.7.600 — Slice UX and onboarding

Deliverables:

- player can discover actions without knowing command internals;
- origin-specific opening guidance;
- icons/tokens/meters used where helpful;
- no full graphical-world requirement.

## 0.7.700 — Replay and alternate-origin pass

Deliverables:

- at least two meaningfully different openings into the same systemic slice;
- common systems remain reusable rather than scripting separate games per origin.

## 0.7.900 — 0.7 exit gate

0.7 is complete when a new player can start a character, live through a meaningful first week, work, prepare, travel, fight, return, build something permanent, and end the slice with materially expanded capability and future options.

This is the first milestone that should be judged primarily by “is this fun enough to keep playing?” rather than “does the architecture exist?”

---

# 0.8 — Life, Infrastructure, and Systemic Expansion

## Purpose

Turn the first slice into a durable long-form life RPG by expanding the systems that make accumulated resources and mastery change how the player lives.

## 0.8.100 — Construction and renovation depth

Deliverables:

- reusable building instances;
- upgrades/renovations;
- capacity/efficiency improvements;
- physically/economically justified costs;
- project labor and logistics.

## 0.8.200 — Gathering and farming depth

Deliverables:

- multiple materials/crops or equivalent production lines;
- quality/yield/season/environment hooks where useful;
- better tools and infrastructure reduce labor or increase output;
- avoid repetitive click expansion.

## 0.8.300 — Crafting and tools

Deliverables:

- structured recipe catalog;
- tool requirements;
- facilities;
- skill/proficiency checks;
- quality/failure rules appropriate to the game;
- crafted goods feed other loops.

## 0.8.400 — Taming and husbandry

Deliverables:

- at least one tamable creature family;
- relationship/care requirements;
- housing/facility needs;
- product, transport, labor, or companion value;
- creature ownership should change capability, not just create another timer.

## 0.8.500 — Relationships and local reputation

Deliverables:

- persistent NPC relationships;
- local/guild reputation or standing;
- relationships unlock information, training, services, opportunities, or assistance;
- avoid affection bars with no systemic consequence.

## 0.8.600 — Logistics and labor-saving infrastructure

Deliverables:

- carts/pack capacity/storage networks/roads/irrigation/helpers or equivalent;
- mature characters spend less attention on mastered low-level chores;
- long-term resource sinks come from capability expansion rather than arbitrary multipliers.

## 0.8.700 — Discipline and livelihood expansion

Deliverables:

- additional disciplines/capabilities chosen for systemic value;
- additional livelihood interactions;
- hybrid play tested beyond the first slice.

## 0.8.800 — Economy and project balancing

Deliverables:

- resource faucets/sinks reviewed across systems;
- repeated identical construction remains logically priced;
- upgrades/logistics/prestige create meaningful advanced demand;
- no single livelihood trivially dominates all others.

## 0.8.900 — 0.8 exit gate

0.8 is complete when the player can pursue a sustained multi-week or multi-season life in which buildings, tools, creatures, relationships, and infrastructure measurably change how earlier work is performed.

---

# 0.9 — Adventure Depth, Content Expansion, and Release Hardening

## Purpose

Bring adventure, magic, region content, balance, persistence, and UX to a release-candidate standard without losing the life-simulation identity proven in earlier phases.

## 0.9.100 — Adventure/combat depth

Deliverables:

- stronger enemy behavior;
- encounter variety;
- tactical action choices;
- status/recovery/death consequences;
- preparation matters materially.

## 0.9.200 — Magic and advanced capabilities

Deliverables:

- structured spell/capability catalog;
- cast/recast/resource behavior;
- equipment/focus/preparation relationships;
- hybrid access consistent with the discipline model;
- formula confidence documented.

## 0.9.300 — Second dense region

Deliverables:

- prove the content architecture scales beyond the initial San d'Oria/Ronfaure-centered slice;
- new local economy/resources/NPCs/objectives;
- travel and discovery remain meaningful;
- do not expand map count merely for breadth.

## 0.9.400 — Long-form progression and economy balance

Deliverables:

- progression pacing across days/weeks/seasons reviewed;
- grind produces measurable gains;
- fast-forward does not trivialize decisions;
- resource economy remains stable enough for extended play;
- advanced sinks are logical and useful.

## 0.9.500 — UI, accessibility, and readability

Deliverables:

- keyboard/mouse interaction stable;
- action discovery and context panels clear;
- text scaling/readability/accessibility improvements;
- icons/tokens/meters used consistently;
- no required command memorization for normal play.

## 0.9.600 — Save compatibility and migration hardening

Deliverables:

- supported migration policy for late-beta saves;
- corruption/failure handling;
- backup/export/import strategy if appropriate;
- 1.0 compatibility expectations documented.

## 0.9.700 — Validation, performance, and deterministic test hardening

Deliverables:

- full standard test/check gate;
- deterministic simulation tests;
- benchmark targets;
- content/schema validation;
- no known blocker-class save, progression, or simulation defects.

## 0.9.800 — Content complete beta

Deliverables:

- 1.0-critical content present;
- no major 1.0 system still represented only by a placeholder;
- tuning, writing, bug fixing, and polish may continue.

## 0.9.900 — Release candidate freeze

Deliverables:

- feature freeze for 1.0-critical systems;
- only release-blocking fixes, balancing, content corrections, migration work, and polish;
- version/migration documentation finalized;
- release checklist passes.

## 0.9 exit gate

0.9 is complete when `main` is suitable to promote to 1.0 without adding another foundational subsystem.

---

# 1.0 — Live Foundation

Suggested initial product version:

```text
1.0.000.0
```

`1.0` does not mean the game is finished forever. It means the core product promise is coherent, playable, stable enough to support persistent players, and governed by an explicit compatibility policy.

## 1.0 minimum product promise

A 1.0 player should be able to:

- create a character from meaningful starting circumstances;
- develop one persistent character across multiple disciplines without magical job transformations;
- use equipment/preparation to shape available and effective capabilities;
- live through a deterministic day/time simulation with pause and fast-forward;
- work at livelihoods and improve through measurable mastery;
- own/use a persistent foothold and improve infrastructure;
- undertake material projects with logical resource/labor costs;
- travel into dangerous areas and prepare for expeditions;
- fight, recover, and gain useful capability from adventure;
- participate in an economy where work, crafting, gathering, and adventure interconnect;
- build relationships/reputation that affect available opportunities;
- tame/use at least representative creature systems if retained in the 1.0 scope;
- progress through at least two dense regional content spaces;
- experience end-of-day review and long-duration fictional progression without mandatory real-world waiting;
- save/load through an explicit supported compatibility/migration contract;
- play normal game flows without command-line expertise;
- understand important state through text-first presentation plus limited visual polish.

## 1.0 quality gate

Before promotion to 1.0:

- no known data-loss blocker;
- supported 0.9 save migration path is tested;
- normal new-game-to-established-character loop is tested end-to-end;
- first-region critical path and second-region access are complete;
- economy has no obvious infinite or catastrophic early-game exploit in normal play;
- fast-forward cannot silently skip blocker-class interrupts;
- game logic remains renderer-independent;
- validation/check/benchmark suite passes;
- release notes and known limitations are explicit;
- version manifest and all schema counters are correct;
- project documentation points to current, non-superseded direction documents.

## After 1.0

Post-1.0 versions can continue using the same four-part product scheme:

```text
1.MINOR.TRACK.REVISION
```

Example:

```text
1.1.200.3
```

At that point `MINOR` represents a live feature line rather than a pre-release completeness phase.

Breaking save or gameplay-contract changes after 1.0 require explicit migration/deprecation policy and should not be hidden inside an ordinary revision bump.

A future `2.x` line should be reserved for a genuinely incompatible product-generation change, not ordinary content expansion.

---

# Release management rules

## Branch/PR targeting

Every implementation branch should identify its intended target in the PR body, for example:

```text
Target: 0.5.300.x — Canonical timed task model
```

Do not mix unrelated tracks merely to increase version numbers faster.

## Milestone completion evidence

A track or phase exit should be based on merged evidence:

- implemented behavior;
- tests;
- validation;
- relevant benchmark/check results;
- docs updated to the new state;
- known limitations recorded.

## Codenames

Codenames are optional human-readable labels for meaningful product points. They must never replace numeric versions and should not be changed for every revision.

Good use:

```text
0.7.900.x — First Week
0.9.800.x — Content Complete Beta
1.0.000.0 — Live Foundation
```

## Changelog policy

`CHANGELOG.md` should record player-visible/runtime-significant changes grouped by product track or release.

Do not flood the changelog with every internal refactor unless it affects behavior, compatibility, migration, testing guarantees, or developer-operational requirements.

## Roadmap maintenance

When reality changes, insert or revise future tracks rather than pretending the original plan was exact.

Rules:

- completed version labels are immutable history;
- active track scope may be clarified but should not be silently broadened into a new phase;
- new necessary work can use inserted track numbers such as `250` or `350`;
- moving a feature later is preferable to declaring a milestone complete with placeholder behavior;
- version numbers represent achieved gates, not aspirational branch names.

## Current recommended sequence

From the present `0.4.4` baseline:

1. merge the direction/version planning docs without pretending they are runtime progress;
2. implement `0.4.200` version-manifest separation;
3. implement ordered persistence migrations;
4. add structured action/event seams;
5. close 0.4;
6. build deterministic world time and task/project simulation in 0.5;
7. build continuous-character capability/disciplines/origins in 0.6;
8. prove the complete life/adventure loop in 0.7;
9. deepen life/infrastructure systems in 0.8;
10. deepen adventure, add a second region, balance, and harden in 0.9;
11. promote the tested release candidate to `1.0.000.0`.
