# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

```text
Product:       0.9.500.1
Package:       0.9.500
Account Save:  5
Game State:    21
Data:          81
Benchmark:     3
Codename:      Social Relationship Eligibility Foundation
Runtime:       Node >=24
Phase:         0.9
0.9.100:       COMPLETE — Content Scale Gate A
0.9.200:       COMPLETE — Adventure Vertical Slices
0.9.300:       COMPLETE — Advanced Combat / Training
0.9.400:       COMPLETE — Economy / Production Depth
0.9.500:       ACTIVE — Quest / Social Depth
Latest unit:   Q0 — Social Relationship Eligibility Foundation
Next unit:     Q1 — Ironspine Watchpost Trust & Warden Companion Slice
Next status:   SELECTED / NOT STARTED
```

Data 81 is the current authored/mechanics-data checkpoint. Q0 changes eligibility semantics for existing Sable Renn commitment/companion records and adds reusable relationship-requirement schema/runtime authority.

Game State remains 21. Q0 introduces no new durable state family or persisted field.

## Repository / promotion state

Pre-Q0 main checkpoint:
- `c9d96ff9c242445919c806b061a461454be8a13f`.

Q0 branch:
- `phase-0.9.500-q0-social-authority-selection`.

Promotion PR:
- PR #413 — Open 0.9.500 Q0 social relationship authority.

Q0 behavioral implementation freeze:
- `61227536f7683401de047474ace4eec5160aaef3`.

Hosted implementation evidence:
- Check #2315 / run `33685651230`;
- Repository Audit PASS;
- **934/934 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS.

First synchronized promotion attempt:
- head `3d3fd5a601604481f37d7697fa5500926ae8fb19`;
- Check #2329 / run `33686263573`;
- Repository Audit PASS;
- tests **933/934**;
- sole failure: historical `tests/phase07Px6Versioning.test.js` still required `SYSTEM_VERSIONS.companions === 0.2.0` even though Q0 deliberately advances that shared later-track catalog to `0.3.0`;
- no Q0 social-runtime test failed.

Synchronization repair:
- `610a330f6c45ba38d91c2b54de87829407e3977d`;
- the historical Phase 0.7 gate now permits later compatible companion catalog versions using the same lower-bound convention already used by its adjacent shared-authority assertions.

This handoff rewrite is the intended final pre-merge file mutation after that synchronization repair. Validate its exact resulting PR head with hosted Check before merging PR #413.

## Validated Data 81 census

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
raw-resource production demand       145/154
luxury-raw production demand          14/14
```

Q0 changes no census counts.

Mechanics-scale readiness remains **NOT READY**:
- abilities/techniques 41/100;
- quests/contracts 20/30;
- companions 2/4;
- named NPCs 48/50.

Do not close these gaps with disconnected filler.

## Q0 authority result

### Existing social authority retained

Existing owners remain:
- `commitmentEngine` — acceptance, resolution, exact-provenance delivery, reward, later-day follow-up;
- `relationshipEngine` — NPC-specific familiarity/respect/trust/obligation;
- `partyEngine` — recruited/active companions and companion continuity;
- `npcScheduleEngine` — fictional-time availability;
- `localKnowledgeEngine` — NPC identity/familiarity and locality knowledge;
- Pack v2 — authored social placement/ownership.

Q0 adds no replacement authority.

### Relationship requirement schema

`js/text/data/socialRequirements.js` owns:
- canonical relationship dimension vocabulary;
- normalized relationship requirement records;
- structural/reference validation.

Canonical dimensions:

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

Requirements may reference a different persistent NPC from the current giver or companion. This is the intentional seam for multi-NPC social consequence.

### Stateless evaluation

`js/text/systems/socialRequirementEngine.js` reads existing relationship state and returns:
- exact unmet NPC;
- relationship dimension;
- current value;
- required minimum;
- player-facing blocker text.

It persists nothing.

### Commitment eligibility

`checkCommitmentEligibility()` composes:
- resolved commitment prerequisites;
- relationship requirements.

`acceptCommitment()` consumes the combined result.

Once accepted, a commitment remains resolvable even if a relationship later drops. Acceptance itself is already durable commitment state.

### Opportunity / Journal coherence

`playerContinuityEngine` now uses the same relationship-aware eligibility when projecting commitment opportunities.

A commitment cannot appear as actionable when acceptance authority would reject it.

### Companion eligibility

Companion definitions may now specify `recruitment.relationshipRequirements`.

`canRecruitCompanion()` composes:
- current place;
- existing required flags;
- resolved commitment IDs;
- relationship thresholds;
- backing NPC presence.

No companion-specific duplicate relationship meter is introduced.

## Established proof — Sable Renn

Q0 converts the already-authored Slatewater trust story from checklist implication to real relationship semantics.

Second commitment:

```text
commitment-slatewater-lichen-fogmarks
requires:
  commitment-slatewater-resin-waymarks resolved
  Sable trust >= 1
