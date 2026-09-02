# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

```text
Product:       0.9.400.6
Package:       0.9.400
Account Save:  5
Game State:    21
Data:          80
Benchmark:     3
Codename:      Basic Leather Garment Conversion Proof
Runtime:       Node >=24
Phase:         0.9
0.9.100:       COMPLETE
0.9.200:       COMPLETE — Adventure Vertical Slices
0.9.300:       COMPLETE — Advanced Combat / Training
0.9.400:       ACTIVE — Economy / Production Depth
A0:            COMPLETE — Production & Item Authority Hardening
A1:            COMPLETE — Existing Field-Tool Conversion Proof
A2:            COMPLETE — Bronze Martial Conversion Proof
A3:            COMPLETE — Caster / Offhand Starter Conversion Proof
A4:            COMPLETE — Remaining Bronze Starter Set Conversion Proof
Latest unit:   A5 — Basic Leather Garment Conversion Proof
Next unit:     A6 — Shared Workshop Tool Authority Audit
Next status:   CANDIDATE / NOT STARTED
```

Data 80 is the current authored/mechanics-data checkpoint. A5 adds two canonical production definitions and one shared Pack-v2 ownership tranche while preserving the existing Leather Vest and Leather Trousers stable IDs.

Game State remains 21. Crafted equipment identity, production provenance, equipment placement, combat/stat use, and save/load all use existing durable authority/state envelopes.

## Repository / promotion state

A5 is merged to `main`.

- merged main SHA: `dd7abf0f7dd69464c572884152752130cbb92b82`;
- PR #411: MERGED;
- exact synchronized PR head: `75d9771692374651cdfa219f31e4a1b0cfdfd79c`;
- final pre-merge Check #2294 / run `33675900751`: Repository Audit, **926/926 tests**, Census, Benchmark 3, and Benchmark Sample PASS;
- behavioral implementation freeze: `ff238f7aef29f2229cd35f2d77ea9ba0b8faa847`;
- implementation freeze Check #2277 / run `33675272069`: full gate PASS.

Initial Check #2276 / run `33675148970` produced 925/926. The single failure was regression setup: the test crafted the existing A1 Field Knife but granted only `crafting`, omitting the Field Knife recipe's existing `metalworking 4` prerequisite. Test setup was corrected; A5 recipe/runtime definitions did not change.

The older A5 branch may remain remotely if connector cleanup is unavailable; do not continue new work on it. A future A6 continuation should start from current `main`.

## Validated Data 80 census

```text
places/localities                       55
named NPCs                              48
shop/service sites                      37
creature definitions                   123
resource sources                       143
canonical items                        410
recipes/processes                      254
abilities/techniques                    41
quests/contracts                        20
companions                               2
transport services                       7
routes                                  25
NPC schedules                           27
regional/shared packs                   43
pack-owned records                    1365
runtime seed NPCs                       47
runtime seed enemies                    17
raw-resource production demand       145/154
luxury-raw production demand          14/14
```

Canonical item count remains 410 because A5 converts existing equipment IDs instead of adding new item identities.

A5 Pack-v2 breadth changes:
- regional/shared packs 42 -> 43;
- pack-owned records 1,361 -> 1,365;
- Pack-v2 owned item refs 395 -> 397;
- Pack-v2 owned recipe refs 246 -> 248.

## A5 canonical conversion result

### Production definitions

`js/text/data/basicLeatherGarmentProductionCatalog.js` owns exactly two new process definitions:

```text
craft-leather-vest       -> leather-vest
craft-leather-trousers   -> leather-trousers
```

Do not add these equipment IDs to `productionItems` or resource-item catalogs. `equipmentCatalog` remains physical/equipment behavior authority.

Traveler Gloves and Traveler Boots were explicitly not included.

### Existing leather supply authority

A5 reuses the established Elderwood Hunt-Timber tanning chain:

Leather Vest:
- 2x Dusk-Tanned Barkboar Hide;
- Resin-Cured Hide Binding;
- physical `cutting` capability;
- tannery.

