# 0.9.400 A6 — Shared Workshop Tool Authority Audit

Status: **COMPLETE / IMPLEMENTATION FREEZE VALIDATED.**

This checkpoint closes the current `0.9.400 Economy / Production Depth` track by resolving the remaining workshop-tool authority question without manufacturing unsupported tool content.

## Version decision

```text
Product       0.9.400.6 -> 0.9.400.7
Package       0.9.400   -> 0.9.400
Account Save  5         -> 5
Game State    21        -> 21
Data          80        -> 80
Benchmark     3         -> 3
Codename      Workshop Tool Authority Audit
```

Data remains 80 because A6 adds no authored item, recipe, pack, NPC, quest, ability, geography, ecology, or other canonical gameplay record.

Game State remains 21 because A6 adds no new durable gameplay fact.

Product advances because runtime validation now owns an explicit production requirement authority and rejects unsupported station/tool requirements before they become live content.

## Audit result

The current production graph already distinguishes:
- **workstation capability** through `requiredStationTags`;
- **portable physical tools** through `requiredToolTags` plus existing equipment/inventory binding;
- **explicit contextual capability** through the existing production tool-binding seam.

Across all current production catalogs, the live portable-tool requirement set is only:

```text
cutting
woodcutting
```

Canonical providers are:

```text
cutting     -> Field Knife, Reed Sickle
woodcutting -> Woodsman Hatchet
```

The active workstation vocabulary is:

```text
forge
kitchen
woodshop
tannery
workshop
```

The remaining conceptual Packet-A workshop-tool list—smithing hammers/tongs/files, woodworking saws/planes/chisels, masonry tools, textile tools, leatherworking awls/needles, cooking implements, and measurement tools—has no existing stable equipment identities and no current recipe requirements that need those tags.

Therefore those items are **not justified as immediate portable-equipment content**.

## Authority hardening

A6 adds `js/text/data/productionRequirementAuthority.js` as the shared authority for:
- recognized production workstation tags;
- explicitly declared contextual production-tool tags;
- canonical portable-tool capability providers;
- validation of production station/tool requirements.

`workstationEngine` now consumes the centralized workstation vocabulary instead of owning a separate copy.

`validateProductionCatalog()` now rejects:
- unknown workstation tags;
- required portable/contextual tool tags that have no canonical provider or explicit contextual authority.

Examples intentionally rejected by the A6 regression:
- `smithing-hammer` as an undeclared tool requirement;
- `loom` as an unrecognized workstation tag.

This prevents future content from adding decorative friction or unsupported workshop vocabulary without first extending the correct authority.

## Why no hammer/saw/awl catalog was authored

A portable tool should exist only when it changes player decisions in a way that workstation context does not already express.

Current forge, woodshop, tannery, kitchen, and workshop requirements already represent integrated workshop fixtures and work context. Adding a carried hammer to every forge recipe, or a saw to every woodshop recipe, would currently:
- duplicate station authority;
- add inventory friction without a new decision;
- create new stable IDs only to satisfy a conceptual checklist;
- imply future durability/repair/quality questions without a demonstrated need.

A future action may justify a portable workshop tool when it must occur:
- away from a fully equipped station;
- across multiple station types;
- as a field repair or preparation action;
- as a meaningful loadout/inventory choice;
- with a mechanically distinct capability that the workstation does not already provide.

Until then, the workshop itself owns ordinary fixed implements.

## Validation evidence

Behavioral implementation freeze:

```text
4583b405e85dd91266c05c30b9ae3cfb05a00f14
```

Hosted Check:

```text
Check #2297
Run   33677766982
Repository Audit       PASS
Tests                  930 / 930 PASS
Content Census         PASS
Benchmark 3            PASS
Benchmark Sample       PASS
```

Validated census remains:

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

## 0.9.400 closure decision

`0.9.400 Economy / Production Depth` is **COMPLETE for the current Phase 0.9 target** after A0-A6.

The track now proves:
- singular canonical item authority across equipment, production, shops, inventory, and persistence;
- production output into existing equipment stable IDs;
- physical portable-tool binding and active-work protection;
- complete production conversion for the selected existing field-tool, bronze starter, caster/offhand, and basic leather-garment tranches;
- reusable material-foundation integration;
- coherent Pack-v2 ownership for those conversions;
- explicit station/tool requirement authority validation;
- no need for a new durable production/tool state family.

Remaining workshop-tool concepts are deferred depth, not blockers.

## Next bounded candidate

**0.9.500 Q0 — Quest / Social Authority & Vertical Slice Selection — CANDIDATE / NOT STARTED.**

Why this supersedes more 0.9.400 breadth:
- recipes/processes are 254 against a mechanics floor of 75;
- canonical items are 410 against a mechanics floor of 200;
- shop/service and transport floors are already cleared;
- quests/contracts remain 20/30;
- companions remain 2/4;
- named NPCs remain 48/50;
- the project north star emphasizes persistent relationships, commitments, companions, and social continuity.

Q0 should audit before authoring:
1. current commitment/relationship/companion/NPC-schedule/local-knowledge authorities;
2. whether current quest definitions can support branching, prerequisite, consequence, and follow-up needs without duplicate state;
3. companion recruitment and relationship gating;
4. dialogue/presentation boundaries versus durable social state;
5. the smallest two-or-more-NPC vertical slice that creates real recurring social consequence;
6. whether any missing system must land before authored quest/social breadth;
7. which mechanics-floor gaps can be closed through coherent slices rather than filler.

Do not automatically author ten quests, two companions, or two NPCs merely to satisfy the census.

## Deferred after A6

Do not reopen automatically:
- ordinary portable workshop-tool catalogs;
- tool durability/quality/repair;
- workstation-owned inventories;
- worker automation;
- Traveler Gloves / Traveler Boots conversion;
- Material Culture Packets B-F;
- managed husbandry without source authority;
- advanced-combat depth explicitly deferred by the 0.9.300 maturity reassessment.
