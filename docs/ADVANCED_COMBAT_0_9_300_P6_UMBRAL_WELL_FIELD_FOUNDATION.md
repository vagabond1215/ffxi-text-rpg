# Advanced Combat 0.9.300 Packet 6 — Umbral Well Field Foundation

Status: **SELECTED / IMPLEMENTATION STARTED.**

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

## Closure discipline

Freeze the exact behavioral/data implementation SHA before Product/Game-State/Data promotion and repository authority synchronization. `docs/THREAD_HANDOFF.md` remains the final repository-file write for the packet.
