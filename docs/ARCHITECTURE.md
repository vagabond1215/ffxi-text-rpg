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
Product:       0.9.100.2
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          41
Benchmark:     3
Codename:      Redstone Forge-Road
Phase:         0.9 / Content Scale Gate A
```

Frozen Redstone implementation/content checkpoint before version/document synchronization:

```text
440a77c542fcc6a6efcce7a45ca989e9068499f8
```

The version transition is intentionally narrow. Data advances because stable canonical authored content and cross-linked Pack-v2 relationships changed. Game State remains 14 because no new durable player/world fact was introduced.

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
- Content packs own regional/shared **content identity and dependency metadata**, not duplicate gameplay state.
- Canonical domain catalogs remain definition authorities; the content catalog registry resolves pack references into those catalogs.
- Maps, Journal guidance, service boards, information models, home opportunities, social schedules and cultivation opportunities are projections over canonical state.
- Ordinary presentation exposes what the character sees, knows, carries, remembers, needs or can decide; implementation rationale stays outside normal play.

# Phase 0.9 content-scale architecture

## Content Pack Scale Contract v2

Pack v2 owns regional/shared placement across:

```text
places
routes
transportServices
ecologyFamilies
species
populations
gatheringSources
items
npcs
npcSchedules
shops
recipes
quests
relationships
spellSchools
capabilities
abilities
companions
```

A pack record establishes stable ownership and declared dependencies. It does not replace the canonical runtime catalog for the referenced system.

```text
regional/shared pack
  -> stable content identity + dependency placement

contentCatalogRegistry
  -> resolves pack references

canonical domain catalogs
  -> definitions consumed by runtime systems

runtime systems
  -> gameplay behavior/state
```

The architecture therefore scales regional organization without creating pack-specific inventories, progression state, quest state, companion state, clocks, or other parallel authorities.

### Catalog bridge

`js/text/data/contentCatalogRegistry.js` resolves pack ownership into existing definitions:

```text
items                  -> resource / production / equipment catalogs
recipes/processes      -> production catalog
quests/contracts       -> commitment catalog
NPCs                    -> canonical seed NPC definitions
world/ecology           -> place / route / transport / ecology catalogs
training/combat access  -> spell-school / capability / ability catalogs
NPC life                -> NPC schedule catalog
companions              -> companion catalog
```

### Cross-pack validation

Pack v2 validation enforces:

- stable IDs and collection ownership;
- duplicate ownership and cross-collection collisions;
- declared dependencies for cross-pack references;
- canonical catalog references;
- ability -> capability and spell-school relationships;
- NPC schedule -> NPC/place relationships;
- companion -> backing NPC/home/recruitment relationships;
- topology, source/sink, quest and relationship references;
- bounded legacy-ID adapters rather than accidental legacy leakage.

The generated validation fixture exercises **1,401 ownership records** and is never counted as gameplay content.

# Redstone Forge-Road composition

`0.9.100.2` is the first authored regional tranche after Pack v2. Its architectural requirement is reuse, not parallel infrastructure.

```text
existing Redstone ecology/resources
  iron ore / sunstone grit / Ridge Ibex recovery
          |
          v
existing inventory + provenance
          |
          v
existing forge/workstation + work-task + work-proficiency authority
          |
          v
forge flux / tempered iron / rivets
work equipment / caravan repair hardware
          |
          +-----------------------+
          |                       |
          v                       v
existing commitments       existing character capability
relationships/schedules    + ability runtime authority
          |                       |
          v                       v
Brasshaven social use      Redstone techniques/spells
```

## Production and physical ownership

Redstone processing/crafting definitions live in the existing production catalog. Work execution remains under the existing production/work-task engines.

Consequences remain split by existing authority:

```text
work duration / task lifecycle  -> work-task + canonical fictional time
work mastery                    -> player work proficiencies
physical inputs/outputs         -> inventory containers
source/transformation history   -> resource provenance
station availability            -> existing workstation/locality context
```

The Redstone pack creates **no direct timed-task owner**. It does not add a forge clock, recipe queue, offline worker, or pack-owned inventory.

## Capability and ability ownership

Ridge Breaker, Rivet Guard, Forge Spark, and Ironbound Ward are ordinary character-owned capabilities backed by executable entries in the existing ability catalog/engine.

Learning a Redstone capability changes the character's existing capability authority. Activation still uses existing context, learned-skill, equipment, resource, target, timing, cooldown, status, and combat rules. There is no regional ability bar or second advancement meter.

## Commitments, schedules, and continuity

The Forge-Road contracts use existing commitment, relationship, wallet, inventory, semantic-event, NPC-projection, and NPC-schedule authorities.

A first integration run exposed an important projection/content interaction: later Forge-Road jobs offered through Varric's already-discovered contact could outrank his established copper-return continuity in the Journal. The repair was authored-content placement, not a new priority subsystem:

```text
Varric Stone
  -> existing Copper for the Ring path remains intact

Mae Oris
  -> later Forge-Road orders
  -> existing 11:00–17:00 fictional-time schedule applies
