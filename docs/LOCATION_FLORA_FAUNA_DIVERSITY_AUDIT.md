# Location Flora & Fauna Diversity Audit

Status: **COMPLETE — PLANNING / CONTENT-QUALITY AUDIT ONLY.**

Baseline inspected: `main` at `76aa98c56d2fbceee7ada4d0b4d694e92ad87eb2`, Product **0.9.100.18**, Data **57**, Game State **14**.

This audit does **not** authorize the recommended additions. It identifies where existing geography, climate, habitat descriptions, ecology populations, and recovery sources no longer line up cleanly after the recent biome expansion.

No Product, Data, Game State, Account Save, Package, or Benchmark change is required for this audit document itself.

## 1. Audit method

The review compared:

- all 55 canonical places;
- the 30 canonical wilderness/dungeon places where ambient ecology is materially relevant;
- canonical species/population placement;
- ecology-family reuse across related regions;
- flora/fungal recovery sources used as the current botanical proxy;
- place descriptions and biome/habitat tags;
- predator/prey family links;
- the locked macro-geography and climate transitions;
- prior deferred ecology gaps from `docs/ECOLOGY_GEOGRAPHY_INTEGRITY_AUDIT.md`.

The audit asks four separate questions:

1. **Local diversity** — does the place contain enough ecological guilds for the described biome?
2. **Regional spread** — do species/families continue plausibly across adjacent transition zones instead of appearing in isolated pockets?
3. **Trophic coherence** — do predators, prey, decomposers, pollinators, aquatic life, and vegetation overlap plausibly?
4. **Taxonomy economy** — can an established family support the missing niche, or does the biome actually justify a new family?

Raw species count alone is not a quality target.

## 2. Important modeling caveat: fauna and flora are not represented symmetrically

Fauna has explicit:

- family;
- species;
- population;
- habitat;
- density/rarity;
- behavior;
- optional encounter authority.

Ordinary plants and fungi generally do **not** have equivalent species/population authority. They are represented mainly through gathering sources and resource items, with place descriptions carrying non-harvestable vegetation fiction.

Therefore:

- a place with three `flora` sources does not necessarily have only three plant species;
- a place with zero flora sources may still describe vegetation, but that vegetation has no canonical recovery/ecology record;
- flora-source count is a useful coverage signal, not a literal biodiversity count;
- adding a full durable botanical-population state family is **not** recommended merely to repair this audit.

A future static botanical-guild/tag convention could improve auditability without introducing new serialized state.

One current taxonomy wrinkle is `source-waymeet-peat-cut`: peat is classified under the existing `flora` source enum even though it is an accumulated organic substrate rather than living vegetation. This does not break gameplay, but it slightly overstates living-flora coverage in Waymeet South Marches.

## 3. Overall assessment

### Strong / coherent regional ecology

The following regions currently have good biome-to-ecology structure and do not need broad species inflation:

- **Gloamwood** — old-growth canopy, large herbivore/omnivore, mesopredator, owl/crow, amphibian, snail/decomposer, moth, wet-forest flora/fungi.
- **Headwater Lower Vale** — cold-stream fish, otter, fox, turtle, alder/willow/cress river flora.
- **Waymeet South Marches** — grouse, fox, bee, owl, cold-burn fish, sedge/bog-myrtle/peat economy.
- **Great Mere Westshore** — forage fish, predatory fish, crayfish, dragonfly, mussel, aquatic/riparian vegetation.
- **Starfen Brackish Coast** — crab, oyster, ray, seal, gull, salt/coastal recovery, kelp wrack.
- **Lower Deepvein** — bats, salamanders, springtails, moths, crab, spider, cavefish, isopod, moss/fungus and mineral niches.
- **Coppergrass Steppe** — grazer, wolf, ground bird, locust, raptor, pulse/fiber/dye/scrub flora; its main remaining gap is small-prey breadth rather than biome identity.
- **Emberwash North Wash** — ibex, lizard, quail, detritivore beetle, fruit/herb/scrub sources form a coherent arid-transition packet.

