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
Product:       0.9.500.2
Package:       0.9.500
Account Save:  5
Game State:    21
Data:          82
Benchmark:     3
Codename:      Ironspine Warden Trust Circuit
Phase:         0.9 / 0.9.500 ACTIVE; Q0-Q1 complete; Q2 Crownfields allocation-choice pass selected next
```

Data 82 is the current authored/mechanics-data checkpoint. Product 0.9.500.2 closes Q1 Ironspine Watchpost Trust & Warden Companion Slice; Game State 21 remains unchanged. Q1 composes existing production provenance, relationship requirements, schedules, locality, and party continuity into one multi-NPC trust circuit. Q2 Crownfields Grange Allocation Choice & Social Consequence is selected / not started.

## 0.9.400 production/item authority

A0 deliberately adds a **resolver**, not another item database:

```text
resource definitions ----\
production definitions ---+--> canonicalItemRegistry --> commerce / Pack refs / production outputs
equipment definitions ----/
```

Production recipes may now output an existing equipment stable ID while the equipment catalog remains physical/equipment behavior authority. The production work record contributes transformation provenance; it does not copy the equipment definition into `productionItems`.

Canonical shop stock is materialized from the same canonical item definition. Shops own price/availability and purchase provenance, not a second physical shape inferred from merchandising tags.

Production tool requirements resolve to explicit bindings:

```text
equipped field tool
portable equipment tool in Inventory
explicit contextual capability
        |
        v
existing work record.data.toolBindings
```

Physical bindings are reservations on existing work records, not a new state family. Common player move/equip/sell paths reject moving a bound tool until the work record leaves active status. Field gathering/recovery may retain stricter equipped-tool rules.

### A1 conversion proof

A1 demonstrates the A0 authority contract with real authored production:

```text
existing material-foundation stocks
        |
        v
occupationalFieldToolProductionCatalog
    (process definitions only)
        |
        v
productionEngine
        |
        v
existing equipment stable ID
        |
        +--> equipmentCatalog behavior
        +--> production provenance
        +--> inventory/equipment persistence
```

`pack-occupational-field-tools` owns placement of six existing item refs and six new recipe refs. It does not own a parallel equipment definition.

The crafted Field Knife is proven as a physical `cutting` capability in both downstream handle work and Marsh Fishing Rod assembly. The rod itself remains the existing `marsh-rod` equipment identity and provides `fishing`.

A1 requires no persistence-family change: the canonical item snapshot plus provenance already serializes through the existing inventory/equipment envelope.

### A2 bronze martial conversion proof

A2 composes shared material culture into existing martial equipment identities:

```text
bronze ingot / bronze sheet
ash handle / hemp twine / hemp canvas
iron buckle-ring hardware
A1 Field Knife cutting binding
        |
        v
starterBronzeMartialProductionCatalog
        |
        v
existing Bronze Sword / Cap / Harness IDs
        |
        +--> equipmentCatalog behavior
        +--> production provenance
        +--> statEngine combat profile
        +--> weaponCadenceEngine
        +--> current-schema persistence
```

`pack-starter-bronze-martial-equipment` owns shared placement of three existing item refs and three new recipe refs. It does not create a parallel item catalog.

Bronze Harness assembly explicitly requires `cutting`, so physical tool bindings are now proven across separate A1 and A2 production families. No new persistence family is required.

### A3 caster / offhand starter conversion proof

A3 composes the existing starter loadout rules with established material supply chains:

```text
Elderwood ash / Silvermaple fine board
common hemp / glue / brass stocks
Redstone tempered iron / rivets
A1 Field Knife cutting binding
        |
        v
starterCasterOffhandProductionCatalog
        |
        v
existing Ash Staff / Maple Wand / Iron Buckler / Brass Ring IDs
        |
        +--> equipmentCatalog behavior
        +--> two-handed/offhand compatibility
        +--> statEngine combat profile
        +--> weaponCadenceEngine
        +--> production provenance
        +--> current-schema persistence
