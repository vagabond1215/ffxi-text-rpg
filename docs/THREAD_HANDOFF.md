# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

```text
Product:       0.9.400.7
Package:       0.9.400
Account Save:  5
Game State:    21
Data:          80
Benchmark:     3
Codename:      Workshop Tool Authority Audit
Runtime:       Node >=24
Phase:         0.9
0.9.100:       COMPLETE — Content Scale Gate A
0.9.200:       COMPLETE — Adventure Vertical Slices
0.9.300:       COMPLETE — Advanced Combat / Training
0.9.400:       COMPLETE — Economy / Production Depth
Latest unit:   A6 — Shared Workshop Tool Authority Audit
Next track:    0.9.500 — Quest / Social Depth
Next unit:     Q0 — Quest / Social Authority & Vertical Slice Selection
Next status:   CANDIDATE / NOT STARTED
```

Data 80 remains the current authored/mechanics-data checkpoint. A6 changes production requirement validation authority but adds no canonical authored item, recipe, pack, NPC, quest, ability, ecology, geography, or other data record.

Game State remains 21. A6 adds no new durable gameplay fact or persistence family.

## Repository / promotion state

Pre-A6 main checkpoint:
- `fe27e872a701f6228e8c95a1fd92957d1c2e4a82`.

A6 branch:
- `phase-0.9.400-a6-workshop-tool-authority-audit`.

Promotion PR:
- PR #412 — Close 0.9.400 A6 workshop tool authority audit.

A6 behavioral implementation freeze:
- `4583b405e85dd91266c05c30b9ae3cfb05a00f14`.

Hosted implementation evidence:
- Check #2297 / run `33677766982`;
- Repository Audit PASS;
- **930/930 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS.

This handoff write is the intended final pre-merge file mutation. Validate its exact resulting PR head with hosted Check before merging PR #412.

## Validated Data 80 census

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

A6 changes none of these counts.

Mechanics-scale readiness remains **NOT READY**:
- abilities/techniques 41/100;
- quests/contracts 20/30;
- companions 2/4;
- named NPCs 48/50.

Do not close these gaps with disconnected filler.

## A6 authority result

### Production requirement authority

`js/text/data/productionRequirementAuthority.js` is now shared authority for:
- recognized production workstation tags;
- canonical portable production-tool capability providers;
- explicitly declared contextual production-tool tags;
- validation of station/tool requirements before content is accepted.

Current recognized workstation tags:

```text
forge
kitchen
woodshop
tannery
workshop
```

`workstationEngine` consumes this shared vocabulary rather than owning another station-tag list.

### Current portable-tool requirements

Across all current production definitions, the required portable-tool tag set is exactly:

```text
cutting
woodcutting
```

Canonical providers:

```text
cutting     -> field-knife, reed-sickle
woodcutting -> woodsman-hatchet
```

`CONTEXTUAL_PRODUCTION_TOOL_TAGS` is currently empty. Future context-only production capabilities must be declared explicitly rather than appearing as undocumented recipe tags.

### Validator behavior

`validateProductionCatalog()` now also validates production requirement authority.

It rejects:
- an unknown workstation tag such as `loom`;
- a required tool capability such as `smithing-hammer` when there is neither a canonical portable provider nor an explicit contextual authority.

Primary regression:
- `tests/productionRequirementAuthority.test.js`.

This guard prevents future recipes from silently creating unsupported workshop vocabulary.

## Workshop-tool decision

A6 does **not** authorize a broad portable workshop-tool catalog.

Repository audit found no existing canonical equipment identities for ordinary:
- smithing hammers, tongs, or files;
- woodworking saws, planes, or chisels;
- masonry mallets or chisels;
- textile shears, needles, or spindles;
- leatherworking awls or needles;
- cooking implements;
- balances, measures, or precision workshop tools.

Current recipes also do not require those portable capability tags.

Ordinary fixed implements remain part of workstation capability while the action occurs at a forge, woodshop, tannery, kitchen, or general workshop.

A new portable tool identity is justified only when it creates a real player decision beyond station presence, for example:
- a field repair or preparation action away from a complete workstation;
- a capability that matters across multiple station types;
- an inventory/loadout choice with meaningful access consequences;
- a portable specialist action that cannot honestly be represented by the workstation itself.

Do not create one tool per profession merely to complete a conceptual list.

## 0.9.400 closure

**0.9.400 Economy / Production Depth is COMPLETE after A0-A6.**

The track now proves:
- one canonical item authority across resource, production, equipment, shop, inventory, and persistence paths;
- production can output existing equipment stable IDs without duplicate definitions;
- physical portable tools can bind into work and become protected while active work owns them;
- established field tools have canonical production paths;
- selected bronze starter, caster/offhand, and basic leather equipment IDs have canonical production paths;
- material-foundation stocks feed those conversions;
- Pack-v2 owns shared placement without duplicating definition authority;
- production station/tool requirement vocabulary is explicit and validated;
- no new production/tool persistence family is required for the current target.

Remaining Material Culture Packet-A workshop-tool concepts and Packets B-F are deferred depth requiring fresh explicit selection.

## Version result

```text
Product       0.9.400.6 -> 0.9.400.7
Package       0.9.400   -> 0.9.400
Account Save  5         -> 5
Game State    21        -> 21
Data          80        -> 80
Benchmark     3         -> 3
```

Relevant system manifest changes:
- `versionManifest 0.9.400.6 -> 0.9.400.7`;
- `workstations 0.3.1 -> 0.4.0`;
- `productionRequirementAuthority 0.1.0` added;
- `productionCatalog 0.22.0 -> 0.23.0`.

No persistence migration, compatibility adapter, or authored-data promotion was added.

## Next bounded candidate — 0.9.500 Q0

