# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Required read order

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/DEVELOPMENT_DIRECTION.md`
4. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
5. `docs/ROADMAP.md`
6. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
7. `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`
8. `docs/ARCHITECTURE.md`, `docs/LOCALITY_AND_EXPLORATION_MODEL.md`, `docs/QUALITY_GATES.md`, `docs/PERFORMANCE_BUDGET.md`, `docs/RESOURCE_LIFECYCLE.md`, `js/text/version.js`, and systems/tests relevant to the next bounded work order.

## Workflow and pre-alpha policy

Work directly on `main` by default. Treat each prompt as a bounded work order and stop at a coherent checkpoint.

Hearth & Horizon is pre-alpha. Old local saves/accounts are not a design constraint. Prefer one clean current schema and one clear authority over compatibility-only migrations, duplicate fields, or adapter layers. This never relaxes determinism, validation, provenance, one-time ownership, original-world content policy, acquired-knowledge privacy, or test discipline.

## Product laws

Working title: **Hearth & Horizon**. FFXI-derived material is legacy research/reference/migration material only.

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

Maps/campaign guidance represent acquired character knowledge. Fictional time is separate from wall-clock scheduling. Resources retain provenance. Companions are persistent NPC-backed people. Commitments/relationships are canonical state. Journal/readability/service/information/home/social models are derived presentation or bounded adapters.

Ordinary player-facing information describes what the character **sees, knows, carries, remembers, needs, or can decide**. Architecture, compatibility, raw state/task channels, hidden topology, and implementation rationale stay outside normal play.

## Current baseline

```text
Product:       0.8.500.1
Package:       0.8.500
Account Save:  4
Game State:    5
Data:          36
Benchmark:     1
Codename:      Daily Social Availability
Compatibility: pre-release-current-schema
Released:      false
```

**Phases 0.4–0.7 are complete. Phase 0.8 is IN PROGRESS. Tracks `0.8.100`, `0.8.200`, `0.8.300`, `0.8.400`, and `0.8.500` are complete and audited.**

## Authoritative promoted `0.8.500` runtime checkpoint

```text
fde1d30d76264ea25af6bad4d829545c488eec9b
Allow later commitment authority revisions in Phase 0.7 gate
```

Observed promoted runtime evidence:

```text
tests       509
pass        509
fail        0
skipped     0
benchmark   success
Product     0.8.500.1
Package     0.8.500
Data        36
Account     4
Game State  5
```

Benchmark 1:

```text
1,000 player combat profiles      367.612ms  0.367612ms/op
1,000 enemy combat profiles       101.654ms  0.101654ms/op
1,000 basic attacks               434.260ms  0.434260ms/op
10,000 ticks / 5 subscribers       43.213ms  0.004321ms/op
10,000 direct route lookups      6877.677ms  0.687768ms/op
```

Promoted validation used marker-only draft PR #319 because the connector can reliably observe pull-request Check runs. PR #319 based exactly on `fde1d30d76264ea25af6bad4d829545c488eec9b`, added only an inert marker, completed Test and Benchmark successfully, and was closed without merging.

GitHub Actions project tests explicitly install Node 20.20.2. The recurring warning that `actions/checkout` / `actions/setup-node` may run under GitHub's newer action runtime remains warning-only.

## Current relevant registrations

```text
versionManifest:              0.8.500.1
projects:                     0.1.0
homeInfrastructure:           0.3.0
homeStorage:                  0.3.9
characterActivity:            0.3.0
activityAdvance:              0.5.0
workstations:                 0.3.0
productionItems:              0.4.0
production:                   0.1.0
settlementServiceBoard:       0.2.0
transport:                    0.3.0
carriedLoad:                  0.2.0
transportServiceBoard:        0.2.0
inventoryContainers:          0.6.0
inventoryTransfers:           0.6.0
commitments:                  0.3.0
relationships:                0.1.0
npcSchedules:                 0.1.0
playerSocialSchedules:        0.1.0
localityNavigation:           0.2.0
gameViewModels:               0.14.0
uiIntents:                    0.10.0
validation:                   0.10.0
dayCycle:                     0.2.0
resourceRecoveryWork:         0.3.0
shopTransactions:             0.5.0
playerInformation:            0.1.1
playerExperience:             0.3.0
playerOpportunities:          0.2.0
playerContinuity:             0.5.0
playerCampaignReadability:    0.2.0
playerDangerRecovery:         0.2.0
domUi:                        0.10.0
domOnboarding:                0.1.0
saveRecovery:                 0.1.0
characterCreation:            0.6.0
characterCreationContent:     0.2.0
characterNames:               0.1.0
startingDisciplineKits:       0.1.0
companionCatalog:             0.2.0
party:                        0.2.0
companions:                   0.2.0
```

Database registration added by `0.8.500`:

```text
npcSchedules  implemented 0.1.0
```

Subsystem and database versions are independent contracts.

## Stable closed history

Phase 0.7 remains closed at Product `0.7.400.1`. Its multi-region proof still covers the three origin communities, livelihood/production, danger/combat/recovery, acquired-knowledge readability, semantic transport/services/information, persistent companion preparation, character-POV presentation, and save/load.

`0.8.100` remains the Storage Chest proof; `0.8.100.2` remains onboarding/creator polish; `0.8.200` remains the locality-bound Joiner's Workbench/home-production proof; `0.8.300` remains canonical carried-load transport; `0.8.400` remains earned portable Field Satchel logistics. Do not reopen those tracks merely because later breadth is desirable.

## `0.8.300` — Carried Load & Transport Logistics — complete

`carriedLoadEngine` derives transport load from canonical occupied carried-container slots. `transportServiceBoardEngine` projects that fact and `transportEngine` independently derives it at booking, ignores caller-supplied cargo values, checks capacity before fare deduction, and records canonical load.

Authoritative checkpoint:

```text
4f8c0de9e6ba926ee903f5787d34cca73c40eb6d
507/507 tests
Benchmark 1 success
Product 0.8.300.1
Data 34
```

## `0.8.400` — Portable Field Logistics — complete

**Make a Field Satchel**:

```text
2 Resin-Cured Hide Bindings
1 Copper Trail Clasp
30 minutes canonical project labor
  -> unlock Field Satchel
  -> 8 portable slots