```

`pack-starter-caster-offhand-equipment` owns shared placement of four existing item refs and four new recipe refs. It depends on the material-foundation pack and Redstone Forge-Road instead of creating generic duplicate iron inputs.

A3 requires no persistence-family change.

### A4 remaining bronze starter conversion proof

A4 completes the existing bronze starter family without fragmenting Pack-v2 ownership:

```text
A2 bronze ingot / bronze sheet
Ash Handle Blank / Hemp Twine / Hemp Canvas
shared ferrule / buckle-ring hardware
A1 Field Knife cutting binding
        |
        v
remainingBronzeStarterProductionCatalog
        |
        v
existing Bronze Axe / Dagger / Pick / Subligar / Mittens IDs
        |
        +--> existing pack-starter-bronze-martial-equipment
        +--> equipmentCatalog behavior
        +--> weaponCadenceEngine
        +--> statEngine combat profile
        +--> production provenance
        +--> current-schema persistence
```

A4 extends `pack-starter-bronze-martial-equipment` from three to eight item refs and three to eight recipe refs. A second bronze Pack-v2 pack would be duplicate ownership structure and is intentionally not created.

Bronze Pick remains an axe-family combat weapon and does not acquire field-tool/mining capability. Field mining remains owned by Prospector Pick.

A4 requires no persistence-family change.

### A5 basic leather garment conversion proof

A5 composes the established Elderwood tanning chain into existing shared light-armor identities:

```text
Elderwood Barkboar recovery
  -> Dusk-Tanned Barkboar Hide
  -> Resin-Cured Hide Binding
A1 Field Knife cutting binding
        |
        v
basicLeatherGarmentProductionCatalog
        |
        v
existing Leather Vest / Leather Trousers IDs
        |
        +--> equipmentCatalog light-armor behavior
        +--> statEngine combat profile
        +--> production provenance
        +--> current-schema persistence
```

`pack-basic-leather-garments` owns shared placement of two existing item refs and two new recipe refs while depending on `pack-elderwood-hunt-timber`.

A5 does not add a leatherworking proficiency, stitching state family, or generic duplicate leather item. It requires no persistence-family change.

### A6 production requirement authority closure

A6 resolves the post-A5 workshop-tool question by separating station capability from portable-tool capability and validating both before production content is accepted.

```text
equipmentCatalog portable tool identities
        |
        v
productionRequirementAuthority
  - recognized station tags
  - canonical portable-tool providers
  - explicit contextual tool tags
        |
        +----------------------+
        |                      |
        v                      v
productionCatalog         workstationEngine
requirement validation    station availability
        |
        v
productionEngine
tool binding + station checks
```

Recognized workstation tags:
- `forge`;
- `kitchen`;
- `woodshop`;
- `tannery`;
- `workshop`.

Current required portable production capabilities:
- `cutting` -> Field Knife / Reed Sickle;
- `woodcutting` -> Woodsman Hatchet.

`validateProductionCatalog()` now rejects a station tag outside the recognized station authority and rejects any required tool tag without either a canonical portable provider or explicit contextual authority.

This keeps ordinary fixed workshop implements inside workstation context. A carried hammer, saw, awl, ladle, balance, or similar identity should be introduced only when a player-facing action needs a portable capability distinct from station presence.

A6 adds no new authored data or persisted state. Data remains 80 and Game State remains 21.

### Q0 social relationship eligibility authority

Q0 composes social eligibility without creating a second relationship or quest state model:

```text
relationship state
  familiarity / respect / trust / obligation
            |
            v
socialRequirements schema
            |
            v
socialRequirementEngine
        +---+------------------+
        |                      |
        v                      v
commitment eligibility     party recruitment
        |                      |
        +----------+-----------+
                   v
       existing commitment / party state
```

Commitment opportunity projection consumes the same eligibility calculation as acceptance, preventing presentation from advertising an offer the runtime would reject.

Requirements may reference NPCs other than the current giver, enabling bounded multi-NPC consequence while leaving faction/reputation state deferred until a real slice requires it.

Sable Renn is the established proof: second-road-test visibility requires Sable trust 1; companion recruitment requires trust 3 and respect 1 plus both resolved commitments.

No persisted social family is added. Data advances 80 -> 81 because existing authored eligibility semantics change; Game State remains 21.

### Q1 Ironspine social composition and scheduled mobile NPCs

Q1 proves a social slice can span production, commitment, relationship, schedule, locality, party, travel, persistence, and combat without a new durable state family:

```text
canonical crafted output + provenance
              |
              v
      commitment delivery
              |
              v
    relationship change
              |
              v
