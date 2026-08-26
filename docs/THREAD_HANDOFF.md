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

Phase 0.8 is complete. Phase 0.9 / `0.9.100 Content Scale Gate A` is in progress. Content Pack Scale Contract v2 and Redstone Forge-Road are merged. The second authored regional tranche — **Elderwood Hunt-Timber** — is implemented, validated on its frozen implementation/data head, promoted to the `0.9.100.3` / Data 42 contract, and fully synchronized across repository documentation/profile. Only the final exact-head hosted Check + PR landing remain.

```text
Product:       0.9.100.3
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          42
Benchmark:     3
Codename:      Elderwood Hunt-Timber
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

### Repository state immediately before this final handoff write

```text
main:            9c64982a8cad549eb710fbc23680ce3c81798ddd
main protected:  false
PR:              #384 open / draft / mergeable
branch:          feature/0.9.100-elderwood-hunt-timber
pre-handoff tip: a8749d2ada8866423b2b05ab90fd36e08d1f4d60
```

GitHub-side final validation/readiness/merge occur after this write. If a future thread resumes before/after those operations, refresh PR #384 and `main` instead of guessing final status from this document.

This handoff is the **final repository-file write** for the packet. Do not change repository files merely to record the resulting final Check or merge SHA; those GitHub-side facts belong in chat/PR state and can be refreshed by the next thread.

## Frozen implementation/content checkpoint

The exact gameplay/content implementation freeze is:

```text
acb24b73b4894d3febab370aa279bdfd12cbd02e
```

No gameplay/content behavior was changed after this SHA. Later commits only promoted version/system metadata, updated version/count assertions, restored/synchronized repository documentation, and updated the project profile.

Pre-promotion hosted evidence on the frozen implementation SHA:

```text
Check:              32423676980
Job:                96600958329
Node:               24.19.0
Repository Audit:   PASS
Tests:              711/711 passed
Content Census:     success
Benchmark 3:        success
Benchmark Sample:   success
```

The first Elderwood integration run had six failures. All six were stale count/index expectations caused by intentional pack/catalog growth; the Elderwood production/provenance, civic delivery, schedule, and ability behavior already passed. Those assertions were updated narrowly without weakening validators or gameplay behavior.

During test-assertion maintenance, one partial-file replacement briefly truncated `tests/abilityEngine.test.js`; it was detected before the green implementation Check and fully restored from the complete file with only the intended count change. A transient empty `__noop__` file created during early PR preparation was also immediately removed. Neither artifact is present in the final branch tree or part of the frozen implementation behavior.

During the later documentation promotion, README, execution pipeline, and roadmap were found to have been shortened by the same partial-read replacement hazard. They were restored to their full operating structure and then synchronized to Elderwood before this final handoff write.

## What Elderwood Hunt-Timber implements

The tranche deliberately deepens existing Thornwall/Elderwood authorities instead of bulk-generating disconnected records.

```text
existing Barkboar recovery / Duskcap / amber resin / hardwood
  -> existing inventory + provenance
  -> existing tannery / woodshop / production / work-task / work-proficiency authority
  -> tanned hide / bindings / resin boards + pitch
  -> forester gloves / hunter bracer / trail-repair bundles
  -> persistent Thornwall service contacts + Oren roadworks schedule
  -> provenance-qualified civic/community commitments
  -> character-owned Elderwood techniques/warding
  -> Pack v2 regional ownership
```

Implemented content:

- four character-owned Elderwood capabilities and four executable abilities using the existing ability engine;
- six downstream Elderwood production outputs and six production processes connected to existing Barkboar recovery, Duskcap, amber resin, hardwood, station, work, inventory and provenance authorities;
- three existing POI people promoted to persistent NPC-backed contacts;
- Oren Vale on an authored **07:00–15:00** recurring roadworks window derived from canonical fictional time;
- three provenance-qualified Thornwall commitments consuming real Elderwood production output;
- `pack-elderwood-hunt-timber`, depending on:
  - `pack-shared-foundation`
  - `pack-elderwood-opening`
  - `pack-elderwood-ecology-breadth`
- `tests/playerElderwoodHuntTimberFlow.test.js` proving Pack v2 ownership, production/provenance, exactly-once civic consumption/reward behavior, schedule derivation, census growth, and real Barkboar Brace execution.

No new simulation clock, persistence family, direct timed-task owner, inventory authority, progression meter, social state family, place, companion system, or bulk import/generation was introduced.

## Version decisions

```text
Product       0.9.100.2 -> 0.9.100.3
Package       0.9.100   -> 0.9.100
Data          41        -> 42
Game State    14        -> 14
Account Save  5         -> 5
Benchmark     3         -> 3
```

### Why Data 42

Data 42 adds stable canonical authored capabilities/abilities, production items/processes, persistent NPCs, one authored schedule, commitments, and their source/sink/social/schedule/Pack-v2 relationships.

### Why Game State remains 14

The tranche reuses existing character capability/ability, production/work, inventory/provenance, commitment/relationship/schedule, canonical NPC projection, and fictional-time authorities. It adds no new durable player/world fact.

Current promoted system/catalog bookkeeping includes:

```text
versionManifest       0.9.100.3
commitments           0.6.0
npcSchedules          0.3.0
productionCatalog     0.4.0
productionItems       0.6.0
regionalContentPacks  0.5.0
capabilities          0.4.0
abilityCatalog        0.3.0
```

`npcSchedules` remains 0.3.0 because only authored schedule data grew; schedule schema/runtime behavior did not change.

## Current content census

Validated canonical gameplay breadth:

```text
places/localities       26 / mechanics floor 10
named NPCs              15 / 50
shop/service sites      17 / 20
creatures               16 / 40
resource sources        13 / 40
canonical items         62 / 200
recipes/processes       23 / 75
abilities/techniques    13 / 100
quests/contracts        14 / 30
companions                1 / 4
transport services        3 / 5
```

Supplemental infrastructure coverage:

```text
routes                                   7
spell schools                            3
capabilities/training definitions       16
NPC schedules                            5
regional/shared content packs            9
pack-owned records                     171
pack-owned abilities/capabilities/
  schedules/companions              13/16/5/1
