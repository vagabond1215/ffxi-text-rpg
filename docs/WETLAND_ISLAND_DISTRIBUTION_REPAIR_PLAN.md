# Wetland / Island Distribution Repair Plan

Status: **COMPLETE / PROMOTED DATA 61.**

Baseline: Product **0.9.100.21**, Data **60**, Game State **14**, Package **0.9.100**.

Promoted result: Product **0.9.100.22**, Data **61**, Game State **14**, Package **0.9.100**.

Authority:
- `docs/LOCATION_FLORA_FAUNA_DIVERSITY_AUDIT.md`
- `docs/HEADWATER_HIGHLAND_TRANSITION_REPAIR_PLAN.md`
- `docs/ITEM_CONSUMPTION_SAFETY.md`
- `docs/WORLD_MACRO_TOPOLOGY.md`

This is repair unit **4 of 5** from the location flora/fauna diversity audit. It does not authorize Cross-biome Family Breadth, world-edge expansion, material-culture work, or dungeon ecology work in the same bounded run.

## 1. Scope

This pass covers only:
- East Starfen;
- Reedcrown Isle;
- Starfen Lower Delta.

The objective is **distribution continuity across freshwater fen, lake-island, and lower-delta transition habitat**.

No new places, routes, settlements, NPCs, shops, services, quests, gathering-source economy, or durable serialized state family is authorized.

## 2. Family/species reuse rule

No new ecology family is planned.

No new species is planned.

Reuse only established canonical species where their existing habitat and family identity remain credible:
- Starfen Mirecrest Heron;
- Starfen Reed Eel;
- Starfen Reed Crab;
- Starfen Fen Duck;
- Great Mere Silver Perch;
- Great Mere Glasswing Dragonfly;
- Delta Saltflat Mud Crab.

This unit is intentionally a placement repair, not a taxonomy expansion.

## 3. East Starfen

Current:
- Bellfrog;
- Fen Duck;
- five established flora/fiber/wood recovery lines;
- open fen and grass islands.

Defect:
- aquatic, wading, shallow-channel, and insect guilds are thinner than West Starfen despite compatible habitat.

Planned distribution:
1. **Mirecrest Heron** — shallow channels and grass-island margins;
2. **Reed Eel** — reed channels and slow fen water;
3. **Reed Crab** — mud/shallow-water patches;
4. **Great Mere Glasswing Dragonfly** — reed margin and flowering wetland transition.

No new East Starfen source is required.

Descriptive non-node wetland layers may be strengthened with sedges, rushes, duckweed-like floating cover, reed litter, mud-bank herbs, and ordinary marsh flowers where useful.

## 4. Reedcrown Isle

Current:
- Crown Grebe;
- Basking Turtle;
- rare Cloudwater Pearl recovery;
- reed crowns, nesting ground, clear shallows, mussel gravel, and basking rocks.

Defects:
- Crown Grebe's linked perch prey is regional rather than same-place;
- insect transition life is absent;
- waterfowl overlap is thin for a low reed-ringed nesting island.

Planned distribution:
1. **Great Mere Silver Perch** — clear-shallow shoal around the island;
2. **Great Mere Glasswing Dragonfly** — reed-margin breeding/feeding overlap;
3. **Starfen Fen Duck** — reed-crown and shallow-island waterfowl overlap.

No new island fishery or plant source is required. Existing pearl recovery remains the only new-island economic node.

Descriptive non-node vegetation may mention floating pondweed, reed litter, low sedges, water mint-like herbs, and algae on basking stones without turning them into inventory records.

## 5. Starfen Lower Delta

Current:
- Brackish Reed Eel;
- Grey Delta Heron;
- Saltmarsh Duck;
- samphire and saltmarsh reed recovery;
- broad distributaries, mud banks, reed islands, natural levees, and increasingly brackish water.

Defect:
- lower-delta benthic/shallow-mud invertebrate presence is thinner than the coast despite compatible mud-bank habitat.

Planned distribution:
1. **Delta Saltflat Mud Crab** — upper tidal creeks, mud banks, and brackish levee margins.

