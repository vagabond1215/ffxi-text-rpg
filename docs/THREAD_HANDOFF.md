# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

Product: 0.9.300.5
Package: 0.9.300
Account Save: 5
Game State: 20
Data: 72
Benchmark: 3
Codename: Tempest Ring Geometry Foundation
Runtime: Node >=24
Phase: 0.9
0.9.100: COMPLETE
0.9.200: COMPLETE — Adventure Vertical Slices
0.9.300: ACTIVE — Advanced Combat / Training
Packet 1: COMPLETE — Current Melee Kata Breadth
Packet 2: COMPLETE — Character Affinity & Kata Substitution Foundation
Packet 3: COMPLETE — Novice Elemental Resolution Breadth
Packet 4: COMPLETE — Thunder Cage Control Foundation
Packet 5: COMPLETE — Tempest Ring Geometry Foundation
Next packet: UNSELECTED — requires fresh bounded work order

## Latest bounded unit — 0.9.300 Packet 5

Permanent record:
- docs/ADVANCED_COMBAT_0_9_300_P5_TEMPEST_RING_GEOMETRY_FOUNDATION.md

Permanent combat design authority:
- docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md

Previous packet:
- docs/ADVANCED_COMBAT_0_9_300_P4_THUNDER_CAGE_CONTROL_FOUNDATION.md

Adjacent/stale combat audit:
- docs/COMBAT_ADJACENCY_AND_DEBT_AUDIT.md

### Behavioral/data implementation freeze

29d6da27e48850aa96307553b4c124f2598c8caa

Hosted evidence:
- Check #2034 / run 33544018110
- Repository Audit PASS
- 879/879 tests
- Content Census PASS
- Benchmark 3 PASS
- Benchmark Sample PASS
- Pages #2164 / run 33544018073 PASS

This freeze intentionally predates Product/Data promotion and authority synchronization.

### Promoted authority checkpoint before this handoff

13bec5c847f5b0fe2d1ef5cb1b7b663ef017b5ca

At this checkpoint:
- Product 0.9.300.5 / Package 0.9.300 / Game State 20 / Data 72 promotion is complete.
- Runtime/system-version guards are synchronized.
- README, execution pipeline, roadmap, system catalog, version roadmap, project profile, combat design, architecture, Phase 0.9 plan, development direction, quality gates, resource lifecycle, changelog, and Packet 5 record are synchronized.
- Packet 5 is complete.
- No subsequent advanced-combat packet has been selected or implemented.

This handoff write is intended to be the final repository-file mutation for Packet 5.

## Why Packet 5 was selected

Packet 4 closed the Thunder Cage control gap and left Tempest Ring as the strongest next semantic mismatch.

The permanent naming law says Ring / Nova / Bloom / Burst imply radial or expanding behavior and explicitly states that a Ring should have radial behavior.

The runtime had no target-distance contract. Treating Tempest Ring as an alias for all enemies would therefore still have been cosmetic AoE rather than real radial behavior.

Packet 5 introduces the smallest honest geometry substrate capable of expressing Tempest Ring:
- deterministic encounter-relative formation projection;
- target-centered radial selection;
- bounded maximum targets;
- independent per-recipient resolution;
- per-recipient hostile attention.

It deliberately does not add combat movement, LOS, pursuit, disengagement, ground targeting, zones, or a tactical grid.

## Geometry authority

js/text/systems/combatGeometryEngine.js is the canonical bounded geometry projection/query authority.

COMBAT_GEOMETRY_VERSION = 1.
Currently supported geometry kind: ring.

It owns:
- deterministic encounter-relative formation projection;
- ring-distance calculation;
- candidate filtering;
- deterministic recipient ordering/capping;
- structured geometry evidence.

It does not own:
- mutable combat position;
- movement;
- pathfinding;
- LOS/reachability;
- pursuit/search/disengagement;
- zones;
- ground locations.

### Derived formation, not durable position

Packet 5 does not persist combat positions.

Current formation is derived from facts that already persist:
- combatant side;
- combatant array order.