```

The old copper continuity test was not weakened.

## Pack ownership

`pack-redstone-forge-road` is a child regional pack with dependencies:

```text
pack-shared-foundation
pack-redstone-opening
pack-redstone-ecology-breadth
```

It claims the downstream Redstone items, recipes/processes, capabilities, abilities, and commitments through Pack v2. Canonical definitions continue to live in their domain catalogs.

# Census separation

The content census distinguishes actual canonical breadth from infrastructure coverage.

Current gameplay breadth:

```text
places/localities       26
named NPCs              12
shop/service sites      17
creatures               16
resource sources        13
canonical items         56
recipes/processes       17
abilities/techniques     9
quests/contracts        11
companions                1
transport services        3
```

Supplemental infrastructure:

```text
routes                                   7
spell schools                            3
capability/training definitions         12
NPC schedules                            4
regional/shared packs                    8
pack-owned records                     140
pack-owned abilities/capabilities/
  schedules/companions                9/12/4/1
```

The mechanics-scale gate remains **NOT READY**. Pack references and generated fixtures do not manufacture gameplay-content progress.

# Phase 0.8 connected-life architecture

Phase 0.8 deliberately composed existing authorities rather than creating isolated property, farming, automation or social simulators.

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

```text
state.cultivation
  version
  plot
    id / homePlaceId / phase / cycle / harvestCount
    activeWorkId / activeWorkKind
    preparedAtWorldSeconds / lastHarvestedAtWorldSeconds
    crop
      itemId / cycle
      plantedAtWorldSeconds
      tendDueAtWorldSeconds
      readyAtWorldSeconds
      tendedAtWorldSeconds
      seedProvenance
```

Crop growth has no task owner. Planting persists fictional-time boundaries; status derives from canonical world time. Manual preparation/tending reuse `workTaskEngine`.

Planting consumes an ordinary `item-elderwood-sweetroot`; harvest creates ordinary Sweetroot inventory with cultivated provenance `sourceId = plot-home-sweetroot-bed` and nested seed provenance. Existing consumption, production, and trade sinks remain valid.

The stable work proficiency `cultivation` lives in existing character work-proficiency authority. There is no crop XP or farming-level authority.

## Earned routine delegation

Game State 14 extends cultivation authority with one bounded paid tending assignment after the routine has been manually proven.

```text
manual crop cycle completed
  -> delegation eligible
  -> player pays 12 gil once
  -> assignment persists on cultivation authority
  -> canonical fictional time reaches helper completion boundary
  -> tending records exactly once
  -> helper work grants no player mastery
```

The assignment creates no seventh direct timed-task owner, helper/offline clock, hands-on player lock, free resources, or duplicate progression authority.

## Household & community continuity

`0.8.900` adds no new persistence family. Existing named scheduled people consume home-grown Sweetroot provenance through existing commitment/relationship/wallet/inventory/event/save authorities.

No social clock, household relationship engine, duplicate quest state, or reputation meter was created.

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

- `state.npcs` is omitted from saves and rebuilt from canonical seed NPC definitions plus persisted party companion authority.
- `state.enemies` is omitted from saves and rebuilt from canonical seed encounter templates; mutable ongoing enemy combat belongs to `activeBattle`.
- top-level `state.log` is bounded session-only command presentation history and is omitted from saves.
- `player.combat` and `player.statState` are reconstructed after raw validation; mutable HP/MP/TP remain durable separately.
- active battle combatants/resources/statuses/actions/timeline/phase and deterministic encounter snapshots persist; live battle RNG is transient.

## Semantic history boundaries

```text
state.events      -> persisted typed semantic observations
state.log         -> transient command presentation history
activeBattle.log  -> persisted encounter-local narrative/action history
Canvas history    -> transient UI state
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

Redstone production reuses `workTaskEngine`; it does not add a direct creator. Cultivation manual labor also reuses that owner; crop growth and delegated tending do not add direct creators. Each owner releases terminal tasks only after durable exactly-once consequence reconciliation. There is no accepted blind global pruning policy.

## Historical Game State transitions

- Game State 7 — fictional-time atlas visit timestamps.
- Game State 8 — root player combat/stat caches removed from serialization.
- Game State 9 — canonical persisted status modifier shape.
- Game State 10 — NPC runtime projection removed from serialization.
- Game State 11 — enemy encounter-template projection removed from serialization.
- Game State 12 — command presentation history removed from serialization.
- Game State 13 — required cultivation plot/crop authority introduced.
- Game State 14 — required paid cultivation delegation appointment state introduced.

## Validation checkpoints

Pack v2 infrastructure history:

```text
implementation SHA 739f88801ddd66587b6b45bdbd0784dff351c986
Check              32402373472
704/704 tests + census + Benchmark 3 + sample
```

Current Redstone implementation/content freeze:

```text
implementation SHA 440a77c542fcc6a6efcce7a45ca989e9068499f8
Check              32416678697
Job                96579293377
707/707 tests + census + Benchmark 3 + sample
```

A final promoted/documented exact-head PR Check is required before landing `0.9.100.2`.

## Carried-forward rule

Presentation adapters, projections, content packs and catalog registries may make canonical state/content easier to organize and operate, but they must not become second gameplay authorities.

Redstone Forge-Road is the current completed bounded tranche pending landing. **Elderwood Hunt-Timber is the next independent packet and is not started or authorized by this document.**