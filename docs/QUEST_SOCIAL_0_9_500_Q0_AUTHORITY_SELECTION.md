# 0.9.500 Q0 — Quest / Social Authority & Vertical Slice Selection

Status: **COMPLETE / IMPLEMENTATION FREEZE VALIDATED.**

Q0 opens `0.9.500 Quest / Social Depth` by hardening relationship-based eligibility across existing commitment and companion authorities, then selecting the first bounded authored social slice.

## Version decision

```text
Product       0.9.400.7 -> 0.9.500.1
Package       0.9.400   -> 0.9.500
Account Save  5         -> 5
Game State    21        -> 21
Data          80        -> 81
Benchmark     3         -> 3
Codename      Social Relationship Eligibility Foundation
```

Data advances to 81 because Q0 changes authored eligibility semantics for existing canonical social content:
- Sable Renn's second Slatewater field commitment now requires the trust earned from the first road test;
- Sable's companion recruitment now requires actual trust/respect in addition to the two resolved commitments.

Game State remains 21 because all relationship values, commitment records, and companion recruitment facts already live in existing durable state families. Q0 adds no new persisted field.

## Audit findings

Existing social authority is already strong enough for:
- persistent commitment acceptance/resolution;
- prerequisite commitment chains;
- exact-provenance deliveries;
- gil/capability/relationship rewards;
- later-fictional-day follow-up;
- NPC-specific familiarity/respect/trust/obligation;
- canonical fictional-time schedules;
- local NPC identity/familiarity knowledge;
- persistent companion recruitment/travel/combat continuity.

The missing authority was **relationship eligibility**.

Before Q0:
- commitment offers could require only resolved commitment IDs;
- companion recruitment could require flags and resolved commitments;
- relationships were recorded and companions copied them at recruitment, but their values did not gate either offer eligibility or recruitment;
- player-continuity opportunity projection used only commitment-ID prerequisites.

That allowed narrative language about earned trust to remain mechanically equivalent to checklist completion.

## Q0 relationship requirement authority

### Data schema

`js/text/data/socialRequirements.js` owns:
- canonical social relationship dimensions;
- normalized `relationshipRequirements`;
- structural validation.

Canonical dimensions remain:

```text
familiarity
respect
trust
obligation
```

Requirement shape:

```js
relationshipRequirements: [
  {
    npcId: 'npc-example',
    minimums: {
      trust: 2,
      respect: 1,
    },
  },
]
```

Requirements may reference a different NPC from the current giver/recruitment target. This intentionally supports multi-NPC social consequence without introducing faction/reputation state prematurely.

### Runtime evaluation

`js/text/systems/socialRequirementEngine.js` is stateless calculation authority.

It reads existing `relationships.npcs[npcId].dimensions` and returns:
- whether all thresholds are met;
- exact unmet NPC/dimension/minimum/current values;
- player-facing blocker text.

It owns no durable state.

### Commitments

Commitment definitions now normalize and validate `relationshipRequirements`.

`checkCommitmentEligibility()` composes:
- resolved prerequisite commitments;
- relationship requirements.

`acceptCommitment()` uses the combined eligibility result.

Once a commitment is accepted, later relationship loss does **not** invalidate resolution. Acceptance is already a durable commitment fact.

### Player continuity / Journal projection

`createCommitmentOpportunities()` and `createCommitmentOpportunity()` use the same combined commitment eligibility authority.

A relationship-gated commitment therefore cannot appear as actionable in the continuity model when `acceptCommitment()` would reject it.

### Companion recruitment

Companion recruitment definitions now normalize and validate `relationshipRequirements`.

`canRecruitCompanion()` requires:
- place;
- existing flags, if any;
- resolved commitment requirements;
- relationship requirements;
- backing NPC presence.

Companion recruitment remains owned by the existing party state.

## Established-content proof — Sable Renn

Q0 makes the existing Slatewater Road Scout arc mechanically honest.

Second commitment:
```text
commitment-slatewater-lichen-fogmarks
  requires:
    commitment-slatewater-resin-waymarks resolved
    Sable trust >= 1
```

The first commitment already awards Sable:
- familiarity +1;
- trust +1.

Sable recruitment:
```text
requires:
  both Slatewater field commitments resolved
  Sable trust >= 3
  Sable respect >= 1
```

The two existing commitments already award exactly:
- trust 3 total;
- respect 1 total;
- familiarity 1 total.

No ordinary player path is made grindier. Q0 makes the relationship values already earned by that path matter mechanically.

Regression proof deliberately lowers Sable's trust after prerequisite resolution:
- the second commitment disappears from opportunity projection and acceptance is blocked;
- restoring trust re-enables it;
- after both commitments resolve, lowering trust blocks companion recruitment even though the checklist is complete;
- restoring the earned trust re-enables recruitment.

Current-schema persistence remains unchanged.

## What Q0 does not add

Q0 does **not** add:
- declined/failed commitment state;
- mutually exclusive commitment groups;
- branching outcome state;
- faction/reputation state;
- romance/affection;
- generic dialogue state;
- companion affinity separate from NPC relationship state.