### Main systemic problem

The world has enough total ecology to establish its biomes, but **distribution is patchier than the geography**.

Several established families stop at place boundaries even where the next place is explicitly the same watershed, mountain transition, forest belt, fen system, or plateau ecotone.

The next ecology work should therefore favor **additional populations or closely related species in established families** before inventing many new families.

## 4. Priority location findings

### P0 — direct fiction/ecology mismatches

#### Emberwash Saltpan Verge

Current:
- four fauna populations: scorpion, vulture, Dust Hare, Saltbrush Tortoise;
- **zero flora recovery sources**.

Place fiction explicitly names **saltbrush**.

This is the clearest current flora mismatch. The tortoise itself is named for vegetation that has no canonical source representation.

Recommended repair:
- add at least one halophyte/saltbrush source;
- preferably add a second salt-basin plant guild such as saltgrass, succulent, or drought annual;
- consider extending Glasswing Beetle or another existing detritivore/insect into the verge rather than inventing a new hostile creature.

No new fauna family is required to fix the core issue.

#### Thornwall Old Gaol

Current:
- zero populations;
- zero flora/recovery sources.

This is the only wilderness/dungeon-scale place with no ecological substrate at all, and the gap was already identified in the Data 45 integrity audit.

Its cistern passages, disused cells, and old foundations plausibly support:
- bats;
- spiders;
- cellar/commensal vermin;
- damp moss, mold, or fungi;
- salvage/archaeological material.

Existing Bat and Spider families can cover part of the repair. A generalized commensal-rat family may eventually be preferable to misusing the agricultural Field Rat family.

#### Timbercross Landing

Current:
- River Otter;
- river turtle;
- zero flora recovery sources.

For a navigable forest river bend and timber landing, the ecology is too sparse.

Recommended repair:
- add riparian vegetation coverage;
- add at least one fish population/source;
- add waterfowl or amphibian/insect life if the local channel geometry supports it.

Existing Otter, Turtle, Waterfowl, Frog, and Dragonfly families can be reused where appropriate. A **lower-river fish family** is a credible new-family candidate because the lower navigable river need not share the cold-stream trout niche of Headwater Vale.

#### Reedcrown Isle

Current:
- Crown Grebe;
- Basking Turtle;
- zero flora recovery sources despite explicit “reed crowns”;
- Crown Grebe links to Lake Perch, but no perch population is scoped to the island place.

The same-region prey relationship is plausible, so this is not a broken trophic reference. It is nevertheless a local distribution gap.

Recommended repair:
- add a reed/rush/aquatic-plant source;
- add a Silver Perch shoal or equivalent local fish population around the island shallows;
- optionally extend Dragonfly or Waterfowl-family presence.

No new family is required.

### P1 — strong under-spread relative to habitat

#### Headwater Upper Vale

Current:
- Red Deer;
- Moss Owl;
- one Meadowsweet source.

Description also includes meadow benches, cold tributaries, forest, cliffs, flood channels, and the immediate transition into Windscar Saddle.

Recommended spread:
- Grouse family into upper meadow/scrub;
- Bee family into meadow flowering season;
- Stream Trout into suitable tributaries;
- possibly Marmot only at the highest rocky benches if the habitat genuinely overlaps the saddle;
- add one or two meadow/berry/shrub sources.

This is a **family-spread repair**, not a new-family need.

#### North Redstone Reach

Current:
- Crag Marmot;
- Cliff Vulture;
- one Ridge Millet flora source.

It sits immediately below the Ironspine system and is described as wind-scoured ridge/mine-road country.

Recommended spread:
- Ridge Ibex into appropriate ridges;
- Lizard on warmer exposed rock;
- Grouse on scrub/grass transitions where plausible;
- at least one dry scrub/bunchgrass or hardy woody source;
- consider Stonepine/dwarf-shrub overlap only close to the lower pass, not across all North Redstone.

