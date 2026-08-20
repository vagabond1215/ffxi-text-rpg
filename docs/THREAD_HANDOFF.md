# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Required read order

1. `AGENTS.md`
2. this file
3. `docs/EXECUTION_PIPELINE.md`
4. `docs/DEVELOPMENT_DIRECTION.md`
5. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
6. `docs/ROADMAP.md`
7. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
8. `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md` when Phase 0.9 work is authorized
9. only the architecture/runtime/tests named by the next bounded action

If these checkpoints still match repository state, **do not restart a broad repository audit**.

## Current checkpoint

Phase 0.8 is complete. Phase 0.9 / `0.9.100 Content Scale Gate A` has been explicitly opened only far enough to complete the infrastructure-first **Content Pack Scale Contract v2** packet.

```text
Product:       0.9.100.1
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          40
Benchmark:     3
Codename:      Content Pack Scale Contract v2
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

Exact implementation/version checkpoint before documentation synchronization:

```text
739f88801ddd66587b6b45bdbd0784dff351c986
```

Architecture/documentation tip immediately before this handoff write:

```text
e0f820f9b5f739683ca71773a6017f7c3c8e4451
```

This handoff is the **final repository-file write** for the Pack v2 closure. GitHub-side validation and merge occur after this file write, so a future continuation must refresh `main` and PR #382 rather than assuming their final status from this document.

At handoff-write time:

```text
main:   a58001c95282b215a1ee939365fcab7b4e1bbb91
PR:     #382 open / mergeable
branch: feature/0.9.100-content-pack-v2
```

## What Pack v2 completed

The infrastructure packet intentionally scaled supporting architecture before authored data volume.

### Regional/shared ownership contract

Content packs can now own:

```text
places
routes
transportServices
ecologyFamilies
species
populations
gatheringSources
items
npcs
npcSchedules
shops
recipes
quests
relationships
spellSchools
capabilities
abilities
companions
```

Pack ownership is metadata/graph authority, **not duplicate gameplay state or a replacement domain catalog**.

### Canonical catalog bridge

`js/text/data/contentCatalogRegistry.js` resolves pack-owned references into existing canonical catalogs, including:

```text
resource / production / equipment items
production recipes/processes
commitments
seed NPCs
places / routes / transport / ecology
spell schools / capabilities / abilities
NPC schedules
companions
```

Do not copy canonical definitions into packs merely so a region can claim them.

### Validation boundary

Pack v2 validation now checks stable ownership, collisions, declared cross-pack dependencies, dangling catalog references, ability/capability/school links, NPC schedule links, companion/NPC/home/recruitment links, topology/source-sink/quest/relationship links, and legacy-boundary violations.

NPC schedule definitions also have structural validation for stable schedule identity, canonical fictional-time windows, overlap and required presentation fields.

### Scale proof

The generated Pack v2 fixture validates **1,401 owned records** across items, recipes, NPCs, schedules, capabilities, abilities and companions. It is validation-only and must never contribute to canonical content counts.

## Census / anti-filler result

Canonical gameplay breadth did not increase during the infrastructure packet:

```text
places/localities       26 / mechanics floor 10
named NPCs              12 / 50
shop/service sites      17 / 20
creatures               16 / 40
resource sources        13 / 40
canonical items         50 / 200
recipes/processes       11 / 75
abilities/techniques     5 / 100
quests/contracts         8 / 30
companions                1 / 4
transport services        3 / 5
```

Mechanics-scale gate remains **NOT READY**. This is correct.

Infrastructure coverage is now separately visible:

```text
routes:                                     7
spell schools:                              3
capabilities/training definitions:          8
NPC schedules:                              4
regional/shared content packs:              7
pack-owned records:                       115
pack-owned abilities/capabilities/
  schedules/companions:                 5/8/4/1
