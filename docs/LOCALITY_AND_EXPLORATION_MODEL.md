# Locality and Exploration Navigation Model

Status: **accepted design direction; implementation deferred until after the first Combat 2.0 vertical slice.**

This document records how Hearth & Horizon should distinguish settlement interaction from wilderness/dungeon exploration. It exists to prevent the current rough local-map substrate from hardening into a requirement that every place be represented as a fine directional grid.

## Core rule

```text
Use fine movement where movement itself creates decisions.
Use named localities and actions where destinations and relationships create decisions.
```

A guarded city, academy, village, guild quarter, or other broadly safe settlement should not require the player to operate a compass merely because the engine can represent coordinates. Conversely, a dangerous forest, ruin, mine, cave, marsh, battlefield, or expedition route may benefit from local directional movement, discovery, positioning, and a cartographic view.

Internal coordinates remain valid simulation data where useful. They are not player-facing identity and they do not force a particular presentation mode.

## Three navigation contexts

### 1. Settlement / locality context

A settlement-facing `place` may contain named subdivisions such as districts, wards, quarters, precincts, campuses, terraces, docks, markets, villages, compounds, courts, or culturally specific equivalents.

The player interface should emphasize:

- the current named locality;
- a concise description of what is here;
- nearby people, services, landmarks, projects, and opportunities;
- a small set of **locality actions**;
- transitions to adjacent known localities or important destinations.

The default settlement interface does **not** need a permanent minimap or compass/D-pad. A schematic district map may be shown later when useful, but it should behave as a knowledge/navigation aid rather than as the primary interaction mechanism.

Locality subdivisions deliberately bound UI density. A large city can contain many total services/NPCs while each locality exposes only the subset relevant to the player's present context.

Examples of locality actions:

```text
Visit the Market
Go to Crownward
Enter the Smiths' Court
Talk to the gate watch
Browse nearby shops
Look for work
Rest at the inn
Visit your lodging
```

These should dispatch semantic navigation or interaction intents rather than requiring the player to type coordinate movement.

### 2. Exploration context

Wilderness, ruins, caves, mines, hostile districts, expedition sites, and other movement-sensitive spaces may use finer navigation.

The player interface may expose:

- discovery-relative local map geometry;
- directional or destination movement;
- landmarks and known paths;
- hazards, resource sites, tracks, bodies, encounters, and discoveries;
- terrain- or preparation-sensitive choices.

The existing acquired-knowledge privacy rule remains mandatory: authored coordinates, undiscovered total extent, and the player's hidden relative placement inside authored bounds are never automatically exposed.

Directional controls are justified only when they help express tactical/exploration decisions. Keyboard directional movement can remain available where the navigation mode supports it.

### 3. Route / transport context

Travel between settlements, regions, or major localities belongs to the canonical route/timed-task/transport substrate rather than being simulated as thousands of mandatory fine-grid inputs.

Routes can carry fictional duration, danger, weather, cargo, preparation, scheduled departures, stops, discoveries, and interrupts. The player may advance normally, accelerate, or advance to the next meaningful event according to the simulation contract.

## Safe-locality time policy

A safe locality is **not outside canonical world time**. It is outside the need for continuous ambient danger simulation when nothing meaningful depends on fine-grained ticks.

Safe settlement behavior should therefore follow these rules:

- ordinary UI browsing and inspection consume no fictional time;
- explicit activities may consume coarse, authored durations when meaningful;
- moving between nearby districts may consume a small fixed or data-driven amount of fictional time when the distinction matters;
- passive health/resource recovery does not need a bespoke city tick loop merely to make the clock move;
- scheduled NPC, shop, transport, project, social, or world events can still become interrupts;
- a locality may temporarily become unsafe through a quest, attack, riot, fire, disaster, curfew, criminal pursuit, or other authored/systemic condition without requiring the normal city presentation to be a wilderness grid.

`safe` should therefore be treated as a hazard/encounter policy, not as a second clock or a promise that nothing can ever happen.

## Locality data direction

A future locality contract should be able to describe approximately:

```js
{
  id,
  placeId,
  name,
  kind,
  description,
  tags,
  adjacentLocalityIds,
  poiIds,
  defaultSafety,
  travelSeconds,
  knowledgeRequirements,
  accessRequirements
}
```

The exact schema is intentionally deferred until implementation. The important semantic distinction is stable now: a `place` may own player-facing named localities without requiring each locality to masquerade as a coordinate cell.

Cultural naming should be data/content, not engine logic. One city may use wards, another terraces, another courts, campuses, rings, islands, docks, villages, or other locally appropriate terms.

## Cartography direction

The current SVG local map is a functional discovery substrate, not the final visual identity of world cartography.

Two future map directions are compatible with this model:

1. **Schematic locality maps** for settlements: named districts, gates, rivers, roads, major landmarks, and known connections. These need not represent every step of walking.
2. **Higher-resolution exploration maps** for spaces where terrain/path shape matters. When used, authored neighboring map boundaries should share compatible connection geometry so discovered seams do not visibly contradict one another.

Higher-resolution shaped boundaries are presentation/content work and should not be undertaken merely to make safe cities look less like rectangles. First remove the false requirement that every safe city needs a fine-grid map.

## UI consequence

The active DOM shell should eventually choose its navigation surface from semantic place/navigation context:

```text
settlement/locality -> locality name + nearby destinations + locality actions
exploration         -> discovery map + movement/exploration actions
route/transport     -> journey/progress + travel actions/interrupts
combat              -> combat state + tactical actions
```

The minimap and D-pad should therefore become **conditional**, not permanent chrome.

## Progression and gating

Named localities provide useful progression boundaries without artificial level-loading language.

Access can depend on:

- discovered knowledge;
- reputation or faction standing;
- guild membership/certification;
- quest/event state;
- permits, invitations, keys, tolls, or schedules;
- time of day;
- social relationships;
- danger/emergency state;
- physical route access.

This allows a city to grow large in content while keeping each immediate interaction surface legible.

## Implementation sequencing

Do **not** interrupt the current Combat 2.0 foundation to build this immediately.

Insert a bounded **0.6.450 — Locality and exploration navigation** track after the first coherent 0.6.400 Combat 2.0 contract and before broad 0.6.500+ content/mechanics expansion hardens the current city-grid assumptions.

Expected 0.6.450 scope:

- add an explicit navigation/presentation mode or equivalent semantic contract;
- add named locality records and adjacency/access semantics;
- migrate representative starter-city interaction to locality actions;
- make minimap/D-pad conditional on exploration-capable contexts;
- preserve canonical world time while avoiding needless ambient city ticking;
- preserve atlas/map knowledge rules;
- keep route/transport authority for longer travel;
- add semantic DOM view-model/actions and focused tests;
- defer polished/high-resolution cartographic art until the locality model proves where it adds gameplay value.

Until that track, the current minimap remains a rough transitional exploration substrate. Do not invest in large-scale shaped-map authoring merely to compensate for using that substrate in contexts where a map should not be the primary interface.