Existing families are sufficient.

#### East Elderwood

Current:
- Embercoat Fox;
- Amber Bee;
- six substantial plant/tree sources.

This creates a flora-rich forest with unusually little vertebrate and bird ecology compared with West Elderwood.

Recommended spread from existing forest families:
- Hare;
- Hart or another deer population;
- Owl;
- Barkboar where root-thicket habitat exists.

A small woodland songbird family would improve world-scale bird guild breadth, but is not necessary to repair East Elderwood itself.

#### East Starfen

Current:
- Bellfrog;
- Fen Duck;
- five flora/fiber/wood sources.

For open fen and grass islands, aquatic and wading guilds are much thinner than West Starfen.

Recommended spread:
- Mire Heron;
- Reed Eel or another shallow-channel fish;
- Reed Crab in suitable mud/shallow-water patches;
- Dragonfly-family population from the Great Mere transition.

Existing families can do the work.

#### Slatewater Foothills

Current fauna is dominated by large vertebrates:
- bear;
- lynx;
- grouse;
- eagle.

Flora coverage is strong.

Missing guilds:
- small prey;
- pollinator/insect life;
- woodland-edge small mammal.

Recommended:
- reuse Hare family;
- reuse Bee family around serviceberry/thyme;
- consider a new **tree-squirrel or ground-squirrel family** only if a multi-region small-mammal pass is planned.

#### Crownfields

Managed ecology is coherent but almost entirely domestic/pest/pollinator:
- cattle;
- sheep;
- chickens;
- Field Rat;
- Honeybee.

The described hedgerows, ditches, coppices, orchard belts, and water meadows should also carry ordinary wild fauna.

Recommended existing-family spread:
- Hare;
- Fox;
- Owl;
- Frog in drainage ditches;
- Waterfowl in water meadow/ditch complexes where suitable.

A small **farmland/hedgerow passerine** family would be a justified new addition, especially if shared with Elderwood and Slatewater.

#### Ironspine Highlands

The region successfully covers the headline alpine vertebrates, but has no insect/pollinator population.

Recommended:
- Bee-family alpine species around sorrel and lower-pass flowering shrubs;
- Hare-family alpine/snow-hare species if small prey breadth is desired;
- add a Grouse population in High Meadow if local predator/prey overlap is preferred over region-scale overlap.

No new alpine family is strictly required.

#### Coppergrass Steppe

Current trophic structure is clear:
- Courser;
- Wolf;
- Bustard;
- Locust;
- Kite.

The missing guild is a **small burrowing herbivore/prey base**.

Short-term option:
- reuse Hare family with a steppe species.

Higher-value future option:
- add a **ground-squirrel/vole family** that can also support Waymeet plateau, Crownfields margins, and selected foothill habitats.

This is one of the strongest genuinely new-family candidates.

#### South Redstone Reach

Fauna breadth is reasonable, but vegetation is represented by only Sun Crocus while the biome is a dry upland crossed by quarry/caravan routes.

Recommended:
- add dry bunchgrass;
- hardy scrub or dwarf woody vegetation;
- optionally a drought herb/resin plant.

The issue is botanical coverage rather than missing fauna families.

### P2 — bounded dungeon/secondary gaps

#### Deepvein Mine

Two cave populations and mineral sources are present, but no fungi/moss recovery occurs until the Lower Decline.

A small fungal/moss seam would improve vertical ecological continuity if supported by mine moisture/light fiction.

#### Sunken Archive

Only Threadspider is represented.

The half-submerged ruin plausibly supports some combination of:
- Frog;
- wetland invertebrate;
- Rootling where magical/plant intrusion is appropriate;
- algae/moss/reed recovery;
- salvage.

Use established families first.

#### Redfang Camp

