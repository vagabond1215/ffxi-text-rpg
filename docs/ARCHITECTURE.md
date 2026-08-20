# Architecture

Hearth & Horizon is an original text-first persistent fantasy life RPG built around one deterministic world state and one continuous character. This document describes current runtime authority, not speculative final architecture.

## Active browser path

```text
index.html
  -> js/main.js
      -> createDomRoot(...)
          -> createDomApp(host)
              -> authoritative game/save/intent services
              -> createGameViewModel(state, uiState)
              -> renderDomApp(...)
```

The semantic DOM/CSS shell is the active player interface. Canvas code remains bounded regression/reference code.

## Core authority rules

- One canonical fictional-time/simulation substrate owns elapsed gameplay time.
- Timed tasks own scheduled active work boundaries; domain systems own consequences and exactly-once release.
- Continuous-character progression, learned skills/capabilities, and work proficiency belong to the person; disciplines are contextual training traditions.
- Inventory/equipment/container state owns physical item location, capacity, access, carried load, preparation and tool context.
- Resources preserve source/transformation provenance.
- Projects own persistent construction/material/labor progress; home infrastructure composes project/inventory/furnishing/workstation authorities.
- Commitments own accepted/resolved/follow-up state; relationships remain separate durable authority.
- NPC schedules derive authored availability from canonical fictional time.
- Persistent companions are NPC-backed participants whose party authority owns recruitment, active membership, location continuity, field approach and battle/recovery synchronization.
- Maps, Journal guidance, service boards, information models, home opportunities, social schedules and cultivation opportunities are projections over canonical state.
- Ordinary presentation exposes what the character sees, knows, carries, remembers, needs or can decide; implementation rationale stays outside normal play.

## Cultivation & Stewardship — draft PR #378

The 0.8.700 bounded proof deliberately composes existing authorities instead of introducing a farming subsystem with its own clock, inventory or background scheduler.

### Authority graph

```text
canonical world time
  -> determines whether tending is due and harvest is ready

state.cultivation
  -> owns durable plot/crop lifecycle facts

workTaskEngine
  -> owns only short hands-on preparation/tending labor

player.inventoryState
  -> owns the physical propagation root and harvest output

resource provenance
  -> owns cultivated origin + retained seed history

player.progression.workProficiencies.cultivation
  -> owns repeated-practice efficiency

semantic opportunity/view model
  -> projects available cultivation decisions
```

### Durable cultivation state

Game State 13 introduces required `state.cultivation`:

```text
state.cultivation
  version
  plot
    id
    homePlaceId
    phase
    cycle
    harvestCount
    activeWorkId / activeWorkKind
    preparedAtWorldSeconds
    lastHarvestedAtWorldSeconds
    crop
      itemId
      cycle
      plantedAtWorldSeconds
      tendDueAtWorldSeconds
      readyAtWorldSeconds
      tendedAtWorldSeconds
      seedProvenance
```

These facts are durable because they encode consumed player input, elapsed growth boundaries, completed tending, harvest replay protection and provenance that cannot safely be reconstructed from other systems.

### Growth has no task owner

```text
plant
  -> persist crop timestamps
  -> no timer / interval / timed-task / background worker

world time advances
  -> getCultivationPlotStatus compares now with persisted boundaries

save/load
  -> same timestamps survive
  -> readiness derives identically
```

This avoids one retained timed task per crop and avoids a seventh direct timed-task owner.

### Hands-on labor reuses work authority

Preparation and tending are short character work:

```text
cultivation.prepare / cultivation.tend
  -> workTaskEngine.startWorkTask
  -> work.cultivation-prepare or work.cultivation-tend
  -> existing activity advancement reaches completion
  -> cultivation reconciliation copies durable consequence
  -> cultivation proficiency gain
  -> work owner marks complete and releases terminal task
```

The cultivation domain does not call `startTimedTask` directly.

### Physical input/output and provenance

Planting consumes one ordinary existing `item-elderwood-sweetroot` from inventory. The removed stack's provenance is stored in crop state.

Harvest creates three ordinary Sweetroots in normal inventory with cultivated provenance:

```text
sourceId = plot-home-sweetroot-bed
placeId  = character home place
data.seedProvenance = original propagation-root provenance
```

Because the canonical item ID is unchanged, existing consume, crafting and trade sinks remain valid. Provenance prevents cultivated and wild-foraged stacks from collapsing into one indistinguishable history.

### Mastery

