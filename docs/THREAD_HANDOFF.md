# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

```text
Product:       0.9.300.7
Package:       0.9.300
Account Save:  5
Game State:    21
Data:          74
Benchmark:     3
Codename:      Radiant Arc Propagation Foundation
Runtime:       Node >=24
Phase:         0.9
0.9.100:       COMPLETE
0.9.200:       COMPLETE — Adventure Vertical Slices
0.9.300:       ACTIVE — Advanced Combat / Training
Packet 1:      COMPLETE — Current Melee Kata Breadth
Packet 2:      COMPLETE — Character Affinity & Kata Substitution Foundation
Packet 3:      COMPLETE — Novice Elemental Resolution Breadth
Packet 4:      COMPLETE — Thunder Cage Control Foundation
Packet 5:      COMPLETE — Tempest Ring Geometry Foundation
Packet 6:      COMPLETE — Umbral Well Field Foundation
Packet 7:      COMPLETE — Radiant Arc Propagation Foundation
Next packet:   UNSELECTED — requires fresh bounded work order
```

## Latest bounded unit — 0.9.300 Packet 7

Permanent record:
- `docs/ADVANCED_COMBAT_0_9_300_P7_RADIANT_ARC_PROPAGATION_FOUNDATION.md`.

Permanent combat design authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Previous packet:
- `docs/ADVANCED_COMBAT_0_9_300_P6_UMBRAL_WELL_FIELD_FOUNDATION.md`.

### Behavioral/data implementation freeze

`65f10a96d4e479b758981f3798efbfc1ddf059ec`

Hosted evidence:
- Check #2106 / run `33569913910`;
- Repository Audit PASS;
- **889/889 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #2236 / run `33569912530` PASS.

Validation-only PR #405 was used only while the direct-main Check scheduler was temporarily pending. Its branch contained the exact implementation parent plus one non-merge CI marker; Check #2107 / run `33570292266` independently passed and PR #405 was closed without merge. The direct-main Check #2106 is the authoritative behavioral freeze.

### Promoted authority checkpoint before this handoff

`91859295df8daac240b665c0361a7746c58539d4`

At this checkpoint:
- Product 0.9.300.7 / Package 0.9.300 / Game State 21 / Data 74 promotion is complete;
- runtime/version guards are synchronized;
- README, execution pipeline, roadmap, system catalog, version roadmap, project profile, combat design, architecture, Phase 0.9 plan, development direction, quality gates, resource lifecycle, changelog, and Packet 7 record are synchronized;
- pre-handoff Check #2123 / run `33571001053` reported exactly one Repository Audit issue: this handoff still carried the previous packet baseline;
- no other current authority surface was stale;
- no subsequent advanced-combat packet has been selected or implemented.

This handoff write is intended to be the final repository-file mutation for Packet 7.

## Packet 7 behavior

Radiant Arc now has honest target-to-target propagation instead of generic single-target adept damage.

Authored target geometry:
```text
kind:            arc
jumpRange:       2
maximumTargets:  3
repeatTargets:   false
ordering:        nearest-then-encounter-order
```

Selection law:
1. the explicitly selected living hostile is recipient 1;
2. each later jump originates from the previous recipient;
3. only living opposing combatants not already visited are eligible;
4. candidate distance is measured through Packet-5 derived encounter formation;
5. candidates beyond two formation units are excluded;
6. nearest distance wins;
7. encounter order then stable ID break ties;
8. propagation stops after three recipients or when no next recipient exists.

This differs mechanically from Tempest Ring: Ring selects around one fixed center; Arc walks from target to target and can reach a later enemy outside the original primary target's own jump radius.

## Radiant Arc authored contract

Stable properties preserved:
- ability ID `ability-radiant-arc`;
- capability ID `spell-radiant-arc`;
- Elemental Form / adept / Light identity;
- enemy primary target;
- six-second interruptible activation;
- 20 MP cost;
- 18-second cooldown;
- MND scaling;
- base damage 16;
- coefficient 1.75.

Added:
- three-second recovery;
- `area` / `propagation` tags;
- structured `arc` target geometry;
- explicit Light magical resolution using magic accuracy, magic defense, and elemental resistance.

`ABILITY_CATALOG_VERSION` advances 10 -> 11.

Executable ability count remains **41**.

## Resolution and attention

The existing generic geometric ability path owns execution. Packet 7 adds no action owner.

Every selected recipient independently resolves:
- magic accuracy;
- magic defense;
- Light resistance;
- hit/miss;
- damage.

There is no jump damage falloff in this foundation. Balance is constrained by the three-recipient cap.

Result/event/action geometry evidence records:
- primary target;
- jump range;
- maximum targets;
- repeat policy;
- ordering law;
- recipient order;
- jump number;
- previous-recipient ID;
- jump distance;
- derived position.

Geometric actions already use explicit per-recipient attention. A missed primary therefore receives no Radiant Arc enmity merely because later propagated recipients land.

## Persistence/version decision

```text
Product       0.9.300.6 -> 0.9.300.7
Package       0.9.300   -> 0.9.300
Account Save  5         -> 5
Game State    21        -> 21
Data          73        -> 74
Benchmark     3         -> 3
```

Game State remains 21 because the complete propagation chain is selected and resolved synchronously inside the finished action. No future jump deadline, cursor, delayed projectile, or other durable fact remains.

Data 74 records the changed canonical Radiant Arc geometry/resolution/recovery contract.

System-version promotions:
- version manifest 0.9.300.7;
- ability catalog 0.10.0;
- combat geometry 0.3.0.

No supported-save migration is added.

## Focused guard

