# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Read order

1. `AGENTS.md` — direct-`main` workflow, autonomous-session budget, scope boundaries, and handoff protocol.
2. `docs/DEVELOPMENT_DIRECTION.md` — authoritative design north star.
3. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-setting, naming, legacy-data, provenance, scale, and content-pack policy.
4. `docs/ROADMAP.md` — current implementation sequence and milestone gates.
5. `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — version protocol.
6. `docs/TRANSITIONAL_ARCHITECTURE.md` — temporary seams that must not harden into final design.
7. Relevant runtime/data/tests for the next bounded unit.

Older planning documents preserve useful history but do not override the files above.

## Current Git workflow

The repository is in an early single-maintainer development phase. Per `AGENTS.md`, **continue directly on `main` by default**.

Do not create a branch/PR merely as ceremony. Use isolation if the user asks, a tool requires it, or the change is unusually risky enough that isolation materially helps.

Remote branch deletion is not exposed by the current GitHub connector, so stale remote branches remain a manual repository-maintenance task. Do not create replacement cleanup branches.

## Autonomous work-session limit

`AGENTS.md` sets the operating guardrail:

- maximum autonomous session: **2 hours 45 minutes**;
- **2:15** stabilization checkpoint;
- **2:30** start no new implementation unit;
- by **2:45** persist a coherent state, update this handoff, and report;
- if elapsed time cannot be measured reliably, use the fallback maximum of **6 autonomous work cycles**, reserving cycle 6 for stabilization/handoff.

A new user message starts a new budget. Roadmap `Next` sections do not authorize an endless autonomous chain.

## Product identity

Working title: **Hearth & Horizon**.

This is an original text-first persistent fantasy life RPG about one continuous character building livelihood, skills, relationships, reputation, material capability, home/infrastructure, and geographic reach across a connected fantasy world.

Earlier FFXI-derived material is **legacy research/reference/migration material**, not canonical world content.

Core laws:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

## Current baseline

```text
Product:      0.5.650.1
Package:      0.5.650
Account Save: 4
Game State:   5
Data:         17
Benchmark:    1
Codename:     Ecology Substrate
```

`js/text/version.js` is authoritative.

## Completed sequence

The current coherent sequence on `main` is:

- 0.4 foundation/versioning/ordered migrations/ActionResult/semantic events/stabilization;
- 0.5.100 deterministic world clock;
- 0.5.200 pause/speed controls;
- 0.5.300 canonical timed tasks;
- 0.5.400 deterministic interrupt model;
- 0.5.500 day boundaries/end-of-day review;
- 0.5.550 original-world identity/stable-ID migration;
- 0.5.600 persistent projects and resource provenance;
- 0.5.650 ecology, gathering-source, and population substrate.

Do not restart earlier tracks unless a concrete regression requires it.

## 0.5.650 — exit status

The ecology/gathering/spawn substrate is **complete enough to exit the track**. It deliberately proves contracts with representative content rather than beginning high-volume generation.

### Canonical ecology catalog

`js/text/data/ecologyCatalog.js` now provides:

- canonical family records;
- canonical species records separated from encounter instances;
- habitat tags;
- aggression, senses, social mode, and family-link behavior metadata;
- place-bound population records;
- population capacity, density, rarity, and deterministic respawn rules;
- deterministic appearance conditions using canonical day/time or explicit flags;
- named-variant hooks without arbitrary random appearance semantics;
- flora, mineral, and fishing gathering-source definitions;
- source action, tool, proficiency, capacity, output, and regeneration contracts;
- standalone cross-reference validation across families/species/populations/places/sources/actions/items/provenance.

Representative records span multiple distinct ecological cases: Elderwood beasts/raiders, Redstone burrowers, Deepvein cave bats, Starfen plantoids/raiders, a rare Moon-Antler Hart, forest flora/timber, upland ore/clay, wetland reeds/herbs, and fishing water.

### Canonical raw resource items

`js/text/data/resourceItems.js` provides representative raw-resource item templates for the ecology substrate. Each item has canonical source/place/action provenance and intentional sinks rather than existing as an isolated loot name.

Current representative items include Elderwood Sweetroot/Hardwood, Redstone Copper Ore/Clay, Starfen Reed Fiber/Marrowleaf/Silverfin.

### Persistent ecology state

`js/text/systems/ecologyEngine.js` provides additive Game State v5 ecology state with:

- lazy runtime records for populations and gathering sources;
- persistent available-unit/depletion state;
- deterministic regeneration/respawn from `worldTime.totalSeconds`;
- population consumption;
- environmental harvesting;
- place, active-condition, tool, proficiency, and capacity checks;
- atomic normal-inventory insertion before source depletion;
- semantic events for population consumption and resource harvesting;
- runtime ecology-state validation.

No real-world timer is authoritative. Full sources do not accumulate unbounded hidden regeneration while already full.

### Encounter/species boundary

`createEnemy()` now supports `speciesId`, and canonical seed world enemies use that field to reference their species record. This keeps combat encounter templates distinct from species/ecology identity.

The training dummy remains an artificial test target and therefore does not require a world species record.

### Rare/named behavior

Rare/named hooks are deterministic or world-state driven:

- the Moon-Antler Hart population uses a canonical day-modulo plus early-morning time window;
- the Pale Ear named hook requires the explicit `elderwood.pale-ear-trail` flag.

No arbitrary "roll every load until rare spawn appears" contract was introduced.

### Version/data impact

```text
Product             0.5.600.1 -> 0.5.650.1
Package             0.5.600   -> 0.5.650
Account Save        4         unchanged
Game State          5         unchanged
Data                16        -> 17
enemyEntity          0.2.0    -> 0.2.1
ecologyCatalog       new       0.1.0
ecologyState         new       0.1.0
populations          new       0.1.0
gatheringSources     new       0.1.0
resourceItems        new       0.1.0
```

Database registry now includes `ecologyFamilies`, `species`, `populations`, `gatheringSources`, and `resourceItems`.

### Tests

`tests/ecologyEngine.test.js` covers:

- species/family/encounter separation;
- multiple habitats and families;
- gathering-source -> canonical item provenance links;
- additive ecology state under Game State v5;
- persistent population depletion and deterministic respawn;
- deterministic rare day/time appearance;
- explicit-flag named hooks;
- atomic harvest/inventory/provenance behavior;
- source depletion/regeneration;
- place/tool hooks;
- fishing time windows;
- ecology catalog validation;
- invalid runtime ecology references.

`tests/pipeline.test.js` is synchronized to the `0.5.650.1 / Data 17` version and registry contract.

### CI checkpoint

Runtime/version integration head `81210ce6915f3d5f0034ee10744da91b929940df` completed the GitHub Actions **test** check successfully on 2026-08-12. Subsequent commits are documentation closeout only.

On continuation, inspect the newest `main` head and current check runs before coding. Do not assume a later documentation commit's build/deploy state without re-reading GitHub.

## 0.5.650 bounded limitations

These are deliberate deferrals, not reasons to reopen the track broadly:

- existing `places.js` `spawnRules` remain a transitional encounter-placement layer; population definitions are established but encounter selection is not yet population-driven;
- general player-facing gathering commands/UI are not yet exposed;
- population dynamics currently model deterministic capacity/depletion/respawn, not seasons, weather, migration, predation, reproduction, or territory simulation;
- representative ecology/resource records are intentionally small; do not begin hundreds-scale generation before `0.5.800` content-pack validation;
- the ecology validator is currently a dedicated validator tested directly; high-volume unified regional validation belongs to `0.5.800`;
- `gil`, historical localStorage keys, and legacy-shaped POI hook IDs remain bounded compatibility debt.

## Next target

```text
0.5.700 — Travel and scheduled transport substrate
```

**Do not start high-volume route authoring.** First prove one bounded shared transport contract.

Recommended first unit:

1. Define canonical route records independent of incidental place-transition UI.
2. Represent walking/local/overland route traversal with canonical fictional duration using the existing world-time/task/interrupt infrastructure.
3. Add stable route stops, directionality, distance/time, hazard, map/knowledge, cargo/encumbrance hooks without prematurely solving every travel mechanic.
4. Define scheduled caravan/service records with deterministic departure cadence, fare, cargo allowance, route/stops, and arrival time.
5. Make the transport contract reusable by later ferries, wagons, mounts, and other scheduled modes rather than creating one caravan-only engine.
6. Add deterministic arrival/departure and interrupt seams; no needless wall-clock waiting.
7. Cross-validate routes/services/stops against canonical places and prove multiple representative routes before broad generation.
8. Update version/docs/handoff and stop at a coherent 0.5.700 boundary before 0.5.800.

## Resource/economy law

Rewards should have physical, economic, or social provenance. Combat can create access to bodies, carried goods, or salvage; it should not automatically manufacture finished crafting materials in inventory.

Desired material flow remains:

```text
world source
  -> raw material
  -> processing
  -> component/ingredient
  -> finished good
  -> use/wear/consumption
  -> repair/recycling/salvage or replacement
```

## Current transitional technical debt

Treat these as temporary and replace incrementally behind migrations/tested interfaces:

- `mainJobId` as a broad capability gate;
- sparse placeholder skill-rank math;
- placeholder spell/weapon-skill combat actions;
- small starter equipment/shop/enemy/resource catalogs;
- `places.js` encounter `spawnRules` rather than population-driven spawning;
- minimal current sink metadata on some starter materials;
- legacy `data/` and `ffxi*` research tables;
- historical localStorage key names;
- legacy-shaped POI hook IDs.

Do not solve these through an unbounded rewrite.
