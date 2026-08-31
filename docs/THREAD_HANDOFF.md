# Thread Handoff

Repository evidence beats conversation memory.

## Current contract

```text
Product:       0.9.200.1
Package:       0.9.200
Account Save:  5
Game State:    15
Data:          63
Benchmark:     3
Codename:      Slatewater Road Scout
Runtime:       Node >=24
Phase:         0.9
Track:         0.9.200 Adventure Vertical Slices ACTIVE
Slice A:       COMPLETE
Slice B:       UNSELECTED / NOT AUTO-STARTED
```

## Latest bounded unit — Adventure Vertical Slice A

**Slatewater Road Scout is COMPLETE on `main`.**

Permanent implementation record:
- `docs/ADVENTURE_VERTICAL_SLICE_A_SLATEWATER_ROAD_SCOUT.md`

Implementation/runtime freeze:
- `63cbd31edb149c9cf10af0a83bcf6f667abe17b8`
- Check #1815 / run `33361131795`
- Repository Audit PASS
- **826/826 tests**
- Content Census PASS
- Benchmark 3 PASS
- Benchmark Sample PASS

Pre-handoff synchronized-authority head:
- `7a23ff95ca77ed806b235a05b6b8890098b82e5f`
- Check #1827 / run `33367045849`: success
- Pages #1957 / run `33367045182`: success

This handoff file is the final repository-file mutation for the session. The resulting handoff commit SHA is therefore the final `main` SHA and must be reported/validated externally after this write; do not perform another repository-file write merely to insert that self-referential SHA.

## What Slice A implemented

Slice A deliberately reuses **Slatewater Waylodge + Slatewater Foothills** rather than adding a new zone.

New canonical content:
- `npc-slatewater-sable-renn` — Sable Renn, Slatewater Road Scout;
- `poi-slatewater-road-scout`;
- `commitment-slatewater-resin-waymarks` — Resin for the Mile Posts;
- `commitment-slatewater-lichen-fogmarks` — Silver for the Fog Marks;
- `companion-sable-renn`;
- Pack-v2 relationship/ownership metadata.

The trust arc is connected rather than decorative:
1. player must actually interact with Sable before the first commitment is projected;
2. first contract requires two provenance-qualified Pitch Pine Resin from `source-slatewater-pitch-pine-stand`;
3. that real gathering raises fresh-character foraging proficiency from 0 to 2;
4. second contract remains hidden/unacceptable until the first is resolved;
5. Silver Lichen comes from `source-slatewater-silver-lichen-face`, which requires foraging proficiency 2;
6. both contracts must resolve before recruitment;
7. recruitment itself rechecks the commitment gate.

General integration fixes made with the slice:
- canonical commitment prerequisites are enforced at acceptance;
- continuity projection hides chained commitments until prerequisites resolve;
- locality companion action preserves real party success/failure rather than returning false narrative success;
- recruited companion relationship dimensions inherit the backing NPC's earned relationship values rather than resetting to zero;
- active companion route travel keeps the backing NPC location synchronized;
- resolved commitment follow-up checks the giver's projected location, so a mobile recruited giver is not exposed as a static old-place quest marker.

Sable intentionally has **no fixed Waylodge NPC schedule** after becoming recruitable. Party/NPC projection remains the single mobile-location authority.

## Persistence/version decision

```text
Product       0.9.100.24 -> 0.9.200.1
Package       0.9.100    -> 0.9.200
Data          62         -> 63
Game State    15         -> 15
Account Save  5          -> 5
Benchmark     3          -> 3
```

Data advances because canonical NPC/POI/commitment/companion/Pack ownership records were added.

Game State stays 15 because all durable consequences already belong to:
- commitments;
- relationships;
- party;
- localKnowledge / active POI context;
- existing backing-NPC projection.

No supported-save migration, new clock, route graph, timed-task owner, quest store, relationship store, party store, or other persistence family was added.

