# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

```text
Product:       0.9.300.6
Package:       0.9.300
Account Save:  5
Game State:    21
Data:          73
Benchmark:     3
Codename:      Umbral Well Field Foundation
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
Next packet:   UNSELECTED — requires fresh bounded work order
```

## Latest bounded unit — 0.9.300 Packet 6

Permanent record:
- `docs/ADVANCED_COMBAT_0_9_300_P6_UMBRAL_WELL_FIELD_FOUNDATION.md`.

Permanent combat design authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Previous packet:
- `docs/ADVANCED_COMBAT_0_9_300_P5_TEMPEST_RING_GEOMETRY_FOUNDATION.md`.

Adjacent/stale combat audit:
- `docs/COMBAT_ADJACENCY_AND_DEBT_AUDIT.md`.

### Behavioral/data implementation freeze

`6e4ab807c943fc94f398b86b33dba6637f215ad3`

Hosted evidence:
- Check #2069 / run `33554921560`;
- Repository Audit PASS;
- **884/884 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #2199 / run `33554920945` PASS.

This freeze intentionally predates Product/Game-State/Data promotion and authority synchronization.

### Promoted authority/checkpoint before this final handoff

`3c4f2b703acbaa72091ac2375ff1ad9bd3973d71`

At this checkpoint:
- Product 0.9.300.6 / Package 0.9.300 / Game State 21 / Data 73 promotion is complete;
- the five literal current-schema Game State guards exposed by the first exact-head post-promotion run are synchronized to 21;
- runtime/system-version guards are synchronized;
- README, execution pipeline, roadmap, system catalog, version roadmap, project profile, combat design, architecture, Phase 0.9 plan, development direction, quality gates, resource lifecycle, changelog, and Packet 6 record are synchronized;
- Packet 6 is complete;
- no subsequent advanced-combat packet has been selected or implemented.

This handoff write is intended to be the final repository-file mutation for Packet 6.

## Why Packet 6 was selected

Packet 5 made Tempest Ring mechanically honest and left Umbral Well as the strongest remaining adept name/behavior mismatch.

The permanent naming law says:
- Ring should have radial behavior;
- Well / Field / Mire / Pyre should represent persistent area behavior.

A Well that resolves only as one instantaneous single-target damage event violates that vocabulary.

Packet 6 therefore introduces one bounded persistent-field family and proves it only with Umbral Well.

## Durable field authority

New canonical owner:
- `js/text/systems/combatFieldEngine.js`.

```text
COMBAT_FIELD_STATE_VERSION = 1
COMBAT_FIELD_INTERRUPT_PRIORITY = 910
ACTIVE_BATTLE_PERSISTENCE_VERSION = 5
```

Every active battle now owns required:

```text
activeBattle.fields:
  version
  sequence
  records[]
```

Each field record persists:
- stable field ID;
- source actor ID;
- source ability ID;
- center-target provenance;
- center point snapshot;
- creation world second;
- expiration world second;
- pulse cadence;
- next pulse world second;
- pulse sequence;
- radius;
- maximum targets;
- source scaling stat/value snapshot;
- source magic-accuracy snapshot;
- source magic-attack snapshot.

This is required Game State, not a derived cache.

## Why Game State advances to 21

Packet 5 geometry did not require a Game State bump because current formation can be deterministically projected from already-persisted combatant side/order.

Packet 6 is different.

After Umbral Well's cast completes, the game must remember facts that affect future outcomes:
- where the Well remains centered;
- when its next pulse is due;
- how many pulses have occurred;
- when it expires;
- which source offense values were frozen at creation.

Those facts cannot be reconstructed safely from completed ability/action prose or the current source loadout.

Therefore:

```text
Game State 20 -> 21
```

No supported-save migration is added under the current pre-alpha current-schema-only policy.

## Umbral Well authored contract

Stable identity preserved:
- ability ID `ability-umbral-well`;
- capability ID `spell-umbral-well`;
- Elemental Form;
- adept / Dark identity;
- enemy primary target;
- 6-second interruptible activation;
- 20 MP cost;
- 18-second cooldown;
- INT scaling;
- direct base 16;
- direct coefficient 1.75.

It now has:
- 3-second post-action recovery;
- explicit Dark magical direct impact;
- one persistent field effect.

Field tuning:

```text
duration:         12 seconds
pulse cadence:     4 seconds
scheduled pulses:  3
pulse times:       +4 / +8 / +12
radius:             2 formation units
maximum targets:    4

pulse damage:
  stat:            INT snapshot
  base:            4
  coefficient:     0.45
  element:         dark
  accuracy:        magic
  resistance:      magicDefense
  critical:        false
```

