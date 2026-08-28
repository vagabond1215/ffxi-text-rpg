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

Repository evidence beats conversation memory. If this checkpoint matches repository state, do not restart broad historical discovery.

## Current checkpoint

Phase 0.8 is complete. Phase 0.9 / `0.9.100 Content Scale Gate A` remains in progress.

Gate A Packets A–D are merged:

- Content Pack Scale Contract v2
- Redstone Forge-Road
- Elderwood Hunt-Timber
- Universal Magic & Starfen Marshcraft

The separately authorized **Location & Area Profiles** supporting-data pass is implemented, validated, promoted to Product `0.9.100.5` / Data `44`, and synchronized across repository authorities. Only the final exact-head hosted Check + PR #386 landing remain after this handoff write.

```text
Product:       0.9.100.5
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          44
Benchmark:     3
Codename:      Location & Area Profiles
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

### Repository state immediately before this final handoff write

```text
main:            59e3fadfb180cc51d899a73a561fa0f126155729
main protected:  false
PR:              #386 open / draft / mergeable
branch:          feature/0.9.100-location-area-profiles
```

GitHub-side final validation/readiness/merge occur after this write. Refresh PR #386 and `main` rather than inferring their final state from this pre-merge handoff.

This handoff is the **final repository-file write for the Location & Area Profiles pass**. Do not modify repository files merely to record the resulting final Check or merge SHA.

## Frozen implementation/data checkpoint

The exact implementation/data freeze before version/document synchronization is:

```text
ba156a416026835ccc483b8644d134a8d3d062d9
```

Pre-promotion hosted evidence:

```text
Check:              33149570962
Job:                98778174178
Node:               24.19.0
Repository Audit:   PASS
Tests:              725/725 passed
Content Census:     success
Benchmark 3:        success
Benchmark Sample:   success
```

No location-profile behavior/data changed after that SHA. Later commits promote version metadata and synchronize profile/roadmap/architecture/quality authorities.

## Location-profile contract

`js/text/data/locationProfileCatalog.js` is a derived world-information catalog. It does **not** replace `places.js` or `ecologyRegistry.js`.

Current coverage:

```text
canonical place profiles    26 / 26
settlement profiles          5
regional profiles            3
profile catalog version      1
```

Settlement profiles:

- Thornwall
- Timbercross Landing
- Redfang Camp
- Brasshaven
- Mistmere

Regional profiles:

- Elderwood
- Redstone Reach
- Starfen

### Population semantics

Population is authored at the place-profile level only:

```text
resident population
+ typical transient/workforce presence
= typical present population
```

Settlement totals sum member-place values. Region totals sum all place profiles in the region. The modeled-world total sums all 26 place profiles.

```text
Area              Residents   Typical present
Elderwood            33,175            41,168
Redstone Reach       30,080            40,320
Starfen              29,530            37,990
------------------------------------------------
Modeled world        92,785           119,478
Typical transient    26,693
```

These are authored **pre-alpha demographic estimates**, not ecological encounter capacities and not persisted simulation state.

### Biome and ecology semantics

Every place has:

- one primary biome description;
- explicit biome tags;
- settlement membership/role when applicable;
- resident/transient demographic estimates;
- local ecology projection;
- regional representative ecology context.

Ecology is resolved from existing canonical authority:

```text
ecologyRegistry species/populations/gathering sources
+ place spawn definitions
-> local flora/fauna/fishing/other-creature projection
```

Coverage is explicitly classified:

- `local-canonical`
- `regional-context-only`
- `not-yet-modeled`

Humanoid raiders and plantoids are reported as **other creatures**, not mislabeled as fauna.

Missing ecology is not filled with invented records. Redstone Reach currently has **no canonical flora gathering sources**, so its profile honestly exposes that gap.

### Reporting

```bash
npm run profiles:locations
npm run profiles:locations -- --json
```

The text report includes every region and every place; JSON exposes places, settlements, and regions structurally.

## Authority boundaries

- Place identity/topology: `js/text/data/places.js`
- Species/populations/gathering sources: `js/text/data/ecologyRegistry.js`
- Demographic + biome profile metadata and derived aggregates: `js/text/data/locationProfileCatalog.js`
- Player/world persisted state: unchanged Game State 14

Do not move place identity or ecology definitions into the profile catalog. Do not treat demographic profile estimates as ecological population capacity or runtime NPC instances.

## Version decision

```text
Product       0.9.100.4 -> 0.9.100.5
Package       0.9.100   -> 0.9.100
Data          43        -> 44
Game State    14        -> 14
Account Save  5         -> 5
Benchmark     3         -> 3
```

Data 44 is justified by canonical authored biome/demographic metadata plus the stable derived location/settlement/region profile contract.

Game State remains 14 because no durable player/world fact, save field, simulation clock, task owner, inventory authority, progression state, or social state was introduced.

## Validation contract

Ordinary hosted Check remains:

```text
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Focused guard: `tests/locationProfileCatalog.test.js`.

Census target completion remains progression evidence, not ordinary CI pass/fail. Benchmark 3 thresholds remain unaccepted.

## Immediate next bounded work

**Packet E — Gate A integration/census audit remains queued and not started.**

The location-profile work does not authorize Packet E automatically. If separately authorized, Packet E should review combined Gate A connectedness, current census gaps, ecology/profile gaps, and validation evidence rather than manufacture filler.

## Governance

Phase 0.9 work uses PR-based integration and exact-head hosted validation. Main remains unprotected because the available connector cannot safely mutate branch-protection policy. Stale remote branch cleanup remains manual administrative debt.

Do not auto-start a later roadmap unit without explicit authorization.