cross-NPC relationship eligibility
              |
              v
     later commitment access
              |
              v
 companion recruitment eligibility
              |
              v
 existing party / travel / combat state
```

Vara Kell, Dain Rove, and Mara Fell are one concrete proof graph.

Dain also establishes a scheduled-mobile-NPC invariant:

```text
npc schedule
  = recurring service availability window
  != physical-location teleport authority

backing NPC / companion location
  = current physical presence authority
```

Therefore:
- companion recruitment checks a candidate's canonical schedule when one exists;
- locality interaction with a scheduled POI checks that the backing NPC is physically present;
- a recruited or left-behind Dain does not reappear at the watchpost merely because the clock enters his service window.

Dain's existing warden desk remains a Guild POI and gains a companion action through explicit companion metadata. POI type remains service/presentation semantics rather than exclusive identity ownership.

No new persistent field is needed: commitments, relationships, party, NPC identity/location, local knowledge, and world time already own all durable facts.

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


# Adventure Vertical Slice A composition

Product 0.9.200.1 / Data 63 adds the Slatewater Road Scout vertical slice without adding a new runtime authority.

```text
existing Slatewater Waylodge + Foothills
        |
        v
localKnowledge / staged POI interaction
        |
        v
persistent Sable Renn NPC
        |
        v
commitment prerequisites + provenance-qualified field work
        |
        +----------------------+
        |                      |
        v                      v
work proficiency         NPC relationship
        |                      |
        +----------+-----------+
                   |
                   v
          commitment-gated party recruitment
                   |
                   v
         persistent companion + backing-NPC projection
                   |
                   v
             canonical route travel
```

Ownership remains split by existing domain authority:
- commitment catalog/engine owns prerequisite metadata and accepted/resolved records;
- ecology/gathering/work proficiency owns actual Slatewater field recovery and skill growth;
- relationship state owns Sable's NPC trust/respect/familiarity before recruitment;
- party state owns the recruited companion, active membership, tactics, and companion-side relationship;
- recruitment seeds companion relationship dimensions from the backing NPC relationship instead of creating a second trust store;
- NPC world projection follows party location while Sable is active;
- player continuity checks projected giver location before exposing old-place follow-up actions;
- Pack v2 owns placement/dependency metadata, not duplicate definitions.

Sable deliberately has no fixed Waylodge NPC schedule because fixed civic availability would conflict with mobile companion projection after recruitment.

This slice adds no new Game State family, direct timed-task owner, simulation clock, route graph, or supported-save migration.

# Combat Packet B1 implementation

Product 0.9.200.2 / Data 64 introduces `combatResolutionEngine.js` as a stateless resolution authority beneath the existing battle/ability systems.

```text
existing combatant profiles + battle RNG
               |
               v
      combatResolutionEngine
       /       |        \
 physical    magic     status
       \       |        /
               v
 existing battle mutation/action record
```

The resolver owns formulas/structured resolution only. It does not own:
- combatants;
- active battle lifecycle;
- fictional time;
- ability tasks;
- statuses;
- cooldown storage;
- persistence.

Basic attack and representative canonical abilities call it, then existing battle/ability owners apply HP/status consequences and record structured evidence.

B1 keeps `activeBattle.contract.version = 2` and ability runtime version 1. No new required persisted field exists; resolution details are nested in the existing action `data` envelope. Therefore Game State remains 15.

Timed canonical activation is treated as an action commitment: basic attack and transitional legacy combat actions cannot overlap it.

Behavioral freeze: `20b7351a61f56203975e101ef04fd7311e110d9b`, Check #1860 / run `33457301272`, **832/832 tests**.


# Combat Packet B2 implementation

Product 0.9.200.3 / Game State 16 / Data 64 introduces `combatAttentionEngine.js` as a stateless attention calculation/selection authority beneath the existing active-battle owner.

```text
combat action evidence
        |
        v
