# 0.9.500 Q1 — Ironspine Watchpost Trust & Warden Companion Slice

Status: **COMPLETE / IMPLEMENTATION FREEZE VALIDATED.**

Q1 is the first authored social-depth slice built on the Q0 relationship-eligibility foundation. It turns existing Ironspine production, schedules, NPC relationships, and party continuity into one connected multi-NPC trust circuit without adding a new durable social state family.

## Version decision

```text
Product       0.9.500.1 -> 0.9.500.2
Package       0.9.500   -> 0.9.500
Account Save  5         -> 5
Game State    21        -> 21
Data          81        -> 82
Benchmark     3         -> 3
Codename      Ironspine Warden Trust Circuit
```

Data advances because Q1 adds canonical commitments, one companion definition, Pack-v2 relationship ownership, NPC quest/service metadata, and a new companion action on Dain Rove's existing POI.

Game State remains 21 because all durable facts continue to live in existing commitment, relationship, party, local-knowledge, world-time, and NPC state envelopes.

## Authored Q1 graph

### 1. Vara Kell — A Compass Worth Trusting

```text
commitment-ironspine-survey-compass
giver: npc-ironspine-vara-kell
item: item-ironspine-high-pass-compass
required provenance: craft-ironspine-high-pass-compass
reward relationship:
  Vara respect +2
  Vara trust   +1
```

This is a production-to-social proof. Buying or presenting an unrelated survey-looking object is insufficient; the delivered compass must carry the canonical Ironspine crafting provenance.

### 2. Dain Rove — Cold Before Courage

```text
commitment-ironspine-frost-salve-readiness
giver: npc-ironspine-dain-rove
requires:
  commitment-ironspine-survey-compass resolved
  Vara respect >= 2
  Vara trust   >= 1
item: item-ironspine-frost-lichen-salve
required provenance: craft-ironspine-frost-lichen-salve
reward relationship:
  Dain familiarity +1
  Dain respect     +1
  Dain trust       +2
```

The second offer is therefore not a plain quest-chain unlock. Q1 regression deliberately removes Vara trust after the first commitment resolves; Dain's offer disappears from player-continuity opportunity projection and direct acceptance is blocked until the earned trust is restored.

### 3. Mara Fell — A Place to Come Back Warm

```text
commitment-ironspine-bearhide-bedroll
giver: npc-ironspine-mara-fell
requires:
  commitment-ironspine-frost-salve-readiness resolved
  Dain trust   >= 2
  Dain respect >= 1
item: item-ironspine-bearhide-bedroll
required provenance: craft-ironspine-bearhide-bedroll
reward relationship:
  Mara familiarity +1
  Mara obligation  +1
```

Q1 again proves cross-NPC social eligibility by reducing Dain respect after his commitment resolves. Mara's offer remains unavailable until the relationship requirement is restored.

## Dain Rove companion contract

Q1 adds one companion definition for the already-existing persistent NPC Dain Rove.

Recruitment requirements:

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
  canonical Dain schedule must currently be open
```

Dain is not converted into a companion-only contact. His existing `poi-ironspine-warden-desk` remains a Guild/fieldcraft POI and exposes both:
- `guild`;
- `companion`.

### Dain field identity

```text
Role: warden
Policy: basic-attack-v1

Hold the Pass
  VIT +2
  AGI -1
  defensive / line-holding posture

Drive the Ridge
  STR +2
  VIT -1
  forceful / seize-the-opening posture
```

These approaches intentionally differ from Sable Renn's mobile scout identity and Mara Venn's road-skirmisher identity.

## Scheduled / mobile NPC coherence

Q1 exposed a real integration seam because Dain can now be both:
- a scheduled watchpost service NPC;
- a persistent mobile companion.

Two generic coherence fixes are therefore part of Q1.

### Schedule-aware companion recruitment

`canRecruitCompanion()` now reads the backing NPC's canonical schedule when one exists.

A scheduled companion candidate cannot be recruited outside the NPC's authored availability window merely by invoking party authority directly.

Dain's existing schedule remains:

```text
07:00–18:00
Ironspine warden desk
```

Q1 regression proves recruitment at 18:30 is blocked and becomes available again at 08:00 the next fictional day.

### Scheduled POI physical-presence check

A schedule describes when an NPC normally serves a POI; it must not teleport a mobile recruited NPC back to that POI.

`performLocalityPoiAction()` now verifies that the scheduled backing NPC is physically present in the current place before interaction.

Regression proof:
1. recruit Dain;
2. travel with him to Ironspine High Meadow;
3. leave him there;
4. return alone to Ironspine Watchpost during his nominal schedule;
5. interaction at the warden desk is blocked because Dain is physically still in the high meadow.

This preserves one NPC identity across schedule, locality, companion, travel, and combat authorities.

## Pack-v2 ownership

The existing `pack-ironspine-highlands` remains the owner.

Q1 adds:
- 3 quest/commitment records;
- 1 companion record;
- 3 relationship ownership records.

Relationship records:
- `relationship-ironspine-vara-kell`;
- `relationship-ironspine-dain-rove`;
- `relationship-ironspine-mara-fell`.

No new content pack is introduced.

`REGIONAL_CONTENT_PACK_DATA_VERSION` advances 48 -> 49.

## Authored breadth

```text
new commitments       3
new companions        1
new relationship Pack records 3
new named NPCs        0
new schedules         0
new places/routes     0
new items/recipes     0
```

## Validation evidence

Behavioral implementation freeze:

```text
702d06bd123e1f6f85eebf7f0fdb02dd7b394359
```

Hosted Check:

```text
Check #2338
Run   33687994124
Repository Audit       PASS
Tests                  936 / 936 PASS
Content Census         PASS
Benchmark 3            PASS
Benchmark Sample       PASS
```

The earlier Check #2334 / run `33687784628` reached 931/936. The new end-to-end Q1 gameplay test itself passed; all five failures were stale census assertions plus one incorrect supplemental-field name. Those assertions were updated to the bounded Q1 census and the full gate then passed.

## Data 82 census

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
```