The raider population is sufficient for its primary purpose, but the camp has no ordinary commensal/scavenger substrate.

Low-priority options:
- rat/vermin;
- crow/scavenging bird;
- firewood/salvage source.

Do not turn this into an ecology-heavy wilderness merely for count.

## 5. Predator/prey distribution findings

Existing family-link validation is structurally sound, but four predators have prey links that are present only elsewhere in the same region:

| Predator | Place | Linked prey absent locally | Regional status |
| --- | --- | --- | --- |
| Crown Grebe | Reedcrown Isle | Lake Perch | present at Great Mere Westshore |
| Froststep Lynx | Ironspine High Meadow | Grouse | present at Ironspine Lower Pass |
| Whitecrest Eagle | Ironspine High Meadow | Grouse | present at Ironspine Lower Pass |
| Cairnward Eagle | Windscar Saddle | Grouse | present at Waymeet South Marches |

These are **not errors**. Mobile predators can forage across a regional range.

However, when future ecology density is added, these four are good places to improve same-place overlap:
- island perch shoal;
- High Meadow Snow Grouse;
- Windscar Grey Grouse.

## 6. High-value missing family/guild candidates

### A. Ground squirrel / vole / small burrowing rodent — HIGH

Why:
- Coppergrass has no small burrowing mammal despite steppe habitat;
- Waymeet plateau and meadow country could support a related small-prey niche;
- Crownfields margins and selected foothills could support species variants;
- it strengthens raptor/fox/wolf trophic logic without requiring aggression.

This is the strongest broadly reusable new fauna-family candidate.

### B. Small passerine / seed-eating songbird — HIGH

Current bird diversity is weighted toward:
- raptors;
- owls;
- grouse/quail/bustard;
- waterfowl/waders;
- gull/vulture/crow.

Temperate forest, hedgerow, orchard, foothill, and open-grassland small birds are almost absent.

A Finch, Lark, Thrush, or similarly grounded family could support several regional species. Prefer one clearly scoped family rather than a vague “songbird” catch-all.

### C. Lower-river fish — MEDIUM-HIGH

Timbercross is a navigable river bend but has no fish population/source.

Headwater Stream Trout should not automatically occupy every warmer/deeper downstream reach.

A river chub/dace/barbel-like family would give the lower river a distinct hydrological identity and could support future lower western river country.

### D. Shorebird / small wader — MEDIUM

Starfen Delta has heron, duck, gull, and coastal fauna but lacks the dense small-wader guild typical of mudflat/saltmarsh transitions.

This is useful for future coastal depth, but not necessary before more important terrestrial gaps.

### E. Snake — MEDIUM / OPTIONAL

The current world has lizards, turtles/tortoises, amphibians, and arachnids but no snake family.

A snake family could plausibly span:
- Redstone;
- Emberwash;
- Coppergrass;
- Starfen margins.

This is an ecological breadth opportunity, not a present coherence defect.

## 7. Existing families that should be spread before inventing replacements

Highest-value reuse candidates:

- **Hare** — East Elderwood, Crownfields, Slatewater, Coppergrass, possibly Ironspine.
- **Bee** — Headwater Upper Vale, Slatewater, Ironspine; existing generic family is already suitable.
- **Grouse** — Headwater Upper Vale, Windscar Saddle, Ironspine High Meadow.
- **Waterfowl** — Timbercross/Reedcrown where habitat supports it.
- **Frog** — Timbercross riparian margins, Crownfields ditches, East Starfen expansion.
- **Dragonfly** — East Starfen and Great Mere/Reedcrown transition.
- **Mire Heron / Reed Eel / Crab** — broader East Starfen and lower-delta distribution.
- **Ridge Ibex** — North Redstone transition.
- **Lizard** — warmer North Redstone slopes.
- **Bat / Spider** — Thornwall Old Gaol before inventing bespoke dungeon families.

## 8. New-biome specific verdicts