absolute Enmity per hostile/credible actor
        |
        v
normalized Focus
        |
        v
nonlinear selection weight
        |
        v
sticky Aggro ---- Fixation/Priority override
```

Durable authority remains `activeBattle.enmity`, not the helper engine. Each hostile record owns actor-linked baseline/transient Enmity, floors, fictional-time decay anchors, sticky Aggro, optional Fixation, and tuning policy. `recordCombatAction()` feeds the same Enmity seam for representative damage/healing/status/control pressure.

Focus is explicitly not literal attack probability. The default concentration exponent, switch ratio, and current-target weight multiplier are initial tuning data, not genre laws.

Because attention changes future target choices after save/load, Game State advances 15 -> 16. No supported-save migration is added under the pre-alpha current-schema-only policy. Data remains 64 because no authored content records changed.

Behavioral freeze: `92e6d1623470fbc923ef9beebe148829418b7080`; Check #1881 / run `33459747237`, **837/837 tests**, full gate green; Pages #2011 / run `33459746331` green.

# Advanced combat authority direction

Permanent design authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`

Selected implementation plan:
- `docs/COMBAT_2_0_SLICE_B_IMPLEMENTATION_PLAN.md`

The existing Combat 2.0 substrate remains authoritative for:
- canonical fictional-time combat readiness;
- structured combat action history;
- active battle persistence;
- deterministic enemy-ready interrupts;
- timed ability activation/interruption;
- root-player / battle-player synchronization.

B1-B2 extend this substrate without creating a second combat clock or parallel battle store. Future packets must preserve that boundary.

Target authority flow:

```text
capability + proficiency + equipment + affinity
                    |
                    v
          executable action definition
                    |
                    v
       unified combat resolution contract
        /        |          |          \
 physical    magical     status      geometry
        \        |          |          /
                    v
             combat action record
                    |
          +---------+----------+
          |                    |
          v                    v
 weapon/kata readiness    enemy attention
                         enmity -> focus
                         -> aggro/fixation
```

Prepared loadouts and kata selections are player configuration, not separate character identities. Canonical ability cooldowns remain keyed to the ability/shared cooldown family rather than loadout slots.

Attention state belongs to the active hostile encounter. If it affects resumable battle outcomes across save/load, it must be persisted with `activeBattle` rather than reconstructed from narrative logs.

Equipment transitions use canonical combat/world time. Armor-swap legality depends on actual hostile pressure, pursuit, reachability, disable state, focus, aggro, and fixation—not merely whether the player is the current selected target.

B2 defines the attention persistence boundary as Game State 16. B3 advances to Game State 17 for active loadout transitions. B4 advances to Game State 18 because player kata configuration and the encounter-local next-sequence cursor change resumable combat outcomes. B5 keeps Game State 18 because training reuses capability/event authority and its ammo-persistence fix corrects the existing B4 contract; Data advances to 67 for authored training-service metadata.

