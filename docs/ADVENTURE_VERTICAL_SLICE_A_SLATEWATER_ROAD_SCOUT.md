# Adventure Vertical Slice A — Slatewater Road Scout

Permanent implementation record for the first `0.9.200 Adventure Vertical Slices` bounded unit.

## Status

**COMPLETE ON `main`.**

```text
Product:       0.9.200.1
Package:       0.9.200
Account Save:  5
Game State:    15
Data:          63
Benchmark:     3
Codename:      Slatewater Road Scout
```

Implementation freeze:
- SHA `63cbd31edb149c9cf10af0a83bcf6f667abe17b8`
- Check #1815 / run `33361131795`
- Repository Audit PASS
- **826/826 tests**
- Content Census PASS
- Benchmark 3 PASS
- Benchmark Sample PASS

## Slice intent

Adventure Vertical Slice A deliberately reuses **Slatewater Waylodge + Slatewater Foothills** rather than adding another zone.

The slice targets the mechanics categories that were still materially thin after Gate A:
- recruitable companions;
- connected quests/contracts;
- persistent named NPC relationships;
- service/route/fieldwork integration.

It avoids recipe inflation, a new combat subsystem, a new route graph, or geographic expansion merely to raise counts.

## Character anchor — Sable Renn

New persistent NPC:
- `npc-slatewater-sable-renn`
- Sable Renn, Slatewater Road Scout
- home/recruitment locality: `slatewater-waylodge`
- POI: `poi-slatewater-road-scout`

Sable is intentionally **not** given a fixed daily NPC schedule. A recruitable companion is mobile after recruitment, so a permanent Waylodge schedule would contradict the backing-NPC location projection.

The existing party authority keeps the backing NPC synchronized with the recruited companion through route travel.

## Trust arc

### 1. Resin for the Mile Posts

`commitment-slatewater-resin-waymarks`

The player must bring two Pitch Pine Resin bundles gathered from:
- `source-slatewater-pitch-pine-stand`
- Slatewater Foothills.

This is provenance-bound. Buying generic/resold resin does not substitute for field recovery from the requested source.

Gathering two units through the existing work engine raises foraging work proficiency from 0 to 2 for a fresh character.

### 2. Silver for the Fog Marks

`commitment-slatewater-lichen-fogmarks`

This second contract remains hidden and cannot be accepted until the resin contract is resolved.

It requires one Silver Lichen sample from:
- `source-slatewater-silver-lichen-face`
- Slatewater Foothills.

That source requires foraging proficiency 2, so the first contract naturally teaches the proficiency needed for the second. The chain uses existing work progression rather than a bespoke quest-only unlock meter.

## Earned recruitment

New companion:
- `companion-sable-renn`
- level 4 scout/skirmisher profile
- recruitment requires both Slatewater commitments resolved.

Field approaches:
- **Read the Road** — more cautious/mobility-oriented;
- **Cut the Gap** — sharper offense at some defensive cost.

Recruitment uses existing `party` persistence. No new Game State family is added.

A recruitment attempt before the trust arc completes returns the real `party.commitment-requirement` failure through the locality/UI path rather than being converted into a false success.

## Relationship continuity

The two commitments award existing NPC relationship dimensions:
- familiarity +1;
- respect +1;
- trust +3 total.

On recruitment, the persistent companion relationship now starts from the backing NPC's existing relationship dimensions instead of resetting to zero.

This is a general party integration correction, not Sable-specific serialized state.

## Mobile quest-giver continuity

Because Sable can become a mobile companion, resolved-contract follow-up cannot assume the giver remains at the Waylodge.

Player continuity now checks the backing NPC's current projected location before offering a static follow-up action. A recruited giver traveling elsewhere is not presented as an actionable old quest marker.

No new location authority is introduced; the existing NPC/party projection remains authoritative.

## Locality foundation integration

The slice composes with Game State 15 locality knowledge:
- Sable is not automatically exposed merely because the POI exists;
- reaching the scout is not the same as speaking with the scout;
- the first commitment appears only after real interaction;
- the second commitment is gated by the first;
- companion recruitment is a separate contextual action;
- locality interaction preserves recruitment failure/success semantics.

## Pack-v2 ownership

`pack-slatewater-waylodge` now owns/references:
- Sable's NPC catalog record;
- both canonical commitments;
- the companion catalog record;
- one relationship metadata record.

Existing dependency on `pack-slatewater-foothills-ecology` supplies the canonical Slatewater field resources/sources used by the contracts.

No duplicate canonical gameplay catalog is created.

## Version decision

```text
Product       0.9.100.24 -> 0.9.200.1
Package       0.9.100    -> 0.9.200
Data          62         -> 63
Game State    15         -> 15
Account Save  5          -> 5
Benchmark     3          -> 3
```

Why Data advances:
- new canonical NPC stable ID;
- new canonical POI stable ID;
- two new canonical commitment stable IDs;
- new canonical companion stable ID;
- Pack-v2 ownership/relationship metadata changes.

Why Game State stays 15:
- commitments already own persistent contract records;
- relationships already own persistent NPC relationship dimensions;
- party already owns recruited companion state;
- localKnowledge already owns player-specific POI/NPC knowledge;
- backing-NPC projection already follows companion location.

No new durable state family is introduced.

## Census delta

Validated Data 63 census:

```text
places/localities       55
named NPCs              48
shop/service sites      37
creatures              123
resource sources       143
canonical items        408
recipes/processes      234
abilities/techniques    41
quests/contracts        20
companions               2
transport services       7
regional/shared packs    39
pack-owned records     1325
runtime seed NPCs        47
runtime seed enemies     17
```

Delta from Data 62:
- named NPCs +1;
- quests/contracts +2;
- companions +1;
- pack-owned records +5.

Mechanics-scale gate remains **NOT READY**:
- abilities/techniques 41/100;
- companions 2/4;
- quests/contracts 20/30;
- named NPCs 48/50.

Largest relative gap is now **Abilities/techniques**.

## Explicit non-goals

Slice A does not:
- add a new zone;
- make Coppergrass a staffed stop;
- add a fixed schedule to a mobile companion;
- add new recipes merely for quest count;
- add a combat/training subsystem before `0.9.300`;
- add supported-save migration;
- add a new clock, background task owner, relationship store, quest store, or party store;
- auto-start Adventure Vertical Slice B.

## Decision boundary

Adventure Vertical Slice A is complete.

`0.9.200 Adventure Vertical Slices` remains the active formal track, but the next bounded slice must be selected separately. A second character-centered slice should continue to prefer existing geography and connected companion/quest/NPC/service depth over disconnected filler.
