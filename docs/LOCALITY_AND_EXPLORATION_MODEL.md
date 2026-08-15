# Locality and Exploration Navigation Model

Status: **implemented at 0.6.450.1; accepted ongoing navigation contract.**

This document defines how Hearth & Horizon distinguishes settlement interaction from wilderness/dungeon exploration. The purpose is to avoid forcing every place into a fine directional grid merely because internal simulation coordinates exist.

## Core rule

```text
Use fine movement where movement itself creates decisions.
Use named localities and actions where destinations and relationships create decisions.
```

A guarded city, academy, village, guild quarter, or other broadly safe settlement should not require compass operation for ordinary interaction. A dangerous forest, ruin, mine, cave, marsh, battlefield, or expedition site may benefit from local directional movement, discovery, positioning, and cartography.

Internal coordinates remain valid simulation data. They are not player-facing identity and do not force a presentation mode.

## Implemented navigation contexts

The semantic view model currently distinguishes:

```text
locality     -> locality name + adjacent destinations + locality/POI actions
exploration  -> discovery map + directional movement/exploration actions
route        -> journey/progress + travel actions/interrupts
combat       -> combat state + tactical actions
```

`js/text/systems/localityEngine.js` owns the settlement/locality distinction. `gameViewModel.js` derives presentation mode. `domRenderer.js` conditionally emits the correct navigation surface.

## Settlement / locality context

Current safe locality recognition uses existing canonical `place` records rather than introducing a second city-geography database. A place is currently locality-capable when it is a non-placeholder danger-0 `city`, `cityInterior`, or `travelHub`.

This means existing records such as Thornwall Southgate/Crownward, Brasshaven Market Ring/Delvers' Ward, and Mistmere Canal/Spire wards already form named locality graphs through their existing walk connections.

The player interface emphasizes:

- current named locality;
- concise world description;
- nearby people/services/landmarks/opportunities;
- a small set of semantic locality actions;
- known adjacent locality destinations.

The default settlement interface **does not render the exploration minimap or compass/D-pad**. This is implemented by omitting those DOM elements, not merely hiding a permanent map behind styling.

Locality subdivisions bound UI density. A large city can contain many total services/NPCs while each immediate locality exposes only relevant nearby content.

Current semantic examples:

```text
Go · Crownward
Browse · Southgate Arms
Guild · local training hall
Commission · local contract source
Storage · lodging/storage point
Talk · nearby person
```

`domApp.js` routes `locality.move` and `locality.poi` directly into `localityEngine` rather than manufacturing coordinate movement commands.

### Internal POI coordinates

POIs still have internal coordinates because existing world systems use them for location/context. `performLocalityPoiAction()` may reposition the internal state to the POI coordinate before dispatching the existing interaction behavior. That coordinate is an implementation detail; the player chooses the named POI/action.

## Safe-locality time policy

A safe locality remains on **canonical world time**. `safe` is a hazard/encounter policy, not a second clock.

Implemented policy:

- ordinary UI browsing/inspection consumes no fictional time;
- locality crossings use the authored `travelSeconds` from the existing walk connection;
- crossings advance through `advanceSimulationUntilInterrupt()` and can therefore stop for meaningful events;
- the origin locality is retained if the crossing is interrupted before completion;
- passive regeneration does not require a bespoke ambient city tick loop merely to make time move;
- future social/shop/schedule/project/emergency providers can interrupt the same canonical advancement path.

This keeps settlement play fast without making settlement time fake.

## Exploration context

Wilderness, ruins, caves, mines, hostile districts, expedition sites, and other movement-sensitive spaces retain finer navigation.

The exploration interface may expose:

- discovery-relative local map geometry;
- directional/destination movement;
- known paths and landmarks;
- hazards/resource sites/tracks/bodies/encounters/discoveries;
- terrain- or preparation-sensitive choices.

The acquired-knowledge privacy rule remains mandatory: authored coordinates, undiscovered total extent, and hidden relative placement inside authored bounds are not automatically exposed.

Keyboard directional movement/auto-run are active only when the semantic navigation mode is `exploration`.

## Route / transport context

Travel between settlements, regions, or major destinations remains owned by canonical routes/timed tasks/transport services rather than thousands of mandatory fine-grid inputs.

Routes can carry fictional duration, danger, cargo, scheduled departures, stops, discoveries, and interrupts. The locality implementation did not replace route/transport authority.

## Locality data direction

The initial implementation deliberately reused `place` + existing walk connections rather than creating speculative records such as:

```js
{
  localityId,
  placeId,
  adjacentLocalityIds,
  poiIds,
  ...
}
```

A dedicated locality content schema should be added only when content needs semantics that cannot be represented cleanly by current place/connection/POI data—for example culturally named intra-place sublocalities, explicit access policies, or large-city hierarchy beyond the present place graph.

Cultural naming remains content, not engine logic. Wards, terraces, courts, campuses, rings, islands, docks, villages, compounds, and other forms can coexist.

## Progression and gating

Named localities are natural progression boundaries. Future access can compose with:

- discovered knowledge;
- reputation/faction standing;
- guild membership/certification;
- quest/event state;
- permits/invitations/keys/tolls/schedules;
- time of day;
- relationships;
- danger/emergency state;
- physical route access.

Do not turn locality access into arbitrary level-loading language when a world-facing requirement is more coherent.

## Cartography direction

The SVG local map remains a functional exploration substrate, not final visual identity.

Two future map directions remain compatible:

1. **Schematic locality maps** when a settlement is complex enough that a district overview genuinely helps. These should show named districts/gates/roads/landmarks, not every walking step.
2. **Higher-resolution shaped exploration maps** where terrain/path shape matters. Neighboring authored map boundaries should have compatible seam geometry so discovered edges do not visibly contradict one another.

Higher-resolution shaped boundaries are deferred presentation/content work. Do not mass-author detailed city maps merely to make settlements look less rectangular; ordinary safe-settlement interaction no longer depends on a grid map.

## 0.6.450 completion contract

Completed at:

```text
Product: 0.6.450.1
Package: 0.6.450
Game State: 5
Data: 22
```

Delivered:

- semantic locality/exploration/route/combat navigation modes;
- named locality adjacency from existing place graph;
- semantic locality destination and POI actions;
- interruptible coarse-time locality crossing;
- conditional DOM navigation presentation;
- map/D-pad omission in safe settlement mode;
- preserved discovery map/directional controls in wilderness;
- preserved atlas privacy and route/transport authority;
- focused locality and UI regression tests.

The next navigation work should be driven by actual content/gameplay need: access requirements, larger city hierarchy, schematic maps, or richer exploration cartography. Do not reopen the basic locality-vs-exploration distinction without a concrete contradiction.
