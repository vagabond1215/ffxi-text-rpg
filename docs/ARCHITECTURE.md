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
Product:       0.9.100.24
Package:       0.9.100
Account Save:  5
Game State:    15
Data:          62
Benchmark:     3
Codename:      Local Knowledge & Familiarity
Phase:         0.9 / Gate A complete; 0.9.200 queued
```

Data 62 remains the canonical authored-content checkpoint. Product 0.9.100.24 adds the Local Knowledge & Familiarity Foundation: Game State 15 persists character-specific locality knowledge, temporary guidance, NPC identity linkage, connector familiarity, POI interaction history, and active local POI context while canonical world definitions remain in their existing catalogs.

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

## Data 49 Ironspine and population-hunting composition

Population hunting is a bridge, not a second ecology or encounter database:

```text
canonical population
  -> deliberate population encounter discovery
  -> existing active battle
  -> victory
  -> consume one ecology population unit exactly once
  -> existing defeated-body recovery
  -> existing inventory/provenance
```

The active battle carries optional source population/species identifiers and an exactly-once consumption marker. Encounter start alone does not alter population availability. Hostile automatic encounters remain owned by the aggro/spawn system.

Ironspine geography preserves boundary semantics through canonical routes:

```text
North Redstone
  -> wagon-capable maintained pass road
  -> Ironspine Lower Pass
  -> High-Pass Watch [wagon limit]
  -> walk/mount High Trail
  -> Ironspine High Meadow

broad cliffs / unstable scree
  -> no implicit adjacency
```

Ironspine food preparation uses the existing authored consumption metadata. Internal hazards remain explicit for validation while normal presentation describes experiential period knowledge such as raw game causing sickness and cooking, salting, or smoking making it fit for use.

## Data 48 Great Mere and consumption-safety composition

Great Mere preserves physical boundary authority:

```text
East Starfen
  -> East Fen Shore Track
  -> Great Mere Westshore
  -> Merewatch Landing

Mistmere Reedport
  -> canonical ferry waterway
  -> Merewatch Landing
  -> Reedcrown Isle
```

Open/deep water is not a walkable place edge. Reedcrown is reachable through the route/transport system only.

The item-safety extension remains definition metadata:

```text
canonical item
  -> food/use tags
  -> explicit consumption profile
       mode: direct | processRequired | nonFood
       hazard: none | pathogenRisk | rawIrritant | rawToxic
       preparation: authored labels
  -> player information presentation
  -> existing production recipes transform unsafe/raw ingredients
```

No hunger meter, poison clock, nutrition store, or second item authority is introduced. A future explicit eat/consume mechanic can compose this metadata with existing item/status systems if authorized.

See `docs/ITEM_CONSUMPTION_SAFETY.md` and `docs/ZONE_PROFILE_GREAT_MERE.md`.

## Data 47 intermediate-first production composition

The production architecture remains one canonical authority:

```text
canonical raw resource
      |
      v
productionCatalog definition
      |
      v
productionEngine / workTask / world time
      |
      v
inventory item with transformation provenance
      |
      +--> trade / storage
      |
      +--> later production recipe input
      |
      v
finished food / textile / luxury / decorative good
```

Data 47 adds modular regional subcatalogs behind the existing `getProductionDefinition` / `getProductionItem` interfaces. Runtime callers do not need a second production engine or regional dispatch path.

The key architectural rule is that **intermediate goods are ordinary canonical items**. Flour, pea meal, thread, linen cloth, pigments, perfume extracts, cut gemstones, veneer, ceramic slip/glaze, apple must/vinegar and similar outputs preserve provenance and can feed later recipes.

`pack-regional-ingredient-luxury-processing` owns placement/dependency metadata for these 30 items and 30 recipes. It does not own inventory state, work state, proficiency state, or a separate luxury economy.

## Crownfields managed-agriculture composition

Data 46 adds a managed agricultural landscape without creating a second cultivation or husbandry state authority.

```text
Crownfields crop strips / orchard / hay meadow
        |
        v
existing ecology gathering sources
        |
        v
existing timed gathering + work proficiency
        |
        v
existing inventory + exact provenance
        |
        v
Crownfields Produce Exchange
        |
        +--> safe Grange recovery / provisions
        |
        +--> Southfield Farm Road / Produce Wagon
        |
        v
