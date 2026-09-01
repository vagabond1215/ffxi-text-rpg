# Advanced Combat 0.9.300 Packet 6 — Umbral Well Field Foundation

Status: **COMPLETE / PRODUCT 0.9.300.6 / GAME STATE 21 / DATA 73.**

Entry baseline:
```text
Product:       0.9.300.5
Package:       0.9.300
Account Save:  5
Game State:    20
Data:          72
Benchmark:     3
```

Permanent combat authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Previous packet:
- `docs/ADVANCED_COMBAT_0_9_300_P5_TEMPEST_RING_GEOMETRY_FOUNDATION.md`.

## Why this packet is selected

Packet 5 closed the strongest remaining geometry-signaling mismatch. Umbral Well is now the strongest remaining name/behavior mismatch in the adept Elemental Form tranche.

The permanent naming law is explicit:
- a **Well / Field / Mire / Pyre** should represent a persistent area;
- zones/fields must use canonical fictional time and explicit lifetime/application semantics.

Keeping Umbral Well as ordinary single-target damage would therefore remain mechanically dishonest.

Packet 6 introduces one bounded persistent combat-field family and proves it only with Umbral Well.

## Selected field ownership model

A new `combatFieldEngine` owns **battle-local persistent combat fields**.

Durable state lives under:
```text
activeBattle.fields
```

This is required persistence, not a derived cache, because an Umbral Well has future scheduled consequences after the creating ability has fully resolved.

Expected state shape:
```text
fields:
  version
  sequence
  records[]
```

Each active field owns:
- stable field id;
- source actor id;
- source ability id;
- target-derived center position snapshot;
- center target id for provenance;
- created/expires world seconds;
- pulse cadence and next pulse world second;
- pulse sequence;
- recipient radius / maximum-target contract;
- a compact cast-time source-combat snapshot sufficient for deterministic future pulse resolution.

No timed-task record is created for the field. The field state itself is the owner; canonical world time plus combat interrupt providers schedule pulses.

## Snapshot law

Umbral Well is **cast-time source snapshot / pulse-time defender evaluation**.

At creation, snapshot only the source values required by its pulse damage:
- scaling stat/value;
- magic accuracy;
- magic attack.

At every pulse:
- the field uses that frozen source potency/accuracy snapshot;
- each current recipient uses its current magic evasion, magic defense, and Dark resistance.

Therefore:
- later weapon/loadout changes do not retroactively strengthen or weaken an already-created Well;
- later defensive/resistance changes on enemies do affect subsequent pulses;
- the field does not require its source actor to be currently able to act in order to persist.

The field still ends when the battle itself ends.

## Umbral Well authored behavior

Umbral Well preserves:
- stable ability/capability ids;
- Elemental Form / adept / Dark identity;
- enemy primary target;
- six-second interruptible activation;
- 20 MP cost;
- 18-second cooldown;
- INT scaling;
- existing direct-impact base 16 / coefficient 1.75.

It gains:
- explicit Dark magical direct-impact resolution;
- three-second post-action recovery;
- one persistent Well field centered on the target's encounter-relative position at cast completion.

Selected field tuning:
```text
duration:        12 seconds
pulse cadence:    4 seconds
scheduled pulses: 3
radius:            2 formation units
maximum targets:   4 enemies per pulse

pulse damage:
  stat:          INT snapshot
  base:          4
  coefficient:   0.45
  element:       Dark
  accuracy:      magic
  resistance:    magicDefense
  critical:      false
```

The direct impact and field pulses resolve independently.

## Field geometry boundary

Packet 6 extends combat geometry only enough to query enemies inside a radius around a persisted point.

It does **not** add:
- player ground targeting;
- mutable combatant positions;
- movement;
- knockback/pull;
- LOS/line-of-fire;
- pursuit/search/disengagement;
- generic zone authoring for unrelated abilities.

The field center is a persisted point snapshot because the field must outlive the creating action. Combatant positions remain Packet-5 derived formation.