Representative ally slots begin at:
- player/ally 0: x 0, y 0
- ally 1: x -1, y 1
- ally 2: x -1, y -1
- ally 3: x -2, y 0

Representative enemy slots begin at:
- enemy 0: x 3, y 0
- enemy 1: x 4, y 1
- enemy 2: x 4, y -1
- enemy 3: x 5, y 0
- enemy 4: x 3, y 2
- enemy 5: x 5, y 2

Additional slots are deterministically projected as needed.

This is intentionally provisional and non-mutable. It gives the current encounter enough spatial relationship to distinguish inside a ring from outside a ring without pretending the game has tactical movement.

If a future packet introduces movement, knockback, repositioning, LOS, pursuit, or player-controlled positioning, it must make a fresh state-ownership and Game State decision.

## Tempest Ring authored contract

Tempest Ring preserves:
- ability ID ability-tempest-ring;
- capability ID spell-tempest-ring;
- Elemental Form school;
- adept / wind identity;
- enemy primary target;
- 6-second interruptible activation;
- 20 MP cost;
- 18-second cooldown;
- INT scaling;
- base damage 16;
- coefficient 1.75.

It gains:
- recoverySeconds 3;
- target geometry kind ring;
- center target;
- radius 2;
- maximumTargets 4;
- explicit magical spell delivery;
- wind element / ability source;
- magic accuracy;
- magic-defense resistance;
- non-critical default.

ABILITY_CATALOG_VERSION advances 8 -> 9.

Executable ability count remains 41.

## Ring selection semantics

For an authored target-centered ring:

1. The explicitly selected enemy is the center.
2. Only living opposing-side combatants are eligible.
3. Euclidean distance is measured from the derived center position.
4. Candidates beyond the authored radius are excluded.
5. The primary target is ordered first.
6. Remaining candidates are ordered by distance, then stable encounter order.
7. Selection stops at maximumTargets.

For Tempest Ring, radius is 2 formation units and maximumTargets is 4.

The ring does not hit allies.

Geometry evidence includes:
- geometry version/kind;
- center kind;
- center combatant ID;
- derived center position;
- radius;
- maximum targets;
- selected recipient IDs;
- each recipient distance;
- each recipient derived position.

## Ability execution integration

abilityEngine.js remains ability activation/effect sequencing authority.

Packet 5 adds one bounded target-expansion step:

authored ability geometry
-> combatGeometryEngine selects recipients
-> existing target effect is applied independently per selected recipient
-> combatResolutionEngine resolves each recipient independently

Only target-recipient effects are expanded.

Every Tempest Ring recipient independently receives:
- a magic-accuracy roll;
- magic-defense calculation;
- wind-resistance calculation;
- damage;
- hit/miss outcome;
- structured resolution evidence.

One target's resistance does not alter another target's result.

The original selected enemy remains the combat action primary targetId. Full geometric recipients are explicit in:
- ActionResult data.geometry;
- ability.resolved semantic-event geometry;
- combat action data.geometry;
- each effect recipientId.

No second combat action record per target is created.

## Multi-recipient hostile attention

Before Packet 5, B2 attention assumed one action's aggregate enmity belonged to its primary enemy target.

combatAttentionEngine.js now preserves the existing single-recipient path and adds a bounded multi-recipient path when one action contains applied effects on more than one distinct enemy.

For a multi-recipient action:
- each enemy enmity is derived from effects actually applied to that enemy;
- secondary Tempest Ring targets actually struck gain hostility toward the caster;
- each target enmity reflects its own resolved damage/effects;
- enemies outside geometry/cap receive no Tempest Ring damage enmity.

No new attention store or target-selection owner is introduced.

## Focused Packet 5 guard

Primary guard:
- tests/advancedCombatTempestRingGeometry.test.js

It proves:
- ABILITY_CATALOG_VERSION equals 9;
- ability count remains 41;
- Tempest Ring stable identity/cost/timing/potency/scaling;
- exact ring geometry contract;
- deterministic player/enemy formation coordinates;
- radius inclusion/exclusion;
- authored four-target cap;
- independent magic resolution for every selected enemy;
- target-specific wind resistance and damage;
- structured geometry evidence;
- per-recipient hostile attention;
- excluded enemies receive no Tempest Ring attention;
- no activeBattle.geometry field exists;
- valid current-schema cloned battle state reproduces identical geometry.

