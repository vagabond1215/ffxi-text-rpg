# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Required read order

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/DEVELOPMENT_DIRECTION.md`
4. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
5. `docs/ROADMAP.md`
6. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
7. Relevant architecture/runtime/data/tests, especially `docs/ARCHITECTURE.md`, `docs/QUALITY_GATES.md`, `docs/PERFORMANCE_BUDGET.md`, `docs/RESOURCE_LIFECYCLE.md`, and `js/text/version.js`.

For navigation/UI work also read `docs/LOCALITY_AND_EXPLORATION_MODEL.md`.

## Workflow

Work directly on `main` by default. Treat each prompt as a bounded work order. Follow the `AGENTS.md` autonomous-session guardrail and update this handoff at the end of substantive work.

## Product laws

Working title: **Hearth & Horizon**. Earlier FFXI-derived material is legacy research/reference/migration material, not canonical world content.

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

Maps represent acquired character knowledge, not omniscient authored geography. Resources have physical/economic/social provenance. Canonical fictional time is separate from wall-clock scheduling.

### Hard map/privacy rule

**Authored coordinates are simulation/internal data only and must not be player-facing.** A player-facing map may render discovered or locally knowable geometry, but it must not expose raw authored coordinates, undiscovered total extent, or the character's hidden relative placement inside authored bounds.

Internal `state.position`, atlas keys, topology edges, POI coordinates, route-stop coordinates, and other simulation geometry remain valid implementation data. Presentation translates those into knowledge-relative geometry and human world descriptions.

## Current baseline

```text
Product:      0.6.400.1
Package:      0.6.400
Account Save: 4
Game State:   5
Data:         21
Benchmark:    1
Codename:     Combat 2.0 Foundation
```

Phase 0.5 is complete. Phase 0.6 is active. **0.6.400 is not complete:** the first Combat 2.0 vertical slice is complete and green; canonical combat timing/interruption/status/enemy-ability work remains before moving on.

## Completed implementation sequence

- 0.4 foundation/versioning/ordered migrations/ActionResult/semantic events;
- 0.5.100 deterministic world clock;
- 0.5.200 pause/speed controls;
- 0.5.300 canonical timed tasks;
- 0.5.400 deterministic interrupt model;
- 0.5.500 day boundaries/end-of-day review;
- 0.5.550 original-world identity/stable-ID migration;
- 0.5.600 persistent projects/resource provenance;
- 0.5.650 ecology/gathering/populations;
- 0.5.700 canonical routes/scheduled transport;
- 0.5.800 regional content packs/normalization/scalable validation;
- 0.5.900 simulation/content-substrate exit gate;
- 0.6.100 continuous-character stats/progression;
- 0.6.200 character-owned skills/proficiencies/capabilities;
- 0.6.200.2 bounded Canvas usability refinement;
- 0.6.250 semantic DOM player-interface architecture;
- 0.6.300 original magic and active ability engine;
- 0.6.400.1 Combat 2.0 foundation vertical slice.

## Map state and accepted navigation direction

The current SVG minimap is a **functional transitional exploration substrate**, not final cartography.

Two map regressions were corrected before this checkpoint:

1. Player-facing projection previously used authored bounds. It now rebases/fits discovered geometry only, hides authored total extent, and removes coordinate labels.
2. Numeric grid atlas keys such as `"2,2"` did not round-trip through `parseCoordinate()`, causing grid maps to render only a solid background. Internal numeric serialized keys now parse correctly and render discovered cells without exposing those coordinates in HTML.

Runtime grid-map regression coverage remains green.

### Accepted settlement/exploration distinction

`docs/LOCALITY_AND_EXPLORATION_MODEL.md` is the accepted design direction:

```text
Use fine movement where movement itself creates decisions.
Use named localities and actions where destinations and relationships create decisions.
```

Do **not** assume every settlement must be a fine directional grid.

Future presentation contexts:

```text
settlement/locality -> locality name + nearby destinations + locality actions
exploration         -> discovery map + movement/exploration actions
route/transport     -> journey/progress + travel actions/interrupts
combat              -> combat state + tactical actions
```

A guarded/safe city should usually expose named districts, wards, quarters, precincts, campuses, terraces, docks, markets, compounds, or culturally specific equivalents. These subdivisions bound UI density and provide discovery/reputation/quest/access gating without pretending every shop visit is wilderness navigation.

The minimap and D-pad should therefore become **conditional**, not permanent application chrome.

A safe locality remains on canonical world time. `safe` is a hazard/encounter policy, not a second clock. UI browsing consumes no fictional time; meaningful activities or district travel may consume authored coarse durations; scheduled/social/shop/transport/project/world events can still interrupt. There is no need to run continuous ambient danger or health-regeneration ticks merely because the player is standing in a guarded city.

Higher-resolution, shaped, seam-compatible exploration maps remain a valid later cartography direction, especially for terrain-sensitive wilderness/dungeons. They are **deferred**; do not mass-author detailed city maps merely to compensate for using a grid in a context where a map should not be primary.

Accepted insertion after Combat 2.0:

```text
0.6.450 — Locality and exploration navigation
```

Expected 0.6.450 scope is defined in `docs/LOCALITY_AND_EXPLORATION_MODEL.md`: named localities/adjacency/access, semantic locality actions, representative starter-city migration, conditional map/D-pad, safe-locality coarse time policy, preservation of atlas privacy and route/transport authority. Polished cartographic art remains later work.

## 0.6.300 magic/ability state

Canonical executable ability/effect data is separate from character capability ownership. `capabilityEngine` owns learned/use prerequisites; `abilityEngine` owns activation, costs, targeting, effects, canonical fictional-time activation/cooldowns, interruption, and lifecycle events.

Original representative abilities remain Ember Dart, Mending Thread, Stone Ward, Guarded Cut, and Waymark Reading. Costs are spent when activation begins; non-instant activation uses canonical timed tasks; successful resolution starts cooldown; interruption retains already-spent resources and does not start cooldown.

Ability lifecycle events remain:

```text
ability.started
ability.resolved
ability.interrupted
```

`invoke <ability>` is a bounded keyboard/power-user adapter. Historical spell names are not canonical ability data.

## 0.6.400 Combat 2.0 foundation — complete vertical slice

The pre-0.6.400 audit found three divergent combat paths:

- basic attacks mutated/logged directly in `battleEngine`;
- legacy attack/cast/weapon-technique behavior and enemy retaliation lived in `combatActionEngine`;
- canonical 0.6.300 abilities resolved separately in `abilityEngine` and did not share the legacy enemy-response path.

The first Combat 2.0 slice establishes one structured action/response seam without pretending the whole combat redesign is finished.

### Canonical combat contract

New `js/text/systems/combatTurnEngine.js` introduces additive battle state:

```js
battle.contract = {
  version: 1,
  actionSequence: 0,
  actions: [],
  lastActionId: null
}
```

Each structured action record carries:

- stable sequential action ID;
- round;
- actor ID/type;
- target ID;
- action kind;
- source ID;
- outcome;
- structured data.

Records emit semantic event:

```text
combat.action.resolved
```

The contract is additive runtime battle state; Account Save, Game State, and Data versions did not need to change.

### Structured basic attack

`battleEngine.resolveBasicAttack()` now returns structured resolution data including hit/miss, damage, hit chance/roll, HP before/after, and defeat outcome. Existing `performBasicAttack()` remains a compatibility wrapper.

### Deterministic enemy response v1

Enemy action selection is explicit rather than inferred from combat prose. Current deliberately narrow policy is:

```js
{
  kind: 'basicAttack',
  actorId: enemy.id,
  targetId: livingPlayer.id,
  policy: 'basic-attack-v1'
}
```

The enemy response records its own structured combat action and carries `triggerActionId` linking it to the player action that gave the enemy its response opportunity.

This is not final enemy AI. It establishes deterministic action-selection authority that later policies/abilities can replace or extend.

### Player action unification

Current flows through the contract:

- player basic attacks;
- canonical ability resolution in combat;
- legacy cast as `legacyCast` compatibility action;
- legacy weapon technique as `legacyTechnique` compatibility action;
- deterministic enemy basic response.

Canonical ability results now expose `combatActionId` and `enemyResponseActionIds`. Semantic UI `ability.activate` remains command-string independent.

Legacy adapters remain transitional; they no longer need to own a separate private enemy-response loop.

### Battle finalization compatibility

Combat finalization synchronizes player resources/statuses from the battle combatant, preserves victory reward resolution, preserves resource-opportunity/provenance behavior, and retains player-facing reward log compatibility. Battle end is recorded once.

## Validation checkpoint

Coherent runtime/version head:

```text
d4e888328e414081ae753aa4b349b257218735bd
```

GitHub Actions completed successfully on 2026-08-15:

```text
tests       402
pass        402
fail        0
cancelled   0
skipped     0
todo        0
```

Pages checks:

```text
test                  success
build                 success
report-build-status   success
deploy                success
```

Benchmark at that head:

```text
create 1,000 player combat profiles       407.562 ms | 0.407562 ms/op
create 1,000 enemy combat profiles        101.735 ms | 0.101735 ms/op
resolve 1,000 basic attacks               474.025 ms | 0.474025 ms/op
10,000 tick dispatches / 5 subscribers     46.125 ms | 0.004612 ms/op
10,000 direct route lookups              6408.738 ms | 0.640874 ms/op
```

The recurring GitHub Actions warning about Node 20 action-runtime deprecation remains warning-only. Project tests/benchmark still run with configured Node 20.20.2.

## Important current combat limitations

Do not describe 0.6.400 as complete yet.

- Enemy action policy is only deterministic basic attack v1.
- Player and enemy actions do not yet share a complete canonical recovery/readiness timeline.
- A timed player ability currently receives the enemy response when the ability resolves; enemy action/interruption is not yet interleaved across the cast window.
- General cast interruption/recovery windows remain incomplete.
- Status records can carry duration metadata, but status expiry is not yet fully orchestrated from canonical world time.
- Enemy canonical ability selection/execution is not implemented.
- AoE/ground targeting, resistance/accuracy layers, and richer tactical policy remain later Combat 2.0 work.
- The combat contract validator currently has focused tests; global `validateGameState()` does not yet validate an active battle contract.
- Existing battle IDs still use the older `Date.now()` scaffold.
- Only one active player ability activation is supported.

## Compatibility / intentional debt

Do not clean these opportunistically unless they are directly in scope:

- `combatActionEngine.castSpell()` remains a legacy placeholder adapter until Combat 2.0 finishes.
- Transitional weapon-technique/recovered weapon-skill behavior remains bounded.
- Equipment eligibility still contains discipline-shaped compatibility requirements.
- `player.jobs`, `mainJobId`, `raceId`, `nationId`, and related persisted/internal names remain compatibility seams.
- Historical FFXI research modules remain bounded reference surfaces.
- `places.js` spawn rules/place connections, `gil`, historical localStorage keys, and legacy-shaped POI hook IDs remain intentional migration/economy debt.
- Canvas remains bounded compatibility/regression/reference code; semantic DOM is the active browser UI.
- Internal coordinate helpers may inspect authored geometry, but presentation must not expose it.

## Next bounded target

Continue **0.6.400 — Combat 2.0**, not 0.6.450 yet.

Recommended next unit:

1. define canonical combat readiness/recovery timing against fictional world time;
2. allow enemy actions to occur/interleave while a timed player ability is activating;
3. route combat interruption through the existing deterministic interrupt substrate;
4. move status duration/expiry toward canonical world-time authority;
5. add one representative original enemy active ability and deterministic selection policy;
6. integrate `validateCombatContract()` with state validation if the contract is now stable enough;
7. preserve rewards, resource provenance, skills, equipment, capability composition, semantic events, and compatibility adapters;
8. test/version/benchmark/document and stop at the next coherent 0.6.400 checkpoint.

After Combat 2.0 is coherent/complete, execute **0.6.450 — Locality and exploration navigation** before broad 0.6.500+ expansion hardens the current city-grid assumptions.