```

Do not convert these ownership counts into gameplay-content progress.

## Validation evidence already collected

Pre-promotion implementation Check:

```text
Check:              32402373472
Job:                96533356513
Node:               24.19.0
Repository Audit:   PASS
Tests:              704/704 passed
Content Census:     success
Benchmark 3:        success
Benchmark Sample:   success
```

This Check proved the Pack v2 runtime/validator/census/CI implementation before product/data promotion and documentation synchronization.

The hosted `Check` contract now runs:

```text
Repository Audit
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Census execution is required, but future target shortfalls remain progression evidence rather than ordinary CI failures.

## Version decisions

```text
Product      0.8.900.1 -> 0.9.100.1
Package      0.8.900   -> 0.9.100
Data         39        -> 40

Account Save 5         -> 5
Game State   14        -> 14
Benchmark    3         -> 3
```

Data 40 advances because stable content ownership/catalog-validation semantics changed.

Game State remains 14 because Pack v2 introduces no new durable player/world fact. No new simulation clock, direct timed-task owner, inventory authority, progression authority, persistence family or compatibility layer was added.

Focused system versions include:

```text
contentCatalogRegistry 0.1.0
contentPackSchema      0.2.0
regionalContentPacks   0.3.0
contentPackValidation  0.2.0
contentScaleGate       0.2.0
npcSchedules           0.3.0
```

## Closure operation after this handoff

PR #382's exact head containing this handoff must pass the promoted-version hosted `Check`. Merge only that exact green head into `main`.

Because those are GitHub-side operations after the final repository-file write, their exact final Check ID / merge SHA are intentionally not guessed here. Refresh them from GitHub before the next implementation pass.

## Next bounded unit

**Redstone Forge-Road is not started.**

It is the next proposed `0.9.100` content tranche only after Pack v2 closure is green and merged.

The intended graph is:

```text
named NPCs / mentors / services
  -> schedules / training / contracts
  -> creatures + mineral/resource sources
  -> raw materials
  -> processing / recipes
  -> tools / equipment / consumables
  -> techniques / capability access
  -> shops / wages / trade / transport
  -> field danger / recovery / provenance
```

Do not bulk-generate/import records and then retrofit connections. Author a dense connected regional tranche through Pack v2 and existing runtime catalogs.

## Authority decisions to preserve

- fictional simulation time remains separate from wall-clock scheduling;
- Game State 14 remains strict current-schema-only pre-alpha authority;
- content packs own regional/shared identity and dependencies, not gameplay state;
- canonical domain catalogs remain definition authorities;
- direct production timed-task owners remain the audited existing owner set;
- `state.npcs`, `state.enemies`, top-level `state.log`, root player combat/stat caches and `activeBattle.rng` remain derived/transient;
- `state.events` remains persisted semantic observation history;
- content-scale fixtures and ownership counts must not inflate canonical breadth;
- content-heavy packets must preserve sources, sinks, reachable references and cross-pack dependency integrity;
- roadmap sequencing does not authorize the next independent packet automatically.

## Deferred work — do not rediscover

- protected `main` / required Check policy remains a governance follow-up unless repository settings have changed;
- stale historical branch deletion remains manual cleanup debt;
- supported-save migrations remain deferred to a deliberate release-transition packet;
- dedicated browser E2E/accessibility remains proposed for `0.9.700`;
- hard performance thresholds remain deferred;
- balance certification remains deferred;
- quality/HQ crafting, mounts/warehouses/large logistics and deep romance remain later content/system decisions.

## Do not redo

Closed unless a concrete regression/change directly touches them:

```text
Phase 0.4–0.8 broad discovery
Phase 0.8 exit audit
post-0.8 status audit
late-0.8 persistence classification
Content Pack v2 ownership-gap discovery
catalog-bridge design
Pack v2 generated-scale proof
cultivation/delegation clock and ownership decisions
```

## Restart protocol

```text
1. refresh current main SHA
2. refresh PR #382 state / merge SHA if relevant
3. read this handoff and EXECUTION_PIPELINE
4. confirm Product 0.9.100.1 / Package 0.9.100 / Game State 14 / Data 40
5. confirm final Pack v2 Check on the exact merged or PR head
6. only then select/authorize the next bounded content packet
```