Leather Trousers:
- Dusk-Tanned Barkboar Hide;
- Resin-Cured Hide Binding;
- physical `cutting` capability;
- tannery.

Both recipes use:
- `crafting` proficiency;
- `tannery` station;
- A1 physical-tool binding.

No generic duplicate leather item, leatherworking proficiency, stitching state family, or recipe-only material was added.

### Pack-v2 ownership

`pack-basic-leather-garments` owns:
- `leather-vest`;
- `leather-trousers`;
- `craft-leather-vest`;
- `craft-leather-trousers`.

Dependencies:
- `pack-shared-foundation`;
- `pack-elderwood-hunt-timber`.

The Elderwood dependency is intentional because this shared garment production consumes the canonical Elderwood tanning supply chain.

### Mechanical vertical proof

A5 proves:

```text
Elderwood Barkboar recovery / tanning / hide binding
  -> A1 crafted Field Knife supplies cutting
  -> craft existing Leather Vest / Leather Trousers IDs at tannery
  -> canonical light-armor HP / defense behavior
  -> current-schema save/load preserves crafted identities + provenance
```

Primary regression:
- `tests/basicLeatherGarmentConversion.test.js`.

Prior authority/conversion regressions remain:
- `tests/canonicalItemAuthority.test.js`;
- `tests/productionWork.test.js`;
- `tests/occupationalFieldToolConversion.test.js`;
- `tests/starterBronzeMartialConversion.test.js`;
- `tests/starterCasterOffhandConversion.test.js`;
- `tests/remainingBronzeStarterConversion.test.js`.

## Version result

```text
Product       0.9.400.5 -> 0.9.400.6
Package       0.9.400   -> 0.9.400
Account Save  5         -> 5
Game State    21        -> 21
Data          79        -> 80
Benchmark     3         -> 3
```

Relevant system manifest changes:
- `versionManifest 0.9.400.5 -> 0.9.400.6`;
- `productionCatalog 0.21.0 -> 0.22.0`;
- `basicLeatherGarmentProductionCatalog 0.1.0` added;
- `regionalContentPacks 0.26.0 -> 0.27.0`.

No persistence migration or compatibility adapter was added.

## Conversion-first exhaustion finding

A0-A5 have exhausted the clean existing-ID conversion path for the explicit Packet-A backlog.

Canonical equipment currently provides these established field tools:
- Field Knife;
- Prospector Pick;
- Woodsman Hatchet;
- Digging Spade;
- Reed Sickle;
- Marsh Fishing Rod.

Repository inspection found no established canonical equipment IDs for ordinary:
- smithing hammers, tongs, or files;
- woodworking saws, planes, or chisels;
- masonry mallets or chisels;
- textile shears, needles, or spindles;
- leatherworking awls or needles;
- cooking implements;
- balances, measures, or precision workshop tools.

The material foundation contains useful tool components/materials, including Iron Tool-Head Blank, textile fibers/yarns, quicklime, pine tar, and hide glue, but those are not workshop-tool equipment identities.

Therefore the next unit is not another conversion tranche.

## Next bounded candidate — 0.9.400 A6

**Shared Workshop Tool Authority Audit — CANDIDATE / NOT STARTED.**

A6 is an authority/design pass. It is not automatic authorization to create a broad workshop-tool catalog.

### Required A6 questions

1. Which workshop actions genuinely need a portable physical tool?
2. Which needs are already adequately represented by workstation tags such as `forge`, `woodshop`, `tannery`, or `kitchen`?
3. Which proposed tools are workstation fixtures rather than carried equipment?
4. Which proposed tools are consumable components rather than durable equipment?
5. Which `requiredToolTags` would change gameplay meaningfully instead of adding decorative friction?
6. Can the existing production tool-binding contract handle those tags without new durable state?
7. What is the smallest mechanically meaningful new-ID proof cluster?
8. If new portable tools are justified, can smithing + woodworking form the first cross-profession proof using existing material-foundation components?
9. Which shared Pack-v2 owner should own them without duplicating regional production authority?
10. Does any proposal actually require a Game State advance? Default expectation is no.

