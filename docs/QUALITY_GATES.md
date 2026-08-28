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
Product:       0.9.100.9
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          48
Benchmark:     3
Codename:      Great Mere Freshwater Economy & Food Safety
```

The Data 45 ecology/geography audit passed hosted Check #1266 / run `33188833540` with **728/728 tests**, Content Census, Benchmark 3, and Benchmark Sample. Check #1267 / run `33189086957` also passed after the final reciprocal Crownward forest-gate repair; PR #390 later merged and its post-merge main gate remained green.

## Persistence/lifecycle

Current mode remains strict pre-alpha current-schema-only.

- Account Save remains 5 unless account/session shape changes.
- Game State remains 14 unless a genuinely new durable player/world fact changes the serialized contract.
- Data changes do not automatically imply Game State changes.
- Required persisted authority validates before runtime normalization/revival.
- Active owner/task links remain coherent until owner reconciliation.
- Direct timed-task creation remains limited to audited domain owners.
- No blind global pruning, wall-clock canonical simulation, or duplicate state authority.

Data 48 adds **no persistence or lifecycle owner**. Great Mere and item-consumption safety reuse route/transport, ecology/gathering, inventory/provenance, production/work, workstation, player-information, shop/recovery, and Pack-v2 authorities. The consumption profile is authored item metadata, not a new mutable hunger/poison state family. `npm run hardening` remains reserved for lifecycle-sensitive packets and phase/release gates.

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

### Crownfields agricultural geography proof

The pre-promotion Crownfields implementation head passed hosted Check #1294 / run `33199542741` with **731/731 tests**, Content Census, Benchmark 3, and Benchmark Sample. The final promoted PR head passed Check #1307 / run `33200172961`. PR #392 merged at `738faa5813e4aca30950b0d787f1209ae9a3d917`; post-merge main Check #1308 / run `33200236952` passed the full hosted gate.

### Regional ingredient/luxury processing proof

`tests/ingredientLuxuryProcessing.test.js` proves:
- 30 new transformations and 30 outputs resolve through the canonical production/item catalogs;
- all 11 existing luxury raw resources have real production demand;
- combined canonical raw-resource utilization reaches 33/44 (75%);
- Crown Rye -> flour -> bread is a real intermediate chain;
- Ghost Orchid + Moonlotus each become intermediate extracts before a cross-regional finished perfume;
- chained outputs preserve input provenance.

The pre-promotion implementation head passed Check #1311 / run `33202128019` with **736/736 tests**, Content Census, Benchmark 3, and Benchmark Sample. The final promoted head passed Check #1326 / run `33202537431`; PR #394 merged at `fb7a4ec0145c6072aac21525cb15e931125fc327`, and post-merge main Check #1327 / run `33202596523` also passed.

### Great Mere freshwater and item-safety proof

`tests/playerGreatMereFreshwaterFlow.test.js` proves:
- Great Mere geography/map/routes validate and Reedcrown Isle remains boat-only;
- seven plausible freshwater species remain passive/wary;
- nine resources have exact source/place/action provenance;
- every canonical food-tagged resource/production item explicitly declares consumption safety;
- every preparation-required Great Mere raw food feeds a real production path;
- Bitterflag is raw-toxic, lacks a direct consume sink, and detoxifies through leaching/boiling;
- fish processing preserves intermediate provenance into a safe prepared ration;
- the player information model exposes toxic/raw and direct-safe labels;
- both Great Mere Pack-v2 graphs validate without dangling references.

The repaired pre-promotion implementation head passed Check #1334 / run `33209084881` with **743/743 tests**, Content Census, Benchmark 3, and Benchmark Sample. Final exact-head Check #1348 / run `33212388143` passed the same full gate; PR #396 merged at `e327181fcd1e93579f335045a817de1fdae842a5`, and post-merge main Check #1349 / run `33212454122` passed with **743/743 tests**.

### Ecology/geography integrity proof

`tests/ecologyGeographyIntegrity.test.js` verifies reciprocal map/place references, valid route-stop coordinates, no competing zone-edge/canonical-route authority, outbound escape paths, encounter-template resolution, population/source references, and end-to-end gathering/body provenance. Regional ecology now receives the same structural classes of validation as foundation ecology.

### Universal magic + Starfen connected-content proof

`tests/universalMagicCatalog.test.js` and `tests/playerStarfenMarshcraftFlow.test.js` verify the Packet D rules:

- all canonical spell capabilities/abilities are shared-owned rather than Redstone/Elderwood/Starfen-owned;
- canonical spells carry no regional identity tags;
- elemental magic can be learned and executed away from any supposed home region when character training/skill/resources permit;
- Veilscript sigils use the existing `ninjutsu` skill and ability/status contracts;
- external franchise material remains research-only, while canonical spell names/IDs/effects are original;
- Starfen wetland materials become provenance-bearing medicine, waterproofing and survey stock through existing production authorities;
- regional Starfen contracts do not unlock universal spells;
- Starfen Current Reading remains a qualified regional field-knowledge reward;
- Pelu/Tavi service availability derives from canonical fictional time.

## Current content progression

```text
places/localities       34 / mechanics 10
named NPCs              26 / 50
shop/service sites      23 / 20
creatures               52 / 40
resource sources        50 / 40
canonical items        158 / 200
recipes/processes       81 / 75
abilities/techniques    41 / 100
quests/contracts        18 / 30
companions               1 / 4
transport services       6 / 5
```

Infrastructure coverage:

```text
routes                                   8
spell schools                            4
capability/training definitions         44
NPC schedules                           13
regional/shared packs                   18
pack-owned records                     564
pack-owned abilities/capabilities/
  schedules/companions              41/44/11/1
```

The mechanics-scale gate remains NOT READY. Recipes/processes are now 59/75 and canonical items 126/200; companions remain the largest relative gap. Content-scale targets remain progression indicators, not ordinary Check thresholds.

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

Great Mere Freshwater Economy & Food Safety is implemented on PR #396 and pre-promotion validation is green. Completion requires the synchronized exact-head Check and PR #396 landing.