Thornwall economy
```

Cattle, sheep, hens, rats, and orchard bees are persistent ecology populations. They do not yet emit milk, wool, eggs, honey, manure, meat, or hides through a fake flora source. Those products require a deliberate managed-animal/husbandry source model if later authorized.

## Geography and ecology integrity rules

- A canonical route and a legacy direct connection must not independently describe the same leg with conflicting time/distance authority.
- Player-enterable places require an outbound path unless trapping is explicit game design.
- Place ↔ map membership is reciprocal.
- Route stops must be valid/navigable coordinates and segments must follow authored stop order.
- Regional ecology resolves through the same canonical registry as foundation ecology.
- Resource provenance must resolve to known places/sources and cannot be hidden by pre-validation deduplication.
- Population state remains ecology authority; automatic aggro remains spawn-rule authority. A future hunt-discovery bridge should compose them rather than making passive wildlife aggressive.

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
- canonical commitment -> giver/place/item/source/capability relationships;
- NPC schedule -> NPC/place relationships;
- companion -> backing NPC/home/recruitment relationships;
- topology, source/sink, quest and relationship references;
- bounded legacy-ID adapters rather than accidental legacy leakage.

The generated validation fixture exercises **1,401 ownership records** and is never counted as gameplay content.

# Universal magic and Starfen marshcraft composition

Packet D deliberately separates **universal magic ownership** from **regional authored context**.

```text
pack-shared-foundation
  -> Elemental Form / Vital Weave / Ward Lore / Veilscript
  -> shared spell capabilities
  -> shared executable abilities
  -> character learning/use requirements
  -> abilityEngine
```

A spell's definition is not owned by the region where a teacher, contract, or story happens. Regions may reference shared spells through declared dependencies, but regional packs must not claim spell ownership or add geography as an implicit use gate.

Veilscript is the original Hearth & Horizon seal-magic tradition. It uses the existing `ninjutsu` character skill and existing damage/status ability contracts; it does not introduce a second magic state family.

Starfen remains regional where regionality is meaningful:

```text
Starfen ecology/resources
  -> production/work/inventory/provenance
  -> medicine / cord / waterproofing / survey gear
  -> persistent Mistmere people + fictional-time schedules
  -> commitments / relationships
  -> Starfen Current Reading field knowledge
  -> pack-starfen-marshcraft
```

External Tales of Symphonia material is isolated in `docs/research/TALES_OF_SYMPHONIA_MAGIC_REFERENCE.md` as non-canonical design research. Canonical Hearth & Horizon names, stable IDs, schools, effects, lore, and learning paths are original.

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

Redstone processing/crafting definitions live in the existing production catalog; work execution remains under the production/work-task engines. Its contracts reuse commitment, relationship, wallet, inventory, semantic-event, NPC-projection, and NPC-schedule authority. `pack-redstone-forge-road` depends on shared foundation, Redstone opening, and Redstone ecology breadth. It adds no direct timed-task owner or parallel state family.

# Elderwood Hunt-Timber composition

`0.9.100.3` is the second authored Gate A regional tranche and deliberately stresses a different composition: hunting/body recovery, forestry materials, downstream field equipment, fictional-time civic availability, provenance-qualified community work, and learned forest techniques.

```text
existing Elderwood field substrate
  Barkboar hide recovery / Duskcap / amber resin / hardwood
          |
          v
existing inventory + provenance
          |
          v
existing tannery + woodshop / work-task / work-proficiency authority
          |
          v
tanned hide / hide bindings / resin boards + pitch
forester gloves / hunter bracer / trail repair bundles
          |
          +----------------------------+
          |                            |
          v                            v
existing commitment +            existing character capability
relationship + schedule          + ability runtime authority
          |                            |
          v                            v
Thornwall civic/social use       Elderwood techniques/warding
```

## Production and physical ownership

Elderwood processing/crafting definitions live in the existing production catalog. Work execution remains under the existing production/work-task engines.

Consequences remain split by existing authority:

```text
work duration / task lifecycle  -> work-task + canonical fictional time
work mastery                    -> player work proficiencies
physical inputs/outputs         -> inventory containers
source/transformation history   -> resource provenance
station availability            -> existing workstation/locality context
```

The Elderwood pack creates **no direct timed-task owner**. It does not add a tannery clock, woodshop queue, offline worker, pack-owned inventory, or second resource-recovery authority.

## Capability and ability ownership

The four Elderwood techniques/warding actions are ordinary character-owned capabilities backed by executable entries in the existing ability catalog/engine. Barkboar Brace is covered end-to-end through the same learned-skill, equipment, resource, target, timing, cooldown, status, and combat rules already used elsewhere.

There is no regional ability bar or second advancement meter.

## Commitments, schedules, and continuity

The Elderwood contracts use existing commitment, relationship, wallet, inventory, semantic-event, NPC-projection, and NPC-schedule authorities.

Three already-visible Thornwall/Elderwood service people become persistent NPC-backed contacts rather than new filler locations. Oren Vale's roadworks availability is derived from the existing schedule engine at **07:00–15:00 fictional time**. There is no social clock.

The road-repair commitment consumes real provenance-bearing produced bundles and pays exactly once through existing commitment authority.

## Pack ownership

`pack-elderwood-hunt-timber` is a child regional pack with dependencies:

```text
pack-shared-foundation
pack-elderwood-opening
pack-elderwood-ecology-breadth
```

It claims the downstream Elderwood items, recipes/processes, persistent NPCs, schedule, capabilities, abilities, and commitments through Pack v2. Canonical definitions continue to live in their domain catalogs.

# Census separation

The content census distinguishes actual canonical breadth from infrastructure coverage.

Current gameplay breadth:

```text
places/localities       26
named NPCs              15
shop/service sites      17
creatures               16
resource sources        13
canonical items         62
recipes/processes       23
abilities/techniques    13
quests/contracts        14
companions                1
transport services        3
```

Supplemental infrastructure:

```text
routes                                   7
spell schools                            3
capability/training definitions         16
NPC schedules                            5
regional/shared packs                    9
pack-owned records                     171
pack-owned abilities/capabilities/
  schedules/companions              13/16/5/1