Primary guard:
- `tests/advancedCombatRadiantArcPropagation.test.js`.

It proves:
- catalog version 11 and ability count 41;
- exact stable Radiant Arc contract;
- primary-target-first propagation;
- previous-recipient jump origin;
- nearest-target and deterministic tie ordering;
- no repeated targets;
- three-target cap;
- early stop;
- propagation beyond the original primary radius;
- independent Light resistance;
- result/event/action propagation evidence;
- explicit per-recipient attention;
- missed-primary attention exclusion;
- no `activeBattle.arc` or `activeBattle.propagation` durable state;
- valid current Game State 21 structure.

## Explicitly deferred / still nonexistent

Packet 7 does not make these general systems real:
1. delayed propagation between jumps;
2. damage falloff by jump;
3. repeat-target bouncing;
4. friendly/ally chaining;
5. generic chain/arc authoring beyond the bounded proof;
6. line or cone geometry;
7. trajectory collision;
8. mutable combat coordinates;
9. combat movement / knockback / pull;
10. LOS / line-of-fire / cover;
11. pursuit / search / disengagement;
12. pathfinding;
13. player-selected ground targeting;
14. broader aura/stance/channel/reaction families;
15. weapon resonance / generic imbuement;
16. passive defense/reaction semantics;
17. broad adept or martial catalog migration;
18. new abilities merely to raise the census.

## Next decision boundary

**No Packet 8 is selected.**

If advanced combat continues, the strongest bounded candidate is now a **structured martial-technique migration tranche**.

Strong candidate set:
- Guarded Cut;
- Barkboar Brace;
- Thicket Feint.

A bounded martial tranche should give the selected existing techniques explicit physical delivery/damage/resistance/critical/recovery metadata while preserving their current status/self-buff behavior, IDs, capability requirements, and training ownership. It must not invent movement, reaction, or positioning semantics that the runtime does not yet own.

Reason for preferring this over another spell packet:
- Packets 3–7 now demonstrate direct elemental damage, control, radial targeting, persistent fields, and propagation;
- another adept-spell semantic packet yields less architectural breadth;
- current martial actions still expose pre-B1 effect definitions that can now be migrated through already-proven resolution authority.

Recommended sequence:
```text
bounded martial structured-resolution tranche
        |
        v
explicit 0.9.300 maturity reassessment
        |
        v
likely switch to 0.9.400 Occupational Tool Conversion
```

Occupational Tool Conversion remains the strongest prepared `0.9.400 Economy / Production Depth` candidate and should be preferred after the reassessment unless new evidence identifies a higher-priority combat blocker.

Other separately bounded alternatives remain:
- Rimefall repeated/falling-area semantics;
- Flare Bloom expanding radial semantics;
- Fault Rush only after real movement/engagement authority exists;
- engagement geometry / LOS / pursuit / disengagement as a larger architecture program;
- weapon resonance / imbuement;
- passive defense/reaction semantics;
- Waymeet Inner Marches / outer crossroads world-edge expansion;
- locality enrichment;
- quest/social/companion depth.

Do not combine these automatically.

## Preserved queues

- Occupational Tool Conversion: prepared/queued for 0.9.400; authority `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.
- World edge: Waymeet Inner Marches / outer crossroads first, then Coppergrass extensions, then Drowned Vaults.
- Locality enrichment: ambient/risk events, wandering/seasonal merchants, directions/help dialogue, richer contextual dialogue, shop browsing/category depth, learned-locality presentation.
- Ecology: the five-part flora/fauna repair sequence remains complete; do not restart without fresh selection.

## Standing governance rules

Preserve:
- one canonical fictional world clock;
- one owner per state family;
- active battle remains encounter authority;
- ability definitions own authored target/effect contracts;
- ability engine owns activation/cost/cooldown/recovery/effect sequencing;
- combat geometry owns spatial projection/query, not mutable movement state;
- combat field engine owns durable battle-local fields only;
- combat resolution owns hit/damage/defense/resistance formulas;
- combat attention owns Enmity/Focus/Aggro/Fixation;
- combat turns own readiness/action history;
- no cosmetic action-name semantics presented as implemented mechanics;
- current-schema-only pre-alpha persistence;
- Data and Game State advance independently;
- no hard benchmark timing thresholds;
- no census filler;
- freeze implementation before Product/Data promotion;
- `docs/THREAD_HANDOFF.md` is the final repository-file write for a closed packet.

## Restart order after Packet 7

1. `AGENTS.md`
2. this handoff
3. `PROJECT_PROFILE.yaml`
4. `docs/EXECUTION_PIPELINE.md`
5. `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`
6. `docs/ADVANCED_COMBAT_0_9_300_P7_RADIANT_ARC_PROPAGATION_FOUNDATION.md`
7. `docs/COMBAT_ADJACENCY_AND_DEBT_AUDIT.md`
8. `docs/ROADMAP.md`
9. inspect the selected bounded domain only
10. select exactly one next packet before implementation

Do not redo the closed broad combat-adjacency audit unless repository evidence materially diverges.

## Final validation contract

This handoff is the intended final repository-file mutation for 0.9.300 Packet 7.

After this write:
- perform **no repository-file mutations** unless exact-head validation exposes a real failure;
- validate the exact resulting `main` SHA with hosted Check;
- confirm Repository Audit, **889/889 tests**, Census, Benchmark 3, and Benchmark Sample;
- confirm Pages succeeds on the same exact SHA;
- confirm `main` remains on that exact SHA after validation.

If exact-head validation exposes a stale assertion or synchronization defect, repair it, then rewrite this handoff last again before the final validation pass.