# Thread Handoff

Repository evidence beats conversation memory.

## Current contract

```text
Product:       0.9.100.23
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          62
Benchmark:     3
Codename:      Cross-Biome Family Breadth
Runtime:       Node >=24
Phase:         0.9
Track state:   0.9.100 Content Scale Gate A COMPLETE
Next track:    0.9.200 Adventure Vertical Slices QUEUED
```

## Current integration state

**Packet E — Gate A Integration & Census Audit is complete. `0.9.100 Content Scale Gate A` passes and is closed.**

Permanent audit:
- `docs/GATE_A_INTEGRATION_CENSUS_AUDIT.md`.

Packet E implementation freeze:
- `81b2928611a297d765eaa64f7cedeadb5fd697ee`;
- hosted Check **#1638 / run `33332932015`**;
- job `99314664552`;
- Repository Audit PASS;
- **822/822 tests PASS**;
- Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS.

Packet E was promoted to `main` at the same SHA:
- `81b2928611a297d765eaa64f7cedeadb5fd697ee`.

Packet E is an audit/governance checkpoint only. It does not replace the latest runtime/data promotion.

Latest promoted runtime/data remains:
- Cross-Biome Family Breadth;
- implementation freeze `c5e12b5d8f0b6ddf7a76f5df01316567b43d4528`;
- promoted runtime/data SHA `bc472b60374a048686b0ee6c877ba26c515aec35`;
- Product 0.9.100.23 / Data 62 / Game State 14 / Package 0.9.100.

The ordered five-part location flora/fauna diversity repair sequence is complete:
1. Legacy Elderwood Ecology Repair — Data 58;
2. Dry Upland & Saltpan Ecology Repair — Data 59;
3. Headwater / Highland Transition Spread — Data 60;
4. Wetland / Island Distribution Repair — Data 61;
5. Cross-Biome Family Breadth — Data 62.

Do **not** restart that sequence automatically.

## Gate A closure result

Packet E evaluates both the numeric planning bands and the qualitative integration rules.

**Gate A: PASS.**

Data 62 clears every Gate A planning band:

```text
named NPCs                 47 / Gate A 30+
shop/service sites         37 / Gate A 20+
creature definitions      123 / Gate A 28+
resource sources          143 / Gate A 28+
canonical items           408 / Gate A 110+
recipes/processes         234 / Gate A 40+
abilities/techniques       41 / Gate A 40+
quests/contracts           18 / Gate A 18+
companions                  1 / author only when justified
transport services          7 / Gate A 5 when topology justifies
```

Qualitative Gate A evidence also passes:
- Pack-v2 item source/sink or exemption validation;
- connected resource/production/provenance use;
- real capability learning/access/use/runtime coverage;
- NPC schedules tied to canonical fictional world time;
- reference-valid and runtime-exercised commitments;
- NPC-backed persistent companion identity;
- declared cross-pack dependencies and stable ownership;
- legacy-ID leakage rejection;
- separate generated 1,401-record scale fixture validation;
- canonical census deduplication that excludes ownership refs and fixtures.

The later mechanics-scale gate remains **NOT READY**. Gate A closure is not mechanics-scale completion.

## Data 62 census

```text
places/localities                        55
named NPCs                               47
shop/service sites                       37
creature definitions                    123
resource sources                        143
canonical items                         408
recipes/processes                       234
abilities/techniques                     41
quests/contracts                         18
companions                                1
transport services                        7
routes                                   25
spell schools                             4
capabilities/training definitions        44
NPC schedules                            27
regional/shared content packs            39
pack-owned records                     1320
runtime seed NPCs                        46
runtime seed enemies                     17
raw resources with production demand 145/154
luxury raws with production demand      14/14
```

Mechanics-floor gaps:
- companions 1/4;
- abilities/techniques 41/100;
- quests/contracts 18/30;
- named NPCs 47/50.

Companions are the largest relative gap. Abilities are the largest absolute gap. Do not close either with disconnected filler.