**Quest / Social Authority & Vertical Slice Selection — CANDIDATE / NOT STARTED.**

Q0 is an authority/maturity audit before new breadth authoring.

### Why Q0 is next

Economy/production already clears its mechanics-scale floors:
- canonical items 410/200;
- recipes/processes 254/75;
- shop/service sites 37/20;
- transport services 7/5.

The remaining social-facing floors are:
- named NPCs 48/50;
- quests/contracts 20/30;
- companions 2/4.

Abilities/techniques remain the largest raw mechanics gap at 41/100, but the 0.9.300 maturity reassessment explicitly closed the current advanced-combat target and deferred broader combat/ability depth. Do not reopen combat merely to fill that number.

The formal next track is therefore 0.9.500 Quest / Social Depth.

### Q0 required audit

Before authoring:
1. inspect `commitments.js` and `commitmentEngine` for prerequisite, acceptance, resolution, provenance, reward, and later-day follow-up semantics;
2. inspect `relationshipEngine` and its familiarity/respect/trust/obligation dimensions;
3. inspect `companions.js` plus companion recruitment/travel/combat continuity;
4. inspect NPC schedule/world projection and locality-knowledge integration;
5. inspect current dialogue/greeting presentation and determine what belongs in durable social state versus presentation only;
6. determine whether branching choices, failed commitments, mutually exclusive outcomes, reputation/group ties, or longer consequence chains require new authority before breadth;
7. identify existing named NPCs with underused persistent roles before inventing new people;
8. select the smallest coherent multi-NPC vertical slice that creates repeated social consequence across fictional days;
9. include a companion only if recruitment meaningfully emerges from that slice;
10. freeze exact Product/Data/Game-State expectations before implementation.

### Q0 guardrails

Do not:
- add ten disconnected quests to reach 30;
- add two arbitrary companions to reach 4;
- create two named NPCs solely to reach 50;
- collapse social progression into one universal affection meter;
- put presentation-only dialogue randomness into durable state;
- add romance as generic breadth before goals/boundaries/relationship authority are sufficient;
- duplicate commitment, relationship, schedule, local-knowledge, or companion ownership.

Q0 may close as decision-only if current authorities are already sufficient and a bounded slice can be selected without runtime changes.

## Other preserved deferred / queued work

Do not reopen automatically:

- **Workshop tools / material culture:** ordinary portable workshop tools, Material Culture Packets B-F, tool durability/quality/repair, workstation inventories, and worker automation require fresh explicit selection.
- **Traveler gear conversion:** Traveler Gloves / Traveler Boots remain outside prior conversion scopes and are not automatically next.
- **Combat depth:** engagement coordinates, LOS/line-of-fire, pursuit/search/disengagement/flee, passive block/parry/guard/counter/reaction execution, stale combat placeholders, weapon resonance/imbuement, unsupported-family breadth, and remaining richer named-spell semantics remain deferred by the 0.9.300 maturity closure.
- **World edge:** Waymeet Inner Marches / outer crossroads first, then Coppergrass extensions, then Drowned Vaults.
- **Locality enrichment:** ambient/risk events, wandering/seasonal merchants, generalized directions/help dialogue, richer conversation, shop browse/category depth, learned-locality presentation.
- **Ecology repair:** five-part sequence complete; do not restart without fresh selection.
- **Husbandry:** fleece/wool, dairy, eggs, honey, manure, managed domestic meat/hides wait for explicit managed-animal source authority.
- **0.9.600 playable-alpha scale:** queued after 0.9.500, not auto-started.
- **0.9.700–0.9.900:** browser/accessibility, supported persistence transition, and release-candidate hardening remain deferred.

## Standing governance

Preserve:
- one canonical fictional world clock;
- one owner per state family;
- resolver/registry layers do not become duplicate definition authorities;
- equipment stable IDs remain singular across shop, production, equipment, combat use, and persistence;
- portable tools and workstation capability remain distinct concepts;
- required station/tool tags must resolve through explicit authority;
- no duplicate task owner;
- current-schema-only pre-alpha persistence;
- implementation/data freeze before Product/Data promotion;
- Data and Game State advance independently;
- no mechanics-census filler;
- no hidden compatibility scaffolding for unsupported saves;
- exploration aggro remains separate from active-battle attention;
- `docs/THREAD_HANDOFF.md` is updated last for a closed bounded unit.

## Restart order for a future 0.9.500 Q0 continuation

1. `AGENTS.md`;
2. this handoff;
3. `PROJECT_PROFILE.yaml`;
4. `docs/EXECUTION_PIPELINE.md`;
5. `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md`;
6. `docs/DEVELOPMENT_DIRECTION.md`;
7. inspect commitments, relationships, companions, NPC schedules/world projection, local knowledge, dialogue/presentation, and Pack-v2 social ownership;
8. identify concrete social-authority gaps versus breadth gaps;
9. select the smallest coherent multi-NPC vertical slice;
10. freeze exact Product/Data/Game-State expectations;
11. implement authority changes only if the slice actually requires them;
12. prove fictional-time continuity, save/load, relationship/commitment consequences, and any companion recruitment path;
13. update this handoff last.

Do not restart the broad economy/material-culture audit or advanced-combat audit unless Q0 exposes a concrete blocker owned by those domains.

## Final validation contract

This handoff is the intended final pre-merge repository-file mutation for A6 closure.

After this write:
- perform no repository-file mutation unless exact-head validation exposes a real failure;
- validate the exact synchronized PR head with hosted Check;
- confirm Repository Audit, **930/930 tests or higher**, Census, Benchmark 3, and Benchmark Sample;
- merge/promote PR #412 only after that exact synchronized head is green;
- after merge, make only a handoff-status correction on `main` recording the merged main SHA and final synchronized PR head;
- leave 0.9.500 Q0 unstarted.
