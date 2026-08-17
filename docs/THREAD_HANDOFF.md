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
8. `docs/ARCHITECTURE.md`, `docs/LOCALITY_AND_EXPLORATION_MODEL.md`, `docs/QUALITY_GATES.md`, `docs/PERFORMANCE_BUDGET.md`, `docs/RESOURCE_LIFECYCLE.md`, `js/text/version.js`, and the systems/tests relevant to the next bounded work order.

## Workflow and pre-alpha policy

Work directly on `main` by default. Treat each prompt as a bounded work order and stop at a coherent checkpoint.

Hearth & Horizon is pre-alpha. Old local saves/accounts are not a design constraint. Prefer one clean current schema and one clear authority over compatibility-only migrations, duplicate fields, or adapter layers. This never relaxes determinism, validation, provenance, one-time ownership, content originality, acquired-knowledge privacy, or test discipline.

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

Maps/campaign guidance represent acquired character knowledge. Fictional time is separate from wall-clock scheduling. Resources retain provenance. Companions are persistent NPC-backed people. Commitments/relationships are canonical state; Journal/readability/service/information/home models are derived presentation.

Ordinary player-facing information should describe what the character **sees, knows, carries, remembers, needs, or can decide**. Architecture, compatibility, raw state/task channels, hidden topology, and implementation rationale stay outside normal play.

## Current baseline

```text
Product:       0.8.200.1
Package:       0.8.200
Account Save:  4
Game State:    5
Data:          34
Benchmark:     1
Codename:      Home Workshop Capability
Compatibility: pre-release-current-schema
Released:      false
```

**Phases 0.4, 0.5, 0.6, and 0.7 are complete. Phase 0.8 is IN PROGRESS. `0.8.100` and `0.8.200` are complete and audited.**

Authoritative promoted `0.8.200` runtime checkpoint:

```text
03ab71c7e96c54eaeffb75598ed01243fd390f21
Synchronize pipeline manifest with 0.8.200
```

At that checkpoint:

```text
tests       506
pass        506
fail        0
skipped     0
benchmark   success
Product     0.8.200.1
Package     0.8.200
Data        34
```

Benchmark 1:

```text
1,000 player combat profiles      465.527ms  0.465527ms/op
1,000 enemy combat profiles       117.252ms  0.117252ms/op
1,000 basic attacks               550.132ms  0.550132ms/op
10,000 ticks / 5 subscribers       44.971ms  0.004497ms/op
10,000 direct route lookups      8708.613ms  0.870861ms/op
```

Exact promoted runtime Check run: `32046733161` — SUCCESS. Project tests explicitly install Node 20.20.2. The recurring GitHub Actions warning about `actions/checkout` / `actions/setup-node` being forced to the newer action runtime remains warning-only.

The documentation commits after that runtime checkpoint synchronize roadmap, architecture, versioning, player-experience path, and this handoff. Verify the final documentation head's exact Check and Pages runs before new implementation if they are not recorded in the conversation that created this handoff.

## Current relevant registrations

```text
versionManifest:              0.8.200.1
projects:                     0.1.0
homeInfrastructure:           0.2.0
homeStorage:                  0.3.9
characterActivity:            0.3.0
activityAdvance:              0.4.0
workstations:                 0.3.0
productionItems:              0.3.0
production:                   0.1.0
settlementServiceBoard:       0.2.0
gameViewModels:               0.13.0
uiIntents:                    0.10.0
validation:                   0.10.0
commitments:                  0.2.0
relationships:                0.1.0
dayCycle:                     0.2.0
resourceRecoveryWork:         0.3.0
transport:                    0.2.0
transportServiceBoard:        0.1.0
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

Database registrations relevant to the current track:

```text
homeInfrastructure  implemented 0.2.0
workstations        implemented 0.2.0
productionItems     seeded      0.2.0
```

Subsystem versions and database versions are independent contracts.

## Stable Phase 0.7 baseline remains closed

The multi-region playable-alpha proof remains canonical:

- Thornwall / Sera Talwin / Elderwood — `Sweetroot for Southgate`;
- Brasshaven / Marshal Varric Stone / Redstone — `Copper for the Ring`;
- Mistmere / Reader Soli Venn / Starfen — `Marrowleaf for the Ward`;
- semantic scheduled transport connects the proving communities;
- settlement return offers real work/trade/recovery/preparation/social decisions;
- acquired/current information and maps preserve hidden-topology privacy;
- danger/combat/body recovery/defeat return to the same campaign;
- Mara Venn remains one persistent NPC-backed companion with a real pre-battle field-approach choice;
- primary browser surfaces follow the character-POV presentation boundary.

Do not reopen Phase 0.7 merely because later breadth is desirable.

## `0.8.100` — Home Foothold & Infrastructure — complete

The first authored improvement is **Build a Storage Chest**:

```text
2 Resin-Sealed Hardwood Boards
1 Redstone Copper Ingot
30 minutes project labor
  -> Storage Chest furnishing
  -> home storage 3 -> 8 slots
