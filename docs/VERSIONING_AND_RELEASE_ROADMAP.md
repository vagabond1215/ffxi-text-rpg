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
Data:         28
Benchmark:    1
Codename:     Integrated Mechanics Gate
```

The repository is pre-alpha. **Phase 0.6 is complete. Phase 0.7 is in progress.** The product version remains at the last completed product milestone until the bounded `0.7.100` campaign-slice track closes. Data 28 and the current Phase 0.7 subsystem registrations describe landed authored/runtime/presentation contracts; they do not imply `0.7.100` completion.

## Product version format

Use `MAJOR.PHASE.TRACK.REVISION`. `package.json.version` remains normal three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical. `js/text/version.js` is runtime authority.

## Independent schema/data versions

Product version is not a persistence schema number. Track these independently:

| Version | Current | Purpose |
| --- | ---: | --- |
| Account Save | 4 | Current local account/session/character registry contract |
| Game State | 5 | Current serialized character/world runtime contract |
| Data | 28 | Canonical authored-data contract |
| Benchmark | 1 | Benchmark protocol/comparability |

### When to bump Account Save

Bump when the persisted account-registry/session contract changes materially enough that current-format data should not be mistaken for the prior schema. During pre-alpha, a bump does **not** require preserving older local account data. Add an ordered migration only when historical compatibility is deliberately worth carrying.

### When to bump Game State

Bump when the persisted game-state structure or meaning changes materially enough to define a new current contract. During pre-alpha, prefer the clean current schema over compatibility-only normalization machinery.

Purely derived/presentation state should remain unpersisted when there is already a clear canonical authority. PX-5 readability and PX-6 danger/recovery Journal projections are derived and therefore do not justify a Game State bump. PX-6 recovery progress is stored in existing canonical timed-task/battle structures rather than a new registry/schema.

### When to bump Data

Bump when canonical authored-data contracts or catalogs gain a meaningful versioned shape/authority change. Recent examples:

- Data 20 — character capability learning/use contract;
- Data 21 — original magic/active ability contract;
- Data 22 — canonical enemy ability/combat data contract;
- Data 23 — equipment/field-tool/shop breadth contract;
- Data 24 — canonical production/process/output contract;
- Data 25 — regional ecology/resource breadth and registry contract;
- Data 26 — persistent companion definition, recruitment/tactics, and relationship-dimension contract;
- Data 27 — Phase 0.7 player-experience authored content and actionable opportunity/regional-loop contract;
- Data 28 — canonical commitment definition plus general persistent NPC relationship/follow-up authored contract.

PX-5 and PX-6 do **not** advance Data beyond 28. PX-5 derives campaign readability from existing records; PX-6 reuses the existing Redstone enemy, battle rewards, body resource opportunity, equipment/tool, place, and recovery-work authorities rather than adding a new authored-data schema.

### When to bump Benchmark

Bump only when the benchmark workload/protocol changes enough that prior numbers are no longer directly comparable. PX-6 retains Benchmark 1 and changes neither its workload nor route-lookup algorithm.

## Compatibility policy

Current compatibility mode:

```text
pre-release-current-schema
```

Rules:

- the current schema must save, load, validate, and resume deterministically;
- old local saves/accounts may be invalidated or reset when a cleaner current schema materially improves the project;
- do not add lazy normalization, duplicate fields, adapter layers, or migration steps solely to preserve pre-alpha historical state;
- when historical compatibility is deliberately supported, future/unknown versions must still fail deterministically rather than being silently coerced;
- legacy identifiers may be accepted at explicit research/import/input boundaries, but canonical current state/data emits original-world identifiers;
- compatibility policy is never permission to expose historical IP as canonical content.

## Release discipline

A track is complete when its intended contract is coherent, validated, versioned, documented, and integrated enough that following work can build on it without guessing authority. Early single-maintainer development proceeds directly on `main`; temporary failures during an atomic implementation sequence are acceptable, but the milestone checkpoint itself must be green or have a documented blocker.

For a coherent milestone checkpoint:

1. implement the bounded contract and focused tests;
2. observe the full test suite;
3. run/observe the benchmark and compare with performance budgets;
4. verify browser/build/deploy checks where applicable;
5. update runtime/product/schema/data versions deliberately;
6. update roadmap/architecture/handoff documentation;
7. stop at the declared boundary rather than silently beginning the next track.

In-progress work may register subsystem versions or authored-data contracts without advancing the product milestone number.

## Phase / track history

### 0.4 — Foundation — complete

Direction lock, version protocol, ordered persistence migrations, structured action results, semantic events, and architecture stabilization.

### 0.5 — Simulation and content substrate — complete

| Track | Contract | Status |
| --- | --- | --- |
| `0.5.100` | Deterministic fictional world clock | Complete |
| `0.5.200` | Pause/speed and scheduler adapter | Complete |
| `0.5.300` | Canonical timed tasks | Complete |
| `0.5.400` | Deterministic interrupt model | Complete |
| `0.5.500` | Day boundaries/review | Complete |
| `0.5.550` | Original-world identity migration | Complete |
| `0.5.600` | Projects/resource provenance | Complete |
| `0.5.650` | Ecology/gathering/population substrate | Complete |
| `0.5.700` | Routes/scheduled transport | Complete |
| `0.5.800` | Regional content packs/scalable validation | Complete |
| `0.5.900` | Simulation/content-substrate exit gate | Complete |

### 0.6 — Integrated character and mechanics — complete

| Track | Contract | Resulting product/data | Status |
| --- | --- | --- | --- |
| `0.6.100` | Continuous-character stats/progression | `0.6.100.1` / Data 19 | Complete |
| `0.6.200` | Skills/proficiencies/disciplines/capabilities | `0.6.200.1` / Data 20 | Complete |
| `0.6.250` | Semantic DOM player-interface architecture | `0.6.250.1` / Data 20 | Complete |
| `0.6.300` | Original magic and active ability engine | `0.6.300.1` / Data 21 | Complete |
| `0.6.400` | Combat 2.0 timing/action/interruption contract | `0.6.400.2` / Data 22 | Complete |
| `0.6.450` | Locality and exploration navigation | `0.6.450.1` / Data 22 | Complete |
| `0.6.500` | Equipment and field-tool breadth | `0.6.500.1` / Data 23 | Complete |
| `0.6.600` | Gathering/hunting/processing/crafting/cooking/salvage | `0.6.600.1` / Data 24 | Complete |
| `0.6.700` | Ecology/regional creature/resource content breadth | `0.6.700.1` / Data 25 | Complete |
| `0.6.800` | Persistent companion/party foundation | `0.6.800.1` / Data 26 | Complete |
| `0.6.900` | Integrated-mechanics exit gate | `0.6.900.1` / Data 26 | Complete |

### Key completed 0.6 version decisions

- **0.6.400:** Combat 2.0 kept Account Save 4 / Game State 5 and advanced Data to 22 for canonical enemy-ability data.
- **0.6.450:** locality/exploration navigation was derived/ephemeral over existing place authority; no persistence/Data bump.
- **0.6.500:** equipment/tool breadth advanced Data to 23 while ownership remained normal Game State 5 item/equipment state.
- **0.6.600:** canonical production/process/output authority advanced Data to 24; work state remained Game State 5.
- **0.6.700:** regional ecology/resource registry breadth advanced Data to 25.
- **0.6.800:** persistent companion definitions advanced Data to 26; party state remained Game State 5.
- **0.6.900:** integrated mechanics stabilized existing Data 26 authorities and closed at Product `0.6.900.1`, Package `0.6.900`, Account Save 4, Game State 5, Data 26, Benchmark 1.

Authoritative Phase 0.6 runtime checkpoint `58fed55122d8058152c70c8e7b3b2565d2cbeaf9` passed 453/453 tests, Benchmark 1, browser build/status reporting, and GitHub Pages deploy.

## Phase 0.7 in-progress version decision

Current player-experience slices retain Product `0.6.900.1` and Package `0.6.900`. Account Save `4`, Game State `5`, Data `28`, and Benchmark `1` are current.

Current Phase 0.7 registrations after PX-6:

```text
activityAdvance:            0.2.0
campaignRecovery:           0.1.0
characterActivity:          0.2.0
commitments:                0.1.0
relationships:              0.1.0
dayCycle:                   0.2.0
resourceRecoveryWork:       0.3.0
gameViewModels:             0.8.0
playerExperience:           0.3.0
playerOpportunities:        0.2.0
playerContinuity:           0.4.0
playerCampaignReadability:  0.2.0
playerDangerRecovery:       0.2.0
domUi:                      0.6.0
uiIntents:                  0.6.0
```

The sequence of Phase 0.7 decisions is:

- **PX-1/PX-2/PX-3:** Data 27 established player-experience authored content, actionable opportunity projection, starter-tool flow, and the first Brasshaven/Redstone regional-loop contract.
- **PX-4:** Data advanced to 28 because canonical commitment definitions and general persistent NPC relationship/follow-up data became new authored authority. Game State remained 5; current state explicitly owns/validates commitment and relationship registries. The audit also hardened provenance-safe stacking and provenance-qualified commitment consumption.
- **PX-5:** no Product/Package/Account Save/Game State/Data/Benchmark bump. `playerCampaignReadability` is a pure derived presentation layer; the semantic UI gained grouped readiness and scheduled-transport access while the existing transport engine retained fare/cadence/cargo/departure/arrival authority.
- **PX-6:** no Product/Package/Account Save/Game State/Data/Benchmark bump. The new `campaignRecovery 0.1.0` primitive stores progress inside existing timed tasks and existing battle state rather than a new persistent registry. `playerDangerRecovery` is derived. Existing battle/resource-opportunity data remains canonical. `activityAdvance`, resource-recovery adapter, continuity/readability, game view model, DOM, and UI-intent registrations advance to describe the composed ordinary-player danger/recovery path.

PX-6 also advances `playerCampaignReadability` from `0.1.0` to `0.2.0`: explicit truthful region metadata supplied by an upstream opportunity now takes precedence over origin fallback inference. This is a presentation-contract correction required to group a Redstone battle aftermath under Redstone.

Authoritative PX-6 runtime checkpoint:

```text
e30bc607faf0e56b784aca54e1f830c0c48fe274
480/480 tests
Benchmark 1 success
Data 28
```

Benchmark 1 at that checkpoint remained within current soft-budget discipline:

```text
1,000 player combat profiles     459.380ms  0.459380ms/op
1,000 enemy combat profiles       98.733ms  0.098733ms/op
1,000 basic attacks              506.141ms  0.506141ms/op
10,000 ticks / 5 subscribers      44.849ms  0.004485ms/op
10,000 direct route lookups     7909.264ms  0.790926ms/op
```

The proof uses existing Redstone enemy/loot/resource data. Battle victory still owns EXP/currency exactly once; physical creature material remains a separate canonical defeated-body resource opportunity; character/party recovery spends canonical fictional time; defeat retreats to known safety with partial rather than full restoration.

## Phase 0.7 — Multi-region playable alpha — in progress

Phase 0.7 begins from the closed Phase 0.6 authority contracts; it is not permission to replace them with parallel quest/economy/dialogue/travel/encounter/recovery clocks or state models.

### Entry conditions

New 0.7 work must preserve:

- one canonical fictional-time/task/interrupt substrate;
- continuous-character ownership of learned/mastered capability and proficiency;
- semantic DOM/view-model/intents as the normal browser interaction direction;
- acquired-knowledge map/campaign privacy;
- provenance/source-sink/exactly-once integrity;
- explicit content-pack ownership/dependencies and cross-reference validation;
- one clean current schema, with pre-alpha reset/breakage preferred over compatibility-only complexity.

### Playable-alpha exit gate

Phase 0.7 exits only when a normal player can sustain repeated multi-session play across several connected settlements/regions without test-only setup or command-line expertise. The campaign must combine persistent NPC communities, shops/services, commitments/quests, relationships/reputation, companions, meaningful transport/economy, ecology/resources, production/livelihood choices, and adventure/combat/recovery in one coherent current-version save.

Each major playable region should have both economic/livelihood reasons and social/adventure reasons to visit. Ordinary campaign actions must be reachable through semantic browser UI. Current-version saves, validators, provenance, time/interrupt behavior, and exactly-once resource ownership must remain green as content scales.

The first bounded target remains `0.7.100`. PX-1 through PX-6 now prove arrival/footing, actionable opportunities, Brasshaven/Redstone material production, canonical several-day social continuity, acquired-knowledge multi-region readability, and ordinary danger/combat/resource/body/defeat recovery composition.

The full `0.7.100` track remains open because the strongest social/commitment continuity is still Brasshaven-centered and the campaign does not yet have enough alternative repeated multi-region/community goals to claim sustained sandbox breadth.

The next bounded unit is **PX-7 — repeated multi-region/community breadth**. Prove a second real community/regional slice—preferably from existing Mistmere/Starfen authorities—before generalizing the first commitment/readability shapes or closing the campaign track.

## Planned later phases

### 0.8 — Life and infrastructure expansion

Deepen property, workshops, agriculture, logistics, home/infrastructure, companions/relationships, social schedules, and earned automation while maintaining provenance and continuous-character progression.

### 0.9 — Adventure depth and release hardening

Expand difficult regions/dungeons, advanced combat/abilities, rare systems, high-level economy/production, accessibility/UI, balance, historical-save migration policy, performance, deployment, and release tooling.

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