`ABILITY_CATALOG_VERSION` advances:

```text
9 -> 10
```

Executable ability count remains **41**.

## Source snapshot / defender-live law

Umbral Well uses:

**cast-time source snapshot / pulse-time defender evaluation**

At field creation, persist:
- source INT value;
- source magic accuracy;
- source magic attack.

Later source equipment/profile changes do not alter that Well.

At every pulse, read each current defender's:
- current magic evasion;
- current magic defense;
- current Dark resistance.

Thus:
- the caster cannot strengthen an existing Well by swapping to a stronger source loadout after creation;
- a defender can become more or less resistant before a later pulse;
- a source hard-disable does not itself erase the field;
- battle end does erase battle-local fields.

## Field geometry

Packet 6 extends `combatGeometryEngine` with a point-radius query.

A field:
- persists a center point copied from the selected target's derived position at cast completion;
- does not follow the original target;
- selects current living opposing combatants whose Packet-5 derived formation positions lie within radius;
- sorts recipients by distance then stable encounter order;
- caps at the authored maximum.

This is not player ground targeting.

Packet 6 still does not implement:
- mutable combatant coordinates;
- combat movement;
- knockback/pull;
- LOS/line-of-fire;
- reachability;
- pursuit/search/disengagement;
- moving zones;
- friendly fields;
- general-purpose zone scripting.

## Pulse scheduling

No timed-task record owns a field.

The durable `activeBattle.fields` record is the field owner.

`combatFieldEngine.provideCombatFieldInterrupts` emits a `combat.field-pulse` candidate at `nextPulseAtWorldSeconds`.

Priority:

```text
field pulse:              910
ordinary combat readiness: 900
```

Therefore a due field consequence resolves before an ordinary enemy ready action at the same fictional second.

Canonical world time remains the only combat/simulation clock.

After a pulse:
- `pulseSequence` increments;
- `nextPulseAtWorldSeconds` advances by 4 seconds;
- after the +12 pulse, the field is removed because no scheduled pulse remains inside the lifetime.

## Field pulse action evidence

Each field pulse produces one ordinary combat action:

```text
kind:      fieldPulse
sourceId:  ability-umbral-well
targetId:  original center-target provenance
```

Action data includes:
- field ID;
- pulse sequence;
- scheduled/resolved world seconds;
- ended flag;
- point-radius geometry evidence;
- explicit per-recipient attention mode;
- one effect result per selected recipient.

Each recipient independently resolves:
- magic accuracy;
- magic defense;
- Dark resistance;
- damage;
- hit/miss outcome.

One target's resistance never alters another target's result.

## Per-recipient attention correction

Packet 5 correctly distributed area-action enmity when multiple recipients had applied effects, but one edge case remained: if only one secondary target landed while the primary center missed, inferring area semantics from recipient count would fall back to the primary target.

Packet 6 adds explicit:

```text
attention.mode = per-recipient
```

for area actions.

When this mode is present:
- only enemies with applied effects receive attention;
- each amount derives from that recipient's own applied effects;
- zero applied recipients means zero attention;
- no fallback assigns area enmity to the center/primary target.

Tempest Ring now emits the same explicit mode.

Ordinary single-target actions retain their legacy attention path.

## Persistence validation

`activeBattlePersistence` now validates required field state.

Invalid current saves are rejected for:
- missing/malformed field state;
- duplicate or malformed field IDs;
- unknown source/center combatant references;
- invalid center point;
- unknown/non-field source ability;
- invalid creation/expiry/pulse timing;
- invalid radius/cap;
- missing/non-finite source snapshot;
- durable cadence/lifetime/geometry/scaling values disagreeing with the authored ability.

Real current save/load was tested with an active Umbral Well and preserves:
- the same field record;
- next pulse deadline;
- center;
- pulse progress;
- source snapshot.

## Battle-end behavior

`finalizeCombatState` reconciles fields.

If battle phase is no longer active:
- all outstanding field records are removed;
- no future field interrupt candidate exists;
- no task/timer survives the encounter.

Umbral Well is battle-local, not a persistent world-place hazard.

## Hosted validation history

### Check #2066 / run 33554554852

Result:
- Repository Audit PASS;
- **878/884 tests**.

Six failures:
1. Packet-5 exact effect-shape proof saw an unnecessary `field: undefined`;
2. Packet-4 exact effect-shape proof saw the same shape churn;
3–6. Packet-6 runtime fixtures trained `elementalMagic` while canonical Umbral Well requires `darkMagic >= 3`.