```

Generic projects own material/labor/status; inventory owns material removal and storage; world time/timed tasks own duration; furnishings own the durable capacity benefit; the Journal is derived presentation.

Original runtime checkpoint:

```text
0b9251a43285443087050127da36b977cabdf7ee
496/496 tests
Benchmark 1 success
Product 0.8.100.1
Data 32
```

## `0.8.100.2` — Onboarding and character creation polish — complete

This revision added deliberate Light/Dark themes, corrupt-character deletion and local-data recovery, original-world creator randomization, truthful six-discipline previews with real carried starter kits, and distinct authored Thornwall/Brasshaven/Mistmere opening scenes.

Promoted runtime checkpoint:

```text
0f00ef68a01ad001063803d67ff0efffc48ab3ef
505/505 tests
Benchmark 1 success
Product 0.8.100.2
Data 33
```

Known non-blocking seams from that revision remain:

- legacy prompt/fast-create uses neutral generic new-game creation and does not receive the semantic creator's starter kit;
- historical account-settings normalization can still accept `highContrast`, while active browser UI exposes only Light/Dark;
- no manual visual/browser walkthrough was claimed.

Do not repair these by introducing universal starter inventory or another settings authority.

## `0.8.200` — Home Workshop Capability — complete

### Bounded player proof

The new authored improvement is **Build a Joiner's Workbench**:

```text
2 Resin-Sealed Hardwood Boards
1 Copper Trail Clasp
45 minutes canonical project labor
  -> Joiner's Workbench furnishing
  -> woodshop + workshop station context at home
```

The workbench has **0 storage slots**. It grants capability, not hidden capacity.

`workstationEngine` now derives station tags from two sources under one authority:

1. current contextual settlement POIs/services;
2. placed workstation-bearing furnishings, but only while `currentPlaceId` equals the character's home place.

The Joiner's Workbench carries `workbench` + `woodshop` furnishing tags and therefore produces `workshop` + `woodshop` semantic station tags at home. Away from home it contributes nothing.

### Existing production loop enabled at home

The track intentionally reuses the existing `craft-elderwood-resin-board` recipe rather than authoring a parallel home recipe:

```text
Seal Elderwood Hardwood Board
  1 Elderwood Hardwood
  1 Elderwood Amber Resin
  requires woodshop
  240 fictional seconds at proficiency 0
  +2 crafting proficiency
    -> 1 Resin-Sealed Hardwood Board
