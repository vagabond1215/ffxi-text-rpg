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
- coordinate scale metadata used for travel timing
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

Backward compatibility is out of scope for this coordinate reset. Converted zones should use alphanumeric coordinate data directly rather than preserving malformed numeric behavior.

## Coordinate size and movement timing

Coordinate cells are not assumed to have the same physical size on every map. Each topology should expose scale/timing metadata:

```js
movement: {
  coordinateSizeYalms: 100,
  baseWalkYalmsPerSecond: 4,
  tickSeconds: 1,
  diagonalCostMultiplier: 1.414,
  minimumMoveTicks: 1
}
```

Rules:

- A movement edge should have an effective distance.
- If an edge has explicit `distanceYalms`, use that value.
- Otherwise, estimate from the source map's `coordinateSizeYalms`; diagonal moves use `diagonalCostMultiplier`.
- Travel duration is `distanceYalms / baseWalkYalmsPerSecond`.
- Travel duration is rounded up to a whole tick.
- Minimum directional travel duration is one whole tick.
- City maps may use shorter/safer edge timing than wilderness maps if later balance requires it.

Initial default values can be conservative placeholders as long as they are clearly marked and easy to tune.

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
↖   ↑   ↗
←   ✕   →
↙   ↓   ↘
```

The center symbol may be `✕`, `■`, `⏹`, or a small campfire/rest icon if rendered custom in canvas. It should represent stop/rest and must remain visually distinct from direction arrows.

Rules:

- All nine buttons must have uniform width and height.
- Direction buttons should use arrow glyphs rather than text labels (`↑`, `↗`, `→`, `↘`, `↓`, `↙`, `←`, `↖`).
- Direction buttons dispatch the same movement logic as `move <dir>`.
- Direction buttons are enabled only if `canMoveDirection(state, direction)` returns true.
- Direction buttons are disabled while in active battle.
- Disabled buttons should use the existing disabled-action feedback path.
- The center stop/rest button cancels active travel/pathing if present; otherwise reports the player is already stopped/resting.
- Do not remove command input.

## Auto-run / held movement behavior

Add an `Auto Run` toggle beneath the compass rose.

The toggle changes how directional compass buttons behave:

### Auto Run on

- Pressing a directional button toggles continuous travel in that direction.
- The active direction button should display a selected/toggled state.
- Pressing the same direction again stops auto-run.
- Pressing a different enabled direction switches auto-run to that direction.
- The center stop/rest button cancels auto-run.
- Auto-run advances by whole movement ticks until blocked, stopped, battle starts, an exit prompt/action is reached, or the destination changes.

### Auto Run off

- Direction buttons use press-and-release movement.
- Holding a directional button continues movement while held.
- Releasing the button stops queued movement after the current minimum movement duration completes.
- A quick press should still move at least one whole movement tick.
- Minimum directional travel duration is rounded up to one whole tick.

Implementation notes:

- Track UI movement state separately from permanent game state where possible.
- Suggested UI state fields: `autoRunEnabled`, `heldDirection`, `activeAutoRunDirection`, `movementHeldSince`, `queuedMove`.
- The movement engine should own actual coordinate changes and timing decisions.
- The canvas pointer layer will need to distinguish pointer down, pointer held, and pointer up for compass buttons.
- Keyboard/manual `move <dir>` should remain one discrete move command unless a later pass adds keyboard-held movement.

## Recommended implementation sequence

1. Add coordinate helper module.
2. Add navigation/topology engine.
3. Add movement timing helpers and per-map movement metadata.
4. Add San d'Oria topology data module.
5. Convert Southern San d'Oria start/position/exits to alphanumeric coordinates.
6. Update `move <dir>` to use topology edges when available.
7. Add `stop` command/action behavior.
8. Add compass actions in `uiActions.js`.
9. Add compass layout in `canvasLayout.js` with uniform 3x3 button sizing.
10. Render compass rose arrows and center stop/rest symbol in `canvasRenderer.js`.
11. Add Auto Run toggle below the compass rose.
12. Add held-button and auto-run event handling in canvas input/app code.
13. Update atlas output/counting for topology maps.
14. Update travel behavior to require correct exit coordinate/direction for converted zones.
15. Add validation for navigable coordinates and exits.
16. Add tests.
17. Update version/docs/changelog.

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
9. Compass rose has nine uniform buttons.
10. Compass direction buttons use arrow labels/glyphs.
11. Stop/rest button exists in the center of a 3x3 compass layout.
12. Auto Run toggle exists below the compass rose.
13. Auto Run on toggles directional movement state and selected button state.
14. Auto Run off supports press-and-release/held movement semantics.
15. Minimum directional travel duration rounds up to one whole tick.
16. Movement timing can vary by map coordinate size metadata.
17. Compass buttons enable/disable based on current coordinate.
18. `move <dir>` and compass movement use the same engine.
19. Atlas displays alphanumeric coordinates and counts navigable coordinates only.
20. Existing command-router, slash-command, canvas UI, save, travel, and validation tests continue to pass.

## Non-goals for this pass

- Full NPC population for every San d'Oria coordinate.
- Full building interiors.
- Auto-pathing across the city to arbitrary destinations.
- Pixel-perfect walk masks.
- Full wilderness topology conversion.
- Full Northern/Port/Chateau navigable masks unless map references are available.

## Safety notes

This crosses persistent state shape, movement, atlas, travel, UI, validation, and tests. Implement as a branch PR with isolated commits. Do not apply directly to `main`.