Repairs:
- field key is now materialized only on real field effects;
- Packet-6 fixtures use Dark Magic rank 3.

No field architecture changed.

### Check #2068 / run 33554792449

Result:
- Repository Audit PASS;
- **883/884 tests**.

The only failure was test-only:
- `structuredClone` cannot clone the fixture's injected RNG function.

Repair:
- clear the non-persisted RNG before corruption-fixture cloning.

No production runtime behavior changed.

### Behavioral/data implementation freeze

`6e4ab807c943fc94f398b86b33dba6637f215ad3`

Check #2069 / run `33554921560`:
- Repository Audit PASS;
- **884/884 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS.

Pages #2199 / run `33554920945`: PASS.

## Version decisions

```text
Product       0.9.300.5 -> 0.9.300.6
Package       0.9.300   -> 0.9.300
Account Save  5         -> 5
Game State    20        -> 21
Data          72        -> 73
Benchmark     3         -> 3
```

System versions:
- version manifest `0.9.300.6`;
- active-battle persistence `0.6.0`;
- ability catalog `0.9.0`;
- ability engine `0.7.0`;
- battle engine `0.14.0`;
- combat turns `0.7.0`;
- combat simulation `0.3.0`;
- combat geometry `0.2.0`;
- combat fields `0.1.0`;
- combat attention `0.3.0`.

### Why Data advances to 73

The canonical Umbral Well definition changes:
- direct impact resolution;
- recovery;
- field effect;
- field lifetime/cadence/geometry;
- pulse damage/resolution.

No new ability/capability/content record is added.

## Direct timed-task ownership remains unchanged

Current direct timed-task owners remain:
- ability engine;
- campaign recovery;
- combat loadout;
- projects;
- resource opportunities;
- transport;
- work.

The Umbral Well cast uses the normal ability activation task. That task is released when the cast resolves.

The later field is not owned by that task.

`activeBattle.fields` plus canonical world time own its remaining lifecycle.

## Existing combat authorities preserved

- `abilities.js` owns authored ability/effect/field contracts.
- `capabilities.js` owns learning/use requirements.
- `abilityEngine.js` owns cast activation/cost/cooldown/recovery and creates the field.
- `combatFieldEngine.js` owns persistent field state and pulse lifecycle.
- `combatGeometryEngine.js` owns derived combatant formation and spatial queries.
- `combatResolutionEngine.js` owns hit/damage/defense/element formulas.
- `combatAttentionEngine.js` owns Enmity/Focus/Aggro/Fixation and consumes per-recipient pulse evidence.
- `combatTurnEngine.js` owns readiness/action history/final combat reconciliation.
- `combatSimulationEngine.js` consumes combat interrupt candidates against canonical world time.
- active battle remains encounter authority.
- canonical fictional world time remains the only combat/simulation clock.

## Explicitly deferred / still nonexistent

Packet 6 does not make the following general systems real:
1. player-selected ground targets;
2. arbitrary persistent zones;
3. moving fields;
4. friendly fields;
5. source-following auras;
6. field dispel/counterplay;
7. field stacking breadth beyond the bounded authored Well;
8. mutable combat coordinates;
9. player combat movement;
10. knockback/pull/reposition;
11. weapon minimum/maximum range;
12. LOS / line-of-fire / cover;
13. pursuit/search/disengagement;
14. line geometry;
15. cone geometry;
16. chain/propagation geometry;
17. generalized arc geometry;
18. aura/stance/channel/reaction families;
19. broad adept Elemental Form migration;
20. new abilities or mechanics-census filler.

Do not infer those systems from one persistent Well.

## Stale/noncanonical combat surfaces remain non-authoritative

Do not build future advanced combat on:
- `battle.targetId`;
- `battle.actionDelay`;
- `battle.recasts`;
- `battle.casting`;
- root `js/ui.js` timer combat;
- root `js/encounter.js`;
- root `data/weaponskills.js`;
- legacy FFXI job/ability/affinity terminology.

Exploration spawn detection `aggroEngine` remains separate from active-battle Enmity/Aggro.

## Next advanced-combat decision boundary

**No Packet 7 is selected.**

If advanced combat remains the immediate priority, the strongest semantic candidate is:

### Radiant Arc Propagation Foundation

Reason:
- `Arc / Chain / Fork` still belongs to the naming family for arcing/propagating attacks;
- Radiant Arc remains a generic single-target placeholder;
- Packet 5's radial query and Packet 6's persistent field do not themselves define propagation.

