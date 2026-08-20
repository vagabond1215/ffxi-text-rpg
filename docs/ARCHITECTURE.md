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

## Current runtime baseline

```text
Product:       0.8.900.1
Package:       0.8.900
Account Save:  5
Game State:    14
Data:          39
Benchmark:     3
Codename:      Household & Community Continuity
Phase:         0.8 complete
```

Frozen runtime: `ca7d37c643adc4115b519148615f6120d03228df`.

## Core authority rules

- One canonical fictional-time/simulation substrate owns elapsed gameplay time.
- Timed tasks own scheduled active-work boundaries; domain systems own consequences and exactly-once release.
- Continuous-character progression, learned skills/capabilities, and work proficiency belong to the person; disciplines are contextual training traditions.
- Inventory/equipment/container state owns physical item location, capacity, access, carried load, preparation and tool context.
- Resources preserve source/transformation provenance.
- Projects own persistent construction/material/labor progress; home infrastructure composes project/inventory/furnishing/workstation authorities.
- Commitments own accepted/resolved/follow-up state; relationships remain separate durable authority.
- NPC schedules derive authored availability from canonical fictional time and own no separate clock.
- Persistent companions are NPC-backed participants whose party authority owns recruitment, active membership, location continuity, field approach and battle/recovery synchronization.
- Maps, Journal guidance, service boards, information models, home opportunities, social schedules and cultivation opportunities are projections over canonical state.
- Ordinary presentation exposes what the character sees, knows, carries, remembers, needs or can decide; implementation rationale stays outside normal play.

# Phase 0.8 connected-life architecture

Phase 0.8 deliberately composes existing authorities rather than creating isolated property, farming, automation or social simulators.

```text
regional world + provenance
  -> home project/infrastructure
  -> storage/workstation/logistics capability
  -> cultivation plot authority
  -> manual work + mastery
  -> paid bounded delegation
  -> home-grown inventory provenance
  -> existing commitment + relationship + schedule authorities
  -> ordinary services / preparation / travel / adventure
```

## Cultivation authority

Game State 13 introduced required `state.cultivation` because the plot/crop lifecycle contains player-costly facts that cannot be reconstructed safely.

Core durable facts include:

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

### Growth has no task owner

```text
plant
  -> persist crop timestamps
  -> no timer / interval / timed-task / background worker

world time advances
  -> cultivation status compares now with persisted boundaries

save/load
  -> same timestamps survive
  -> readiness derives identically
```

Manual preparation/tending are short character work under the existing work-task authority. Cultivation itself never calls the generic timed-task creator directly.

### Physical input/output and provenance

Planting consumes one ordinary existing `item-elderwood-sweetroot` from inventory. Its provenance is retained through the growing crop.

Harvest creates ordinary Sweetroots in normal inventory with cultivated provenance:

```text
sourceId = plot-home-sweetroot-bed
placeId  = character home place
data.seedProvenance = original propagation-root provenance
```

The canonical item ID remains unchanged, so existing consume, production and trade sinks remain valid while provenance keeps wild and cultivated histories distinct.

### Mastery

The stable work proficiency `cultivation` lives in existing character work-proficiency authority. Manual preparation/tending/harvest can improve player mastery and later reduce hands-on duration. There is no crop XP or farming-level authority.

## Earned routine delegation

Game State 14 extends cultivation authority with one bounded paid tending assignment after the routine has been manually proven.

```text
manual crop cycle completed
  -> delegation becomes eligible
  -> player pays 12 gil once
  -> assignment persists on cultivation authority
  -> canonical fictional time reaches helper completion boundary
  -> cultivation records tending exactly once
  -> no player work proficiency awarded for helper labor
  -> eventual harvest remains ordinary cultivation output
```

The assignment does **not**:

- create a seventh direct timed-task owner;
- create a helper/social/offline clock;
- occupy the player's hands-on work channel;
- generate free resources;
- award player mastery for work the player did not perform.

This is the architectural meaning of earned automation in the current game: lower attention only after the manual routine exists, while cost/time/material consequences remain real.

## Household & community continuity

`0.8.900` adds no new persistence family. It expands authored data consumed by existing authorities.

Three existing named locality people are persistent NPC-backed scheduled participants:

- Mira Fen — Thornwall Southgate, 06:00–11:00;
- Mae Oris — Brasshaven Market Ring, 11:00–17:00;
- Kiri Fen — Mistmere Canal Ward, 16:00–21:00.

Their home-produce commitments use existing commitment/relationship/wallet/inventory/event/save authorities and require provenance source `plot-home-sweetroot-bed`. A wild Sweetroot has the same canonical item identity but does not meet that social requirement.

No social clock, household relationship engine, duplicate quest state or reputation meter was created.

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

Direct semantic player intents now include:

```text
cultivation.prepare
cultivation.plant
cultivation.tend
cultivation.harvest
commitment.accept
commitment.resolve
commitment.followUp
```

The Journal projects these decisions without manufacturing command strings.

# Persistence authority — Game State 14

Raw current-schema validation runs before revival/normalization.

Required authority includes:

```text
world time / simulation control
timed tasks / active owner-task links
active travel
projects / commitments / relationships
resource opportunities / ecology
cultivation plot/crop/delegation authority
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

No automatic Game State migrations are added under the current pre-alpha exact-schema policy.

## Runtime projections and transient state

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

Cultivation manual labor reuses `workTaskEngine`; crop growth and delegated tending do not add direct creators. Each owner releases terminal tasks only after durable exactly-once consequence reconciliation. There is no accepted blind global pruning policy.

## Historical Game State transitions

- Game State 7 — fictional-time atlas visit timestamps.
- Game State 8 — root player combat/stat caches removed from serialization.
- Game State 9 — canonical persisted status modifier shape.
- Game State 10 — NPC runtime projection removed from serialization.
- Game State 11 — enemy encounter-template projection removed from serialization.
- Game State 12 — command presentation history removed from serialization.
- Game State 13 — required cultivation plot/crop authority introduced.
- Game State 14 — required paid cultivation delegation appointment state introduced.

## Validated Phase 0.8 checkpoint

```text
Runtime: ca7d37c643adc4115b519148615f6120d03228df
Check:   32395768383
Tests:   699/699
Node:    24.19.0
Benchmark 3 + sample: success
```

Phase-exit validation Check `32395959505` also passed Content Census and Hardening. Documentation commits after the runtime freeze are synchronization only.

## Carried-forward rule

Presentation adapters and projections may make canonical state easier to understand and operate, but they must not become second authorities.

Phase 0.9 is planned but not opened. The next architectural risk is no longer state coherence; it is scaling connected authored content without introducing content-specific parallel systems.