```

The existing home/project path owns construction and inventory owns unlock/access/capacity/transfer. Portable containers marked `countsAsCarriedCargo` remain transport cargo, so Inventory→Field Satchel preserves load while portable→Home Safe reduces load.

Promoted checkpoint:

```text
d1a43568c5ca4dd7e57fb86316b422c35025ce07
Check 32080844409 SUCCESS
Product 0.8.400.1
Data 35
```

## `0.8.500` — Daily Social Availability — complete

### Why this track

Existing fictional time already affected work, travel, transport, recovery, production, combat readiness, and day review, but named NPC interactions were effectively available whenever the NPC's static location matched the place. The bounded next seam was to make one real named relationship/commitment loop respect the fictional day without introducing a separate social simulation.

### First authored schedule

```text
schedule-thornwall-sera-talwin
NPC:   npc-thornwall-sera-talwin
POI:   poi-sandoria-s-alaune
Place: thornwall-southgate
Daily: 08:00–18:00
Label: Southgate guide duty
```

`js/text/data/npcSchedules.js` owns this authored recurring record. `NPC_SCHEDULE_DATA_VERSION = 1`.

`validateNpcScheduleCatalog()` validates schedule IDs, canonical NPC/POI/place references, unique claimed POIs, integer in-day windows, ordering, and overlaps. The track test invokes it directly. Global `validateWorldData()` was not expanded solely to duplicate this subsystem-owned validation, so `SYSTEM_VERSIONS.validation` remains `0.10.0` deliberately.

### One runtime schedule authority

`js/text/systems/npcScheduleEngine.js` (`NPC_SCHEDULE_ENGINE_VERSION = 1`) derives availability entirely from canonical `state.worldTime` plus authored schedule data. It exposes current availability, current-window end, next available fictional world second, time until return, and player-readable window/return guidance.

**There is no `state.npcSchedules` registry.** Save/load persists fictional time through existing Game State 5 and the schedule re-derives after load.

The current contract is **public availability at a static canonical NPC location**. Sera's persistent `identity.locationId` remains Southgate; the schedule states when she is available there. Multi-location NPC pathfinding/routines are not part of this track.

### Interaction enforcement

One schedule authority feeds all relevant paths:

- `localityEngine` v2 decorates scheduled POIs and rejects an unavailable POI before position/discovery mutation;
- `poiEngine` applies the same schedule to command-path talk and POI actions;
- `commitmentEngine` v0.3.0 applies giver availability to accept, resolve, and follow-up;
- `playerSocialScheduleEngine` is a pure opportunity decorator that blocks unavailable social commitment cards, adds return guidance, removes the action, and recomputes recommendations;
- `gameViewModel` v0.14.0 preserves availability on nearby records, shows away/return information, and omits contextual Talk for scheduled-away POIs.

This does not merge responsibilities: commitments still own obligation/reward state, relationships still own social-continuity dimensions, fictional time owns time, and schedule data owns only recurring availability.

### End-to-end player proof

Primary guard: `tests/playerSocialScheduleFlow.test.js`.

It proves:

```text
Day 1 08:00
  Sera available
  semantic Talk works
  commitment Accept is actionable