Creature breadth has crossed the playable-alpha planning lower bound of 120.

## Persistence / version decision

Packet E introduces no:
- runtime behavior change;
- canonical authored-data record;
- serialized state family;
- account/session contract;
- timer/task/listener owner;
- ecology state authority;
- route state authority;
- inventory authority;
- supported-save migration;
- benchmark contract change.

Therefore:

```text
Product:       0.9.100.23 unchanged
Package:       0.9.100 unchanged
Account Save:  5 unchanged
Game State:    14 unchanged
Data:          62 unchanged
Benchmark:     3 unchanged
```

No migration is warranted.

## Standing rules preserved

Continue to preserve:
- route graph as inter-place traversability/distance/time authority;
- touching map envelopes do not imply travel;
- region ecology through existing family/species/population/source authorities;
- passive/wary wildlife must not become hostile merely to manufacture drops;
- distribution does not automatically create a recovery source;
- exact source/place/action provenance for recoverable resources;
- explicit food-consumption safety for food-capable raws/items;
- intentional production/economic/use sinks or explicit exemptions;
- Pack-v2 ownership/dependency validation without duplicating canonical catalogs;
- generated scale fixtures excluded from canonical census;
- deterministic census guards;
- Game State 14 unless a genuinely new durable serialized state family is introduced.

## Permanent authority synchronization

Synchronized before this handoff:
- `README.md`;
- `PROJECT_PROFILE.yaml`;
- `docs/EXECUTION_PIPELINE.md`;
- `docs/ROADMAP.md`;
- `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md`;
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md`;
- `docs/SYSTEM_CATALOG.md`;
- `docs/QUALITY_GATES.md`;
- `docs/GATE_A_INTEGRATION_CENSUS_AUDIT.md`.

The last pre-handoff authority commit on the continuity-validation branch is:
- `b1c9f0063ca64ca43a111726053bda54dfd15309`.

**This file is the final repository-file write.** The exact commit produced by this handoff is the final continuity candidate. It must receive hosted Check and Pages green before closure and before being reported as the final authoritative head.

## Next decision boundary

No next unit is auto-started.

Formal roadmap ranking:
1. **`0.9.200 Adventure Vertical Slice A`** — prefer a character-centered slice that naturally adds a justified recruitable companion, connected quests/contracts, and supporting NPC/service relationships while reusing existing geography where practical;
2. **`0.9.300 Advanced Combat / Training`** — deepen ability/technique breadth through real learning, equipment, discipline, and encounter requirements;
3. **`0.9.400 Economy / Production Depth`** — Occupational Tool Conversion is the strongest already-planned bounded candidate;
4. **`0.9.500 Quest / Social Depth`**;
5. **`0.9.600 Playable-Alpha Scale Push`**.

Separate world-edge ranking:
1. Waymeet Inner Marches / outer crossroads approach;
2. Coppergrass extensions;
3. Drowned Vaults.

Optional ecology remains separate and requires fresh explicit selection:
- broader Crownfields ordinary-wildlife spread using existing families;
- secondary Deepvein Mine / Sunken Archive ecology/substrate cleanup;
- shorebird/wader breadth if future coastal depth warrants it;
- snake breadth only when tied to a concrete ecological/player/economic loop.

## Restart order

1. `AGENTS.md`
2. this file
3. `PROJECT_PROFILE.yaml`
4. `docs/GATE_A_INTEGRATION_CENSUS_AUDIT.md`
5. `docs/EXECUTION_PIPELINE.md`
6. `docs/ROADMAP.md`
7. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
8. `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md`
9. relevant permanent authority for the explicitly selected next unit

## Final validation requirement

The exact final `main` head must have:
- hosted Check green;
- Pages green.

Hosted Check must include:

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

If final continuity validation exposes only stale authority assertions, repair them narrowly, rewrite this handoff last again, and rerun the exact candidate before closure.
