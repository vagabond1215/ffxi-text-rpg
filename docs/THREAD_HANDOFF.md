# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

```text
Product:       0.9.500.2
Package:       0.9.500
Account Save:  5
Game State:    21
Data:          82
Benchmark:     3
Codename:      Ironspine Warden Trust Circuit
Runtime:       Node >=24
Phase:         0.9
0.9.100:       COMPLETE — Content Scale Gate A
0.9.200:       COMPLETE — Adventure Vertical Slices
0.9.300:       COMPLETE — Advanced Combat / Training
0.9.400:       COMPLETE — Economy / Production Depth
0.9.500:       ACTIVE — Quest / Social Depth
Latest unit:   Q1 — Ironspine Watchpost Trust & Warden Companion Slice
Next unit:     Q2 — Crownfields Grange Allocation Choice & Social Consequence
Next status:   SELECTED / NOT STARTED
```

Data 82 is the current authored/mechanics-data checkpoint.

Game State remains 21. Q1 introduces no new durable state family or persisted field.

## Repository / promotion state

Pre-Q1 main checkpoint:
- `a7135d3e86e194c2f49002193f3016ed9a5d9836`.

Q1 branch:
- `phase-0.9.500-q1-ironspine-trust-warden-companion`.

Promotion PR:
- PR #414 — Implement 0.9.500 Q1 Ironspine trust and warden companion slice.

Q1 behavioral implementation freeze:
- `702d06bd123e1f6f85eebf7f0fdb02dd7b394359`.

Hosted implementation evidence:
- Check #2338 / run `33687994124`;
- Repository Audit PASS;
- **936/936 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS.

Earlier implementation Check #2334 / run `33687784628` reached 931/936. The complete end-to-end Q1 gameplay test passed; all five failures were stale census expectations after the intended 20 -> 23 quest and 2 -> 3 companion changes plus one incorrect supplemental field name. Those assertions were corrected before the behavioral freeze.

Promoted pre-handoff synchronization head:
- `408c4b6eb84cd2bc5597d4e763b7e7bc511b7653`;
- Check #2355 / run `33688768763`;
- Repository Audit stopped the run before tests because this handoff still advertised Product 0.9.500.1;
- no runtime, test, census, or benchmark failure occurred on that attempt.

First exact-handoff synchronization attempt:
- head `76dd8df807bc388ba1b8aa3570a93542ec5e87ee`;
- Check #2356 / run `33688891966`;
- Repository Audit PASS;
- tests **935/936**;
- sole failure: `tests/pipeline.test.js` retained duplicate Q0-era exact assertions for `party 0.5.0` and `companions 0.3.0` after Q1 deliberately advanced them to `0.6.0` and `0.4.0`;
- no Q1 gameplay test failed.

Synchronization repair:
- `8fc6d7354979eafba43bdbf97a617ea9831b4a14`;
- stale duplicate Q0 manifest assertions were removed while the new Q1 manifest assertions remain authoritative.

This handoff rewrite is the intended final pre-merge repository-file mutation after that synchronization repair. Validate its exact resulting PR head with hosted Check before merging PR #414.

## Validated Data 82 census

```text
places/localities                       55
named NPCs                              48
shop/service sites                      37
creature definitions                   123
resource sources                       143
canonical items                        410
recipes/processes                      254
abilities/techniques                    41
quests/contracts                        23
companions                               3
transport services                       7
routes                                  25
NPC schedules                           27
regional/shared packs                   43
pack-owned records                    1372
runtime seed NPCs                       47
runtime seed enemies                    17
raw-resource production demand       145/154
luxury-raw production demand          14/14
```

Mechanics-scale readiness remains **NOT READY**:
- abilities/techniques 41/100;
- quests/contracts 23/30;
- companions 3/4;
- named NPCs 48/50.

Do not close these gaps with disconnected filler.

## Q1 authored social circuit

### Vara Kell — A Compass Worth Trusting

```text
commitment-ironspine-survey-compass
giver: npc-ironspine-vara-kell
delivery:
  item-ironspine-high-pass-compass x1
  provenance craft-ironspine-high-pass-compass
relationship reward:
  Vara respect +2
  Vara trust   +1
```

