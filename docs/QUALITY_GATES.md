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
Product:       0.9.200.3
Package:       0.9.200
Account Save:  5
Game State:    16
Data:          64
Benchmark:     3
Codename:      Enemy Attention Foundation
```

The Data 45 ecology/geography audit passed hosted Check #1266 / run `33188833540` with **728/728 tests**, Content Census, Benchmark 3, and Benchmark Sample. Check #1267 / run `33189086957` also passed after the final reciprocal Crownward forest-gate repair; PR #390 later merged and its post-merge main gate remained green.

## Persistence/lifecycle

Current mode remains strict pre-alpha current-schema-only.

- Account Save remains 5 unless account/session shape changes.
- Game State is 16; change it again only when another genuinely new durable player/world fact changes the serialized contract.
- Data changes do not automatically imply Game State changes.
- Required persisted authority validates before runtime normalization/revival.
- Active owner/task links remain coherent until owner reconciliation.
- Direct timed-task creation remains limited to audited domain owners.
- No blind global pruning, wall-clock canonical simulation, or duplicate state authority.

Packet E added no persistence owner and historically kept Game State 14. Local Knowledge & Familiarity Foundation intentionally advances Game State 14 -> 15 because locality familiarity, temporary guidance, NPC identity linkage, interaction history, and active local POI context must survive save/load. It adds no timer/listener/background owner and no supported-save migration; strict pre-alpha current-schema-only loading remains the policy.

## Player-information / locality-discovery gate

Before broad player-facing locality UI is considered coherent, verify against `docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md`:

1. player-facing models do not enumerate raw canonical POIs/NPCs/routes merely because they exist;
2. unknown NPC identities render authored descriptors rather than canonical names;
3. references, sightings, recognition, and familiarity are distinct enough to prevent one-contact direct navigation;
4. finding an entrance does not cross it without an explicit player action;
5. direct `Go to`-class locality movement requires learned familiarity and respects the current parent district/locality;
6. `Look Around` and `Explore` have different scope/time semantics;
7. contextual exploration randomness is deterministic/injectable and based on canonical fictional context rather than wall-clock randomness;
8. temporary directions/search bias survive save/load for their authored lifetime;
9. ephemeral merchants/events do not become permanent static fast-travel destinations merely because they were encountered once;
10. shop stock/categories are exposed only after the character reaches and engages the service;
11. narrative theft, payment, ambush, reputation, or discovery consequences use the owning gameplay systems rather than prose-only mutation;
12. town maps, if rendered, show learned locality nodes/connectors rather than an omniscient complete layout.

**Foundation gate result: PASS.** Implementation freeze `da168ddff6cc9e3611c9b8c06165b117081ea5c0`; Check #1770 / run `33355620265` passed Repository Audit, **823/823 tests**, Census, Benchmark 3, and Benchmark Sample. Game State 15 rejects legacy `discoveredPois` as current authority and validates durable `localKnowledge` instead. Richer ambient-event/dialogue/shop-category behavior remains follow-on and is not required to claim this foundation gate.

## Adventure Vertical Slice A gate

Adventure Vertical Slice A is coherent only when the character-centered loop composes existing authorities rather than adding disconnected records.

For **Slatewater Road Scout**, verify:

1. the slice reuses existing Slatewater Waylodge/foothills geography and canonical routes rather than adding a zone for count;
2. the recruitable character is backed by a persistent canonical NPC;
3. prerequisite commitments are canonical metadata and are enforced both in presentation and `acceptCommitment`;
4. merely reaching or sighting the giver does not expose/resolve the trust arc without real interaction;
5. requested field goods require the intended provenance source;
6. ordinary work progression materially connects the first contract to the second rather than using a bespoke quest-only meter;
7. recruitment itself rechecks resolved prerequisite commitments and returns a real blocked result before trust is earned;
8. NPC relationship dimensions carry into companion relationship state at recruitment instead of resetting;
9. the backing NPC follows active companion travel through the existing party projection;
10. a mobile companion-backed giver is not exposed as a static follow-up marker at an old locality when physically elsewhere;
11. Pack-v2 owns/references the NPC, quests, companion, and relationship metadata without duplicating canonical catalogs;
12. no new Game State family, simulation clock, task owner, route graph, or supported-save migration is introduced without a separate decision.

**Gate result: PASS.** Implementation freeze `63cbd31edb149c9cf10af0a83bcf6f667abe17b8`; Check #1815 / run `33361131795` passed Repository Audit, **826/826 tests**, Census, Benchmark 3, and Benchmark Sample.

## Advanced combat / Slice B gate

Authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`;
- `docs/COMBAT_2_0_SLICE_B_IMPLEMENTATION_PLAN.md`;
- `docs/COMBAT_2_0_B1_UNIFIED_RESOLUTION.md`.