Mechanics-scale gate remains NOT READY:
- abilities/techniques 41/100;
- quests/contracts 23/30;
- companions 3/4;
- named NPCs 48/50.

Do not fill those gaps mechanically.

## Q1 persistence and continuity proof

The end-to-end regression proves:
- all three commitment records resolve through canonical commitment state;
- Vara / Dain / Mara relationship deltas persist through existing relationship state;
- Dain recruitment uses existing party state;
- Dain follows canonical route travel from Ironspine Watchpost to Ironspine High Meadow;
- backing NPC location follows the persistent companion;
- leaving and rejoining preserve companion identity;
- current-schema save/load preserves all three commitments plus Dain's recruited/active state;
- Dain appears as a companion combatant in a subsequent battle;
- loaded Game State validates with schema 21.

No Q1-specific save adapter or migration exists.

## What Q1 does not add

Q1 does **not** add:
- new NPCs;
- new geography;
- new schedules;
- new items or recipes;
- faction reputation;
- declined/failed commitments;
- mutually exclusive commitments;
- generic branch-choice state;
- romance/affection;
- a second companion-specific relationship meter.

## Post-Q1 social maturity finding

Q0 proved that relationships can gate social access.

Q1 proves that:
- cross-NPC relationship requirements can form a coherent community trust chain;
- material production can create social consequence;
- schedules and mobile companions can share one NPC identity;
- companion recruitment can be the end of a social arc rather than an isolated unlock.

The next missing social behavior is no longer another linear trust chain. It is **meaningful choice and allocation consequence**.

## Q2 selected next pass

**0.9.500 Q2 — Crownfields Grange Allocation Choice & Social Consequence — SELECTED / NOT STARTED.**

Use existing people:
- Maelin Rook — Grange Produce Factor;
- Hessa Vale — Growers' Hall Steward;
- Perrin Bale — Produce Wagonmaster.

Use existing substrate:
- produce exchange;
- Growers' Hall;
- wagon yard;
- millhouse/common loft;
- Crownfields agricultural resources and processed foods/textiles;
- canonical Maelin and Hessa schedules;
- existing Crownfields-to-Thornwall wagon/road logistics.

### Q2 purpose

Q2 should determine the smallest honest contract for a social situation in which **one useful allocation cannot satisfy every local interest simultaneously**.

It should test whether existing authorities can express that consequence through:
- separate commitments;
- relationship changes;
- prerequisite thresholds;
- existing durable flags only where already appropriate;

or whether the authored slice genuinely requires a bounded mutually-exclusive/choice outcome contract.

Do not add generic branching state before the exact Crownfields content is frozen.

### Preferred Q2 shape

Before implementation:
1. inspect Crownfields raw/processed goods and transport services for one credible constrained allocation;
2. freeze what Maelin, Hessa, and Perrin each want and why those interests conflict;
3. freeze which choices are mutually compatible or exclusive;
4. determine whether declined/failed/exclusion state is actually required;
5. only then define the smallest state/schema extension, if any.

Q2 should remain a Crownfields community/economy social slice. Do not manufacture a fourth companion merely to satisfy the 3/4 mechanics floor.

## Q2 guardrails

Do not:
- add a new Crownfields NPC for census;
- make Maelin, Hessa, or Perrin a companion without strong fictional/gameplay justification;
- reuse the exact Vara -> Dain -> Mara linear chain shape;
- invent faction reputation for a three-person local allocation problem;
- create generic dialogue-tree state;
- author a new agricultural item when existing Crownfields production can support the conflict;
- introduce husbandry source authority through the back door;
- choose a branching schema before the actual exclusive outcome is defined.

## Version / state expectation for Q2

Data will likely advance if new commitments/Pack ownership are authored.

Game State 21 remains the default expectation. A Game State advance is justified only if Q2 proves a genuinely new durable **choice/outcome fact** cannot be represented within current commitment, relationship, party, local-knowledge, or existing flag envelopes.
