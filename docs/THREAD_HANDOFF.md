# Thread Handoff

Repository evidence beats conversation memory.

## Current contract

```text
Product:       0.9.100.24
Package:       0.9.100
Account Save:  5
Game State:    15
Data:          62
Benchmark:     3
Codename:      Cross-Biome Family Breadth
Runtime:       Node >=24
Phase:         0.9
Track state:   0.9.100 Content Scale Gate A COMPLETE
Next formal:   0.9.200 Adventure Vertical Slices QUEUED
```

Latest promoted runtime/data remains:
- Cross-Biome Family Breadth;
- implementation freeze `c5e12b5d8f0b6ddf7a76f5df01316567b43d4528`;
- promoted runtime/data SHA `bc472b60374a048686b0ee6c877ba26c515aec35`;
- Product 0.9.100.23 / Data 62 / Game State 14 / Package 0.9.100.

Packet E / Content Scale Gate A remains complete:
- audit `docs/GATE_A_INTEGRATION_CENSUS_AUDIT.md`;
- implementation freeze/promoted audit SHA `81b2928611a297d765eaa64f7cedeadb5fd697ee`;
- Check #1638 / run `33332932015`: Repository Audit, **822/822 tests**, Census, Benchmark 3, Benchmark Sample PASS.

The five-part flora/fauna diversity repair sequence remains complete through Data 62. Do not restart it automatically.

## Current completed planning unit

**Player Information & Locality Discovery design authority is COMPLETE; implementation has NOT started.**

Permanent authority:
- `docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md`.

The user-facing intent is now explicit:

- the UI must not expose all authored options merely because they exist;
- canonical world truth and character knowledge are separate;
- NPC canonical names are masked until learned through introduction, reference, credible visual identification, prior acquaintance, or other authored source;
- knowing a name and recognizing the person on sight are separable;
- POI/location knowledge is layered:
  - Unknown;
  - Referenced/Rumored;
  - Sighted;
  - Recognized;
  - Familiar;
- a sighted entrance/building/district never auto-transitions;
- direct `Go to`-class local navigation is familiarity-gated;
- settlement navigation may use an abstract learned locality graph rather than a literal city coordinate grid;
- route/passages remain inter-place traversability authority;
- `Look Around` is immediate local observation;
- `Explore` advances fictional time and resolves context-weighted discovery/ambient events;
- exploration RNG must use deterministic/injectable game conventions, not wall-clock randomness;
- temporary directions create a save-persistent search bias rather than teleportation;
- wandering/conditional merchants/events may remain ephemeral and non-fast-travelable even after encounter;
- shops use reach -> Enter -> NPC interaction -> Shop -> stock-derived categories/Browse;
- closed services respect schedules without erasing the known building;
- specialty/hidden services may be gated by quest, relationship/reputation, referral, schedule, event/weather/harvest conditions, remote geography, limited stock, or hidden access;
- theft/payment/ambush/reputation/discovery outcomes must call owning gameplay systems rather than exist only in prose;
- greeting/dialogue prose should have personality-consistent variants while semantic outcomes remain explicit and testable.

Initial familiarity tuning defaults recorded in the authority:
- Tier 1 major/high-traffic: 5 exposure points;
- Tier 2 ordinary specialist/secondary: 7;
- Tier 3 tucked-away/uncommon: 10;
- Tier 4 obscure/secretive: 14.

These are data-driven defaults, not universal constants. Strong guidance, maps, being led, and purposeful use may accelerate familiarity so the loop does not become button grinding.

## Important current-runtime mismatch

Existing pieces are useful but too permissive for the intended player experience:

- `atlas` already owns physical visit knowledge;
- `discoveredPois` is currently binary;
- POI interaction currently discovers the POI immediately;
- same-place POI fast travel can follow that one discovery;
- some current player-facing projections can expose canonical NPC names directly.

Do **not** polish broad UI on top of those semantics.

The current binary `discoveredPois` behavior is transitional.

## Planned prerequisite before broad UI