Packet 3 and Packet 4 focused guards were changed only to recognize that Tempest Ring is now deliberately selected and that the ability catalog version advanced to 9.

## Hosted validation history

### First full focused run

Check #2033 / run 33543929815:
- Repository Audit PASS
- 878/879 tests
- one focused Packet 5 proof failed

The failure was a test-fixture coherence defect, not runtime geometry.

The manually constructed six-enemy battle used combatSequence 0 and a noncanonical battle ID. Current-schema validation correctly requires a positive combat sequence and matching battle-000001 identity for a persisted active battle.

The fixture alone was repaired:
- state.combatSequence = 1
- battle ID = battle-000001

No production geometry, target expansion, resolution, attention, or persistence code changed for this repair.

### Behavioral/data implementation freeze

29d6da27e48850aa96307553b4c124f2598c8caa

Check #2034 / run 33544018110:
- Repository Audit PASS
- 879/879 tests
- Content Census PASS
- Benchmark 3 PASS
- Benchmark Sample PASS

Pages #2164 / run 33544018073: PASS.

## Version decisions

Product 0.9.300.4 -> 0.9.300.5
Package 0.9.300 -> 0.9.300
Account Save 5 -> 5
Game State 20 -> 20
Data 71 -> 72
Benchmark 3 -> 3

System versions:
- ability catalog: 0.7.0 -> 0.8.0;
- ability engine: 0.5.0 -> 0.6.0;
- combat geometry: new -> 0.1.0;
- combat attention: 0.1.0 -> 0.2.0.

### Why Game State remains 20

There is no mutable or required persisted geometry field.

The existing active battle already persists combatant identity/type/side and array order. Packet 5 derives formation from side/order, and current-schema cloning reproduces the same positions and ring recipients.

No supported-save migration is added.

A later mutable positioning model must revisit this decision.

### Why Data advances to 72

The canonical Tempest Ring definition gains:
- target geometry;
- wind resolution metadata;
- explicit recovery metadata.

No new ability/capability/content record is added.

## Existing authorities preserved

- abilities.js owns authored ability/effect/target contracts.
- capabilities.js owns learning/use requirements.
- abilityEngine.js owns activation, costs, cooldown, recovery, and effect sequencing.
- combatGeometryEngine.js owns derived encounter geometry projection/query.
- combatResolutionEngine.js owns hit/damage/defense/element formulas.
- combatAttentionEngine.js owns hostile attention and consumes per-recipient effect evidence.
- combatTurnEngine.js owns readiness/action history.
- statusEngine.js owns generic status/hard-disable interpretation.
- combatLoadoutEngine.js owns equipment-transition legality.
- active battle remains encounter authority.
- canonical fictional world time remains the only simulation/combat clock.

No new direct timed-task owner was introduced.

## Explicitly deferred / still nonexistent

Packet 5 does not make the following real:
1. mutable combat coordinates;
2. player-controlled combat movement;
3. knockback/pull/reposition actions;
4. weapon minimum/maximum range;
5. LOS / line-of-fire / cover;
6. reachability / pursuit / search / disengagement;
7. line geometry;
8. cone geometry;
9. arc geometry;
10. chain propagation;
11. ground/location targeting;
12. generic radius/zone targeting outside selected authored contracts;
13. Umbral Well persistent field behavior;
14. aura/stance/channel/reaction action families;
15. broad adept Elemental Form migration;
16. broad martial/Veilscript migration;
17. new abilities or mechanics-census filler.

Do not infer those systems from Tempest Ring's derived ring selection.

## Stale/noncanonical combat surfaces remain non-authoritative

Do not build future advanced combat on:
- battle.targetId;
- battle.actionDelay;
- battle.recasts;
- battle.casting;
- root js/ui.js timer combat;
- root js/encounter.js;
- root data/weaponskills.js;
- legacy FFXI job/ability/affinity terminology.

