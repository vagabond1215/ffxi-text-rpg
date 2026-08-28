# Ecology & Geography Integrity Audit

Status: **implemented and validated on audit PR #390 before final version/document synchronization**.

This audit was run immediately after Slatewater Foothills & Waylodge landed on `main` at merge commit:

`edca59ac8955d999f7c80812688e7153d5aaafeb`

Post-Slatewater main Check #1265 / run `33187962625` was green before this audit began.

The purpose of this pass was not to add another content tranche. It was to inspect the geography/ecology graph for broken references, competing authorities, unreachable places, provenance mistakes, validator blind spots, and player-facing inconsistencies.

## Promoted contract

```text
Product:       0.9.100.6
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          45
Benchmark:     3
Codename:      Ecology & Geography Integrity
```

Data advances because canonical place-connection records changed and integrity contracts for canonical ecology, resource provenance, maps, routes, services, and Pack-v2 catalog resolution became stricter.

Game State remains 14 because no new durable player/world fact or serialized authority was introduced.

## Validated census

The stricter audit did not change content-scale volume:

```text
places/localities                        29
named NPCs                               20
shop/service sites                       19
creature definitions                    40
resource sources                        35
canonical items                         90
recipes/processes                       29
abilities/techniques                    41
quests/contracts                        18
companions                               1
transport services                       4

routes                                    7
spell schools                             4
capability/training definitions          44
NPC schedules                             9
regional/shared content packs            13
pack-owned records                      374
pack-owned abilities/capabilities/
  schedules/companions                41/44/9/1
runtime seed NPCs                        19
runtime seed enemies                     13
```

Mechanics-scale gate remains **NOT READY**. Creature definitions remain at the mechanics floor of 40/40. Companions remain the largest relative gap.

## Fixed defects

### 1. Duplicate canonical ecology IDs could be hidden

The canonical ecology list helpers deduplicate foundation + regional records.

The registry validator previously checked those already-deduplicated lists, so a duplicate ID across catalogs could disappear before validation saw it.

Repair:
- validate duplicate family/species/population/source IDs against the raw combined catalogs;
- retain deduplicated canonical list helpers for ordinary consumption.

### 2. Duplicate canonical resource IDs could be hidden

The resource-item registry had the same ordering problem: the canonical list deduplicated before validation checked duplicate IDs.

Repair:
- validate raw foundation + regional + hunting resource lists;
- validate provenance and sink metadata through the canonical provenance validator;
- require provenance place references to resolve.

### 3. Regional ecology validation was weaker than foundation ecology validation

Regional ecology previously checked only a subset of foundation invariants.

It now validates:
- stable IDs;
- family/species names and tags;
- ecosystem/habitat fields;
- behavior structure and family links;
- population density and rarity enums;
- capacity and regeneration;
- time/day/flag conditions;
- source type;
- recovery action;
- required tool tags;
- proficiency ID and minimum proficiency;
- output item existence;
- exact source/place/action provenance.

This prevents later biome expansions from bypassing the rules applied to foundation ecology.

### 4. Pack-v2 ecology catalog resolution was foundation-only

`contentCatalogRegistry` previously resolved:
- ecology families;
- species;
- populations;
- gathering sources

through the foundation ecology catalog only.

Regional ecology happened to work because current regional packs inline those records, but a legitimate future `catalogRef` to regional ecology would fail.

Repair:
- Pack-v2 catalog resolution now uses the canonical ecology registry;
- connected-catalog validation now validates the canonical ecology registry and resource-item registry.

### 5. Place/map relationships were only validated one way

Previously:
- a place had to reference a known map;
- a map had to reference known places.

But the validator did not require those two records to agree.

Repair:
- every place's `mapId` map must list that place;
- every map-listed place must point back to that map;
- duplicate map IDs, place IDs, map memberships, and zone-connection IDs are rejected.

### 6. Route stop coordinates and route chain order were under-validated

The route validator now checks:
- stop coordinates are inside their place;
- topology-place stop coordinates are navigable;
- segment `i` connects route stop `i` to stop `i+1`;
- cargo encumbrance multiplier is positive;
- service stop IDs are unique;
- service stops form an ordered subsequence of the route;
- service cadence/boarding lead are coherent;
- fare currency and values are valid.

### 7. Legacy direct edges duplicated canonical routes with contradictory times

Five `ZONE_CONNECTIONS` duplicated canonical route legs:

```text
Southgate -> West Elderwood
West Elderwood -> Southgate
Crownward -> Timbercross Landing
Brasshaven Market Ring -> South Redstone Reach
South Redstone Reach -> Brasshaven Market Ring
```

Examples:
- Southgate -> West Elderwood: legacy 45s vs canonical road 1,800s;
- Crownward -> Timbercross: legacy 30s vs canonical work road 3,600s;
- Market Ring -> South Redstone: legacy 45s vs canonical quarry road 2,400s.

Runtime route lookup already preferred canonical routes, so actual travel generally used the correct duration. However `describePlace()` advertised the stale direct exits, creating contradictory player-facing geography and parallel authored authority.

Repair:
- remove the obsolete direct edges;
- keep the canonical route definitions as the single long-distance travel authority;
- make place descriptions show destination names served by canonical routes.

### 8. Three places could trap the player

The following places had an inbound connection but no outbound route or connection:

- Thornwall Strider Yard;
- Thornwall Old Gaol;
- Skyferry: Waymeet-Thornwall.