A bounded Radiant Arc packet would first need an explicit decision for:
- what an arc means mechanically: target-to-target propagation versus merely curved delivery;
- recipient ordering;
- propagation range;
- maximum jumps;
- repeated-target exclusion;
- damage falloff or constant potency;
- per-jump accuracy/resistance;
- attention evidence;
- whether any durable state is needed.

It is not selected or implemented by Packet 6.

Other separately bounded candidates:
- Rimefall falling/repeated-area semantics;
- Flare Bloom radial/expanding semantics;
- Fault Rush movement/impact semantics;
- one coherent martial-technique migration tranche;
- engagement geometry / LOS / pursuit / disengagement;
- weapon resonance / imbuement;
- passive defense/reaction semantics.

Do not combine these automatically.

The 41/100 ability count remains progression evidence, not permission to add duplicates.

## Preserved interrupted/resumable queues

Packet 6 does not cancel earlier queues:
- **Occupational Tool Conversion:** strongest prepared `0.9.400 Economy / Production Depth` candidate. Authority: `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.
- **World edge:** Waymeet Inner Marches / outer crossroads first, then Coppergrass extensions, then Drowned Vaults.
- **Locality enrichment:** ambient/risk events, wandering/seasonal merchants, directions/help dialogue, richer contextual dialogue, shop category/browse depth, learned-locality graphical presentation.
- **Ecology:** five-part flora/fauna diversity repair sequence remains COMPLETE.

## Standing governance rules

Preserve:
- one canonical fictional world clock;
- one domain authority per state family;
- character-owned progression survives discipline switching;
- active battle owns encounter state;
- ability definitions own authored target/effect/field contracts;
- ability engine owns activation/cost/cooldown/recovery;
- combat field engine owns durable battle-local field lifecycle;
- combat geometry owns spatial projection/query, not mutable movement state;
- combat resolution owns hit/damage/resistance formulas;
- combat attention owns Enmity/Focus/Aggro/Fixation;
- combat turns own readiness/action history;
- no cosmetic action-name semantics presented as implemented mechanics;
- current-schema-only pre-alpha persistence;
- Data and Game State advance independently;
- no hard benchmark timing thresholds;
- no census filler;
- exact behavioral/data freeze before promotion/synchronization;
- `docs/THREAD_HANDOFF.md` is the final repository-file write for a closed packet.

## Restart order after Packet 6

1. `AGENTS.md`
2. this handoff
3. `PROJECT_PROFILE.yaml`
4. `docs/EXECUTION_PIPELINE.md`
5. `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`
6. `docs/ADVANCED_COMBAT_0_9_300_P6_UMBRAL_WELL_FIELD_FOUNDATION.md`
7. `docs/COMBAT_ADJACENCY_AND_DEBT_AUDIT.md`
8. `docs/ROADMAP.md`
9. inspect current runtime only for the freshly selected bounded domain
10. select exactly one next advanced-combat packet before implementation

Do not redo the closed broad combat-adjacency audit unless repository evidence materially diverges.

## Final-handoff schema-guard repair

The first post-promotion handoff head was `c3172b89c7293cf6199f04045e05827f8f61f414`.

Exact-head Check #2092 / run `33555870148`:
- Repository Audit PASS;
- test step failed before Census/Benchmark;
- exactly five tests failed;
- every failure was a literal `VERSION.gameState === 20` assertion in a test explicitly named as a **current Game State** guard.

Affected guards:
- `tests/currentSchemaCultivation.test.js`;
- `tests/currentSchemaDiscoveryPersistence.test.js`;
- `tests/currentSchemaEnemyEncounterProjection.test.js`;
- `tests/currentSchemaNpcWorldProjection.test.js`;
- `tests/currentSchemaPresentationLog.test.js`.

Each assertion now expects Game State 21.

No production runtime, data, field state, save encoding, persistence validator, ability behavior, combat timing, or authority document changed for this repair.

The repair checkpoint before this final handoff is `3c4f2b703acbaa72091ac2375ff1ad9bd3973d71`.

This handoff rewrite is again the intended final repository-file mutation.

## Final validation contract

This handoff is the intended final repository-file mutation for 0.9.300 Packet 6.

After this write:
- perform **no repository-file mutations** unless exact-head validation exposes a real failure;
- validate the exact resulting `main` SHA with hosted Check;
- confirm Repository Audit, **884/884 tests**, Census, Benchmark 3, and Benchmark Sample;
- confirm Pages succeeds on the same exact SHA;
- confirm `main` remains on that exact SHA after validation.

If exact-head validation exposes a stale assertion or synchronization defect, repair it, then rewrite this handoff last again before the final validation pass.
