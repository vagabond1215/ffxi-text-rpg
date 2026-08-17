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

Maps/campaign guidance represent acquired character knowledge. Fictional time is separate from wall-clock scheduling. Resources retain provenance. Companions are persistent NPC-backed people. Journal/readability/service/information/home models are derived presentation or bounded adapters.

Ordinary player-facing information describes what the character **sees, knows, carries, remembers, needs, or can decide**. Architecture, compatibility, raw state/task channels, hidden topology, and implementation rationale stay outside normal play.

## Current baseline

```text
Product:       0.8.400.1
Package:       0.8.400
Account Save:  4
Game State:    5
Data:          35
Benchmark:     1
Codename:      Portable Field Logistics
Compatibility: pre-release-current-schema
Released:      false
```

**Phases 0.4–0.7 are complete. Phase 0.8 is IN PROGRESS. `0.8.100`, `0.8.200`, `0.8.300`, and `0.8.400` are complete and audited.**

Authoritative promoted `0.8.400` runtime checkpoint:

```text
d1a43568c5ca4dd7e57fb86316b422c35025ce07
Synchronize 0.8.400 pipeline version contract
```

Promoted runtime evidence:

```text
Product     0.8.400.1
Package     0.8.400
Data        35
Account     4
Game State  5
Benchmark   1
Check run   32080844409 SUCCESS
Test step   SUCCESS
Benchmark   SUCCESS
```

The exact `0.8.400` test-count/timing lines were not retained in the available connector evidence. Do not reconstruct or invent them later. The workflow-level fact that both Test and Benchmark steps succeeded is observed and authoritative.

GitHub Actions project tests explicitly install Node 20.20.2. The recurring warning that `actions/checkout` / `actions/setup-node` may run under GitHub's newer action runtime remains warning-only.

## Current relevant registrations

```text
versionManifest:              0.8.400.1
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
gameViewModels:               0.13.0
uiIntents:                    0.10.0
validation:                   0.10.0
commitments:                  0.2.0
relationships:                0.1.0
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

## Stable closed history

Phase 0.7 remains closed at Product `0.7.400.1`. Its multi-region proof still covers the three origin communities, livelihood/production, danger/combat/recovery, acquired-knowledge readability, semantic transport/services/information, persistent companion preparation, character-POV presentation, and save/load.

`0.8.100` remains the Storage Chest proof; `0.8.100.2` remains onboarding/creator polish. `0.8.200` remains the locality-bound Joiner's Workbench/home-production proof. Do not reopen those tracks merely because later breadth is desirable.

## `0.8.300` — Carried Load & Transport Logistics — complete

### Problem repaired

Scheduled transport already authored `cargoAllowanceUnits`, but service-board and booking callers could provide arbitrary `cargoUnits`. That made cargo a UI assertion instead of simulation authority.

### Current contract

`carriedLoadEngine` derives the current load from canonical occupied carried-container slots. At the `0.8.300` checkpoint it used the main Inventory; `0.8.400` later generalized the same authority to all portable carried containers.

`transportServiceBoardEngine` projects the real load and blocker. `transportEngine` independently derives the load during booking, ignores supplied cargo payloads, checks capacity before charging fare, and records the canonical load in the journey snapshot.

Proving loop:

```text
25 carried slots
  -> Crown–Forge caravan allowance 24 blocks
  -> fake cargo=0 cannot bypass
  -> leave one item in Home Safe
  -> carried load 24
  -> service becomes boardable
  -> fake cargo=999 cannot change booked load
  -> save/load preserves canonical journey load
```

Primary guard: `tests/playerTransportLogisticsFlow.test.js` plus `tests/transportEngine.test.js`.

Authoritative `0.8.300` checkpoint:

```text
4f8c0de9e6ba926ee903f5787d34cca73c40eb6d
507/507 tests
0 failed
0 skipped
Benchmark 1 success
Product 0.8.300.1
Package 0.8.300
Data 34
```

Benchmark 1:

```text
player combat profiles  0.492450 ms/op
enemy combat profiles   0.117547 ms/op
basic attacks            0.588062 ms/op
tick dispatch            0.005528 ms/op
direct route lookup      0.902781 ms/op
```

Validation used a marker-only draft PR because the connector could observe pull-request Check runs but could not reliably enumerate push-triggered runs. Marker files were never merged. Historical Phase 0.7 transport-board assertions were changed from exact ceilings to compatible minimums so later shared-authority evolution does not reopen Phase 0.7.

## `0.8.400` — Portable Field Logistics — complete

### Bounded player proof

**Make a Field Satchel**:

```text
2 Resin-Cured Hide Bindings
1 Copper Trail Clasp
30 minutes canonical project labor
  -> unlock Field Satchel
  -> 8 portable slots