### A6 guardrails

Do not:
- invent one tool per profession just to complete a checklist;
- model workstation fixtures as carried equipment by default;
- add durability/quality/repair merely because physical tools exist;
- create a new proficiency family unless existing `crafting` / `metalworking` semantics genuinely cannot express the work;
- add a new stable ID without a demonstrated mechanical role;
- authorize Material Culture Packets B-F through A6.

A fresh explicit continuation may authorize the A6 audit. New tool authoring should occur only if that audit selects a bounded proof.

## Other preserved deferred / queued work

Do not reopen automatically:

- **Traveler gear conversion:** Traveler Gloves / Traveler Boots remain outside A5 and are not automatically next.
- **Combat depth:** engagement coordinates, LOS/line-of-fire, pursuit/search/disengagement/flee, passive block/parry/guard/counter/reaction execution, stale combat placeholders, weapon resonance/imbuement, unsupported-family breadth, remaining richer named-spell semantics.
- **World edge:** Waymeet Inner Marches / outer crossroads first, then Coppergrass extensions, then Drowned Vaults.
- **Locality enrichment:** ambient/risk events, wandering/seasonal merchants, generalized directions/help dialogue, richer conversation, shop browse/category depth, learned-locality presentation.
- **Quest/social/companion depth:** later 0.9.500 track.
- **Ecology repair:** five-part sequence complete; do not restart without fresh selection.
- **Husbandry:** fleece/wool, dairy, eggs, honey, manure, managed domestic meat/hides wait for explicit managed-animal source authority.
- **Tool durability/quality/repair:** not implied by A6.
- **Worker automation or workstation inventories:** not implied by A6.
- **Material Culture Packets B-F:** not auto-authorized by A6.

## Standing governance

Preserve:
- one canonical fictional world clock;
- one owner per state family;
- resolver/registry layers do not become duplicate definition authorities;
- equipment stable IDs remain singular across shop, production, equipment, combat use, and persistence;
- workshop tool identity must be justified by gameplay authority rather than checklist completion;
- portable equipment and workstation capability must remain distinct concepts;
- no duplicate task owner;
- current-schema-only pre-alpha persistence;
- implementation/data freeze before Product/Data promotion;
- Data and Game State advance independently;
- no mechanics-census filler;
- no hidden compatibility scaffolding for unsupported saves;
- exploration aggro remains separate from active-battle attention;
- `docs/THREAD_HANDOFF.md` is updated last for a closed bounded unit.

## Restart order for a future A6 continuation

1. `AGENTS.md`;
2. this handoff;
3. `PROJECT_PROFILE.yaml`;
4. `docs/EXECUTION_PIPELINE.md`;
5. `docs/ECONOMY_0_9_400_A5_BASIC_LEATHER_GARMENTS.md`;
6. `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`;
7. inspect workstation semantics, `requiredToolTags`, production tool binding, equipment authority, material-foundation tool components, and existing recipes across smithing/woodworking/tannery/textile/cooking;
8. classify candidate tools as portable equipment, station fixture/capability, consumable component, or unnecessary;
9. select the smallest mechanically meaningful proof only if new portable equipment is justified;
10. freeze exact Product/Data/Game-State expectations before any authoring;
11. if no new identities are justified, close A6 as a decision-only audit;
12. if a proof is justified, implement only that bounded cluster;
13. update this handoff last.

## Final validation contract

This post-merge handoff correction is the intended final repository-file mutation for A5 closure.

A5 promotion evidence is complete:
- behavioral freeze Check #2277 / run `33675272069`: full gate PASS;
- exact synchronized PR-head Check #2294 / run `33675900751`: **926/926 tests** plus Repository Audit, Census, Benchmark 3, and Benchmark Sample PASS;
- PR #411 merged to `main` at `dd7abf0f7dd69464c572884152752130cbb92b82`.

After this write:
- perform no repository-file mutation unless exact-main validation exposes a real failure;
- leave A6 unstarted;
- start future work from current `main`, not the old A5 branch.