runtime seed NPCs                       14
runtime seed enemies                    13
```

The mechanics-scale gate remains **NOT READY**. Abilities/techniques remain the largest relative gap. Pack references and generated fixtures do not manufacture gameplay-content progress.

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

## Player locality-knowledge authority

`docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md` defines the player-information boundary. The foundation is implemented in Game State 15.

Canonical world truth and player knowledge remain separate:
- canonical catalogs own actual places, routes, POIs, NPCs, schedules, shops, quests, and services;
- persisted `state.localKnowledge` owns only character-specific references: place/POI knowledge states, learned names, NPC identity linkage, connector familiarity, interaction counts, temporary guidance, and the current locality anchor;
- nullable `state.activePoiId` records current local POI/interior engagement and must agree with the current place/anchor;
- legacy `discoveredPois` is rejected by the current Game State schema.

The foundation implements:
- Unknown -> Referenced -> Sighted -> Recognized -> Familiar states;
- explicit approach/enter/interact/leave staging;
- familiarity-gated direct navigation;
- deterministic/injectable fictional-time locality exploration;
- save-persistent guidance/search bias;
- knowledge-gated shops/services/transport and commitment disclosure after real contact.

It deliberately does **not** create:
- a second route graph;
- a city-only simulation clock;
- duplicated POI/NPC definitions in player state;
- serialized prose/button lists;
- wall-clock availability;
- a new timer/listener/background lifecycle owner.

Town/locality movement may use abstract graph nodes and transition anchors while wilderness/dungeon places continue using coordinates/topologies where those are mechanically useful. Richer ambient events, wandering merchants, personality dialogue, and deeper shop browsing remain follow-on systems.


# Persistence authority — Game State 15

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

Redstone and Elderwood production both reuse `workTaskEngine`; neither adds a direct creator. Cultivation manual labor also reuses that owner; crop growth and delegated tending do not add direct creators. Each owner releases terminal tasks only after durable exactly-once consequence reconciliation. There is no accepted blind global pruning policy.

## Historical Game State transitions

- Game State 7 — fictional-time atlas visit timestamps.
- Game State 8 — root player combat/stat caches removed from serialization.
- Game State 9 — canonical persisted status modifier shape.
- Game State 10 — NPC runtime projection removed from serialization.
- Game State 11 — enemy encounter-template projection removed from serialization.
- Game State 12 — command presentation history removed from serialization.
- Game State 13 — required cultivation plot/crop authority introduced.
- Game State 14 — required paid cultivation delegation appointment state introduced.
- Game State 15 — durable locality knowledge/familiarity, temporary guidance, NPC identity linkage, connector knowledge, POI interaction history, and active local POI context.

## Validation checkpoints

Pack v2 infrastructure history:

```text
implementation SHA 739f88801ddd66587b6b45bdbd0784dff351c986
Check              32402373472
704/704 tests + census + Benchmark 3 + sample
```

Redstone implementation/content freeze:

```text
implementation SHA 440a77c542fcc6a6efcce7a45ca989e9068499f8
Check              32416678697
Job                96579293377
707/707 tests + census + Benchmark 3 + sample
```

Current Elderwood implementation/content freeze:

```text
implementation SHA acb24b73b4894d3febab370aa279bdfd12cbd02e
Check              32423676980
Job                96600958329
711/711 tests + census + Benchmark 3 + sample
```

`0.9.100.3` subsequently landed; this historical freeze is retained only as earlier validation evidence.

## Carried-forward rule

Presentation adapters, projections, content packs and catalog registries may make canonical state/content easier to organize and operate, but they must not become second gameplay authorities.

Historical packet sequencing above is retained for provenance only. The current authored-data baseline is Data 62; the current runtime/persistence baseline is Product 0.9.100.24 / Game State 15. Current next-work authority lives in `docs/THREAD_HANDOFF.md`, `docs/EXECUTION_PIPELINE.md`, and `docs/ROADMAP.md`.