```

The first commitment already awards:
- familiarity +1;
- trust +1.

Sable companion recruitment:

```text
requires:
  commitment-slatewater-resin-waymarks resolved
  commitment-slatewater-lichen-fogmarks resolved
  Sable trust >= 3
  Sable respect >= 1
```

The two existing commitments already award exactly trust 3 and respect 1.

Regression proof deliberately reduces trust after checklist completion:
- relationship-gated second commitment disappears from player-continuity opportunities;
- direct acceptance is blocked;
- restoring earned trust re-enables the offer;
- after both commitments resolve, lowering trust blocks recruitment;
- restoring earned trust re-enables recruitment.

Primary guards:
- `tests/socialRequirementAuthority.test.js`;
- `tests/playerSlatewaterRoadScoutFlow.test.js`.

## Version result

```text
Product       0.9.400.7 -> 0.9.500.1
Package       0.9.400   -> 0.9.500
Account Save  5         -> 5
Game State    21        -> 21
Data          80        -> 81
Benchmark     3         -> 3
```

Relevant system manifest changes:
- `versionManifest 0.9.400.7 -> 0.9.500.1`;
- `commitments 0.8.0 -> 0.9.0`;
- `relationships 0.1.0 -> 0.2.0`;
- `socialRequirements 0.1.0` added;
- `socialRequirementEngine 0.1.0` added;
- `playerContinuity 0.6.0 -> 0.7.0`;
- `party 0.4.0 -> 0.5.0`;
- `companions 0.2.0 -> 0.3.0`.

No persistence migration or compatibility adapter is added.

## Q0 branching / failure decision

Q0 deliberately does **not** add:
- declined commitment state;
- failed commitment state;
- mutually exclusive commitment groups;
- branch-choice state;
- faction reputation;
- generic affection;
- romance state.

The selected Q1 slice does not require those semantics to create a meaningful multi-NPC consequence chain.

Add any of them only if a future selected slice cannot be represented honestly through:
- commitment acceptance/resolution;
- relationship thresholds;
- existing follow-up timing;
- existing companion recruitment;
- existing schedules/local knowledge.

## Next selected unit — 0.9.500 Q1

**Ironspine Watchpost Trust & Warden Companion Slice — SELECTED / NOT STARTED.**

### Existing people

Reuse:
- `npc-ironspine-vara-kell` — Vara Kell, High-Pass Survey Factor;
- `npc-ironspine-dain-rove` — Dain Rove, Ironspine Warden;
- `npc-ironspine-mara-fell` — Mara Fell, Pass Lodge Keeper.

Do not add a new Ironspine NPC merely to move the census.

### Existing schedule / service substrate

Already present:
- Vara schedule;
- Dain schedule;
- survey trade / resource appraisal / provisions;
- route guidance / hunting / wildlife tracking / weather / field training;
- lodging / food / animal shelter / trail provisions.

Add no schedule unless Q1 proves Mara needs one for actual availability semantics.

### Existing production proof goods

Prefer:
- `item-ironspine-high-pass-compass`;
- `item-ironspine-frost-lichen-salve`;
- `item-ironspine-bearhide-bedroll`.

These already have real production/provenance chains. Do not invent a Q1-only material if one of these can express the desired work.

### Preferred bounded Q1 shape

1. **Vara Kell survey proof**
   - real Ironspine survey output;
   - raises Vara respect/trust;
   - proves survey work through existing economy.

2. **Dain Rove field-readiness proof**
   - eligibility depends on prior work plus Vara relationship;
   - use real high-country preparation output;
   - raises Dain trust/respect.

3. **Mara Fell watchpost-continuity proof**
   - eligibility depends on Dain relationship, not only a prior commitment ID;
   - use real lodging/travel-preparation output;
   - raises local familiarity/obligation.

4. **Dain Rove recruitment**
   - companion definition for existing NPC Dain Rove;
   - requires earned Dain trust/respect plus relevant resolved commitments;
   - uses existing party state;
   - field approaches must express warden/route/hunting identity rather than duplicate Sable Renn or Mara Venn.

### Preferred Q1 authored delta

```text
new commitments      3
new companions       1
new named NPCs       0
new schedules        0 by default
new places/routes    0
new items/recipes    0 by default
```

If this exact target survives implementation, expected census:
- quests/contracts 20 -> 23;
- companions 2 -> 3;
- named NPCs remain 48.

This is not permission to add more records merely to reach mechanics floors.

### Q1 state expectation

Default:
- Data advances because commitments/companion/Pack-v2 ownership will be authored;
- Game State remains 21;
- no new social state family.

Advance Game State only if Q1 exposes a genuinely new durable fact that existing commitment/relationship/party/schedule/local-knowledge state cannot own.

## Why Ironspine is selected before Crownfields

Crownfields remains a strong future social substrate.

Ironspine is selected first because:
- Dain Rove is already fictionally suited to become an adventuring companion;
- Vara / Dain / Mara form a coherent factor / warden / lodge-keeper social triangle;
- survey gear, field medicine, weather preparation, hunting, and lodging provide distinct real gameplay hooks;
- Q1 can exercise cross-NPC relationship requirements immediately;
- no new person or geography is required.

## Other preserved deferred / queued work

Do not reopen automatically:

- **Crownfields social slice:** strong later 0.9.500 candidate, not discarded.
- **Branch/failure/exclusion state:** deferred until a selected social slice actually needs it.
- **Romance/deep affection:** deferred; relationships remain multi-dimensional and NPC-specific.
- **Workshop tools / material culture:** ordinary portable workshop tools, Material Culture Packets B-F, tool durability/quality/repair, workstation inventories, worker automation require fresh selection.
- **Traveler gear conversion:** Traveler Gloves / Traveler Boots are not automatically next.
- **Combat depth:** engagement coordinates, LOS/line-of-fire, pursuit/search/disengagement/flee, passive block/parry/guard/counter/reaction execution, stale combat placeholders, weapon resonance/imbuement, unsupported-family breadth, richer named-spell semantics remain deferred by 0.9.300 maturity closure.
- **World edge:** Waymeet Inner Marches / outer crossroads first, then Coppergrass extensions, then Drowned Vaults.
- **Locality enrichment:** ambient/risk events, wandering/seasonal merchants, generalized directions/help dialogue, richer conversation, shop browse/category depth, learned-locality presentation.
- **Ecology repair:** completed sequence; do not restart without fresh selection.
- **Husbandry:** managed-animal products wait for explicit source authority.
- **0.9.600 playable-alpha scale:** queued after 0.9.500.
- **0.9.700–0.9.900:** browser/accessibility, supported persistence transition, RC hardening remain deferred.

## Standing governance

Preserve:
- one canonical fictional world clock;
- one owner per durable state family;
- relationship state remains NPC-specific and multi-dimensional;
- companion recruitment must consume backing-NPC relationship authority rather than create a second affinity meter;
- visible commitment opportunities and acceptance use the same eligibility authority;
- accepted commitments remain durable even if later relationship values change;
- no filler records for census;
- current-schema-only pre-alpha persistence;
- Data and Game State advance independently;
- resolver/registry layers do not become duplicate definition authorities;
- no hidden compatibility scaffolding for unsupported saves;
- `docs/THREAD_HANDOFF.md` is updated last for a closed bounded unit.

## Restart order for Q1

1. `AGENTS.md`;
2. this handoff;
3. `PROJECT_PROFILE.yaml`;
4. `docs/EXECUTION_PIPELINE.md`;
5. `docs/QUEST_SOCIAL_0_9_500_Q0_AUTHORITY_SELECTION.md`;
6. inspect current Ironspine NPCs/schedules/POIs, production outputs, Pack-v2 owner, commitment schema, companion schema, relationship eligibility, and existing player continuity;
7. freeze exact three-commitment narrative/requirements/rewards;
8. freeze Dain companion stats/approaches/recruitment thresholds;
9. freeze exact Product/Data/Game-State expectation;
10. implement only the bounded Q1 graph;
11. prove cross-NPC relationship gating, fictional-time availability, production provenance, companion recruitment/travel/combat, current-schema save/load, Pack-v2 ownership, and census;
12. update this handoff last.

Do not restart broad social-system discovery, economy discovery, or combat discovery unless Q1 exposes a concrete blocker.

## Final validation contract

This handoff is the intended final pre-merge repository-file mutation for Q0 closure.

After this write:
- perform no repository-file mutation unless exact-head validation exposes a real failure;
- validate the exact synchronized PR head with hosted Check;
- confirm Repository Audit, **934/934 tests or higher**, Census, Benchmark 3, and Benchmark Sample;
- merge/promote PR #413 only after that exact synchronized head is green;
- after merge, make only a handoff-status correction on `main` recording the merged main SHA and final synchronized PR head;
- leave Q1 unstarted.