# Persistence authority — Game State 21

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
atlas / localKnowledge / active POI context
player identity / progression / skills / capabilities / character affinities / weapon-kata configuration
inventory / mutable resources / wallet / equipment / statuses
world flags
current location/position coherence
combat identity sequence
active battle state, weapon-kata cursor, and deterministic caches when present
active battle player / root-player live-authority coherence
```

Optional persisted authority remains:

```text
state.work
player.progression.workProficiencies
state.dayCycle
```

No automatic Game State migrations are added under the current pre-alpha exact-schema policy.

### B3 combat loadout transition authority

Product 0.9.200.4 / Game State 17 / Data 65 adds `combatLoadoutEngine.js` as a direct timed-task owner beneath existing active-battle, equipment, inventory, combat-timeline, and world-time authorities.

`activeBattle.loadoutTransition` is the durable owner record. Generic timed tasks carry timing, equipment/inventory retain physical-item authority, and the loadout owner performs exactly-once reconciliation plus terminal release. Direct active-battle equipment mutation is blocked outside this owner.

B3 transitions are atomic: old equipment remains effective until successful completion. Completion synchronizes root and battle-player equipment, recomputes the battle combat profile, records structured evidence, uses canonical combat recovery, and releases the terminal task. Cancellation does not mutate equipment.

Armor-pressure legality reads B2 attention rather than inventing a second threat model. LOS/reachability/pursuit remains nonexistent and cannot be used as an implicit pressure-release flag.

### B4 cadence, ranged, and kata authority

Product 0.9.200.5 / Game State 18 / Data 66 adds `weaponCadenceEngine.js` as the one conversion authority from equipment `weaponDelay` to fictional-time readiness and `weaponKataEngine.js` as the owner of configured selections plus encounter-local sequence semantics.

Player and companion basic attacks read equipment cadence; enemy actions keep their separate enemy-action recovery contract because enemies do not currently share player equipment definitions. `combatResolutionEngine` owns ranged hit/defense math, while equipment authority owns ranged weapon/ammunition state. Ranged shots consume the equipped ammo stack through `equipmentEngine` and do not create a second inventory/quiver.

`player.progression.weaponKata` owns durable selection configuration. `activeBattle.weaponKata` owns the encounter cursor. B3 loadout completion emits and now consumes sequence-reset intent through the kata owner.

### B5 training-service integration authority

Product 0.9.200.6 / Game State 18 / Data 67 adds `trainingServiceEngine.js` as a **stateless contextual adapter**, not a new progression or combat authority. Authored POI metadata identifies Marshal Varric Stone and the existing Ridge Breaker / Rivet Guard capability IDs; learning delegates to `capabilityEngine`, and semantic observations use the existing event registry.

The B5 vertical proof reuses the canonical Brasshaven -> South Redstone route, existing Redstone encounters, party attention, combat loadout, weapon cadence/kata, ranged ammo, canonical abilities, and skill progression. Hard-disable pressure release is proven through the already-recognized B3 disable boundary; no LOS/pursuit state is synthesized.

Equipped ammunition remains physical equipment authority. Game State 18 validation permits a positive stack in the canonical `ammo` slot while all ordinary equipment slots retain quantity-1/non-stackable invariants.

### 0.9.300 Packet 1 current melee kata breadth

Product 0.9.300.1 / Game State 19 / Data 68 keeps `weaponKataEngine.js` as the only kata runtime/configuration owner and `weaponKataCatalog.js` as authored move/family authority.

The required player configuration advances to version 2 because `player.progression.weaponKata.selections` now includes axe, staff, and club in addition to dagger/sword. This changes durable current-schema state and requires Game State 19.

`activeBattle.weaponKata` keeps record version 1: family, next slot, last move, action count, reset count, and reset reason are unchanged. The catalog simply broadens the valid family references. B3 loadout resets automatically rebind to the newly supported family.

Packet 1 adds no new task owner, combat clock, ability/capability record, equipment record, affinity state, or action-family subsystem.

### 0.9.300 Packet 2 character affinity and kata substitution authority

Product 0.9.300.2 / Game State 20 / Data 69 adds `player.progression.affinities` as the character-owned durable elemental-affinity authority. `characterAffinityEngine.js` creates, reads, changes, and validates ranked affinity state; discipline/job selection, spell knowledge, equipment, and active battle do not duplicate that authority.

`weaponKataCatalog.js` remains authored substitution authority and `weaponKataEngine.js` remains configuration/eligibility/cursor authority. Affinity requirements are conjunctive with weapon proficiency. `battleEngine` passes authored element/channel/resistance metadata into the existing `combatResolutionEngine`; it does not own a second elemental resolver.

Kata configuration remains version 2 because selections are still move IDs. Encounter-local kata state remains version 1 because no cursor field changed. Packet 2 adds no timed-task owner or combat clock.

### 0.9.300 Packet 3 novice elemental resolution breadth

Product 0.9.300.3 / Game State 20 / Data 70 changes authored ability definitions, not state ownership. The eight novice Elemental Form attacks now declare structured magical resolution and explicit recovery inside the existing `abilityCatalog`; `abilityEngine` continues to execute them and `combatResolutionEngine` continues to own hit, magic-defense, and elemental-resistance math.

No persistence family, combat clock, task owner, target-geometry authority, or new ability record is added. The ability runtime state shape is unchanged. Adept names whose semantics imply rings, cages, wells, or other richer action forms remain unmigrated until a separate bounded packet selects the required mechanics.

### 0.9.300 Packet 4 Thunder Cage control foundation

Product 0.9.300.4 / Game State 20 / Data 71 adds no new durable state family. `statusEngine` now owns the shared hard-disable flag vocabulary and exposes active-disable timing derived from existing status expiry fields. `combatLoadoutEngine` consumes that status fact rather than owning its own flag list.

`combatTurnEngine` consumes the same status authority for enemy action selection and readiness interrupts. A ready enemy under a finite hard disable is not given a second timer; its existing combat-ready interrupt is deferred to the latest active disable expiry. An indefinite hard disable emits no ready interrupt until the status is removed. `combatSimulationEngine` remains the existing fictional-time coordinator.

Thunder Cage stays a single-target canonical ability. `abilityEngine` applies its ordinary damage/status effects, `combatResolutionEngine` resolves damage and control resistance, and generic persisted statuses already carry `cannotAct` plus expiry. No geometry/zone/control state family is introduced.

### 0.9.300 Packet 5 Tempest Ring geometry foundation

Product 0.9.300.5 / Game State 20 / Data 72 adds `combatGeometryEngine.js` as a **stateless geometry projection/query authority**, not a new persisted battle-position family. It derives encounter-relative formation coordinates deterministically from the existing persisted combatant side/order and supports one bounded target-centered ring query with radius and maximum-target limits.

`abilities.js` owns the authored geometry contract. `abilityEngine` asks `combatGeometryEngine` for recipients and applies the existing effect/resolution path independently to each selected target. `combatResolutionEngine` remains formula authority. `combatAttentionEngine` consumes the ordinary per-recipient effect evidence to add hostile attention to each enemy actually affected.

No `activeBattle.geometry`, mutable coordinate, movement state, LOS/reachability state, pursuit/search/disengagement state, ground target, or geometry timer/task is added. Because combatant order already persists and no movement can change formation, current-schema cloning/save-load reproduces the same derived ring selection. A later packet that introduces mutable positioning, knockback, movement, or engagement geometry must make a fresh persistence/version decision rather than treating this derived projection as mutable state.

### 0.9.300 Packet 6 Umbral Well persistent-field foundation

Product 0.9.300.6 / Game State 21 / Data 73 adds `combatFieldEngine.js` as the canonical **battle-local persistent field authority**. Unlike Packet 5's derived formation, fields have future consequences after the creating ability has resolved and therefore must persist under `activeBattle.fields`.

Current field state is version 1:
- monotonic field sequence;
- field records with source actor/ability identity;
- selected center-target provenance plus persisted center point;
- creation, expiry, cadence, next-pulse, and pulse-sequence boundaries on canonical world time;
- radius/maximum-target geometry;
- compact cast-time source snapshot for the authored pulse formula.

Umbral Well uses a cast-time source snapshot for INT, magic accuracy, and magic attack. At pulse time, current recipients are selected against the persisted point through `combatGeometryEngine` and each defender's current magic evasion, magic defense, and Dark resistance are read. This lets defensive changes affect later pulses without allowing later source loadout changes to retroactively alter an already-created field.

`combatSimulationEngine` consumes field pulse interrupt candidates. No timed-task record is created: `activeBattle.fields` itself is the durable owner and canonical world time is the only scheduler. One pulse produces one ordinary structured `fieldPulse` combat action. `combatAttentionEngine` consumes explicit per-recipient mode so only enemies with applied pulse effects gain pulse enmity.

Game State advances 20 -> 21 because these outstanding future pulse facts cannot be reconstructed safely from completed ability-action prose/history. No migration is added under the current pre-alpha current-schema-only policy.

This packet does not add mutable combatant coordinates, player-selected ground locations, movement, knockback, LOS/reachability, pursuit/search/disengagement, moving zones, friendly fields, or generic zone scripting.

### 0.9.300 Packet 7 Radiant Arc propagation foundation

Product 0.9.300.7 / Game State 21 / Data 74 adds no new durable state family. `abilities.js` owns the authored `arc` contract and `combatGeometryEngine.js` remains the stateless spatial query authority.

Radiant Arc begins at the explicitly selected enemy. `combatGeometryEngine` then chooses each later recipient from the previous recipient's derived encounter position, selecting the nearest living opposing combatant within the authored two-unit jump range, excluding already-visited recipients, and using encounter order then stable ID for deterministic ties. The query stops after three total recipients or when no eligible next jump exists.

`abilityEngine` needs no Packet-7-specific execution owner: its existing geometric target-expansion path applies the authored Light damage effect independently to every selected recipient. `combatResolutionEngine` remains hit/damage/resistance authority and `combatAttentionEngine` consumes the existing explicit per-recipient area-action evidence.

No propagation record, timer, interrupt, mutable combat coordinate, LOS/reachability state, pathfinding state, pursuit state, or save field is added. Propagation is fully resolved inside the completed action, so Game State remains 21. A later delayed chain, moving projectile, or path/LOS-aware propagation model would require a fresh bounded ownership decision rather than extending this synchronous proof implicitly.

### 0.9.300 Packet 8 martial structured-resolution breadth

Product 0.9.300.8 / Game State 21 / Data 75 changes authored ability definitions only. `abilities.js` remains the canonical technique-effect contract; `abilityEngine` remains activation/cost/cooldown/effect-order/recovery authority; `combatResolutionEngine` remains physical hit/damage/defense/critical formula authority.

Guarded Cut, Barkboar Brace, and Thicket Feint now route their target damage through the same shared physical resolution already used by Ridge Breaker and Rivet Guard. Their existing self-status effects remain separate authored effects and therefore do not become conditional on target damage landing.

No new `activeBattle` field, player progression field, effect-dependency graph, combo cursor, movement/reposition record, reaction window, passive-defense record, timed task, or interrupt provider is added. Existing status expiry, ability cooldown, and combat readiness state already own all durable consequences, so Game State remains 21.

With Packet 8, all five current executable martial techniques use structured damage resolution where applicable. Legacy recovered Weapon Skill data and non-executable capability names remain separate migration/research debt and are not silently promoted into the executable catalog.

### 0.9.300 maturity closure

The post-Packet-8 maturity reassessment adds no architecture owner or runtime state.

It concludes:
- current combat/training ownership is sufficient for the Phase 0.9 loop;
- inert combatant placeholders remain cleanup debt and are not reused;
- mutable engagement geometry, LOS/line-of-fire, pursuit/search/disengagement, and flee/retreat belong to one later coherent program;
- passive block/parry/guard/counter/reaction execution remains unowned future depth despite derived stat values;
- no Packet 9 is selected;
- `0.9.400 Economy / Production Depth` is the next track, with Occupational Tool Conversion selected but not started.

No Product, Package, Data, Game State, Account Save, Benchmark, task-owner, or persistence contract changes at this decision checkpoint.

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
combatLoadoutEngine.js
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
- Game State 16 — required active-battle enemy attention: Enmity entries, Aggro, Fixation/Priority, tuning policy, and fictional-time decay anchors.
- Game State 17 — required active combat-loadout transition ownership, timing, reconciliation, and task linkage.
- Game State 18 — required player weapon-kata selections and active-battle sequence cursor/reset state.

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

Historical packet sequencing above is retained for provenance only. The current authored-data baseline is Data 82; the current runtime/persistence baseline is Product 0.9.500.2 / Game State 21. `0.9.200 Adventure Vertical Slices`, `0.9.300 Advanced Combat / Training`, and `0.9.400 Economy / Production Depth` are COMPLETE. `0.9.500 Quest / Social Depth` is ACTIVE: Q0 and Q1 are complete and Q2 Crownfields Grange Allocation Choice & Social Consequence is selected / not started. Current next-work authority lives in `docs/THREAD_HANDOFF.md`, `docs/EXECUTION_PIPELINE.md`, `docs/ROADMAP.md`, and `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md`.