The High-Pass Survey Compass already existed as a real Ironspine production output. Q1 consumes that existing economy rather than inventing quest-only material.

### Dain Rove — Cold Before Courage

```text
commitment-ironspine-frost-salve-readiness
giver: npc-ironspine-dain-rove
requires:
  commitment-ironspine-survey-compass resolved
  Vara respect >= 2
  Vara trust   >= 1
delivery:
  item-ironspine-frost-lichen-salve x1
  provenance craft-ironspine-frost-lichen-salve
relationship reward:
  Dain familiarity +1
  Dain respect     +1
  Dain trust       +2
```

Regression proof deliberately reduces Vara trust after the first commitment resolves:
- Dain's offer disappears from player-continuity projection;
- direct acceptance is blocked;
- restoring the earned Vara trust restores eligibility.

### Mara Fell — A Place to Come Back Warm

```text
commitment-ironspine-bearhide-bedroll
giver: npc-ironspine-mara-fell
requires:
  commitment-ironspine-frost-salve-readiness resolved
  Dain trust   >= 2
  Dain respect >= 1
delivery:
  item-ironspine-bearhide-bedroll x1
  provenance craft-ironspine-bearhide-bedroll
relationship reward:
  Mara familiarity +1
  Mara obligation  +1
```

Regression proof deliberately reduces Dain respect after his field-readiness commitment:
- Mara's offer remains unavailable;
- restoring the earned Dain respect restores eligibility.

## Dain Rove companion result

Q1 adds:
- `companion-dain-rove`;
- backing NPC: `npc-ironspine-dain-rove`;
- home: `ironspine-watchpost`;
- level 4;
- existing party state and travel/combat authority only.

Recruitment requires:

```text
place:
  ironspine-watchpost

resolved commitments:
  commitment-ironspine-survey-compass
  commitment-ironspine-frost-salve-readiness
  commitment-ironspine-bearhide-bedroll

relationship:
  Dain trust   >= 2
  Dain respect >= 1

availability:
  Dain's canonical schedule must currently be open
```

Dain remains a Warden/Guild contact. `poi-ironspine-warden-desk` keeps the `guild` action and gains `companion` through explicit `companionId` metadata instead of changing POI type.

### Field approaches

```text
Hold the Pass
  VIT +2
  AGI -1
  defensive line-holding identity

Drive the Ridge
  STR +2
  VIT -1
  decisive high-country pressure identity
```

These are intentionally distinct from Sable Renn and Mara Venn.

## Scheduled / mobile NPC authority

Q1 exposed and closes one real cross-system seam.

### Schedule rule

An NPC schedule owns:
- recurring fictional-time service availability.

An NPC schedule does **not** own:
- physical location;
- teleportation.

### Companion recruitment

`canRecruitCompanion()` now checks canonical NPC schedule status when the backing NPC has a schedule.

Q1 proof:
- Dain is recruitable at 08:00 after all social requirements are met;
- Dain is blocked at 18:30 with `party.npc-unavailable`;
- Dain is available again at 08:00 the next fictional day.

### Scheduled POI physical presence

`performLocalityPoiAction()` now verifies that a scheduled backing NPC is physically present in the player's current place before allowing interaction.

Q1 proof:
1. recruit Dain at the watchpost;
2. travel with him over the canonical Ironspine High Trail;
3. leave Dain in Ironspine High Meadow;
4. return alone to the watchpost during Dain's nominal service hours;
5. the warden desk rejects interaction with `locality.poi-npc-absent`;
6. Dain remains physically in the high meadow until the player returns and rejoins him.

This preserves one NPC identity across schedule, locality, party, travel, save/load, and combat.

## Pack-v2 ownership

The existing `pack-ironspine-highlands` owns the Q1 additions.

Added Pack-v2 records:
- 3 commitments;
- 1 companion;
- 3 relationship records.

Relationship records:
- `relationship-ironspine-vara-kell`;
- `relationship-ironspine-dain-rove`;
- `relationship-ironspine-mara-fell`.

`REGIONAL_CONTENT_PACK_DATA_VERSION` advances 48 -> 49.