No new lower-delta resource source is required; the existing coastal crab trap ground remains the authored recovery location.

Descriptive non-node layers may mention freshwater reed remnants, sedges, mud-bank herbs, floating debris/algae, and salt-tolerant transition grasses.

## 6. Planned authored delta

Expected:
- new ecology families: **0**;
- new species: **0**;
- new population placements: **8**;
- new gathering sources: **0**;
- new raw resources: **0**;
- new transformations: **0**;
- new production outputs: **0**.

Planned populations:
1. East Starfen Mirecrest Heron;
2. East Starfen Reed Eel;
3. East Starfen Reed Crab;
4. East Starfen Glasswing Dragonfly;
5. Reedcrown Silver Perch;
6. Reedcrown Glasswing Dragonfly;
7. Reedcrown Fen Duck;
8. Lower Delta Saltflat Mud Crab.

## 7. Recovery/economy boundary

This unit must **not** add recovery nodes merely because populations spread.

Examples:
- Upper-island Silver Perch may exist ecologically while the established Great Mere Westshore fishery remains the authored catch source.
- Lower-delta Mud Crab may exist ecologically while the established Brackish Coast trap ground remains the authored crab recovery source.
- Dragonflies, herons, ducks, and ordinary wetland vegetation do not need inventory outputs.

This is intentional separation between **ecological presence** and **player-authorized recovery**.

## 8. Pack-v2 ownership

Create one bounded cross-region repair pack:

**Wetland / Island Distribution Repair**
- region ownership: Starfen, Great Mere, Starfen Delta;
- owns only the eight new population records;
- depends on existing Starfen, Great Mere, and Starfen Delta ecology packs needed for reused species/family authority.

Existing canonical species remain owned by their current packs.

## 9. Persistence/version intent

Expected if implemented and promoted:
- Product revision: **0.9.100.22**;
- Data: **61**;
- Game State: **14**;
- Package: **0.9.100**;
- Account Save: **5**;
- Benchmark: **3**.

Game State remains 14 because this is static authored population distribution only. No new serialized ecology state family is planned.

## 10. Validation

Focused:
- ecology registry validation;
- zero new family/species assertion;
- exact eight-population placement count;
- species-resolution across existing catalogs;
- Pack-v2 dependency/ownership validation;
- Reedcrown same-place Grebe/Perch overlap;
- no new gathering source/resource/process;
- descriptive habitat enrichment;
- no geography expansion.

Full contract:

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Deterministic breadth guards move only from measured hosted results.


## 11. Implementation result

Implemented authored delta:
- new ecology families: **0**;
- new species: **0**;
- new population placements: **8**;
- new gathering sources/raws: **0**;
- new transformations/outputs: **0**;
- new Pack-v2 repair graphs: **1**.

The repair uses existing species exactly as planned:
- East Starfen: Mirecrest Heron, Reed Eel, Reed Crab, Glasswing Dragonfly;
- Reedcrown Isle: Silver Perch, Glasswing Dragonfly, Fen Duck;
- Starfen Lower Delta: Saltflat Mud Crab.

Recovery authority remains intentionally unchanged:
- Silver Perch is newly present at Reedcrown, but the established Great Mere Westshore fishing source remains the catch authority;
- Saltflat Mud Crab is newly present in the Lower Delta, but the Brackish Coast trap ground remains the recovery authority.

Implementation freeze:
- `48948292ea26a38d91d306d12998973c1ae35677`;
- Check #1626 / run `33325861973`;
- Repository Audit PASS;
- **817/817 tests PASS**;
- Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS.

Promoted runtime/data SHA:
- `d861b1a6cdeca5a470fb13fa429a7329353b6b02`.

Measured Data 61 breadth:
- 116 creatures;
- 143 resource sources;
- 408 canonical items;
- 234 recipes/processes;
- 38 regional/shared packs;
- 1,304 pack-owned records;
- 129 Pack-v2 population records;
- 145/154 canonical raw resources with production demand.

No later ecology repair is authorized by completion of this unit.