Day 1 18:30
  Sera away
  semantic locality Talk blocked
  command-path Talk blocked
  no hidden position/time mutation
  commitment Accept blocked by domain authority
  Journal action removed and return guidance shown

save/load at 18:30
  no schedule registry exists
  world time persists
  availability re-derives as away

Day 2 08:00
  availability re-derives as present
  commitment acceptance succeeds
```

The test also asserts schedule-catalog validation, current game-state validation, and world-data validation remain green.

### Version decision

```text
Product:       0.8.500.1
Package:       0.8.500
Account Save:  4
Game State:    5
Data:          36
Benchmark:     1
Codename:      Daily Social Availability
```

Data `35 -> 36` because canonical authored NPC-schedule data is new. Game State remains 5 because no persisted schedule state or meaning is introduced. Account Save remains 4. Benchmark remains 1.

### Integration repair trail

Pre-promotion runtime head `752759fe38f4f5743537b66f25c6d9ee84c2e538` passed 509/509 tests plus Benchmark 1 through marker PR #317.

The first promoted validation at base `4e8a7672d7224fa39af913d9813ed8205b26e569` failed one historical Phase 0.7 assertion because it required `SYSTEM_VERSIONS.commitments === 0.2.0`. `0.8.500` legitimately extends the shared commitment authority to honor giver availability. The historical test was repaired to require the compatible minimum `>= 0.2.0`, matching the established policy for evolved shared systems. No Phase 0.7 gameplay behavior was weakened.

The repaired promoted runtime is the authoritative checkpoint `fde1d30d76264ea25af6bad4d829545c488eec9b`, with 509/509 tests and Benchmark 1 success.

### Closure audit

**PASS. `0.8.500` is closed.** Fictional time now creates one real named-person availability decision; semantic UI, command interaction, and commitment authority agree; save/load is deterministic; availability is not persisted redundantly; and ordinary browser presentation explains the blocked choice instead of exposing a dead action.

## Stable authority boundaries to preserve

- one fictional-time/task/interrupt substrate;
- generic projects as shared material + labor + completion substrate;
- continuous-character ownership of stats/capabilities/work mastery;
- semantic browser intents as normal player actions;
- acquired-knowledge privacy for maps/routes/resources/contacts/search;
- provenance and one-time source/sink ownership;
- commitments separate from relationships and both separate from Journal projection;
- NPC schedules as authored recurring availability evaluated against canonical fictional time, never a second clock/state registry;
- schedule-gated interaction enforced below presentation so command/UI paths cannot bypass it;
- static NPC location and public availability kept conceptually separate until a deliberate movement-routine authority is designed;
- transport owning fare/cadence/departure/arrival/service allowance;
- carried load derived from inventory, never supplied by UI as authority;
- inventory owning container unlock/access/capacity/transfer;
- home/service/information/onboarding/social views as projections/adapters only;
- `workstationEngine` as single workstation-context authority;
- `productionEngine` owning recipe requirements/work/inputs/outputs/provenance/mastery;
- persistent NPC-backed companions with party/battle/travel responsibilities kept separate;
- clean current pre-alpha schema over compatibility-only debt.

## Known non-blocking debt

- internal `mogHouse` and some container IDs remain legacy terminology; player-facing copy is original/generic;
- legacy prompt/fast-create creator bypasses the semantic creator starter-kit flag;
- account settings still normalize historical `highContrast`, while active UI offers only Light/Dark;
- original currency terminology remains deferred;
- `commitmentEngine.checkCommitmentRequirements` currently examines the main inventory container rather than all portable carried containers; do not repair by adding duplicate commitment inventory state;
- `gameViewModel.transportBoardAction` still includes a historical `cargoUnits: 0` payload even though transport authority ignores caller cargo since `0.8.300`;
- schedule catalog validation is subsystem-owned/directly tested rather than duplicated inside global `validateWorldData`;
- the first schedule models static-location availability only; multi-location NPC movement remains future design work;
- no manual visual/browser walkthrough was claimed;
- recurring GitHub action-runtime Node warning remains warning-only;
- Phase 0.8 still needs broader life depth such as agriculture/stewardship, companion breadth, earned automation, or another carefully bounded social/life seam.

## Next work

**Do not automatically begin `0.8.600`.** This work order closes at `0.8.500`. A new user work order should resync `main`, reread this handoff, and audit one bounded Phase 0.8 seam before implementation.

Strong candidate families:

- agriculture/stewardship;
- companion life breadth;
- earned automation;
- additional social-life breadth only when a concrete player decision and existing authority path justify it;
- another life/logistics segment only if a specific current seam warrants it.

Do not mass-author schedules, farms, companion routines, warehouses, or automation merely to fill a numeric track.
