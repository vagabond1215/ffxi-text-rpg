# Thread Handoff

Repository evidence beats conversation memory.

## Current contract

```text
Product:       0.9.200.1
Package:       0.9.200
Account Save:  5
Game State:    15
Data:          63
Benchmark:     3
Codename:      Slatewater Road Scout
Runtime:       Node >=24
Phase:         0.9
Track state:   0.9.100 Content Scale Gate A COMPLETE
Prerequisite:  Local Knowledge & Familiarity Foundation COMPLETE
Next formal:   0.9.200 Adventure Vertical Slices QUEUED
```

## Latest bounded units

### Local Knowledge & Familiarity Foundation — COMPLETE

This is the latest runtime/persistence bounded unit.

- Product: `0.9.100.24`
- Game State: `15`
- Data: `62` unchanged
- Package: `0.9.100`
- Account Save: `5`
- Benchmark: `3`
- implementation freeze: `da168ddff6cc9e3611c9b8c06165b117081ea5c0`
- hosted Check: #1770 / run `33355620265`
- result: Repository Audit, **823/823 tests**, Content Census, Benchmark 3, Benchmark Sample all green

The implementation freeze was deliberately established before permanent-authority synchronization.

No canonical authored place, route, POI, NPC, ecology, resource, item, process, quest, companion, or Pack-v2 ownership record was added. Therefore Data remains 62.

Game State advances 14 -> 15 because the character now owns durable gameplay facts that cannot be reconstructed safely from canonical world catalogs:
- layered place/POI knowledge and familiarity;
- learned POI names;
- NPC name/reference/identity linkage;
- known connector familiarity;
- POI interaction history;
- save-persistent temporary guidance/search bias;
- current locality anchor;
- current active POI/interior context.

No supported-save migration was added. Pre-alpha persistence remains strict current-schema-only; legacy Game State 14 saves are not silently coerced into Game State 15.

No new simulation clock, timer owner, listener/background owner, route graph, inventory authority, or duplicate canonical world database was introduced.

### Packet E / Content Scale Gate A — COMPLETE

Permanent audit:
- `docs/GATE_A_INTEGRATION_CENSUS_AUDIT.md`
- implementation freeze/promoted audit SHA: `81b2928611a297d765eaa64f7cedeadb5fd697ee`
- Check #1638 / run `33332932015`
- result: Repository Audit, 822/822 tests, Census, Benchmark 3, Benchmark Sample green

Gate A remains PASS / COMPLETE.

### Latest canonical authored-data unit — Data 62

Cross-Biome Family Breadth remains the latest canonical authored-data bounded unit:
- implementation freeze: `c5e12b5d8f0b6ddf7a76f5df01316567b43d4528`
- promoted Data 62 SHA: `bc472b60374a048686b0ee6c877ba26c515aec35`
- Product at that authored-data promotion: 0.9.100.23
- Game State at that authored-data promotion: 14

The five-part location flora/fauna diversity repair sequence is complete:
1. Legacy Elderwood Ecology Repair — Data 58
2. Dry Upland & Saltpan Ecology Repair — Data 59
3. Headwater / Highland Transition Spread — Data 60
4. Wetland / Island Distribution Repair — Data 61
5. Cross-Biome Family Breadth — Data 62

Do not restart that sequence automatically.

## Local Knowledge & Familiarity Foundation semantics

Permanent design authority:
- `docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md`

Implemented foundation:
- canonical world truth and character knowledge are separate authorities;
- POI/place knowledge uses Unknown -> Referenced -> Sighted -> Recognized -> Familiar semantics;
- sighting does not imply meeting, interaction, direct navigation, or commitment disclosure;
- knowing an NPC name by reference does not automatically imply identity recognition;
- direct same-locality movement requires learned familiarity or a currently sighted boundary/anchor;
- unknown adjacent settlement connectors are not bypassed by long-range travel actions;
- route graph remains inter-place traversability/time/distance authority;
- `Look Around` is immediate observation;
- `Explore` advances fictional time and uses deterministic/injectable weighted discovery;
- temporary guidance survives save/load for its authored lifetime and biases exploration rather than teleporting;
- origin guides now create real supplier referrals as Referenced knowledge plus temporary guidance;
- commitment disclosure requires actual prior interaction with the giver, not mere sighting;
- POI/service use is staged through approach -> enter where required -> interact -> leave;
- indoor workstations require actual entry rather than same-place coordinates;
- public scheduled transport is exposed only through learned travel points or Familiar public transport hubs;
- dense transport hubs prioritize real departure choices without inventing staffed stops;
- Forge-Mere still physically crosses Coppergrass without making Coppergrass a staffed/scheduled boarding locality;
- legacy `discoveredPois` is invalid as current authority under Game State 15;
- current `localKnowledge` is serialized authority.

Foundation intentionally does not claim the entire future design vision. Still-deferred follow-on locality work includes:
- broad ambient/risk event catalogs;
- wandering/seasonal merchant generation;
- generalized guard/help direction dialogue catalogs;
- personality-varied greetings and deeper contextual conversation;
- deeper staged stock-category/Browse interaction;
- richer learned-locality graphical map presentation.

