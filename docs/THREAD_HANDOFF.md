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

Runtime first. After promotion, freeze runtime before documentation. Update this handoff last. For exact-head validation, marker-only draft PRs may be used when the connector can observe pull-request Check runs more reliably than push-triggered runs; never merge validation markers.

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
Product:       0.8.600.1
Package:       0.8.600
Account Save:  4
Game State:    5
Data:          36
Benchmark:     1
Codename:      Companion Convalescence
Compatibility: pre-release-current-schema
Released:      false
```

**Phases 0.4–0.7 are complete. Phase 0.8 is IN PROGRESS. Tracks `0.8.100` through `0.8.600` are complete and audited.**

## Authoritative promoted `0.8.600` runtime checkpoint

```text
04211e8909996b1ac34fa91ae1cdd7aa216b86f8
```

Observed promoted runtime evidence from Check run `32093184714`, job `95579323416`:

```text
tests       511
pass        511
fail        0
cancelled   0
skipped     0
todo        0
benchmark   success
Product     0.8.600.1
Package     0.8.600
Data        36
Account     4
Game State  5
Benchmark   1
```

Benchmark 1:

```text
1,000 player combat profiles      436.701ms  0.436701ms/op
1,000 enemy combat profiles       102.201ms  0.102201ms/op
1,000 basic attacks               519.382ms  0.519382ms/op
10,000 ticks / 5 subscribers       56.889ms  0.005689ms/op
10,000 direct route lookups      8100.376ms  0.810038ms/op
```

Promoted validation used marker-only draft PR #323 based exactly on `04211e8909996b1ac34fa91ae1cdd7aa216b86f8`. Its head added only an inert marker; Test and Benchmark completed successfully; PR #323 was closed without merging.

GitHub Actions project tests explicitly install Node 20.20.2. The recurring warning that `actions/checkout` / `actions/setup-node` may run under GitHub's newer action runtime remains warning-only.

## Current relevant registrations

```text
versionManifest:              0.8.600.1
projects:                     0.1.0
homeInfrastructure:           0.3.0
homeStorage:                  0.3.9
characterActivity:            0.3.0
activityAdvance:              0.5.0
campaignRecovery:             0.2.0
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
gameViewModels:               0.15.0
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
party:                        0.3.0
companions:                   0.2.0
```

Database registration relevant to the new track:

```text
party  implemented 0.3.0
```

The companion catalog/database remains `0.2.0`; `0.8.600` did not add or alter authored companion definitions.

## Stable closed history

Phase 0.7 remains closed at Product `0.7.400.1`. Its multi-region proof still covers the three origin communities, livelihood/production, danger/combat/recovery, acquired-knowledge readability, semantic transport/services/information, persistent companion preparation, character-POV presentation, and save/load. Later recovery/party revisions do not reopen the historical gate; historical assertions use compatible minimum versions for shared authorities.

Phase 0.8 closed tracks before the current one:

- `0.8.100`: Storage Chest home-storage proof; `0.8.100.2`: onboarding/creator polish.
- `0.8.200`: locality-bound Joiner's Workbench/home-production proof.
- `0.8.300`: canonical carried-load transport; checkpoint `4f8c0de9e6ba926ee903f5787d34cca73c40eb6d`, 507/507 tests.
- `0.8.400`: earned portable Field Satchel logistics; checkpoint `d1a43568c5ca4dd7e57fb86316b422c35025ce07`.
- `0.8.500`: Sera Talwin daily 08:00–18:00 public availability derived from fictional time; checkpoint `fde1d30d76264ea25af6bad4d829545c488eec9b`, 509/509 tests.

Do not reopen those tracks merely because later breadth is desirable.

## `0.8.600` — Companion Convalescence — complete

### Why this track

The next recommended seam was chosen by auditing existing Phase 0.8 authorities rather than by theme. A relationship-earned Mara tactic was rejected because Mara had no existing authored normal relationship-earning path; the track did not invent an affection grind.

The actual authority defect was stronger: `joinCompanion` correctly rejects a companion at 0 HP, while campaign recovery previously restored only active companions. A downed recruited companion left inactive could therefore become permanently unavailable.

### One recovery authority

`campaignRecoveryEngine.js` advances to `CAMPAIGN_RECOVERY_VERSION = 2` / registration `0.2.0` and remains the only recovery authority.

Recovery scope:

```text
field recovery
  -> player + active companions

defeat recovery
  -> player + active companions

settlement recovery
  -> player
  -> active companions
  -> inactive recruited companions physically present in the current safe settlement