### Waymeet Marches / central plateau

**Verdict: good.**

The new biome does not need another large family tranche.

Strengths:
- saddle marmot + eagle + tarn waterfowl;
- march grouse + fox + bee + owl + cold-burn fish;
- heather, whortleberry, bog myrtle, sedge;
- realistic pack/wagon transition ecology.

Recommended future refinements:
- Grouse overlap at Windscar;
- small burrowing rodent only if a broader multi-region family is introduced;
- treat Peat Cut as organic substrate rather than evidence of a third living plant taxon during future audits.

### Emberwash

**Verdict: good north-wash ecology; incomplete saltpan flora.**

No large fauna expansion is required before repairing the missing halophyte vegetation.

### Lower Deepvein

**Verdict: strong for a cave frontier.**

Its low “flora” count is not a defect because fungi/moss/organic cave substrate naturally occupy fewer recoverable niches than surface vegetation.

### Gloamwood

**Verdict: strong.**

It currently has the best decomposer/wet-forest microfauna representation among surface forests. Avoid duplicating its specialized old-growth families into ordinary Elderwood merely to increase counts.

### Starfen Delta / Brackish Coast

**Verdict: strong coast, moderate lower-delta thinness.**

Future improvement should favor mudflat/wader and lower-delta distribution before inventing new marine megafauna.

## 9. Recommended bounded repair order

If ecology repair is selected as the next content-quality tranche, use this order:

1. **Legacy Elderwood Ecology Repair**
   - Timbercross Landing;
   - East Elderwood;
   - Thornwall Old Gaol;
   - Redfang Camp only where useful.
2. **Dry Upland & Saltpan Ecology Repair**
   - North/South Redstone vegetation;
   - Emberwash Saltpan halophytes;
   - existing-family transition spread.
3. **Headwater / Highland Transition Spread**
   - Headwater Upper Vale;
   - Windscar Grouse overlap;
   - Slatewater/Ironspine pollinators and small prey.
4. **Wetland / Island Distribution Repair**
   - East Starfen;
   - Reedcrown Isle;
   - Starfen Lower Delta.
5. **Cross-biome family breadth**
   - small burrowing rodent;
   - scoped passerine;
   - lower-river fish;
   - optional shorebird/snake only when player/economic loops justify them.

Do **not** implement all five as one automatic megatranch.

## 10. Suggested future quality guard

A future ecology-density audit should use **biome guild expectations**, not an equal species minimum.

Examples:

- temperate forest: herbivore/small prey + mesopredator + bird + insect/decomposer + multiple vegetation strata;
- riparian river: fish + bank/aquatic vertebrate or amphibian + bird/insect + riparian vegetation;
- steppe: grazer + small burrower + predator + ground bird + insect + grass/forb/shrub;
- arid/badland: herbivore + reptile/arthropod + scavenger/predator + drought vegetation;
- alpine: grazer + small mammal + ground bird + raptor + pollinator + dwarf shrub/forb/lichen;
- wetland: fish/invertebrate + amphibian + waterfowl/wader + reed/sedge/aquatic vegetation;
- brackish/coast: benthic/filter feeder + fish + coastal bird + saltmarsh/seagrass/kelp, with marine mammals where geography supports them;
- cave: detritivore/invertebrate + bat/amphibian/fish where supported + fungi/moss/organic substrate + mineral context.

This should remain a **review heuristic**, not a CI rule that forces filler.

## 11. Version and persistence decision

This audit changes documentation only.

- Product: **0.9.100.18** unchanged.
- Package: **0.9.100** unchanged.
- Data: **57** unchanged.
- Game State: **14** unchanged.
- Account Save: **5** unchanged.
- Benchmark: **3** unchanged.

Any later species/population/source/resource additions would require a deliberate Data increment because they would add canonical authored content.

No new durable serialized state family is indicated by this audit.


## Data 58 repair status