## Pulse scheduling law

A field pulse is a combat interrupt candidate driven by canonical world time.

At the same world second, a due field pulse resolves before ordinary enemy readiness. This makes field/environment consequences at a timestamp settle before an enemy takes its next ready action.

Pulse resolution:
1. select living opponents inside the field radius;
2. cap recipients deterministically;
3. resolve each recipient independently;
4. mutate HP/defeat state;
5. record one structured `fieldPulse` combat action containing per-recipient effects and field/geometry evidence;
6. route hostile attention per recipient;
7. advance the field's pulse sequence/deadline;
8. remove the field after its final scheduled pulse;
9. finalize battle state.

No second combat clock exists.

## Attention correction included by necessity

Persistent fields expose one Packet-5 edge case that must be corrected here.

Area actions require **per-recipient attention even when only one secondary recipient actually receives an applied effect**. The attention contract must therefore support an explicit per-recipient mode rather than inferring it only from "more than one applied recipient."

Packet 6 will:
- mark geometric/field area actions as per-recipient attention;
- apply enmity only to enemy recipients with actually applied effects;
- preserve the legacy single-target path for ordinary actions.

This is a directly necessary area-action correctness repair, not a new attention model.

## Persistence/version decision

Expected if implementation is green:
```text
Product       0.9.300.5 -> 0.9.300.6
Package       0.9.300   -> 0.9.300
Account Save  5         -> 5
Game State    20        -> 21
Data          72        -> 73
Benchmark     3         -> 3
```

Game State must advance because `activeBattle.fields` changes future resumable battle outcomes and cannot be reconstructed safely from completed action history.

Data must advance because Umbral Well's canonical ability definition changes.

No supported-save migration is planned under the current pre-alpha current-schema policy.

## Focused proof requirements

Packet 6 is complete only when tests prove:
1. Umbral Well preserves stable identity, activation, cost, cooldown, direct potency/scaling, and ability count;
2. direct impact uses explicit Dark magical resolution;
3. ability resolution creates one durable field with deterministic center, lifetime, cadence, and source snapshot;
4. field state passes current-schema validation and malformed field records are rejected;
5. save/load preserves an in-progress Well with the same next pulse and source snapshot;
6. a pulse occurs exactly at canonical fictional-time deadline;
7. three scheduled pulses occur at 4/8/12 seconds and the field is then removed;
8. radius and maximum-target filtering are deterministic;
9. every pulse recipient independently resolves magic accuracy, magic defense, and Dark resistance;
10. changing source equipment/profile after creation does not alter field snapshot damage inputs;
11. changing a defender's Dark resistance before a later pulse does alter that later pulse;
12. field pulses create structured combat actions and per-recipient attention;
13. an area action with only one applied secondary recipient does not misassign attention to the primary center;
14. fields are cleared/inert when battle ends;
15. no new timed-task owner, combat clock, movement, LOS, pursuit, or generic ground-target system is introduced.

## Explicit non-goals

Not part of Packet 6:
- general-purpose zone scripting;
- player-selected ground points;
- moving fields;
- source-following auras;
- friendly fields;
- field stacking breadth beyond the one authored Well;
- field dispel/counterplay;
- cone/line/arc/chain abilities;
- combat movement / reach / LOS;
- weapon resonance / imbuement;
- passive defense/reaction systems;
- broad adept spell migration;
- new abilities or mechanics-census filler.

## Implementation result

### Durable field authority

Packet 6 adds `js/text/systems/combatFieldEngine.js` with:

```text
COMBAT_FIELD_STATE_VERSION = 1
COMBAT_FIELD_INTERRUPT_PRIORITY = 910
```

Every new active battle now owns:

```text
activeBattle.fields:
  version
  sequence
  records[]
```

A field record persists:
- stable `combat-field-NNNNNN` identity;
- source actor and source ability;
- center-target provenance;
- persisted center-point snapshot;
- creation and expiration world seconds;
- pulse cadence and next-pulse deadline;
- completed pulse sequence;
- authored radius / maximum-target contract;
- cast-time source snapshot for scaling stat/value, magic accuracy, and magic attack.