```

Settlement rest still uses the existing `recovery.settlement` timed task and costs exactly 3600 canonical fictional seconds. There is no passive wall-clock recovery, companion-healing timer, second HP registry, recovery currency, or new task kind.

The recovery model exposes `playerInjured`, `injuredCompanionCount`, and local companion recovery entries. A healthy player may therefore rest because a nearby companion is hurt. Recovery events record companion before/after resource snapshots.

### Party safety and explicit reunion

`partyEngine` registration advances to `0.3.0`; `PARTY_STATE_VERSION` remains 1.

- A 0-HP inactive companion still cannot `joinCompanion` until recovered.
- A downed companion may be left in a safe settlement.
- A downed companion may not be left behind in unsafe wilderness; `leaveCompanion` returns `party.downed-in-danger` before membership/location mutation.
- Settlement recovery restores HP/MP but does not silently reactivate the companion. Reunion remains an explicit `party.join` action.

This keeps recovery and party membership separate authorities.

### Safe-locality classification

A first implementation imported `isSettlementLocality` from `localityEngine` into `partyEngine`, which would have created a `partyEngine <-> localityEngine` import cycle because locality already synchronizes active party location.

Closure audit extracted `js/text/systems/localityClassificationEngine.js`, containing the dependency-light `SETTLEMENT_LOCALITY_TYPES` and `isSettlementLocality` predicate. `localityEngine` re-exports those symbols, preserving its public API. `partyEngine` imports the classifier directly. `localityNavigation` stays `0.2.0` because the player-facing locality contract did not change.

### Browser alignment

`gameViewModel` advances to `0.15.0`. An inactive companion at the current place receives **Travel together** only when HP > 0. While Mara is downed, the Character view still shows her persisted state but does not advertise an action that party authority will reject. After settlement recovery, the action reappears.

### End-to-end proof

Primary guard: `tests/playerCompanionRecoveryFlow.test.js`.

It proves:

```text
Mara downed
  -> move to Thornwall Southgate
  -> safe Part ways succeeds
  -> Mara stays recruited/in Southgate
  -> immediate reunion blocked at 0 HP
  -> Character view has no dead Travel together action

player is fully healthy
  -> settlement recovery still available because local inactive Mara is injured
  -> start Rest in safety
  -> advance active activity to completion
  -> exactly 3600 fictional seconds pass
  -> Mara reaches full HP/MP
  -> Mara remains inactive
  -> Travel together reappears
  -> explicit reunion succeeds
  -> save/load preserves recovered active companion
  -> game validation succeeds

West Elderwood
  -> downed Mara cannot be left behind
  -> membership/location remain unchanged
  -> game validation succeeds
```

### Version decision

```text
Product:       0.8.600.1
Package:       0.8.600
Account Save:  4
Game State:    5
Data:          36
Benchmark:     1
Codename:      Companion Convalescence
```

Data remains 36 because no authored gameplay catalog changed. Game State remains 5 because the track reuses existing companion resources/location/membership and existing recovery task records. Account Save and Benchmark remain unchanged.

### Validation trail

First behavioral pre-promotion Check passed 511/511. During closure audit, the party/locality import cycle and dead browser reunion action were identified and repaired before promotion.

Cleaned pre-promotion runtime head `24fabe21699bd3bc441812a721b80dca4ca038c8` passed 511/511 tests and Benchmark 1 through marker-only PR #322; the PR was closed unmerged.

One inert validation marker was accidentally written to `main` before its validation branch existed and was immediately removed. It never became runtime content and is absent from the current tree.

After promotion, exact runtime head `04211e8909996b1ac34fa91ae1cdd7aa216b86f8` passed the authoritative 511/511 + Benchmark gate through marker-only PR #323. Runtime froze there before documentation.

### Closure audit

**PASS. `0.8.600` is closed.** Companion injury now creates a real safety/recovery/reunion decision through existing fictional time, recovery tasks, HP, place, and party state. Settlement recovery can restore a nearby inactive companion without silently changing membership; unsafe abandonment is blocked; browser and domain availability agree; save/load is deterministic; and no parallel recovery system was added.

## Stable authority boundaries to preserve

- one fictional-time/task/interrupt substrate;
- campaign recovery as the single player/party recovery authority;
- settlement recovery may include inactive recruited companions physically present there, but field/defeat recovery remain active-party scoped;
- recovery never silently changes active party membership;
- downed companion separation is safe-locality constrained by party authority;
- one dependency-light safe-settlement classification shared by locality and party, not duplicate predicates;
- generic projects as shared material + labor + completion substrate;
- continuous-character ownership of stats/capabilities/work mastery;
- semantic browser intents as normal player actions;
- acquired-knowledge privacy for maps/routes/resources/contacts/search;
- provenance and one-time source/sink ownership;
- commitments separate from relationships and both separate from Journal projection;
- NPC schedules as authored recurring availability evaluated against canonical fictional time, never a second clock/state registry;
- schedule-gated interaction enforced below presentation so command/UI paths cannot bypass it;
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
- `gameViewModel.transportBoardAction` still includes historical `cargoUnits: 0` even though transport authority ignores caller cargo since `0.8.300`;
- schedule catalog validation is subsystem-owned/directly tested rather than duplicated inside global `validateWorldData`;
- the first schedule models static-location availability only; multi-location NPC movement remains future design work;
- no passive/offline companion healing or autonomous companion routine exists, deliberately;
- no manual visual/browser walkthrough is claimed for `0.8.600`; automated semantic/browser-model coverage is authoritative for this track;
- recurring GitHub action-runtime Node warning remains warning-only;
- Phase 0.8 still needs broader life depth such as agriculture/stewardship, earned automation, or another carefully bounded companion/social/life seam.

## Next work

**Do not automatically begin `0.8.700`.** This work order closes at `0.8.600`. A new user work order should resync `main`, reread this handoff, and audit one bounded Phase 0.8 seam before implementation.

Strong candidate families:

- agriculture/stewardship;
- earned automation;
- further companion or social-life breadth only when a concrete player decision and existing authority path justify it;
- another life/logistics segment only if a specific current seam warrants it.

Do not mass-author farms, passive companion timers, schedules, routines, warehouses, or automation merely to fill a numeric track.