Repair unit 1, **Legacy Elderwood Ecology Repair**, is complete and promoted as Data 58 / Product 0.9.100.19.

Resolved:
- Timbercross Landing riparian flora, fish, waterfowl, and amphibian thinness;
- East Elderwood understory/medicinal/decorative flora and ordinary forest-fauna spread;
- Thornwall Old Gaol's zero-substrate ecology gap;
- lower-river fish-family absence through the new River Dace family.

The repair deliberately did not inflate Redfang Camp or add a generalized botanical-population state system.

Measured post-repair breadth:
- 110 creature definitions;
- 134 sources;
- 390 canonical items;
- 225 recipes/processes;
- 135/145 raw resources with production demand.

Updated repair sequence:
1. Legacy Elderwood Ecology Repair — **COMPLETE / Data 58**;
2. **Dry Upland & Saltpan Ecology Repair — NEXT RANKED / NOT AUTO-STARTED**;
3. Headwater / Highland Transition Spread;
4. Wetland / Island Distribution Repair;
5. Cross-biome family breadth.


## Data 59 repair status

Repair unit 2, **Dry Upland & Saltpan Ecology Repair**, is complete and promoted as Data 59 / Product 0.9.100.20.

Resolved:
- South Redstone's rare-flower-only botanical bias through common bunchgrass, herb, and woody-resin layers;
- North Redstone's thin Ironspine-transition ecology through juniper/yarrow plus Ridge Ibex, Sunscale Lizard, and Grouse presence;
- Emberwash Saltpan's missing living halophyte recovery through food, fiber, and decorative/dye plant layers.

The repair deliberately added **no new fauna family** and no additional Saltpan or South Redstone animals merely for count. Non-economic dryland/salt-flat vegetation remains descriptive.

Measured post-repair breadth:
- 111 creature definitions;
- 142 sources;
- 406 canonical items;
- 233 recipes/processes;
- 144/153 raw resources with production demand.

Updated repair sequence:
1. Legacy Elderwood Ecology Repair — **COMPLETE / Data 58**;
2. Dry Upland & Saltpan Ecology Repair — **COMPLETE / Data 59**;
3. **Headwater / Highland Transition Spread — NEXT RANKED / NOT AUTO-STARTED**;
4. Wetland / Island Distribution Repair;
5. Cross-biome family breadth.


## Data 60 repair status

Repair unit 3, **Headwater / Highland Transition Repair**, is complete and promoted as Data 60 / Product 0.9.100.21.

Resolved:
- Headwater Upper Vale's sparse faunal overlap through Meadow Grouse, Meadow Bee, and upper-tributary Coldstream Trout presence;
- Upper Vale botanical thinness through one useful Bilberry recovery node plus fescue, sedge, flowering-groundcover, dwarf-willow, moss, and berry-mat description;
- Windscar Saddle's missing Grouse overlap through the existing South March Grey Grouse;
- Slatewater's large-vertebrate weighting through Brush Hare and Thyme Bee presence;
- Ironspine's missing pollinator/small-prey/high-meadow-grouse distribution through Snow Hare, Sorrel Bee, and High Meadow Snow Grouse.

The repair deliberately added **no new ecology family** and only one new gathering source. Existing Lynx prey-family metadata was left unchanged to avoid rewriting older pack-owned species records within a distribution-only tranche.

Measured post-repair breadth:
- 116 creature definitions;
- 143 sources;
- 408 canonical items;
- 234 recipes/processes;
- 145/154 raw resources with production demand.

Updated repair sequence:
1. Legacy Elderwood Ecology Repair — **COMPLETE / Data 58**;
2. Dry Upland & Saltpan Ecology Repair — **COMPLETE / Data 59**;
3. Headwater / Highland Transition Spread — **COMPLETE / Data 60**;
4. **Wetland / Island Distribution Repair — NEXT RANKED / NOT AUTO-STARTED**;
5. Cross-biome family breadth.