Exploration spawn detection aggroEngine remains separate from active-battle Enmity/Aggro.

## Next advanced-combat decision boundary

No Packet 6 is selected.

The strongest semantic continuation if advanced combat remains the priority is Umbral Well Field Foundation.

Reason:
- Well is still mechanically dishonest as generic single-target damage;
- the permanent naming law says a Well should linger;
- Packet 5 proves radial selection, but a persistent field is a distinct action family and must not be smuggled into ring geometry.

A bounded Umbral Well packet would first need explicit decisions for:
- field owner and state location;
- center/recipient semantics;
- lifetime;
- pulse/continuous behavior;
- world-time reconciliation;
- stacking/replacement;
- source defeat/disable behavior;
- save/load persistence;
- Game State version impact.

It is not selected or implemented by Packet 5.

Other separately bounded candidates:
- one coherent martial-technique resolution migration tranche;
- engagement geometry / LOS / pursuit / disengagement;
- weapon resonance / imbuement;
- passive defense/reaction semantics;
- another geometry family only when a canonical ability genuinely requires it.

Do not combine these automatically.

The 41/100 ability count remains progression evidence, not permission to add duplicates.

## Preserved interrupted/resumable queues

Packet 5 does not cancel earlier queues:
- Occupational Tool Conversion remains the strongest prepared 0.9.400 Economy / Production Depth candidate. Authority: docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md.
- World edge remains paused/resumable: Waymeet Inner Marches / outer crossroads first, then Coppergrass extensions, then Drowned Vaults.
- Locality enrichment remains deferred/resumable: ambient/risk events, wandering/seasonal merchants, directions/help dialogue, richer contextual dialogue, shop category/browse depth, learned-locality graphical presentation.
- Ecology five-part flora/fauna diversity repair sequence remains COMPLETE.

## Standing governance rules

Preserve:
- one canonical fictional world clock;
- one domain authority per state family;
- character-owned progression survives discipline switching;
- active battle owns encounter state;
- ability definitions own authored target/effect contracts;
- ability engine owns activation/cost/cooldown/recovery/effect sequencing;
- combat geometry owns derived spatial projection/query only;
- derived formation must not be mistaken for mutable combat movement;
- combat resolution owns hit/damage/resistance formulas;
- combat attention owns Enmity/Focus/Aggro/Fixation and consumes action evidence;
- combat turns own readiness/action history;
- status engine owns generic status/hard-disable interpretation;
- no cosmetic action-name semantics presented as implemented mechanics;
- current-schema-only pre-alpha persistence;
- Data and Game State advance independently;
- no hard benchmark timing thresholds;
- no census filler;
- exact behavioral/data freeze before promotion/synchronization;
- docs/THREAD_HANDOFF.md is the final repository-file write for a closed packet.

## Restart order after Packet 5

1. AGENTS.md
2. this handoff
3. PROJECT_PROFILE.yaml
4. docs/EXECUTION_PIPELINE.md
5. docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md
6. docs/ADVANCED_COMBAT_0_9_300_P5_TEMPEST_RING_GEOMETRY_FOUNDATION.md
7. docs/COMBAT_ADJACENCY_AND_DEBT_AUDIT.md
8. docs/ROADMAP.md
9. inspect current runtime only for the freshly selected bounded domain
10. select exactly one next advanced-combat packet before implementation

Do not redo the closed broad combat-adjacency audit unless repository evidence materially diverges.

## Final validation contract

This handoff is the intended final repository-file mutation for 0.9.300 Packet 5.

After this write:
- perform no repository-file mutations unless exact-head validation exposes a real failure;
- validate the exact resulting main SHA with hosted Check;
- confirm Repository Audit, 879/879 tests, Census, Benchmark 3, and Benchmark Sample;
- confirm Pages succeeds on the same exact SHA;
- confirm main remains on that exact SHA after validation.

If exact-head validation exposes a stale assertion or synchronization defect, repair it, then rewrite this handoff last again before the final validation pass.
