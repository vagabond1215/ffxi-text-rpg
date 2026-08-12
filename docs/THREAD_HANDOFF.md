# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Read order

1. `AGENTS.md` — direct-`main` workflow, autonomous-session budget, scope boundaries, and handoff protocol.
2. `docs/DEVELOPMENT_DIRECTION.md` — authoritative design north star.
3. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-setting, naming, legacy-data, provenance, scale, and content-pack policy.
4. `docs/ROADMAP.md` — current implementation sequence and milestone gates.
5. `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — version protocol.
6. `docs/TRANSITIONAL_ARCHITECTURE.md` — temporary seams that must not harden into final design.
7. `docs/ARCHITECTURE.md` — current module boundaries.
8. `js/text/version.js` — authoritative active version values.
9. This handoff, then relevant runtime/data/tests for the next bounded unit.

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
Product:      0.5.700.1
Package:      0.5.700
Account Save: 4
Game State:   5
Data:         18
Benchmark:    1
Codename:     Routes and Transport
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
- 0.5.650 ecology, gathering-source, and population substrate;
- 0.5.700 canonical routes and scheduled transport substrate.

Do not restart earlier tracks unless a concrete regression requires it.

## 0.5.700 — exit status

The travel/transport substrate is **complete enough to exit the track**. It deliberately proves shared route/schedule contracts with representative data rather than mass-authoring the final transport network.

### Canonical route catalog

`js/text/data/routeCatalog.js` now provides:

- stable canonical route IDs and route-stop IDs;
- route types and supported modes independent of incidental place-exit UI;
- route stops referencing canonical places and optional departure/arrival coordinates;
- ordered segments carrying fictional duration, distance, and hazard tags;
- bidirectionality;
- cargo/encumbrance metadata;
- map/knowledge discovery hooks;
- deterministic service cadence helpers;
- route/service cross-reference validation.

Representative routes include local/regional roads in Elderwood, Redstone Reach, and Starfen; the Crown-Forge and Forge-Mere interregional caravan roads; and a Mistmere/Starfen waterway.

### Scheduled transport services

The same catalog defines representative services:

- `service-crown-forge-caravan`;
- `service-forge-mere-caravan`;
- `service-mistmere-west-ferry`.

Services use stable route stops, deterministic cadence, first-departure offset, boarding lead, fare, cargo allowance, mode, and route duration. The contract is intentionally generic enough for later caravan/ferry/wagon/coach/mount modes rather than one engine per vehicle type.

`gil` remains the current fare currency only because the original currency design is intentionally deferred.

### Canonical journey engine

`js/text/systems/transportEngine.js` now provides:

- travel-state contract v2;
- `route` and `scheduled` journey kinds;
- `waiting` and `inTransit` phases;
- route journeys backed by canonical timed tasks;
- scheduled booking with fare/cargo validation;
- deterministic departure and arrival world-time boundaries;
- semantic booking/start/departure/arrival/cancellation events;
- travel-specific departure/arrival interrupt candidates;
- arrival through normal place/atlas discovery;
- linked timed-task cancellation when travel stops;
- lazy normalization of older active Game State v5 travel objects.

No new top-level persistence registry was required, so Game State remains v5.

### Existing travel integration

`js/text/systems/travelEngine.js` now prefers canonical route legs for supported walking routes and delegates timing to the transport engine. `advanceTravel()` advances canonical world time rather than a separate travel countdown.

Existing `places.js` connection records remain a **transitional fallback** where canonical route coverage has not yet been authored. Do not delete them until route coverage and dependent POI/exit behavior can migrate atomically.

`navigationEngine.stopTravel()` now cancels the linked timed task instead of only clearing visible travel state.

### Version/data impact

```text
Product             0.5.650.1 -> 0.5.700.1
Package             0.5.650   -> 0.5.700
Account Save        4         unchanged
Game State          5         unchanged
Data                17        -> 18
routeCatalog         new       0.1.0
transport            new       0.1.0
travel               0.4.4    -> 0.5.0
navigation           0.1.0    -> 0.1.1
```

Database registry now includes `routes` and `transportServices`; `placeConnections` is explicitly marked transitional.

### Tests and CI

`tests/transportEngine.test.js` covers:

- route/service catalog cross-reference validation;
- multi-segment service journeys and hazard aggregation;
- deterministic service departure times;
- canonical walking travel using a timed task and advancing world time;
- scheduled fare and cargo enforcement;
- exact departure/arrival simulation interrupts;
- deterministic arrival at the destination place;
- travel cancellation cancelling the timed task.

Travel regression tests were updated for canonical route duration/world-time semantics. Semantic-event tests now filter by event type rather than assuming a travel event owns the first event sequence, because starting a journey composes with the timed-task event stream.

Runtime integration head `987393ec0b083a6e05c012dfb19e7f5f7523cfd5` completed the GitHub Actions **test** check successfully on 2026-08-12. Documentation closeout commits followed that runtime head.

On continuation, refetch the newest `main` and its check runs before coding.

## 0.5.700 bounded limitations

These are deliberate deferrals, not reasons to reopen the track broadly:

- scheduled transport has engine/API contracts but no broad player-facing booking command/UI yet;
- cancellation currently has no fare-refund policy;
- service schedules are simple periodic cadence, without weekday calendars, stop dwell, weather suspension, ticket reservations, finite passenger competition, or vehicle/NPC actors;
- hazard tags are structured route data and interrupt hooks, not yet a full en-route event/encounter resolver;
- route knowledge is metadata/discovery infrastructure, not a universal hard travel gate;
- route distance/time values are representative and not final geographic balance;
- canonical route coverage is intentionally incomplete and old place connections remain fallback infrastructure;
- `gil`, historical localStorage keys, legacy-shaped POI IDs, `mogHouse`/`mogSafe` persisted keys, legacy command adapters, and historical research modules remain bounded compatibility debt.

## Next target

```text
0.5.800 — Regional content packs, normalization, and validation
```

**Do not begin mass content authoring yet.** First prove pack ownership and unified validation.

Recommended first bounded unit:

1. Define a regional content-pack manifest/schema with stable pack ID, region/ownership metadata, data-contract version, dependencies, and explicit record collections.
2. Establish stable-ID ownership and duplicate/conflict detection across multiple packs; canonical IDs should remain human-meaningful rather than becoming opaque generated IDs.
3. Build one validator surface that can resolve/cross-check places, routes/stops/services, species/populations/sources, items/source-sink metadata, shops/NPCs, and representative recipe/quest/relationship records or fixtures.
4. Detect missing/duplicate IDs, dangling references, invalid source/sink graphs, invalid route/service topology, and legacy identifiers leaking into canonical packs without explicit adapters.
5. Define normalization of legacy/reference material as a candidate-record pipeline. Candidate records must remain reviewable and cannot become canonical simply because they parsed successfully.
6. Prove at least two regional packs plus shared/common records and at least one intentional cross-region reference.
7. Add generated scale fixtures at hundreds-of-record breadth to exercise lookup, conflict detection, and validation complexity before hundreds of hand-authored records are created.
8. Version appropriately, update docs/handoff, and stop at a coherent 0.5.800 boundary before the 0.5.900 exit-gate pass.

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
- `places.js` connection records as fallback rather than complete canonical route coverage;
- minimal current sink metadata on some starter materials;
- legacy `data/` and `ffxi*` research tables;
- historical localStorage key names;
- legacy-shaped POI hook IDs.

Do not solve these through an unbounded rewrite.
