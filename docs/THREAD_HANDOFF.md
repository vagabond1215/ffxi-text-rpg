# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

```text
Product:       0.9.400.1
Package:       0.9.400
Account Save:  5
Game State:    21
Data:          75
Benchmark:     3
Codename:      Production Item Authority Hardening
Runtime:       Node >=24
Phase:         0.9
0.9.100:       COMPLETE
0.9.200:       COMPLETE — Adventure Vertical Slices
0.9.300:       COMPLETE — Advanced Combat / Training
0.9.400:       ACTIVE — Economy / Production Depth
Latest unit:   A0 — Production & Item Authority Hardening
Next unit:     A1 — Existing Field-Tool Conversion Proof
Next status:   NEXT / NOT STARTED
```

Data 75 remains the authored/mechanics-data checkpoint. A0 changes runtime/item authority but adds no authored item, recipe, shop-stock, NPC, quest, ability, ecology, geography, or Pack-v2 ownership record.

Game State remains 21. Production tool bindings live inside the existing generic work-record data envelope; A0 adds no new top-level durable state family or required work-state schema field.

## Latest bounded unit — 0.9.400 A0

Permanent record:
- `docs/ECONOMY_0_9_400_A0_PRODUCTION_ITEM_AUTHORITY.md`.

Behavioral implementation freeze:
- `0445823264bb6adf1d1717dee2df83678e561a0f`.

Hosted implementation evidence:
- Check #2172 / run `33661309577`;
- Repository Audit PASS;
- **901/901 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS.

Validated current census:
```text
places/localities                       55
named NPCs                              48
shop/service sites                      37
creature definitions                   123
resource sources                       143
canonical items                        410
recipes/processes                      234
abilities/techniques                    41
quests/contracts                        20
companions                               2
transport services                       7
routes                                  25
NPC schedules                           27
regional/shared packs                   39
pack-owned records                    1325
runtime seed NPCs                       47
runtime seed enemies                    17
raw-resource production demand       145/154
luxury-raw production demand          14/14
```

The 410-item / 47-runtime-NPC figures were already true at the 0.9.300 maturity checkpoint; older operational docs saying 408 / 46 were stale and have been corrected.

## A0 authority result

A0 closes the prerequisites identified by the post-0.9.300 instructional/repo audit.

### Canonical item identity

`js/text/data/canonicalItemRegistry.js` is now the non-owning resolver across:
- canonical resource items;
- production items;
- equipment catalog entries.

It rejects cross-authority stable-ID collisions.

Pack-v2 item references use this resolver through `contentCatalogRegistry`.

Do not create a duplicate production-item definition merely to make an existing equipment ID craftable.

### Production output identity

`productionCatalog` and `productionEngine` can resolve a recipe output through canonical item authority.

This means A1 may author a recipe whose output is the existing `field-knife`, `prospector-pick`, etc. stable ID while `equipmentCatalog` remains equipment behavior authority.

Production contributes transformation provenance; it does not become a second equipment database.

### Commerce identity

When shop stock names a canonical item ID, `shopEngine` now materializes the canonical physical definition and overlays:
- shop purchase source metadata;
- transaction price;
- `commerce` provenance with `purchase` action.

The bounded legacy/non-canonical shop fallback still exists.

This fixes tag-first physical-type divergence, including canonical material records that happen to carry a descriptive `tool` tag.

### Production tool accessibility

Production tool requirements resolve from:
1. equipped physical tools;
2. portable equipment-kind tools in Inventory;
3. explicit contextual capabilities supplied by a caller/service.

A material merely carrying a `tool` tag is not a portable occupational tool.

Field gathering/recovery may retain stricter equipped-tool rules.

### Active work tool binding

Physical tools used to satisfy production requirements are stored in `work.records[*].data.toolBindings`.

While the work record is active, common player mutation paths reject:
- equipping an Inventory-bound tool;
- transferring an Inventory-bound tool;
- selling an Inventory-bound tool;
- unequipping an equipped bound tool;
- replacing an equipped bound tool.

The reservation ends automatically when the work record is no longer active.

No durability, breakage, quality, repair, worker automation, or workstation inventory was introduced.

## Next bounded implementation — 0.9.400 A1

**Existing Field-Tool Conversion Proof — NEXT / NOT STARTED.**

Primary authorities:
- `docs/ECONOMY_0_9_400_A0_PRODUCTION_ITEM_AUTHORITY.md`;
- `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.

The next explicit `continue` authorizes A1 only.

A1 targets exactly:
- Field Knife;
- Prospector Pick;
- Woodsman Hatchet;
- Digging Spade;
- Reed Sickle;
- Marsh Fishing Rod.

Do not broaden into Ash Staff, Maple Wand, Iron Buckler, Brass Ring, bronze equipment, leather garments, or generic profession-tool suites until A1 closes.

### Required A1 proof

A1 must prove an end-to-end loop:

```text
canonical raw source
  -> processed stock/component
  -> recipe producing existing tool stable ID
  -> crafted tool with production provenance
  -> equip/use crafted tool
  -> real tool-gated work action
  -> downstream output/use/trade
  -> current-schema save/load remains coherent