runtime seed NPCs                       14
runtime seed enemies                    13
```

Mechanics-scale gate remains **NOT READY**. This is correct progression evidence, not a CI failure. Abilities/techniques remain the largest relative gap. Generated fixtures and catalog refs must not be counted as canonical gameplay breadth.

## Benchmark 3 evidence

The frozen implementation Check `32423676980` reported:

```text
single run
player combat profiles  0.385203 ms/op
enemy combat profiles   0.076660 ms/op
basic attacks            0.003461 ms/op
tick dispatch            0.000827 ms/op
direct route lookup      0.007519 ms/op

three-sample medians/spreads
player profiles          0.363494 ms/op    6.41%
enemy profiles           0.069119 ms/op   12.38%
basic attacks            0.001282 ms/op  177.11%
tick dispatch            0.000879 ms/op   28.27%
route lookup             0.007145 ms/op    9.38%
```

No hard performance threshold is accepted. Benchmark protocol remains 3.

## Closure operation after this handoff

1. Refresh PR #384 and record the exact head produced by this handoff write.
2. Ignore intermediate CI runs from earlier branch heads.
3. Require hosted `Check` on the **exact final handoff head** to pass:
   - Repository Audit
   - full test suite
   - Content Census
   - Benchmark 3
   - Benchmark Sample
4. Confirm census remains the same.
5. If PR #384 is still draft, mark it ready for review.
6. Merge only the exact green head into `main`, using expected-head protection.
7. Refresh `main` and verify the Elderwood changes landed.
8. Stop. Do **not** begin Starfen Marshcraft-Practical Magic automatically.

No repository file should be changed after this handoff write merely to record the final Check or merge SHA.

## Next bounded unit

**Starfen Marshcraft-Practical Magic — NOT STARTED.**

It is the next proposed Gate A authored tranche only after Elderwood lands and after a new explicit user continuation.

Preferred connected graph:

```text
named people / schedules / canal and research needs
  -> wetland herbs / fungi / water-context resources
  -> medicine / cooking / marshcraft transformations
  -> practical magic and training access
  -> equipment / consumables / preparation choices
  -> community / research contracts and relationships
  -> field danger / recovery / provenance
```

Do not start with a global NPC/item/ability quota dump. Places should not be added merely for count because the place mechanics floor is already exceeded. A companion candidate is appropriate only if an authored person warrants recruitment; companion count is not a quota.

After Starfen comes Gate A integration/census review.

## Authority decisions to preserve

- canonical fictional simulation time remains separate from wall-clock scheduling;
- Game State 14 remains strict current-schema-only pre-alpha authority;
- content packs own regional/shared identity/dependencies, not gameplay state;
- canonical domain catalogs remain definition authorities;
- generated scale fixtures and Pack ownership counts do not inflate canonical breadth;
- direct timed-task creators remain the existing audited owner set; Elderwood adds none;
- production uses existing work/task/proficiency/station/inventory/provenance ownership;
- capabilities remain character-owned and executable abilities use the existing ability engine;
- commitments/relationships/NPC schedules remain existing social authorities;
- `state.npcs`, `state.enemies`, top-level `state.log`, root combat/stat caches and active-battle RNG remain derived/transient as previously classified;
- `state.events` remains persisted structured semantic observation history;
- roadmap sequencing does not authorize the next independent packet automatically.

## Deferred work — do not rediscover

- protected `main` / required Check remains recommended governance work; current `main` is unprotected;
- stale historical remote branch deletion remains manual cleanup debt where no safe delete action exists;
- supported-save migrations remain deferred to the deliberate `0.9.800` transition;
- browser E2E/accessibility remains `0.9.700`;
- hard performance thresholds remain deferred;
- balance certification remains deferred;
- quality/HQ crafting, mounts/warehouses/large logistics and deep romance remain later decisions.

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
Redstone Forge-Road substrate and Varric/Mae continuity diagnosis
Elderwood Hunt-Timber substrate discovery
Elderwood count/index integration diagnosis
cultivation/delegation clock and ownership decisions
```

## Restart protocol

```text
1. refresh current main SHA
2. refresh PR #384 state / final Check / merge state if relevant
3. read this handoff and EXECUTION_PIPELINE
4. confirm Product 0.9.100.3 / Package 0.9.100 / Game State 14 / Data 42
5. confirm the exact final Elderwood PR head was green and landed
6. only then select/authorize Starfen Marshcraft-Practical Magic
```
