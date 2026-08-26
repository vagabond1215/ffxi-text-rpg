# Quality Gates

These repository-level gates supplement the current handoff, execution pipeline, and focused design authorities.

## Before implementation

- Refresh `main`, PR state, `docs/THREAD_HANDOFF.md`, and `docs/EXECUTION_PIPELINE.md`.
- Identify the authoritative state/data owner and production caller for the requested behavior.
- Read `docs/PERFORMANCE_BUDGET.md` and `docs/RESOURCE_LIFECYCLE.md` for performance/lifecycle-sensitive work.
- For Phase 0.9 content work, prove the relevant catalog/Pack v2 ownership and validation path exists **before** high-volume authoring or import.
- A roadmap packet is not authorization for later packets.

## Validation entry points

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
npm run hardening
npm run check
```

Ordinary local/hosted `Check` runs, in order:

```text
Repository Audit
Test
Content Census
Benchmark 3
Benchmark Sample
```

Census execution is a CI contract; census **target completion is not**. A mechanics-scale shortfall is roadmap/progression evidence and must not fail ordinary Check merely because the project has not authored enough content yet.

## Current baseline

```text
Product:       0.9.100.3
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          42
Benchmark:     3
Codename:      Elderwood Hunt-Timber
```

Frozen Elderwood implementation/content SHA `acb24b73b4894d3febab370aa279bdfd12cbd02e` passed hosted Check `32423676980` / job `96600958329` on Node 24.19.0 with **711/711 tests**, Content Census, Benchmark 3, and Benchmark Sample. Final exact promoted/documented PR-head validation remains required before merge.

## Persistence/lifecycle

Current mode remains strict pre-alpha current-schema-only.

- Account Save remains 5 unless account/session shape changes.
- Game State remains 14 unless a genuinely new durable player/world fact changes the serialized contract.
- Data changes do not automatically imply Game State changes.
- Required persisted authority validates before runtime normalization/revival.
- Active owner/task links remain coherent until owner reconciliation.
- Direct timed-task creation remains limited to audited domain owners.
- No blind global pruning, wall-clock canonical simulation, or duplicate state authority.

Elderwood Hunt-Timber adds **no persistence or lifecycle owner**. Tannery/woodshop work reuses production/work-task ownership; abilities reuse character capability/ability runtime authority; commitments reuse existing commitment/relationship/schedule authority. `npm run hardening` is therefore not required solely because this authored-data tranche grew, though it remains required for lifecycle-sensitive packets and phase/release gates.

## Content Pack v2 gate

Before high-volume canonical content enters a family, verify it has:

1. a canonical definition authority;
2. a Pack v2 ownership collection or an explicit reason it should not have one;
3. stable-ID collision detection;
4. cross-pack dependency enforcement;
5. dangling-reference validation;
6. legacy-ID boundary validation;
7. census behavior that counts real canonical breadth without double-counting catalog refs or fixtures;
8. representative scale-fixture coverage.

Current Pack v2 owns:

```text
places / routes / transportServices
ecologyFamilies / species / populations / gatheringSources
items / npcs / npcSchedules / shops
recipes / quests / relationships
spellSchools / capabilities / abilities / companions
```

`contentCatalogRegistry` bridges ownership to existing canonical catalogs. Packs must not copy canonical definitions solely to establish ownership metadata.

### Scale proof

`tests/contentPackValidator.test.js` contains a generated Pack v2 fixture with 1,401 ownership records:

```text
1 place
200 items
200 recipes
200 NPCs
200 schedules
200 capabilities
200 abilities
200 companions
```

Fixtures are validation data only and must never contribute to canonical content census counts.

### Redstone connected-content proof

`tests/playerRedstoneForgeRoadFlow.test.js` verifies the first real Pack-v2-owned regional graph: existing Redstone field inputs become provenance-bearing forge outputs, caravan hardware satisfies a provenance-qualified commitment exactly once, and a Redstone technique executes through existing character capability/ability authority. The old Varric copper continuity remained unchanged after a real integration conflict was repaired through authored contact placement.

### Elderwood connected-content proof

`tests/playerElderwoodHuntTimberFlow.test.js` verifies a second regional graph with different stresses:

- Barkboar recovery and forest gathering become provenance-bearing tannery/woodshop outputs through existing work authorities;
- wearable field gear and trail-repair stock are real inventory outputs, not log rewards;
- Oren Vale's roadworks availability is derived from canonical fictional time rather than a social clock;
- trail-repair bundles satisfy a provenance-qualified civic commitment exactly once;
- Barkboar Brace is character-owned and executes through the existing ability engine;
- Pack v2 ownership/dependencies and the default census remain valid.

The first Elderwood integration run found no product-behavior regression: its six failures were stale pack/count assertions caused by intentional content growth. Those assertions were updated without weakening validators or runtime behavior.

## Current content progression

```text
places/localities       26 / mechanics 10
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

Infrastructure coverage is separately visible:

```text
spell schools                            3
capability/training definitions         16
NPC schedules                            5
regional/shared packs                    9
pack-owned records                     171
pack-owned abilities/capabilities/
  schedules/companions              13/16/5/1
runtime seed NPCs                       14
runtime seed enemies                    13
```

Do not game counts with disconnected filler. Starfen Marshcraft-Practical Magic, when separately authorized, must demonstrate another connected graph across multiple families rather than a category-by-category dump.

## Performance

Benchmark 3 remains comparative evidence. No hard timing thresholds are accepted. Very fast attack/tick microbenchmarks remain noise-sensitive; do not derive CI pass/fail budgets from them without a separate evidence-backed decision.

## Definition of done

A bounded implementation is complete when:

- the production/data authority is coherent;
- focused/adversarial tests cover the changed boundary;
- relevant scale validation actually ran;
- Repository Audit + Test + Census + Benchmark 3 + Sample are green when material;
- persistence/lifecycle decisions are explicit;
- Product/Package/Data/Game State/Benchmark decisions are explicit and independent;
- the exact implementation SHA is frozen before docs synchronization;
- `docs/THREAD_HANDOFF.md` is the final repository-file write;
- the next independent packet is recorded but not silently started.

For the current work order, Elderwood Hunt-Timber is implemented and pre-promotion validation is green. Completion requires the synchronized exact-head Check and PR #384 landing; Starfen Marshcraft-Practical Magic is outside this work order.