Pack count remains 43.

Pack-owned records advance:
- 1365 -> 1372.

## Q1 persistence / combat proof

Primary guard:
- `tests/playerIronspineWardenTrustFlow.test.js`.

It proves:
- exact crafted provenance for all three deliveries;
- cross-NPC relationship-gated offer visibility and acceptance;
- fictional-time schedule blocking;
- Dain recruitment through the existing party authority;
- Dain's relationship snapshot at recruitment;
- canonical route travel to Ironspine High Meadow;
- backing NPC location follows companion location;
- scheduled watchpost POI does not resurrect an absent Dain;
- leave/rejoin continuity;
- current-schema save/load preserves all three commitments and Dain;
- Dain participates in a subsequent battle as a companion combatant;
- loaded Game State validates as schema 21.

No Q1 migration or compatibility adapter is added.

## Version result

```text
Product       0.9.500.1 -> 0.9.500.2
Package       0.9.500   -> 0.9.500
Account Save  5         -> 5
Game State    21        -> 21
Data          81        -> 82
Benchmark     3         -> 3
```

Relevant system manifest changes:
- `versionManifest 0.9.500.1 -> 0.9.500.2`;
- `commitments 0.9.0 -> 0.10.0`;
- `regionalContentPacks 0.27.0 -> 0.28.0`;
- `localityNavigation 0.4.0 -> 0.5.0`;
- `companionCatalog 0.3.0 -> 0.4.0`;
- `party 0.5.0 -> 0.6.0`;
- `pois 0.4.5 -> 0.4.6`;
- `companions 0.3.0 -> 0.4.0`.

No persistence version changes.

## Q1 scope closure

Q1 added exactly:
- 3 commitments;
- 1 companion definition for an existing NPC;
- 3 relationship Pack-v2 ownership records;
- 0 new named NPCs;
- 0 new schedules;
- 0 new places/routes;
- 0 new items/recipes;
- 0 new durable state families.

Q1 does **not** authorize more Ironspine social breadth automatically.

## Post-Q1 maturity finding

Q0 proved relationship eligibility.

Q1 proves:
- multi-NPC relationship chains;
- production -> social consequence;
- earned companion recruitment;
- schedule + mobile companion composition.

The next important social gap is **meaningful choice/consequence**, not another linear trust chain or census-driven companion.

## Next selected unit — 0.9.500 Q2

**Crownfields Grange Allocation Choice & Social Consequence — SELECTED / NOT STARTED.**

### Existing people

Reuse:
- `npc-crownfields-maelin-rook` — Maelin Rook, Grange Produce Factor;
- `npc-crownfields-hessa-vale` — Hessa Vale, Growers' Hall Steward;
- `npc-crownfields-perrin-bale` — Perrin Bale, Produce Wagonmaster.

Do not add a Crownfields NPC merely to reach 50/50.

### Existing locality / service substrate

Reuse:
- Crownfields Produce Exchange;
- Growers' Hall;
- produce wagon yard;
- Crownfields Millhouse and Common Loft;
- Maelin schedule;
- Hessa schedule;
- existing Crownfields / Thornwall road and wagon logistics.

### Q2 purpose

Freeze one credible constrained allocation where the same useful stock cannot satisfy every local interest identically.

Q2 must determine whether the consequence can be represented honestly with:
- separate commitments;
- existing relationship changes;
- relationship-gated later offers;
- existing durable flags only where already semantically appropriate;

or whether the content actually requires a small mutually-exclusive/choice-outcome contract.

Do not implement generic branching state before the conflict is authored.

### Q2 restart questions

1. Which existing Crownfields raw/processed good can plausibly be scarce or allocation-constrained without inventing artificial scarcity?
2. What does Maelin want for market/community supply?
3. What does Hessa want for growers/field continuity?
4. What does Perrin want for freight/road logistics?
5. Which outcomes can coexist?
6. Which outcome must exclude or change another?
7. Is a relationship threshold enough to represent the consequence?
8. If not, what is the smallest durable outcome fact required?

### Q2 guardrails

