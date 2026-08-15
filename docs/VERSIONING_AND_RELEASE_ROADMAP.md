# Versioning and Release Roadmap

This document defines the product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions:

- `docs/DEVELOPMENT_DIRECTION.md` — product/design north star.
- `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-setting, naming, provenance, content scale, and import policy.
- `docs/ROADMAP.md` — implementation status and phase index.
- `docs/THREAD_HANDOFF.md` — current implementation continuation state.

## Current baseline

```text
Product:      0.6.900.1
Package:      0.6.900
Account Save: 4
Game State:   5
Data:         26
Benchmark:    1
Codename:     Integrated Mechanics Gate
```

The repository is pre-alpha. **Phase 0.6 is complete.** Continuous-character progression/capabilities, semantic DOM presentation, original executable abilities, Combat 2.0 timing/interruption, locality/exploration navigation, equipment/tool breadth, provenance-bearing production, regional ecology/resource breadth, persistent NPC-backed companions, and an executable integrated-mechanics exit gate are established on top of the deterministic simulation/content substrate.

## Product version format

Use:

```text
MAJOR.PHASE.TRACK.REVISION
```

Example:

```text
0.6.900.1
```

Meaning:

- **MAJOR** — public compatibility/product generation. Remains `0` before 1.0.
- **PHASE** — broad development phase (`4` foundation, `5` simulation/content substrate, `6` integrated mechanics, etc.).
- **TRACK** — bounded milestone inside the phase.
- **REVISION** — coherent revisions/fixes within the track.

`package.json.version` remains normal three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical:

```text
Product 0.6.900.1 -> Package 0.6.900
```

`js/text/version.js` is runtime authority. Documentation must be synchronized when a milestone version changes.

## Independent schema/data versions

Product version is not a persistence schema number. Track these independently:

| Version | Current | Purpose |
| --- | ---: | --- |
| Account Save | 4 | Local account/session/character registry compatibility |
| Game State | 5 | Serialized character/world runtime compatibility |
| Data | 26 | Canonical authored-data contract compatibility |
| Benchmark | 1 | Benchmark protocol/comparability |

### When to bump Account Save

Bump only when persisted account-registry/session structure changes incompatibly or requires an ordered migration. Presentation, mechanics, or additive character-state changes do not automatically justify a bump.

### When to bump Game State

Bump when persisted game-state structure changes in a way that cannot be safely handled by additive/lazy normalization. Register an ordered migration for every supported step. Never bump merely because product mechanics become richer.

### When to bump Data

Bump when canonical authored-data contracts or catalogs gain a meaningful versioned shape/authority change. Recent examples:

- Data 20 — character capability learning/use contract;
- Data 21 — original magic/active ability contract;
- Data 22 — canonical enemy ability/combat data contract;
- Data 23 — equipment/field-tool/shop breadth contract;
- Data 24 — canonical production/process/output contract;
- Data 25 — regional ecology/resource breadth and registry contract;
- Data 26 — persistent companion definition, recruitment/tactics, and relationship-dimension contract.

`0.6.900` did **not** advance Data because it stabilized and validated existing Data 26 authorities rather than adding a new authored-data schema.

### When to bump Benchmark

Bump only when the benchmark workload/protocol changes enough that prior numbers are no longer directly comparable. `0.6.900` retained Benchmark 1 and compared the same workload with `0.6.800`.

## Compatibility policy

Current compatibility mode:

```text
migrate-supported-save-versions
```

Rules:

- supported historical save versions migrate through ordered steps;
- future/unknown versions fail deterministically instead of being silently coerced;
- additive/lazily reconstructible state should avoid unnecessary save-version churn;
- legacy identifiers may be accepted at explicit migration/input boundaries, but canonical current state/data emits original-world identifiers;
- compatibility tokens are not permission to expose historical IP as canonical content.

## Release discipline

A track is complete when its intended contract is coherent, validated, versioned, documented, and integrated enough that following work can build on it without guessing authority. Early single-maintainer development proceeds directly on `main`; temporary failures during an atomic implementation sequence are acceptable, but the milestone checkpoint itself should be green or have a documented blocker.

For a normal coherent milestone checkpoint:

1. implement the bounded contract and focused tests;
2. run/observe the full test suite;
3. run the benchmark and compare with performance budgets;
4. verify browser/build/deploy checks where applicable;
5. update `js/text/version.js` and `package.json` deliberately;
6. update roadmap/architecture/handoff documentation;
7. stop at the declared boundary rather than silently beginning the next track.

## Phase / track history

### 0.4 — Foundation — complete

Direction lock, version protocol, ordered persistence migrations, structured action results, semantic events, and architecture stabilization.

### 0.5 — Simulation and content substrate — complete

| Track | Contract | Status |
| --- | --- | --- |
| 0.5.100 | Deterministic fictional world clock | Complete |
| 0.5.200 | Pause/speed and scheduler adapter | Complete |
| 0.5.300 | Canonical timed tasks | Complete |
| 0.5.400 | Deterministic interrupt model | Complete |
| 0.5.500 | Day boundaries/review | Complete |
| 0.5.550 | Original-world identity migration | Complete |
| 0.5.600 | Projects/resource provenance | Complete |
| 0.5.650 | Ecology/gathering/population substrate | Complete |
| 0.5.700 | Routes/scheduled transport | Complete |
| 0.5.800 | Regional content packs/scalable validation | Complete |
| 0.5.900 | Simulation/content-substrate exit gate | Complete |

### 0.6 — Integrated character and mechanics — complete

| Track | Contract | Resulting product/data | Status |
| --- | --- | --- | --- |
| 0.6.100 | Continuous-character stats/progression | `0.6.100.1` / Data 19 | Complete |
| 0.6.200 | Skills/proficiencies/disciplines/capabilities | `0.6.200.1` / Data 20 | Complete |
| 0.6.250 | Semantic DOM player-interface architecture | `0.6.250.1` / Data 20 | Complete |
| 0.6.300 | Original magic and active ability engine | `0.6.300.1` / Data 21 | Complete |
| 0.6.400 | Combat 2.0 timing/action/interruption contract | `0.6.400.2` / Data 22 | Complete |
| 0.6.450 | Locality and exploration navigation | `0.6.450.1` / Data 22 | Complete |
| 0.6.500 | Equipment and field-tool breadth | `0.6.500.1` / Data 23 | Complete |
| 0.6.600 | Gathering/hunting/processing/crafting/cooking/salvage | `0.6.600.1` / Data 24 | Complete |
| 0.6.700 | Ecology/regional creature/resource content breadth | `0.6.700.1` / Data 25 | Complete |
| 0.6.800 | Persistent companion/party foundation | `0.6.800.1` / Data 26 | Complete |
| 0.6.900 | Integrated-mechanics exit gate | `0.6.900.1` / Data 26 | Complete |

### 0.6.400 version decision

Combat 2.0 completed at Product `0.6.400.2`, Package `0.6.400`, Data `22`, while Account Save 4 and Game State 5 remained unchanged. Readiness timeline, combat action history, deterministic runtime battle sequence, and status timing are additive/lazily normalizable Game State v5 state. Data advanced because an original canonical enemy-ability catalog became authored runtime data.

### 0.6.450 version decision

Locality/exploration navigation completed at Product `0.6.450.1`, Package `0.6.450`, Data `22`. Navigation mode and active UI state are derived/ephemeral. Existing safe settlement `place` records are reused as locality nodes, so no persistence or canonical data-schema bump was required.

### 0.6.500 version decision

Equipment/tool breadth completed at Product `0.6.500.1`, Package `0.6.500`, Data `23`. The equipment catalog and shop-facing field-tool contract expanded materially, while ownership remains normal item/equipment state compatible with Game State 5. Newly authored equipment avoided active-discipline gating by default.

### 0.6.600 version decision

Production/resource loops completed at Product `0.6.600.1`, Package `0.6.600`, Data `24`. Work-task/proficiency state is additive and lazily normalizable within Game State 5, while canonical process/output records materially expanded authored-data authority and therefore advanced Data.

### 0.6.700 version decision

Regional ecology/resource breadth completed at Product `0.6.700.1`, Package `0.6.700`, Data `25`. Runtime ecology state remained compatible with Game State 5; Data advanced because unified regional species/population/source/resource registries and their content-pack graph became canonical authored content contracts.

### 0.6.800 version decision

Persistent companion/party foundation completed at Product `0.6.800.1`, Package `0.6.800`, Data `26`, with Account Save 4 and Game State 5 unchanged. `state.party` is additive/lazily reconstructible; backing NPC state can be reconstructed/synchronized from canonical companion definitions. Data advanced because companion identity linkage, recruitment requirements, tactical policy, and relationship-dimension records are canonical authored runtime data.

### 0.6.900 version decision

Integrated mechanics completed at Product `0.6.900.1`, Package `0.6.900`, while Account Save `4`, Game State `5`, Data `26`, and Benchmark `1` remained unchanged.

The track introduced `integratedMechanicsGate` system contract `0.1.0`, which evaluates persistence/lazy normalization, time/interrupt dependencies, continuous-character ownership, combat/party/work/travel composition, provenance/production, semantic UI authority, world/content validators, and required database readiness.

No persistence bump was justified because the gate proves the major additive Phase 0.6 registries can be lazily reconstructed within Game State 5. No Data bump was justified because the track repaired authority/presentation integration without introducing a new canonical authored-data shape. Canonical starter equipment was also normalized away from active-discipline `allowedJobs` gates while the generic field remains accepted at explicit legacy compatibility boundaries.

Authoritative runtime checkpoint `58fed55122d8058152c70c8e7b3b2565d2cbeaf9` passed 453/453 tests, the Benchmark 1 workload, browser build/status reporting, and GitHub Pages deploy.

## Phase 0.7 — Multi-region playable alpha — next

Phase 0.7 begins from the closed Phase 0.6 authority contracts; it is not permission to replace them with parallel quest/economy/dialogue clocks or state models.

### Entry conditions

New 0.7 work must preserve:

- one canonical fictional-time/task/interrupt substrate;
- continuous-character ownership of learned/mastered capability and proficiency;
- semantic DOM/view-model/intents as the normal browser interaction direction;
- acquired-knowledge map privacy;
- provenance/source-sink integrity;
- explicit content-pack ownership/dependencies and cross-reference validation;
- supported persistence migrations and additive normalization where sufficient.

### Playable-alpha exit gate

Phase 0.7 exits only when a normal player can sustain repeated multi-session play across several connected settlements/regions without test-only setup or command-line expertise. The campaign must combine persistent NPC communities, shops/services, contracts/quests, relationships/reputation, companions, meaningful transport/economy, ecology/resources, production/livelihood choices, and adventure/combat in one coherent save.

Each major playable region should have both economic/livelihood reasons and social/adventure reasons to visit. Ordinary campaign actions must be reachable through the semantic browser UI. Saves, validators, provenance, time/interrupt behavior, and exactly-once resource ownership must remain green as content scales.

The first bounded target is `0.7.100` — a playable campaign slice connecting existing systems through one coherent regional corridor before broad content multiplication.

## Planned later phases

### 0.8 — Life and infrastructure expansion

Deepen property, workshops, agriculture, logistics, home/infrastructure, companions/relationships, social schedules, and earned automation while maintaining provenance and continuous-character progression.

### 0.9 — Adventure depth and release hardening

Expand difficult regions/dungeons, advanced combat/abilities, rare systems, high-level economy/production, accessibility/UI, balance, save migration, performance, deployment, and release tooling.

### 1.0 — Live foundation

Release when the core promise is coherent and durable:

```text
one persistent person
+ long-form mastery/livelihood
+ relationships/reputation
+ material capability/home/infrastructure
+ connected travel/exploration/adventure
+ persistent companions
+ deterministic fictional time
+ original world/content
+ stable migrations/performance
```

1.0 is not an endpoint for content. It is the first version where the central game is sufficiently complete, stable, and original to be treated as a live foundation rather than pre-alpha development.

## Gate philosophy

Do not inflate version numbers to imply completion. Do not mass-author content merely to fill numeric ranges. A track should close only when its authority boundary is clear enough that the next track can build on it safely. Conversely, do not hold a coherent early milestone hostage to every eventual feature: bounded limitations belong in the roadmap/handoff and can be addressed by later tracks without reopening settled contracts.