Repair:
- Strider Yard -> Southgate return;
- Old Gaol -> High Citadel return;
- skyferry mooring -> Rivergate return.

### 9. Crownward forest gates were asymmetric

Crownward had two distinct ordinary walk gates into West Elderwood without matching return edges.

These are local city/forest boundary shortcuts rather than canonical long-road duplicates, so they were preserved and given reciprocal return edges.

### 10. Rivergate/Crownward direction label was reversed

The reverse connection from Rivergate to Crownward was labeled `north`, despite being the reverse of the Crownward -> Rivergate northbound link.

Repair: label corrected to `south`.

## New regression coverage

`tests/ecologyGeographyIntegrity.test.js` now verifies:

1. the world, routes, canonical ecology, resource registry, connected catalogs, and Pack-v2 graph all validate together;
2. every place belongs to exactly one authored map and map/place references are reciprocal;
3. every current place has at least one outbound connection or route so it cannot trap the player;
4. canonical route stop coordinates are valid and navigable;
5. legacy zone connections do not duplicate canonical route legs;
6. every encounter-backed species resolves a seed enemy;
7. every population resolves species + place;
8. every gathering source resolves place + output item;
9. gathering provenance points exactly back to source/place/action;
10. body provenance resolves a real seed enemy.

The initial hardened audit head passed hosted Check #1266 / run `33188833540` with **728/728 tests**, Content Census, Benchmark 3, and Benchmark Sample.

A later reciprocal Crownward forest-gate repair also passed Check #1267 before the Data 45 version/document promotion.

## Reviewed and retained: express transport services

Two long-distance services intentionally omit intermediate route stops from their passenger service-stop lists:

- Crown-Forge Caravan may pass Slatewater without treating Waylodge as a service stop;
- Forge-Mere Caravan may pass Coppergrass without treating the steppe as a passenger stop.

This was reviewed because `getServiceJourney().segmentCount` is based on passenger service stops while duration/distance uses all physical route segments crossed.

Decision: **retain this model**.

A service-stop list is an ordered subsequence of physical route stops, analogous to an express service. Fare segments therefore represent passenger-service hops, not every underlying geography segment.

The strengthened validator explicitly encodes this rule.

## Deferred content gaps — not broken references

The strict integrity audit found no unresolved canonical IDs, bad place/source provenance, invalid encounter-template references, or invalid Pack-v2 dependency graph.

It did identify uneven content coverage:

| Place | Existing ecology | Gap |
| --- | --- | --- |
| Timbercross Landing | 2 persistent populations | no gathering source |
| Thornwall Old Gaol | no spawn rules, populations, or sources | ecology/content substrate absent |
| Redfang Camp | encounter/spawn ecology + population | no gathering/salvage source |
| Deepvein Mine | encounter ecology + 2 populations | no gathering source despite mining/cave fiction |
| Sunken Archive | encounter ecology + population | no gathering/salvage source |

These should be filled only when they support coherent loops. They are not justification for disconnected census filler.

### Highest-value coverage gap: Thornwall Old Gaol

Old Gaol is a real authored dungeon but currently has no ecological or resource substrate.

A future dungeon pass should consider:
- vermin/scavenger/cave-adapted populations;
- mold/fungi/cistern flora where fiction supports it;
- salvage or archaeological material;
- explicit hazards;
- combat/exploration rewards.

It should not receive arbitrary nodes merely to increase counts.

## Deferred architecture gap: populations do not generate hunt encounters

The ecology engine currently owns:
- population availability/depletion/regeneration;
- gathering source availability/depletion/regeneration.

The aggro engine currently owns automatic exploration encounters through `place.spawnRules`.

There is no generic player-facing bridge:

```text
persistent ecology population
  -> find/track passive or wary animal
  -> instantiate encounter template
  -> defeat/capture/observe
  -> consume population unit
  -> body recovery
```

This matters because regional hunt species such as:
- Elderwood Barkboar;
- Redstone Ridge Ibex;
- Mirecrest Heron

have valid encounter templates and valid defeated-body resource recovery, but their current tests manually instantiate the seed enemy before body recovery.

Do **not** solve this by making passive/wary animals aggressive spawn rules. That would collapse ecology behavior into aggro behavior.

Recommended future bounded system:
**population-backed encounter discovery / hunting** using the existing ecology population authority and existing enemy encounter/recovery authorities.

## Future geography integrity policy

For each new zone or boundary:

1. choose physical boundary semantics before adding connections;
2. do not duplicate a canonical route with a shorter legacy direct edge;
3. every player-enterable place must have a valid escape path unless the trapping behavior is deliberate and explicitly modeled;
4. ordinary two-way roads/gates should be reciprocal;
5. one-way, external-placeholder, legal-gate, water-only, subterranean-only, and air-only travel must be explicit;
6. route stop coordinates must be valid in their place;
7. place/map membership must be reciprocal;
8. long-distance services may be express services, but their stops must follow route order;
9. new ecology records must pass canonical registry validation;
10. gathering and hunting materials must preserve exact provenance.

## Recommended next decision

After this integrity pass lands, no urgent dangling-reference cleanup remains.

Two strategic next choices remain:

- **Packet E — Gate A integration/census audit**, the formal roadmap gate;
- a specifically authorized next geography/content tranche, with **Crownfields** still ranked first in the temporary world-edge plan.

If ecology gameplay depth is prioritized, a population-backed hunting/encounter bridge is also a strong bounded candidate because it would turn currently valid but mostly ambient population records into player-facing ecology without manufacturing new species counts.