Do not auto-start those merely because the foundation is complete.

## Validation evidence

Implementation freeze:
- SHA `da168ddff6cc9e3611c9b8c06165b117081ea5c0`
- Check #1770 / run `33355620265`
- **823/823 tests**
- Repository Audit PASS
- Content Census PASS
- Benchmark 3 PASS
- Benchmark Sample PASS

Pre-handoff synchronized-authority head:
- `71ee257cfcae93ef872386f8ab0dab090a23c060`
- Check #1781 / run `33355858375`
- Repository Audit, tests, Census, Benchmark, Benchmark Sample all green

Validated census remains:

```text
places/localities       55
named NPCs              47
shop/service sites      37
creatures              123
resource sources       143
canonical items        408
recipes/processes      234
abilities/techniques    41
quests/contracts        18
companions               1
transport services       7
routes                   25
spell schools             4
capabilities             44
NPC schedules            27
regional/shared packs    39
pack-owned records     1320
runtime seed NPCs        46
runtime seed enemies     17
raw-resource use      145/154
luxury-raw use          14/14
```

Mechanics-scale gate remains NOT READY:
- companions: 1/4
- abilities/techniques: 41/100
- quests/contracts: 18/30
- named NPCs: 47/50

Largest relative gap remains companions.
Largest absolute listed gap remains abilities/techniques.

## Permanent authorities synchronized

Current continuity was synchronized across:
- `README.md`
- `PROJECT_PROFILE.yaml`
- `docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md`
- `docs/DEVELOPMENT_DIRECTION.md`
- `docs/ARCHITECTURE.md`
- `docs/SYSTEM_CATALOG.md`
- `docs/QUALITY_GATES.md`
- `docs/EXECUTION_PIPELINE.md`
- `docs/ROADMAP.md`
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
- `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md`

Those authorities distinguish:
- current runtime/persistence checkpoint: Product 0.9.100.24 / Game State 15;
- current canonical authored-data checkpoint: Data 62 / Cross-Biome Family Breadth.

This file is the **last repository-file write** for the bounded unit.

## Standing rules preserved

Continue to preserve:
- route graph as inter-place traversability/distance/time/hazard/mode authority;
- touching geographic/map envelopes do not imply traversability;
- acquired map/locality knowledge rather than omniscient maps;
- ecology distribution does not automatically imply recovery-source availability;
- passive/wary wildlife remains non-hostile unless behavior is ecologically/gameplay justified;
- exact provenance source/place/action for recoverables;
- explicit food-safety metadata for food-capable items;
- intentional production/economic/use sinks or explicit exemptions;
- Pack-v2 ownership/dependency metadata only; do not create a second gameplay database;
- generated scale fixtures are excluded from canonical census;
- deterministic simulation, exploration RNG, and census behavior;
- canonical fictional time; no wall-clock canonical schedule authority;
- Game State 15 unless another genuinely new durable serialized state family requires change;
- no hard benchmark timing thresholds;
- Benchmark version remains 3 unless workload/comparability contract changes;
- normal low-risk work may proceed directly on `main`; validation-only branches/PRs remain acceptable only when exact hosted Check surfacing requires them;
- `docs/THREAD_HANDOFF.md` must remain the final repository-file write before final exact-head validation.

## Next decision boundary

Local Knowledge & Familiarity Foundation is complete. No broader locality-event/dialogue/UI work was auto-started.

Formal roadmap priority remains:
1. **`0.9.200 Adventure Vertical Slice A`**
   - prefer a character-centered slice;
   - naturally add a justified recruitable companion where fiction supports it;
   - add connected quests/contracts and NPC/service relationships;
   - reuse existing geography where practical instead of expanding the world merely for counts.
2. **`0.9.300 Advanced Combat / Training`**
   - deepen ability/technique breadth through real learning, equipment, discipline, and encounter requirements.
3. **`0.9.400 Economy / Production Depth`**
   - Occupational Tool Conversion remains the strongest already-planned bounded candidate.
4. **`0.9.500 Quest / Social Depth`**
5. **`0.9.600 Playable-Alpha Scale Push`**

None is auto-started.

Separate world-edge ranking remains:
1. Waymeet Inner Marches / outer crossroads approach
2. Coppergrass extensions
3. Drowned Vaults

Optional ecology remains separate and requires fresh explicit selection:
- broader Crownfields ordinary-wildlife spread;
- secondary Deepvein Mine / Sunken Archive ecology/substrate cleanup;
- shorebird/wader breadth if coastal depth warrants it;
- snake breadth only with a concrete ecological/player/economic loop.

Richer locality-event/UI work is also a separate explicit-selection queue.

## Restart order

1. `AGENTS.md`
2. this file
3. `PROJECT_PROFILE.yaml`
4. `docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md`
5. `docs/EXECUTION_PIPELINE.md`
6. `docs/ROADMAP.md`
7. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
8. relevant runtime files only for the selected next bounded unit

## Final validation requirement

Validate the exact final `main` head with hosted Check and Pages.

Hosted Check must include:

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Do not make any repository-file mutation after this handoff write before final validation.
