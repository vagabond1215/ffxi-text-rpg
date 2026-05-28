# San d'Oria Coordinate + Compass Navigation Pass

## Purpose

This planning pass scopes the safe implementation sequence for replacing malformed numeric placeholder map coordinates with an alphanumeric, graph-based coordinate model for San d'Oria city zones, while adding a 3x3 canvas compass rose for coordinate-aware movement.

This is intentionally a planning/audit artifact, not the full runtime refactor.

## Current audited state

### Numeric placeholder maps

`js/text/data/places.js` currently defines city zones with placeholder rectangular numeric grids, for example Southern San d'Oria uses `grid(5, 5, { x: 2, y: 2 })`.

`ZONE_CONNECTIONS` also stores numeric `departFrom` and `arriveAt` coordinates.

### Numeric movement

`js/text/gameState.js` currently moves by adding `dx`/`dy` from `NAV_KEYPAD` to `state.position.x` and `state.position.y`, then delegates to `setPositionAndDiscover()`.

### Numeric atlas

`js/text/systems/atlasEngine.js` currently renders a rectangular numeric atlas by looping from `0..width` and `0..height`, and records visited keys as `x,y`.

### Canvas action pipeline

`js/text/ui/canvasApp.js`, `canvasLayout.js`, `canvasRenderer.js`, and `uiActions.js` already provide a testable action-button pipeline. This should be extended rather than replaced.

## Required model change

Introduce a coordinate topology model that can represent:

- map bounds: columns and rows
- one or more levels
- explicit navigable coordinates
- directed movement edges
- direction-sensitive exits
- services and interaction nodes
- future transitions such as ramps, cave entrances, palisade gates, bridges, elevators, one-way drops, and multi-level maps

Preferred player position shape:

```js
{
  placeId: 'southern-sandoria',
  levelId: 'main',
  coord: 'G-10',
  facing: 'north'
}
```

Legacy numeric fallback can remain for non-converted placeholder zones during the transition, but new San d'Oria work should use alphanumeric coordinates.

## San d'Oria city-zone data target

### Southern San d'Oria

Start coordinate:

- `G-10`

Invalid coordinate that must be rejected:

- `B-2`

Confirmed major exits to encode:

| From | Coordinate | Direction | To | Arrival |
| --- | --- | --- | --- | --- |
| Southern San d'Oria | `I-7` | north | Northern San d'Oria | `I-10` |
| Southern San d'Oria | `F-10` | west or southwest | West Ronfaure | `I-6` |
| Southern San d'Oria | `L-10` | east or southeast | East Ronfaure | `G-4` |
| Southern San d'Oria | `H-11` | south | Chocobo Circuit | `H-8` |

Use the supplied Southern San d'Oria image as the first topology reference. Do not treat all printed cells as walkable. Do not include disconnected B/D coordinates while skipping C unless an explicit transition exists.

### Northern San d'Oria exits

| From | Coordinate | To | Arrival |
| --- | --- | --- | --- |
| Northern San d'Oria | `F-5` | Carpenters' Landing | `G-7` |
| Northern San d'Oria | `I-6` | Chateau d'Oraguille | `H-9` |
| Northern San d'Oria | `F-3` | Port San d'Oria | `F-10` |
| Northern San d'Oria | `I-10` | Southern San d'Oria | `I-7` |
| Northern San d'Oria | `C-8` | West Ronfaure | `I-5` |
| Northern San d'Oria | `D-7` | West Ronfaure | `I-5` |

### Port San d'Oria exits

| From | Coordinate | To | Arrival |
| --- | --- | --- | --- |
| Port San d'Oria | `F-10` | Northern San d'Oria | `F-3` |
| Port San d'Oria | `H-5` | Airship, Jeuno - San d'Oria | unknown placeholder |

### Chateau d'Oraguille exits

| From | Coordinate | To | Arrival |
| --- | --- | --- | --- |
| Chateau d'Oraguille | `H-9` | Northern San d'Oria | `I-6` |
| Chateau d'Oraguille | `I-8` | Bostaunieux Oubliette | `H-6` |

## 3x3 compass rose UI target

Layout:

```text
NW   N   NE
 W  Stop  E
SW   S   SE
```

Rules:

- Direction buttons dispatch the same movement logic as `move <dir>`.
- Direction buttons are enabled only if `canMoveDirection(state, direction)` returns true.
- Direction buttons are disabled while in active battle.
- Disabled buttons should use the existing disabled-action feedback path.
- The center `Stop` button cancels active travel/pathing if present; otherwise reports the player is already stopped.
- Do not remove command input.

## Recommended implementation sequence

1. Add coordinate helper module.
2. Add navigation/topology engine.
3. Add San d'Oria topology data module.
4. Convert Southern San d'Oria start/position/exits to alphanumeric coordinates.
5. Update `move <dir>` to use topology edges when available.
6. Add `stop` command/action behavior.
7. Add compass actions in `uiActions.js`.
8. Add compass layout in `canvasLayout.js`.
9. Render compass rose in `canvasRenderer.js`.
10. Update atlas output/counting for topology maps.
11. Update travel behavior to require correct exit coordinate/direction for converted zones.
12. Add validation for navigable coordinates and exits.
13. Add tests.
14. Update version/docs/changelog.

## Test plan

Add or update tests to cover:

1. Southern San d'Oria starts at `G-10`.
2. `B-2` is invalid for Southern San d'Oria.
3. `G-10`, `F-10`, `I-7`, `L-10`, and `H-11` are valid Southern San d'Oria topology coordinates.
4. Movement fails when no graph edge exists.
5. Movement succeeds along a defined Southern San d'Oria edge.
6. West Ronfaure exit is at `F-10` and direction-aware.
7. East Ronfaure exit is at `L-10` and direction-aware.
8. Northern San d'Oria exit is at `I-7` and direction-aware.
9. Stop button action exists and sits in the center of a 3x3 compass layout.
10. Compass buttons enable/disable based on current coordinate.
11. `move <dir>` and compass movement use the same engine.
12. Atlas displays alphanumeric coordinates and counts navigable coordinates only.
13. Existing command-router, slash-command, canvas UI, save, travel, and validation tests continue to pass.

## Non-goals for this pass

- Full NPC population for every San d'Oria coordinate.
- Full building interiors.
- Auto-pathing across the city.
- Pixel-perfect walk masks.
- Full wilderness topology conversion.
- Full Northern/Port/Chateau navigable masks unless map references are available.

## Safety notes

This crosses persistent state shape, movement, atlas, travel, UI, validation, and tests. Implement as a branch PR with isolated commits. Do not apply directly to `main`.