### Packet B1 — Unified Combat Resolution

Verify:
1. no second combat/world clock;
2. active battle remains encounter authority;
3. representative basic/canonical actions use one structured resolution vocabulary;
4. element is executable resistance metadata where migrated;
5. physical/magic/status accuracy and defense/resistance are deterministic;
6. activation, action recovery, and cooldown remain distinct;
7. timed canonical activation blocks overlapping basic/legacy combat actions;
8. structured resolution evidence is persisted only inside already-permitted action data;
9. no new required state family or unsupported save migration is introduced;
10. ability breadth is not inflated merely to satisfy mechanics counts.

**B1 gate result: PASS.**
- behavioral implementation freeze `20b7351a61f56203975e101ef04fd7311e110d9b`;
- Check #1860 / run `33457301272`;
- **832/832 tests**;
- Repository Audit, Census, Benchmark 3, Benchmark Sample PASS;
- Pages #1990 / run `33457300712` PASS.

Data advances 63 -> 64 because canonical ability definitions gain recovery/resolution metadata. Game State stays 15 because no new required serialized state shape was added.

### Remaining Slice B gate

Before later packets close:
- B2 **passes** only when Enmity, normalized Focus, nonlinear weighting, sticky Aggro, Fixation, decay/floors, action-driven changes, and active-battle persistence are all proven. Behavioral freeze `92e6d1623470fbc923ef9beebe148829418b7080` passed Check #1881 with 837/837 tests and the full gate.
- B3 loadout transitions must use canonical time and armor-pressure legality.
- B4 must establish one weapon-delay conversion authority and first-class ranged actions before kata breadth.
- B5 must prove these contracts in the playable Brasshaven/Redstone slice.


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

### Ironspine alpine geography and population-hunting proof

`tests/playerIronspineHighlandsFlow.test.js` proves:
- the lower pass admits wagons while the high trail is walk/mount only;
- cliff/scree hazards remain explicit route data rather than implicit walkable edges;
- six alpine species/populations and six gathering sources validate through the canonical ecology registry;
- Snowhorn hunting does not deplete ecology on encounter start and consumes exactly one population unit on victory;
- ordinary defeated-body recovery yields exact-provenance hide/meat rather than fake animal gathering nodes;
- every new Ironspine raw has production demand;
- raw game is marked preparation-required while player-facing language says it can cause sickness if eaten raw;
- both Ironspine Pack-v2 graphs validate.

Implementation-freeze Check #1368 / run `33215878907` passed Repository Audit, **753/753 tests**, Content Census, Benchmark 3, and Benchmark Sample.

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
places/localities       55 / mechanics 10
named NPCs              48 / 50
shop/service sites      37 / 20
creatures              123 / 40
resource sources       143 / 40
canonical items        408 / 200
recipes/processes      234 / 75
abilities/techniques    41 / 100
quests/contracts        20 / 30
companions               2 / 4
transport services       7 / 5
```

Infrastructure coverage:

```text
routes                                  25
spell schools                            4
capability/training definitions         44
NPC schedules                           27
regional/shared packs                   39
pack-owned records                    1325
pack-owned abilities/capabilities/
  schedules/companions              41/44/27/1
```

`0.9.100 Content Scale Gate A` is **COMPLETE** through Packet E. Permanent evidence: `docs/GATE_A_INTEGRATION_CENSUS_AUDIT.md`; implementation freeze `81b2928611a297d765eaa64f7cedeadb5fd697ee`; Check #1638 / run `33332932015` passed Repository Audit, **822/822 tests**, Census, Benchmark 3, and Benchmark Sample.

The later mechanics-scale gate remains **NOT READY**. Abilities/techniques are now the largest relative and absolute listed gap; companions improved to 2/4. Content-scale targets remain progression indicators, not ordinary Check thresholds.

## Regional distribution gate

For established economic areas, validate the local region plus reliable nearby trade partners rather than demanding local autarky. A viable basin should cover staple food/protein, structural stock, common metal access, bindings, fuel, medicine, a preservation path, and workstation access appropriate to the settlement.

Do not satisfy this gate by duplicating specialty deposits everywhere. Ordinary substitutes are preferred; premium outcomes may still require regional trade. Coppergrass is exempt from settlement-workstation expectations while it remains an authored transit wilderness rather than a staffed locality.

Permanent evidence: `docs/REGIONAL_RESOURCE_DISTRIBUTION_AUDIT.md` and `tests/regionalResourceDistribution.test.js`.

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

Packet E closes `0.9.100 Content Scale Gate A`. `0.9.200 Adventure Vertical Slices` is ACTIVE: Slice A and Packets B1-B2 are complete. Packet B3 — Combat Loadout Transition Foundation — is the next bounded unit and is not started. World-edge, Occupational Tool Conversion, richer locality/UI, and optional ecology queues remain preserved independently.