## Current Data 63 census

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
routes                   25
spell schools             4
capabilities             44
NPC schedules            27
regional/shared packs    39
pack-owned records     1325
runtime seed NPCs        47
runtime seed enemies     17
raw-resource use      145/154
luxury-raw use          14/14
```

Mechanics-scale gate remains **NOT READY**:
- abilities/techniques 41/100;
- companions 2/4;
- quests/contracts 20/30;
- named NPCs 48/50.

Abilities/techniques are now the largest relative and absolute listed mechanics gap.

## Permanent authorities synchronized

Current authority set includes:
- `README.md`;
- `PROJECT_PROFILE.yaml`;
- `docs/ADVENTURE_VERTICAL_SLICE_A_SLATEWATER_ROAD_SCOUT.md`;
- `docs/ZONE_PROFILE_SLATEWATER_FOOTHILLS.md`;
- `docs/ARCHITECTURE.md`;
- `docs/EXECUTION_PIPELINE.md`;
- `docs/ROADMAP.md`;
- `docs/SYSTEM_CATALOG.md`;
- `docs/QUALITY_GATES.md`;
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md`;
- `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md`;
- this handoff.

The previous player-information authority remains:
- `docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md`.

## Standing rules that still apply

- route graph owns inter-place traversability, distance, time, hazards, and modes;
- touching map envelopes do not imply travel;
- player-facing world information must respect `localKnowledge`, not enumerate canonical truth;
- sighting does not imply interaction, identity recognition, direct navigation, commitment disclosure, or entry;
- canonical fictional time only; no wall-clock gameplay scheduling;
- Pack v2 is ownership/dependency overlay, not a duplicate canonical database;
- resource provenance and source/sink rules remain mandatory;
- passive wildlife remains non-hostile unless mechanics/ecology justify hostility;
- content-scale targets are progression signals, not permission for filler;
- no hard benchmark timing thresholds;
- Game State changes only for genuine durable serialized contract changes;
- normal low-risk work remains direct to `main`;
- pre-alpha persistence remains current-schema-only unless compatibility is explicitly selected.

## Closed work — do not redo automatically

Do **not** restart:
- the five-part flora/fauna diversity repair sequence; it is complete through Data 62;
- Content Scale Gate A; Packet E is PASS / COMPLETE;
- Local Knowledge & Familiarity Foundation; it is complete at Game State 15;
- Adventure Vertical Slice A; it is complete at Data 63 / Product 0.9.200.1.

Richer locality events/dialogue/shop browsing remain separate future work, not unfinished Slice A work.

## Next bounded decision

`0.9.200 Adventure Vertical Slices` remains the active formal track.

The immediate in-track candidate is **Adventure Vertical Slice B**, but its regional/character anchor is intentionally **UNSELECTED** and must not be auto-started from a preconceived location.

If the user explicitly says `continue` from this boundary, first inspect current existing geography/people/services and select the strongest bounded Slice B candidate by connected value across:
- character/NPC depth;
- companion breadth where justified;
- quests/contracts;
- relationship continuity;
- service/field/combat integration;
- existing route/geography reuse.

Prefer existing geography over another new zone unless the slice genuinely requires a new place.

After deliberate closure of the 0.9.200 track, formal roadmap priority is:
1. `0.9.300 Advanced Combat / Training`;
2. `0.9.400 Economy / Production Depth` — Occupational Tool Conversion remains the strongest prepared candidate;
3. `0.9.500 Quest / Social Depth`;
4. `0.9.600 Playable-Alpha Scale Push`.

Separate queues requiring explicit selection:
- Waymeet Inner Marches / outer crossroads approach;
- Coppergrass extensions;
- Drowned Vaults;
- richer locality events/dialogue/UI;
- optional post-sequence ecology work.

## Restart read order

For the next development thread, read:
1. `AGENTS.md`;
2. this handoff;
3. `PROJECT_PROFILE.yaml`;
4. `docs/EXECUTION_PIPELINE.md`;
5. `docs/ADVENTURE_VERTICAL_SLICE_A_SLATEWATER_ROAD_SCOUT.md`;
6. `docs/ROADMAP.md`;
7. `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md`;
8. `docs/ARCHITECTURE.md`;
9. relevant existing regional profiles only after selecting the Slice B candidate.

If Slice B is selected, inspect the actual current canonical NPC/commitment/companion/service/route catalogs before authoring. Do not infer missing content from old handoff counts.

## Validation contract

Final exact-head validation must observe:

```text
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Also confirm Pages succeeds on the exact final handoff SHA.

No repository-file writes are permitted after this handoff during the current session.