Those concepts should be added only when a selected slice demonstrates that existing commitment/relationship state cannot represent the desired consequence honestly.

## Validation evidence

Behavioral implementation freeze:

```text
61227536f7683401de047474ace4eec5160aaef3
```

Hosted Check:

```text
Check #2315
Run   33685651230
Repository Audit       PASS
Tests                  934 / 934 PASS
Content Census         PASS
Benchmark 3            PASS
Benchmark Sample       PASS
```

Validated census before promotion remains:

```text
places/localities                       55
named NPCs                              48
shop/service sites                      37
creature definitions                   123
resource sources                       143
canonical items                        410
recipes/processes                      254
abilities/techniques                    41
quests/contracts                        20
companions                               2
transport services                       7
routes                                  25
NPC schedules                           27
regional/shared packs                   43
pack-owned records                    1365
runtime seed NPCs                       47
runtime seed enemies                    17
```

Q0 changes eligibility semantics but not census counts.

## Q1 selected vertical slice

**0.9.500 Q1 — Ironspine Watchpost Trust & Warden Companion Slice — SELECTED / NOT STARTED.**

Q1 should reuse existing Ironspine authorities and people:
- Vara Kell — High-Pass Survey Factor;
- Dain Rove — Ironspine Warden;
- Mara Fell — Pass Lodge Keeper.

Existing scheduled people:
- Vara Kell;
- Dain Rove.

Existing service/economy substrate:
- survey trade and appraisal;
- route guidance;
- hunting / wildlife tracking;
- weather / field training;
- lodging / food / animal shelter / trail provisions;
- mature Ironspine ecology/resource/production graph.

Existing production outputs selected as likely social proof goods:
- `item-ironspine-high-pass-compass`;
- `item-ironspine-frost-lichen-salve`;
- `item-ironspine-bearhide-bedroll`.

### Proposed bounded Q1 shape

Freeze exact authored details before implementation, but preserve this structure:

1. **Vara Kell survey proof**
   - consume a real Ironspine survey output such as the High-Pass Survey Compass;
   - build Vara respect/trust;
   - establish that the player can connect local resource production to survey work.

2. **Dain Rove field-readiness proof**
   - offer eligibility depends on both prior work and Vara relationship, exercising cross-NPC social eligibility;
   - consume or verify a real high-country preparation output such as Frost Lichen Tallow Salve;
   - build Dain trust/respect.

3. **Mara Fell watchpost-continuity proof**
   - depend on Dain relationship rather than only a prior commitment ID;
   - use a real lodging/travel preparation good such as the High-Pass Bearhide Bedroll;
   - create obligation/familiarity across the watchpost community.

4. **Dain Rove companion recruitment**
   - add Dain as a canonical companion only after the multi-NPC arc establishes sufficient Dain trust/respect;
   - companion state must reuse existing party authority;
   - Dain's field approaches should reflect his existing warden/route/hunting identity rather than duplicate Sable or Mara Venn.

### Q1 expected breadth

Preferred bounded target:
- 3 new commitments;
- 1 new companion definition for existing NPC Dain Rove;
- 0 new named NPCs;
- 0 new schedules unless an actual availability gap is found;
- 0 new places/routes;
- 0 new item/recipe definitions unless an unavoidable content hole is demonstrated.

Expected census if this exact target survives implementation:
- quests/contracts 20 -> 23;
- companions 2 -> 3;
- named NPCs remain 48.

Do not expand Q1 merely to reach mechanics floors.

## Why Ironspine wins over Crownfields for Q1

Crownfields is also strong future social substrate, but Ironspine is the better first proof because:
- Dain Rove's Warden / route-guidance / hunting / field-training role naturally supports a persistent traveling companion;
- existing Ironspine survey, field medicine, weather gear, hunting, and lodging outputs provide three materially different social/economic hooks;
- Vara, Dain, and Mara already form a factor / field warden / lodge-keeper social triangle;
- Q1 can improve both commitment and companion depth without inventing a new person;
- it tests relationship requirements across multiple NPCs, not merely a linear single-giver chain.

Crownfields remains a strong later 0.9.500 candidate rather than being discarded.

## Q1 guardrails

Do not:
- add a new Ironspine NPC solely to increase census;
- turn Dain into a companion before relationship requirements are actually earned;
- duplicate Sable's two-field-test story beat-for-beat;
- invent faction reputation for a three-person local arc;
- add failed/declined/mutually-exclusive state unless the authored Q1 design genuinely needs it;
- create new Ironspine materials if existing outputs can carry the social loop;
- add generic affection or romance meters;
- make companion relationship a second authority separate from the backing NPC relationship.

## Version / state expectation for Q1

Q1 will almost certainly advance Data because it is expected to add commitments, companion definition, and Pack-v2 ownership.

Default expectation:
- Game State remains 21;
- no new persistent state family;
- party/commitment/relationship/local-knowledge/schedule authorities remain owners.

Any Game State advance requires a concrete Q1 durable fact that cannot honestly live in those existing envelopes.