```

Use existing material-foundation stocks/components where plausible. Prefer cross-profession dependencies over one-off recipe-only materials.

Durable tools are requirements, not consumed recipe inputs.

### A1 version rule

Do not pre-bump Data merely because A1 is selected.

A1 will almost certainly advance Data because recipes for existing tool IDs are new authored canonical production definitions. Product should advance within 0.9.400 from the actual bounded implementation.

Game State advances only if A1 introduces a genuinely new required durable fact that cannot live in existing authority/state envelopes. The current expectation is that Game State can remain 21.

## Preserved deferred / queued work

Do not reopen these automatically:

- **Combat depth:** engagement coordinates, LOS/line-of-fire, pursuit/search/disengagement/flee, passive block/parry/guard/counter/reaction execution, stale combat placeholders, weapon resonance/imbuement, unsupported-family breadth, remaining richer named-spell semantics. Authority: `docs/ADVANCED_COMBAT_0_9_300_MATURITY_REASSESSMENT.md`.
- **World edge:** Waymeet Inner Marches / outer crossroads first, then Coppergrass extensions, then Drowned Vaults.
- **Locality enrichment:** ambient/risk events, wandering/seasonal merchants, generalized directions/help dialogue, richer conversation, shop browse/category depth, learned-locality presentation.
- **Quest/social/companion depth:** later 0.9.500 track.
- **Ecology repair:** five-part sequence complete; do not restart without fresh selection.
- **Husbandry:** fleece/wool, dairy, eggs, honey, manure, managed domestic meat/hides wait for explicit managed-animal source authority.
- **Material Culture Packets B-F:** not auto-authorized by A1.

## Instructional-document corrections made in A0

The audit corrected operational drift rather than deleting history:
- stale current Product/Package references;
- contradictory 0.9.300 queued/not-started language;
- material-culture `Game State remains 14` wording;
- current census 408 -> 410 canonical items;
- current runtime seed NPCs 46 -> 47;
- stale generic project-profile checkpoint fields;
- B2 profile Product typo 0.9.200.4 -> 0.9.200.3;
- historical sections relabeled so they no longer look like continuation instructions.

## Standing governance

Preserve:
- one canonical fictional world clock;
- one owner per state family;
- resolver/registry layers do not become duplicate definition authorities;
- no duplicate task owner;
- current-schema-only pre-alpha persistence;
- implementation/data freeze before Product/Data promotion;
- Data and Game State advance independently;
- no mechanics-census filler;
- no hidden compatibility scaffolding for unsupported saves;
- exploration aggro remains separate from active-battle attention;
- `docs/THREAD_HANDOFF.md` is updated last for a closed bounded unit.

## Restart order for 0.9.400 A1

1. `AGENTS.md`;
2. this handoff;
3. `PROJECT_PROFILE.yaml`;
4. `docs/EXECUTION_PIPELINE.md`;
5. `docs/ECONOMY_0_9_400_A0_PRODUCTION_ITEM_AUTHORITY.md`;
6. `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`;
7. inspect only the six A1 tool entries, their shop presence, existing material-foundation stocks, and production/work tests;
8. define exact recipes/components and Data/Product delta;
9. implement the six-field-tool proof;
10. validate crafted-tool identity, provenance, actual tool-gated use, commerce/equipment equivalence, and save/load;
11. freeze implementation before documentation promotion;
12. update this handoff last.

Do not reopen the broad material-culture audit or advanced-combat audit unless A1 exposes a concrete blocker owned by those domains.

## Exact-head synchronization repair

The first synchronized A0 head Check #2188 / run `33662046866` passed Repository Audit but failed exactly two stale version-expectation tests:
- `tests/phase07Px6Versioning.test.js` still required `shopTransactions === 0.5.0` rather than allowing a later compatible version;
- `tests/pipeline.test.js` still hard-coded Product 0.9.300.8 / Package 0.9.300 and pre-A0 manifest values.

No runtime behavior changed in that repair. The Phase-0.7 assertion now uses its intended minimum-version contract and the pipeline manifest expectations now match the deliberate 0.9.400.1 checkpoint.

A second exact-head run, Check #2190 / run `33662349798`, reached the same behavioral suite but exposed four remaining stale regex assertions in `tests/pipeline.test.js` for Product, Package, contentCatalogRegistry, and validation display strings. Those assertions have now been synchronized to 0.9.400.1 / 0.9.400 / 0.4.0 / 0.54.0. No runtime or authored-data behavior changed.

## Final validation contract

This handoff is the intended final repository-file mutation for the A0 closure.

After this write:
- perform no repository-file mutation unless exact-head validation exposes a real failure;
- validate the exact branch/resulting promoted SHA with hosted Check;
- confirm Repository Audit, tests, Census, Benchmark 3, and Benchmark Sample;
- merge/promote only after the exact synchronized head is green.

If exact-head validation exposes a synchronization defect, repair it and rewrite this handoff last again.