`ACTIVE_BATTLE_PERSISTENCE_VERSION` advances 4 -> 5.

Current-schema validation rejects:
- malformed/duplicate field IDs;
- unknown source/center combatants;
- invalid center coordinates;
- source abilities without a canonical field effect;
- invalid lifetime/cadence/pulse deadlines;
- invalid geometry/caps;
- missing/non-finite source snapshot values;
- durable values that disagree with the canonical authored field definition.

Fields are not lazily reconstructed by persistence validation.

### Umbral Well authored contract

`ABILITY_CATALOG_VERSION` advances 9 -> 10.

Umbral Well preserves:
- `ability-umbral-well`;
- `spell-umbral-well`;
- Elemental Form / adept / Dark identity;
- enemy primary targeting;
- six-second interruptible activation;
- 20 MP cost;
- 18-second cooldown;
- INT scaling;
- direct impact base 16 / coefficient 1.75.

It gains:
- `recoverySeconds: 3`;
- explicit Dark magical direct-impact resolution;
- a second `field` effect;
- 12-second field lifetime;
- 4-second pulse cadence;
- radius 2 / maximum 4 pulse recipients;
- pulse damage base 4 / INT coefficient 0.45;
- explicit Dark magical pulse resolution.

Executable ability count remains 41.

The ability-effect catalog now recognizes `field` as a structured effect family. Field definitions are validated for combat context, target ownership, whole-number pulse cadence, radius/cap, nested damage scaling, and resolution metadata.

### Source snapshot and live defender law

At field creation:
- target encounter-relative position is copied into the durable field center;
- source INT is copied into `sourceSnapshot.scalingValue`;
- source magic accuracy is copied;
- source magic attack is copied.

At each pulse:
- current living opposing combatants are queried against the persisted point;
- the source offense snapshot is used unchanged;
- each defender's current magic evasion, magic defense, and Dark resistance are read.

Focused proof mutates the source combat profile after field creation and confirms pulse inputs remain the stored values. It then applies Dark resistance to the defender between pulses and confirms later damage/evidence changes.

### Point-radius geometry

`combatGeometryEngine` adds `resolveCombatPointRadiusTargets`.

This query:
- accepts a persisted center point rather than a target combatant;
- derives current combatant positions through the existing Packet-5 formation authority;
- selects living opponents within radius;
- sorts by distance then encounter order;
- caps recipients;
- returns structured point-radius evidence.

This does not create mutable combat coordinates or a player ground-target interface.

### Fictional-time pulse scheduling

`combatFieldEngine.provideCombatFieldInterrupts` emits `combat.field-pulse` candidates.

Field pulse priority is 910. Existing ordinary combat readiness priority is 900, so a due field consequence resolves before an enemy ready action at the same world second.

`combatSimulationEngine` resolves a pulse by:
1. invoking the field owner at the canonical current world second;
2. resolving every selected target independently;
3. recording one `fieldPulse` combat action with field/geometry/effect evidence;
4. updating battle phase;
5. finalizing normal combat state.

After each pulse the durable record advances `pulseSequence` and `nextPulseAtWorldSeconds`. After the +12-second pulse, the next deadline lies beyond the authored expiry and the field record is removed.

No timed-task record, interval, wall-clock timer, or second combat scheduler is created.

### Per-recipient area attention correction

Packet 5 introduced per-recipient attention when multiple enemy recipients had applied effects. Packet 6 closes the remaining edge case: an area action may have exactly one applied effect and that effect may belong to a secondary recipient.

Area actions now explicitly carry:

```text
attention.mode = per-recipient
```

For explicit per-recipient actions:
- only enemy IDs with actually applied effects receive attention;
- each amount derives from that recipient's own effects;
- the action never falls back to assigning aggregate area enmity to the primary/center target merely because only one recipient landed.