```

Before the workbench is built, this recipe is blocked at the Thornwall home by the woodshop requirement. After completion, `productionEngine` sees the derived home `woodshop` context and the existing **Work, Trade & Recover** surface exposes the real recipe through semantic `production.start`.

`productionEngine` still owns requirements, atomic input consumption, timed work, output storage, transformation/input/place provenance, and persistent crafting proficiency.

### End-to-end proof

`tests/playerHomeWorkshopFlow.test.js` proves:

- both home improvements remain visible and independently stateful;
- the workbench recipe is blocked before construction;
- 2 boards + 1 clasp are consumed exactly once through project contribution;
- a 45-minute active build survives real account save/load;
- canonical activity advance completes project labor;
- exactly one workbench furnishing is placed;
- storage capacity remains unchanged at 3 when only the workbench is added;
- home station tags become woodshop/workshop;
- repeated reconciliation cannot duplicate the furnishing;
- the existing resin-board process becomes ready at home;
- Work, Trade & Recover discovers it through the ordinary service board;
- production consumes hardwood/resin and 240 fictional seconds;
- output has canonical transformation/input/place provenance;
- crafting proficiency gains +2;
- final world time, furnishing, product, and mastery survive another real save/load;
- home/game validation and player-facing HTML hygiene remain clean.

### Resource-lifecycle audit

Infrastructure-consumed goods now advertise their real construction sinks:

```text
Resin-Sealed Hardwood Board  -> construction
Redstone Copper Ingot        -> construction
Copper Trail Clasp           -> construction
```

This is descriptive authored metadata. Actual consumption remains project/inventory authority.

### Integration repair trail

First functional Check head `9e788412...` ran the new loop successfully but exposed a stale Phase 0.7 test that expected `settlementServiceBoard` to remain exactly version 1. The historical gate was repaired to assert minimum compatible versions for shared systems so later Phase 0.8 evolution does not reopen Phase 0.7.

Pre-promotion head `283e00fa...` then passed 506/506 tests plus Benchmark 1.

The first promoted head `f2b57ec4...` failed only because `tests/pipeline.test.js` still pinned Product `0.8.100.2`, Data 33, and old subsystem/database registrations. The release-contract test was synchronized without weakening persistence or legacy-boundary assertions.

Authoritative promoted runtime checkpoint is therefore:

```text
03ab71c7e96c54eaeffb75598ed01243fd390f21
506/506 tests
0 failed
0 skipped
Benchmark 1 success
Check run 32046733161 SUCCESS
```

### `0.8.200` closure audit

**PASS.** The workbench is locality-honest, grants no hidden storage, applies exactly once, survives save/load, feeds the existing workstation and production authorities, preserves provenance/mastery, and is available through ordinary semantic browser play. `0.8.100` and all historical Phase 0.7 regressions remain green.

## Stable authority boundaries to preserve

- one fictional-time/task/interrupt substrate;
- generic projects as shared material + labor + completion substrate;
- continuous-character ownership of stats/capabilities/work mastery;
- semantic browser intents as normal player actions;
- command routes as optional power/diagnostic surfaces;
- acquired-knowledge privacy for maps/routes/resources/contacts/search;
- safe settlements intentionally omitting wilderness D-pad/minimap controls;
- provenance and one-time source/sink ownership;
- battle progression rewards separate from physical body recovery;
- commitments separate from relationships and both separate from Journal projection;
- scheduled transport owning fare/cadence/cargo/departure/arrival;
- service/information/onboarding/home views as projections/adapters only;
- `workstationEngine` as the single semantic workstation-context authority;
- `productionEngine` owning recipes, station requirements, work, inputs, outputs, provenance, and mastery;
- shop engine owning actual transactions and wallet changes;
- persistent NPC-backed companions with party/battle/travel responsibilities kept separate;
- furnishings/inventory owning placed objects and actual home-storage capacity;
- creator starter gear entering through canonical inventory, not UI-owned loadout state;
- save recovery mutating the existing account registry, not raw storage in the UI;
- content-pack/cross-reference validation;
- clean current pre-alpha schema over compatibility-only debt.

## Known non-blocking debt

- internal `mogHouse` remains legacy terminology; player-facing copy is already original/generic;
- legacy prompt/fast-create creator bypasses the semantic creator starter-kit flag;
- account settings still normalize historical `highContrast`, while active UI offers only Light/Dark;
- broader agriculture/logistics/social schedules/companion breadth/earned automation remain future Phase 0.8 work;
- original currency terminology is still deferred;
- recurring GitHub action-runtime Node warning remains warning-only.

## Next work

**Do not automatically launch another Phase 0.8 track from this handoff.** `0.8.200` is closed. A new user work order should select one bounded life/infrastructure seam and audit the existing authority/data path before implementation.

Good candidate tracks now include:

- agriculture/stewardship;
- logistics/warehousing/transport capacity;
- social schedules and relationship life;
- companion life breadth;
- earned automation.

Do not mass-author additional workshop types or property tiers merely because the first home workstation now exists.