The stable work proficiency `cultivation` lives in the existing persistent work-proficiency authority. Preparation/tending/harvest award proficiency; `workDurationForProficiency` reduces later hands-on durations. No crop XP, farming level or second mastery counter exists.

### Semantic UI

Player actions are direct intents:

```text
cultivation.prepare
cultivation.plant
cultivation.tend
cultivation.harvest
```

The Journal/context model exposes meaningful status/actions but does not reveal raw plot IDs, timestamps or provenance structures. Recommendation policy preserves existing decision priority: active cultivation may surface strongly, but a merely ready bed does not displace stronger active/ready commitment, livelihood, home or recovery decisions.

## Semantic action contract

Canonical `ActionResult` exposes:

```text
ok
action
code
outcome
data
display
```

Adapters render `display.text` or consume semantic fields. Domain logic must not parse presentation prose.

## Persistence authority — proposed Game State 13

Draft PR #378 baseline:

```text
Product:       0.8.700.1
Package:       0.8.700
Account Save:  5
Game State:    13
Data:          38
Benchmark:     3
Codename:      Cultivation & Stewardship
```

Raw current-schema validation runs before revival/normalization and requires:

```text
world time / simulation control
timed tasks / active owner-task links
active travel
projects / commitments / relationships
resource opportunities / ecology
cultivation plot/crop authority
party / ability runtime
semantic events
atlas / POI discovery
player identity / progression / skills / capabilities
inventory / mutable resources / wallet / equipment / statuses
world flags
current location/position coherence
combat identity sequence
active battle state and deterministic caches when present
active battle player / root-player live-authority coherence
```

Optional persisted authority remains:

```text
state.work
player.progression.workProficiencies
state.dayCycle
```

When cultivation references active work, the otherwise-optional work registry must contain the matching active work record and normal task chain.

No Game State 12 -> 13 migration is added under the current pre-alpha exact-schema policy.

## Runtime projections and transient state

The established non-authoritative state boundaries remain:

### NPC projection

`state.npcs` is omitted from saves and rebuilt from canonical seed NPC definitions plus persisted party companion authority.

### Enemy projection

`state.enemies` is omitted from saves and rebuilt from canonical seed encounter templates. Mutable ongoing enemy combat belongs to `activeBattle`.

### Presentation log

Top-level `state.log` is bounded session-only command presentation history, omitted from saves and reset on character load.

### Root combat/stat caches

`player.combat` and `player.statState` are reconstructed after raw validation. Mutable HP/MP/TP remain durable separately.

### Active battle

Active battle combatants/resources/statuses/actions/timeline/phase and deterministic encounter snapshots persist; live battle RNG is transient. `combatSequence` remains the durable encounter-ID allocator.

## Semantic history boundaries

```text
state.events
  -> persisted typed semantic observations with fictional-time context

state.log
  -> transient command presentation/diagnostic history

activeBattle.log
  -> persisted encounter-local narrative/action history

Canvas command/output history
  -> transient UI state
```

No domain consumer should parse top-level command prose as authority.

## Timed-task lifecycle ownership

Direct production task creators remain exactly:

```text
abilityEngine.js
campaignRecoveryEngine.js
projectEngine.js
resourceOpportunityEngine.js
transportEngine.js
workTaskEngine.js
```

0.8.700 deliberately reuses `workTaskEngine` rather than adding cultivation as a direct creator. Each owner releases terminal tasks only after durable exactly-once consequence reconciliation. There is no accepted blind global pruning policy.

## Historical Game State transitions

- Game State 7 — fictional-time atlas visit timestamps.
- Game State 8 — root player combat/stat caches removed from serialization.
- Game State 9 — canonical persisted status modifier shape.
- Game State 10 — NPC runtime projection removed from serialization.
- Game State 11 — enemy encounter-template projection removed from serialization.
- Game State 12 — command presentation history removed from serialization.
- Game State 13 — required cultivation plot/crop authority introduced.

## Validated 0.8.700 implementation checkpoint

```text
Head:   c125f7ae5f94800893dc28c7fa0ceb61553e3db8
PR:     #378 draft/open/unmerged
Check:  32340190710
Tests:  695/695
Node:   24.19.0
Benchmark 3 + sample: success
```

The implementation head is frozen. Documentation commits after it are synchronization only.

## Carried-forward rule

Presentation adapters and projections may make canonical state easier to understand and operate, but they must not become second authorities.

If PR #378 remains unmerged, a future thread should resolve its status before starting independent `0.8.800` work. Do not repeat broad cultivation discovery unless repository authority changed materially.