Do not:
- add a fourth companion merely to hit 4/4;
- turn Maelin/Hessa/Perrin into companions without strong fiction/mechanics;
- repeat the Vara -> Dain -> Mara linear chain;
- add generic faction reputation;
- add a dialogue-tree framework;
- add generic quest failure/decline/exclusion state before the exact Crownfields choice needs it;
- introduce husbandry source authority through a social side door;
- invent a new agricultural good if existing Crownfields production can carry the choice;
- pursue raw quest count rather than consequence quality.

### Q2 state expectation

Default:
- Game State remains 21.

A Game State advance is justified only if Q2 freezes a genuinely new durable choice/outcome fact that cannot be represented honestly inside current commitment, relationship, local-knowledge, party, or existing flag envelopes.

## Other preserved deferred / queued work

Do not reopen automatically:

- **Combat depth:** engagement coordinates, LOS/line-of-fire, pursuit/search/disengagement/flee, passive block/parry/guard/counter/reaction execution, stale combat placeholders, weapon resonance/imbuement, unsupported-family breadth, richer named-spell semantics remain deferred by 0.9.300 maturity closure.
- **World edge:** Waymeet Inner Marches / outer crossroads first, then Coppergrass extensions, then Drowned Vaults.
- **Locality enrichment:** ambient/risk events, wandering/seasonal merchants, generalized directions/help dialogue, richer conversation, shop browse/category depth, learned-locality presentation.
- **Material culture:** Packets B-F, tool durability/quality/repair, workstation inventories, worker automation require fresh selection.
- **Ecology repair:** completed sequence; do not restart without fresh selection.
- **Husbandry:** managed-animal products wait for explicit source authority.
- **Romance/deep social life:** deferred until authored people/goals/boundaries justify it.
- **0.9.600 playable-alpha scale:** queued after 0.9.500.
- **0.9.700–0.9.900:** browser/accessibility, supported persistence transition, RC hardening remain deferred.

## Standing governance

Preserve:
- one canonical fictional world clock;
- one owner per durable state family;
- NPC schedules own recurring availability, not physical location;
- backing NPC / companion location owns current physical presence;
- relationships remain NPC-specific and multi-dimensional;
- companion recruitment consumes backing-NPC relationship authority;
- visible commitment opportunities and acceptance share eligibility authority;
- accepted commitments remain durable even if later relationship values change;
- no filler records for census;
- current-schema-only pre-alpha persistence;
- Data and Game State advance independently;
- resolver/registry layers do not become duplicate definition authorities;
- no hidden compatibility scaffolding for unsupported saves;
- `docs/THREAD_HANDOFF.md` is updated last for a closed bounded unit.

## Restart order for Q2

1. `AGENTS.md`;
2. this handoff;
3. `PROJECT_PROFILE.yaml`;
4. `docs/EXECUTION_PIPELINE.md`;
5. `docs/QUEST_SOCIAL_0_9_500_Q1_IRONSPINE_WARDEN_TRUST.md`;
6. inspect Crownfields NPCs/schedules/POIs, shop stock, agricultural raw/processed goods, transport service, commitment/relationship authority, flags, and Pack-v2 owner;
7. freeze the exact constrained allocation and all outcomes before changing runtime state;
8. prove whether existing state can represent the consequence;
9. only if not, define the smallest durable outcome contract;
10. freeze Product/Data/Game-State expectation;
11. implement only the bounded Q2 graph;
12. prove opportunity/acceptance consequence, relationship effects, schedule/locality behavior, item/provenance semantics, save/load, Pack-v2 ownership, and census;
13. update this handoff last.

Do not restart broad social-system, economy, world, or combat discovery unless Q2 exposes a concrete blocker.

## Final validation contract

This handoff is the intended final pre-merge repository-file mutation for Q1 closure.

After this write:
- perform no repository-file mutation unless exact-head validation exposes a real failure;
- validate the exact synchronized PR head with hosted Check;
- confirm Repository Audit, **936/936 tests or higher**, Census, Benchmark 3, and Benchmark Sample;
- merge/promote PR #414 only after that exact synchronized head is green;
- after merge, make only a handoff-status correction on `main` recording the merged main SHA and final synchronized PR head;
- leave Q2 unstarted.