Tempest Ring emits this explicit mode as well, preserving its intended semantics under miss/resist combinations.

### Battle-end lifecycle

`finalizeCombatState` reconciles fields.

When battle phase is no longer active:
- outstanding field records are cleared;
- no future field interrupt is emitted;
- no detached scheduler or task survives the encounter.

The field is battle-local state, not a world-place hazard.

### Focused guard

Primary guard:
- `tests/advancedCombatUmbralWellField.test.js`.

It proves:
- ability catalog version 10;
- executable ability count 41;
- exact Umbral Well direct-impact and field definition;
- durable field creation and center/deadline/source snapshot evidence;
- real current-schema save/load continuity;
- strict malformed-field validation;
- exact +4/+8/+12-second pulses and final expiry;
- field pulse interrupt priority;
- deterministic radius/cap;
- independent recipient magic/Dark resolution;
- cast-time source snapshot stability;
- pulse-time live defender Dark resistance;
- one structured `fieldPulse` action per pulse;
- explicit per-recipient attention when only one secondary target lands;
- no attention for missed/excluded enemies;
- battle-end field cleanup.

### Hosted validation history

Check #2066 / run `33554554852`:
- Repository Audit PASS;
- **878/884 tests**;
- two Packet-4/5 authored-shape guards failed because the ability normalizer materialized `field: undefined` on every non-field effect;
- four Packet-6 runtime proofs failed before activation because the fixtures trained `elementalMagic` while canonical Umbral Well requires `darkMagic >= 3`.

Repairs:
- field normalization now conditionally materializes the `field` key only for actual field effects;
- Packet-6 fixtures use canonical Dark Magic rank 3.

Check #2068 / run `33554792449`:
- Repository Audit PASS;
- **883/884 tests**;
- all production field behavior passed;
- the remaining failure was a test-only `structuredClone` of the injected battle RNG function.

Final repair:
- the corruption-validation fixture clears the non-persisted RNG function before cloning;
- no production runtime or field-state behavior changed.

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

### Promotion result

```text
Product       0.9.300.5 -> 0.9.300.6
Package       0.9.300   -> 0.9.300
Account Save  5         -> 5
Game State    20        -> 21
Data          72        -> 73
Benchmark     3         -> 3
```

System versions advance:
- version manifest: 0.9.300.5 -> 0.9.300.6;
- active-battle persistence: 0.5.0 -> 0.6.0;
- ability catalog: 0.8.0 -> 0.9.0;
- ability engine: 0.6.0 -> 0.7.0;
- battle engine: 0.13.0 -> 0.14.0;
- combat turns: 0.6.0 -> 0.7.0;
- combat simulation: 0.2.0 -> 0.3.0;
- combat geometry: 0.1.0 -> 0.2.0;
- combat fields: new 0.1.0;
- combat attention: 0.2.0 -> 0.3.0.

Game State 21 is required because outstanding field deadlines, center point, pulse progress, and source snapshot change future resumable combat outcomes.

Data 73 records the changed canonical Umbral Well impact/recovery/field contract.

No supported-save migration is added.

## Next decision boundary

Packet 6 does not authorize another adept migration automatically.

No Packet 7 is selected.

If advanced combat remains the immediate priority, the strongest semantic candidate is **Radiant Arc Propagation Foundation** because `Arc` still promises arcing/propagating behavior that the current single-target placeholder does not express. That candidate would require an explicit propagation/recipient-selection contract and must not be silently treated as Tempest Ring geometry.

Other separately bounded candidates remain:
- Rimefall falling/repeated-area semantics;
- Flare Bloom radial/expanding semantics;
- Fault Rush movement/impact semantics;
- one coherent martial-technique migration tranche;
- engagement geometry / LOS / pursuit / disengagement;
- weapon resonance / imbuement;
- passive defense/reaction semantics.

Do not combine these automatically.

## Closure discipline

`docs/THREAD_HANDOFF.md` remains the final repository-file write for the packet, followed only by exact-head hosted validation.