When player-facing UI/control implementation is explicitly selected, first implement the bounded **Local Knowledge & Familiarity Foundation**.

Expected order:

1. define durable locality/NPC knowledge state;
2. mask player-facing NPC identity;
3. split reference/sighting/recognition/familiarity;
4. replace one-step POI direct navigation;
5. add `Look Around` / `Explore` semantic actions;
6. add explicit entry/exit transition gates;
7. add familiarity-aware local navigation;
8. add temporary directions/search bias;
9. add contextual exploration event resolver;
10. stage NPC-mediated shop interaction;
11. then build/polish the broader UI.

Player personality/dialogue disposition is a separate future bounded player-identity feature and may later feed dialogue presentation. It does not block core locality discovery.

## Persistence / version decision

This completed unit is **design/documentation only**.

No runtime or canonical authored-data change occurred.

```text
Product:       0.9.100.23 unchanged
Package:       0.9.100 unchanged
Account Save:  5 unchanged
Game State:    14 unchanged
Data:          62 unchanged
Benchmark:     3 unchanged
```

However, implementation of Local Knowledge & Familiarity Foundation must deliberately reassess Game State.

Reason:
- familiarity affects future navigation;
- learned NPC identity affects future presentation/social access;
- known connectors affect available direct actions;
- temporary directions/search bias affects future exploration probabilities;
- these facts must survive save/load.

Do not hide that durable contract change inside UI code or preserve obsolete `discoveredPois` semantics merely for pre-alpha save compatibility.

## Authorities synchronized in this planning pass

- `docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md` — new permanent design authority;
- `docs/DEVELOPMENT_DIRECTION.md`;
- `docs/ARCHITECTURE.md`;
- `docs/SYSTEM_CATALOG.md`;
- `docs/QUALITY_GATES.md`;
- `docs/EXECUTION_PIPELINE.md`;
- `docs/ROADMAP.md`;
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md`;
- `PROJECT_PROFILE.yaml`;
- `README.md`.

Last pre-handoff authority commit:
- `0fcf16192c9f60fd3c7717f1f1e677df955597fe`.

**This file is the final repository-file write for the planning pass.**

## Standing rules preserved

Continue to preserve:
- route graph as inter-place traversability/distance/time authority;
- touching map envelopes do not imply travel;
- acquired map knowledge rather than omniscient maps;
- ecology/provenance/food-safety/production-sink rules;
- passive wildlife behavior;
- Pack-v2 ownership/dependency rules;
- deterministic simulation/testing conventions;
- canonical fictional time;
- no wall-clock canonical schedules;
- no duplicate world/NPC/route database in player knowledge state;
- no serialized presentation prose or button lists.

## Next decision boundary

No implementation was auto-started.

Formal roadmap remains:
1. `0.9.200 Adventure Vertical Slice A`;
2. `0.9.300 Advanced Combat / Training`;
3. `0.9.400 Economy / Production Depth` / Occupational Tool Conversion;
4. `0.9.500 Quest / Social Depth`;
5. `0.9.600 Playable-Alpha Scale Push`.

Separate world-edge ranking remains:
1. Waymeet Inner Marches / outer crossroads approach;
2. Coppergrass extensions;
3. Drowned Vaults.

**Before broad UI/player-control implementation, Local Knowledge & Familiarity Foundation is a mandatory prerequisite bounded unit.**

## Restart order

1. `AGENTS.md`
2. this file
3. `PROJECT_PROFILE.yaml`
4. `docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md`
5. `docs/DEVELOPMENT_DIRECTION.md`
6. `docs/ARCHITECTURE.md`
7. `docs/EXECUTION_PIPELINE.md`
8. `docs/ROADMAP.md`
9. relevant runtime files only if implementing the prerequisite:
   - `js/text/systems/atlasEngine.js`
   - `js/text/systems/poiEngine.js`
   - `js/text/gameState.js`
   - `js/text/systems/validation.js`
   - player-facing information/UI projection files

## Final validation requirement

Validate the exact final `main` head with hosted Check and Pages.

Hosted Check includes:

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```