```

The satchel is not a new portable-inventory subsystem. It uses the existing home-infrastructure/project/timed-task path. `inventoryEngine` owns the existing container's `unlocked` state, access, capacity, and transfers.

`homeInfrastructure.js` now supports exactly one durable furnishing or container benefit per authored improvement. `homeInfrastructureEngine` applies either type exactly once after generic project completion.

### Carried-load rule

`inventoryContainers.js` marks portable containers with `countsAsCarriedCargo`. `carriedLoadEngine` v2 sums occupied slots across every **unlocked** marked container.

```text
Inventory -> Field Satchel
  portable distribution changes
  total carried cargo unchanged

Inventory/Field Satchel -> Home Safe
  goods leave portable carriage
  carried cargo decreases
```

The stable internal ID `mogSatchel` remains legacy-shaped, but player-facing copy is **Field Satchel**. Do not expose the internal ID in normal UI.

### End-to-end guard

`tests/playerPortableFieldLogisticsFlow.test.js` proves:

- Field Satchel begins locked and has an authored 8-slot capacity;
- Home & Foothold shows semantic Plan → material → work → finish actions;
- 2 hide bindings + 1 clasp are consumed by canonical project contribution;
- 30 minutes of project labor completes through shared fictional time;
- container unlock applies exactly once and survives account save/load;
- Inventory→Satchel transfer preserves total cargo;
- satchel lets portable holdings exceed the main Inventory's 30 slots;
- a 31-unit carried load blocks Crown–Forge transport;
- moving seven goods into Home Safe reduces load to 24 while a satchel item still counts;
- the service then boards and records cargo 24;
- home/game validation and player-facing HTML hygiene pass.

A briefly drafted separate portable-logistics project/catalog engine was deleted before validation because it duplicated existing project/home authority. The final architecture has one project authority and one inventory authority.

The first pre-promotion Check exposed only a stale `0.8.100` completion-copy assertion. The chest behavior remained correct; the test now asserts the stable semantic fact rather than one historical verb.

Data advances `34 -> 35` for Field Satchel authored semantics and the Resin-Cured Hide Binding construction sink. Game State remains 5 because `container.unlocked` and generic project records already existed. Account Save remains 4.

Promoted checkpoint:

```text
d1a43568c5ca4dd7e57fb86316b422c35025ce07
Check 32080844409 SUCCESS
Test step SUCCESS
Benchmark step SUCCESS
Product 0.8.400.1
Package 0.8.400
Data 35
```

## Stable authority boundaries to preserve

- one fictional-time/task/interrupt substrate;
- generic projects as shared material + labor + completion substrate;
- continuous-character ownership of stats/capabilities/work mastery;
- semantic browser intents as normal player actions;
- acquired-knowledge privacy for maps/routes/resources/contacts/search;
- provenance and one-time source/sink ownership;
- commitments separate from relationships and both separate from Journal projection;
- transport owning fare/cadence/departure/arrival/service allowance;
- carried load derived from inventory, never supplied by UI as authority;
- inventory owning container unlock/access/capacity/transfer;
- portable containers marked as cargo retaining their load when items move among them;
- home storage reducing cargo only because goods are no longer carried;
- service/information/home/onboarding views as projections/adapters only;
- `workstationEngine` as single workstation-context authority;
- `productionEngine` owning recipe requirements/work/inputs/outputs/provenance/mastery;
- persistent NPC-backed companions with party/battle/travel responsibilities kept separate;
- clean current pre-alpha schema over compatibility-only debt.

## Known non-blocking debt

- internal `mogHouse` and some container IDs remain legacy terminology; player-facing copy is original/generic;
- legacy prompt/fast-create creator bypasses the semantic creator starter-kit flag;
- account settings still normalize historical `highContrast`, while active UI offers only Light/Dark;
- original currency terminology remains deferred;
- recurring GitHub action-runtime Node warning remains warning-only;
- Phase 0.8 still needs broader life depth: agriculture/stewardship, social schedules/relationship life, companion breadth, earned automation, and perhaps later logistics breadth.

## Next work

**Do not automatically begin `0.8.500`.** This multi-segment work order closes at `0.8.400`. A new user work order should resync `main`, reread this handoff, and re-audit one bounded Phase 0.8 seam before implementation.

Strong candidate families:

- agriculture/stewardship;
- social schedules and relationship life;
- companion life breadth;
- earned automation;
- further logistics only if a concrete existing authority/data seam justifies it.

Do not mass-author extra bags, warehouses, farm systems, or automation merely to fill a numeric track.
