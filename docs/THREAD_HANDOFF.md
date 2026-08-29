# Thread Handoff

Read this first when continuing Hearth & Horizon in a new development thread.

Repository evidence beats conversation memory.

## Current contract

```text
Product:       0.9.100.11
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          50
Benchmark:     3
Codename:      Material Foundations & Common Components
Runtime:       Node >=24
Phase:         0.9 / 0.9.100 Content Scale Gate A
```

## Current integration state

**Material Foundations & Common Components is complete on `main`; final exact-head Check evidence is the remaining closeout step for this handoff.**

The prior branch-cleanup checkpoint remains authoritative:
- 114 non-`main` remote branches were inventoried and deleted;
- local/remote branch inventory was reduced to `main` (plus symbolic `origin/HEAD -> origin/main`);
- zero open pull requests remained;
- `main` is the default branch;
- normal low-risk work should continue directly on `main`.

Prior validated product checkpoints:
- population-backed hunting: PR #400, merge `e18990188935f52b66fe96cfa9d374ff845618ef`;
- Ironspine / Data 49: PR #402, merge `a410eb18e6f8df2f58b965ab9697f8ae813b1c4d`;
- Ironspine promoted exact-head Check #1381 / run `33217086478`: Repository Audit, 753/753 tests, Census, Benchmark 3, Benchmark Sample green.

## Data 50 — Material Foundations & Common Components

Data 50 establishes the shared material substrate required for profession-scale industry without creating a second crafting authority.

Added:
- **21 gathering sources** and **21 raw resources**;
- **55 reusable production outputs** and **55 transformations**;
- one shared Pack-v2 owner: `pack-material-foundations-common-components`.

### Metals and industrial minerals

New source families cover:
- tin;
- zinc-bearing calamine;
- lead;
- silver;
- gold;
- limestone;
- whetstone stone;
- alum shale;
- glass sand.

Produced stock covers:
- bronze;
- brass;
- pewter;
- solder;
- steel;
- copper/silver wire;
- bronze/brass sheet;
- nails, hinges, buckles/rings, ferrules/sockets, chain, hoops, tool-head blanks, blade blanks, and silver settings.

`Cloudsilver Spellwire` is deliberately cross-regional:
```text
silver wire
+ polished Cloud Quartz
+ lodestone billet
-> Cloudsilver Spellwire
```
Magical industry extends ordinary metal/mineral craft rather than bypassing it.

### Differentiated woods

New working-property families:
- Ash — flexible handle/shaft stock;
- Crown Oak — broad structural hardwood;
- Silvermaple — pale fine-grained decorative stock plus sap/syrup;
- Yew — elastic bow/stave stock;
- Hazel — coppice rods/hoops;
- Slatewater Spruce — tall straight spar/mast stock;
- Fragrant Cedar — rot-resistant aromatic stock;
- Crownfields Applewood — dense fruitwood/carving stock;
- Starfen Giant Cane — hollow lightweight bamboo analogue.

Reusable outputs include handle blanks, planks, beams, fine boards, bow staves, hoops, spars, cane poles, pegs/dowels, wheel-spoke sets, and cooper staves.

### Fiber and cordage

The shared plant-fiber hierarchy now includes:

```text
hemp stalk
  -> dressed hemp fiber
  -> hemp yarn
  -> hemp twine
  -> hemp cord
  -> hemp rope
  -> heavy hemp hawser
```

Parallel outputs:
- hemp canvas;
- hemp net webbing;
- flax lamp wick;
- Starfen nettle thread;
- existing reed/rush/flax chains remain valid.

### Industrial consumables

Added:
- hardwood charcoal;
- quicklime;
- whetstone;
- alum mordant;
- wood-ash potash;
- clear glass batch;
- pine tar;
- hide glue.

Selected woodworking transformations now use the production engine's existing `requiredToolTags` seam through `cutting` capability. No new tool-state authority was added.

## Husbandry boundary

**Do not model wool, milk, eggs, honey, manure, or other managed-animal products as flora gathering sources.**

Crownfields already has sheep/cattle/hen/bee ecology, but those products require a deliberate husbandry/managed-animal source authority. Wool and warm-textile chains therefore remain intentionally deferred.

Body-recovered animal materials continue to use legitimate body provenance.

## Data 50 census target

The authored delta should produce the following census when final Check completes:

```text
places/localities                        37
named NPCs                               29
shop/service sites                       25
creature definitions                    58
resource sources                         77
canonical items                         258
recipes/processes                       149
abilities/techniques                     41
quests/contracts                         18
companions                                1
transport services                        6

routes                                   12
spell schools                             4
capabilities/training definitions        44
NPC schedules                            15
regional/shared content packs            21
pack-owned records                      782
runtime seed NPCs                        28
runtime seed enemies                     16
```

Expected raw-resource production utilization: **77/85 (90.6%)**.

Expected luxury raw utilization: **14/14**.

Canonical items now exceed their mechanics floor through connected material-economy depth. The mechanics-scale gate remains **NOT READY** because companions, abilities, named NPC breadth, and quests remain materially short.

## Persistence decision

Game State remains **14**.

Data 50 adds authored source/item/recipe/pack definitions only and reuses:
- ecology/gathering;
- inventory/container;
- provenance;
- production/work-task;
- workstation;
- work proficiency;
- Pack-v2 ownership.

No new durable player/world fact, direct timed-task owner, simulation clock, or inventory authority was introduced.

## Material-culture continuation

Permanent plan:
- `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.

Next recommended material-culture bounded unit:
- **Occupational Tool Conversion**.

That packet should first convert the existing shop/equipment-only baseline tools and goods into real production outputs:
- Field Knife;
- Prospector Pick;
- Woodsman Hatchet;
- Digging Spade;
- Reed Sickle;
- Marsh Fishing Rod;
- Ash Staff;
- Maple Wand;
- Iron Buckler;
- Brass Ring;
- Bronze weapons/armor;
- basic leather garments.

Then add shared smithing, woodworking, masonry, textile, leatherworking, cooking, and measurement hand tools, using durable `requiredToolTags` rather than consuming tools as recipe inputs.

Later material-culture packets cover:
- fishing/netting/rigging/sails;
- containers/milling/brewing/food-industry equipment;
- construction/hardware/carts/harness;
- scholarly/precision/luxury/magical craft;
- managed husbandry products after a real source authority exists.

These are sequencing notes, not automatic authorization.

## Other decision queues

Formal roadmap:
- Packet E — Gate A integration/census audit.

World-edge sequence:
- Slatewater Foothills — complete;
- Crownfields — complete;
- Great Mere — complete;
- Ironspine Highlands — complete;
- **Emberwash Badlands — next ranked candidate**.

No later unit is auto-started merely because it appears in planning.

## Restart order

1. `AGENTS.md`
2. this file
3. `PROJECT_PROFILE.yaml`
4. `docs/EXECUTION_PIPELINE.md`
5. `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`
6. `docs/DEVELOPMENT_DIRECTION.md`
7. `docs/QUALITY_GATES.md`
8. `docs/ROADMAP.md`
9. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
10. relevant runtime/data/tests for the explicitly selected next unit

Do not redo the broad material-culture discovery pass. Its durable result is the material-culture plan and Data 50 substrate.
