# Combat 2.0 Packet B3 — Combat Loadout Transition Foundation

Status: **COMPLETE.**

## Runtime checkpoint

```text
Product:       0.9.200.4
Package:       0.9.200
Account Save:  5
Game State:    17
Data:          65
Benchmark:     3
Codename:      Combat Loadout Transitions
```

Behavioral implementation freeze:

`3ef9a1c48f22911fe90a08a60c03a72c09d7fd67`

Hosted evidence:
- Check #1908 / run `33462594046`;
- job `99715725979`;
- Repository Audit PASS;
- **844/844 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #2038 / run `33462592986` PASS.

The freeze intentionally predates Product/Game State/Data promotion.

## Entry audit

B3 began with a fresh combat-adjacency audit:
- `docs/COMBAT_ADJACENCY_AND_DEBT_AUDIT.md`.

That audit established:
- exploration `aggroEngine` is encounter detection, not B2 combat Aggro;
- stale `battle.targetId/actionDelay/recasts/casting` fields are not new loadout authority;
- root `js/ui.js`, root `js/encounter.js`, and recovered weapon-skill data are legacy/reference surfaces;
- LOS/reachability/pursuit/search, named combat loadouts, kata state, and first-class ranged actions do not yet exist;
- shield block/parry/guard/counter/interruption statistics are not silently promoted into universal passive mechanics.

## New authority

New direct timed-task owner:
- `js/text/systems/combatLoadoutEngine.js`.

Durable transition authority:
- `activeBattle.loadoutTransition`.

The owner uses:
- canonical world time;
- generic timed tasks;
- existing combat timeline/recovery;
- existing equipment/inventory authority;
- B2 hostile attention for armor pressure.

It does not create a second combat clock, equipment store, attention store, or cooldown family.

## Transition contract

B3 distinguishes:
- **weapon-set transitions** for `mainHand`, `offHand`, `ranged`, and `ammo`;
- **full equipment transitions** for armor/accessory slots.

The foundation is atomic:
- the old item remains mechanically equipped during the timed transition;
- requested inventory/equipment authority is protected from generic transfer/mutation;
- another equipment change cannot start;
- basic attack, legacy technique/cast, and canonical ability activation are blocked;
- ability cooldown timestamps are not reset;
- interruption/cancellation leaves equipment unchanged;
- successful completion applies equipment exactly once;
- root and battle-player equipment are synchronized;
- battle combat profile is recomputed;
- canonical action recovery applies;
- structured action/event evidence is recorded;
- terminal task is released.

Weapon changes record `resetWeaponSequence: true` for B4. B3 does **not** create kata state early.

## Directional handling metadata

Item schema now supports optional:

```text
handling:
  stowSeconds
  drawSeconds
  readySeconds
  cumbersome
```

Representative canonical B3 proof data includes authored handling for:
- Bronze Sword;
- Bronze Axe;
- Bronze Dagger;
- Ash Staff;
- Iron Buckler;
- Leather Vest;
- Bronze starter armor.

Fallback handling remains deterministic for equipment without explicit B3-authored values.

Directional proof includes dagger -> staff taking longer than staff -> dagger because outgoing stow and incoming draw costs differ.

## Armor-pressure legality

Armor/accessory transitions consult B2 attention.

A living, non-hard-disabled hostile blocks the transition when the actor:
- is that hostile's current Aggro target;
- is its Fixation target;
- or holds Focus at/above the B3 armor-pressure threshold.

Focus is pressure, **not literal attack probability**.

Another party member being current Aggro target is therefore insufficient by itself to permit an armor change.

Defeated or explicitly hard-disabled hostiles do not exert immediate pressure.

### Conservative LOS/pursuit rule

The runtime still has no canonical LOS/reachability/pursuit/search/disengagement model.

B3 therefore does not invent an LOS flag to waive pressure. Existing active encounter hostiles remain threatening until later work adds real engagement/disengagement state.

This preserves the design rule that armor changes require actual pressure to be broken.

## Hard-disable boundary

B3 adds only a narrow combat helper over explicit status flags sufficient to:
- reject transition start while the player cannot act;
- cancel an active transition if the player becomes hard-disabled;
- ignore a hard-disabled hostile for immediate armor-pressure purposes.

This is not a claim that the full crowd-control/reaction model exists.

## Equipment coherence

Direct `equipItem` / `unequipItem` during active battle no longer mutates root equipment immediately.

Command and DOM equipment actions route through the timed B3 owner during combat.

Current-schema validation now explicitly rejects root-player / active-battle-player equipment divergence.

## Persistence/version decision

```text
Product       0.9.200.3 -> 0.9.200.4
Package       0.9.200   -> 0.9.200
Account Save  5         -> 5
Game State    16        -> 17
Data          64        -> 65
Benchmark     3         -> 3
```

### Why Game State advances to 17

An active loadout transition affects future resumable combat outcomes and persists:
- task identity;
- actor/battle ownership;
- operation and slot/item plan;
- transition kind;
- start/completion times;
- recovery;
- future weapon-sequence reset intent.

The current schema also validates the transition -> timed-task owner link.

No supported-save migration is added. Pre-alpha current-schema-only persistence remains authoritative.

### Why Data advances to 65

Canonical equipment definitions gained authored directional handling metadata and provenance notes.

No new item record was added solely to raise the census.

## Validation proof

`tests/combatLoadoutEngine.test.js` proves:
- direct active-combat equipment mutation is closed;
- transition direction changes duration;
- equipment is unchanged before completion;
- weapon-set vs full-equipment classification;
- player attack lock;
- canonical ability activation lock;
- ability cooldown preservation;
- completion root/battle equipment coherence;
- action recovery;
- weapon-sequence reset evidence;
- Aggro/Fixation/Focus armor pressure;
- hard-disable cancellation without mutation;
- active transition save/load/resume;
- malformed owner-task link rejection;
- terminal task release.

The owner set is also enforced by `tests/architectureDebtGuard.test.js`.

## Deferred explicit design/user decisions

B3 records but does not resolve:

1. Whether future transitions expose partial physical state such as “old weapon stowed / new weapon not ready” or remain atomic.
2. Whether named prepared loadout presets become durable player configuration, their count, and preparation/rest/service constraints.
3. The exact LOS/reachability/pursuit/search/disengagement model that breaks hostile pressure.
4. Whether shield block, parry, guard, counter, and interruption are passive rolls, stance/reaction choices, technique-specific, or enemy/weapon dependent.
5. Whether recovered `/techniques` and discipline menus migrate during B4/B5 or the broader `0.9.300` combat-training pass.

These questions must not silently acquire ad-hoc runtime authority.

## Not part of B3

Still deferred:
- weapon-delay-driven basic attack cadence;
- first-class ranged attack actions;
- configurable weapon kata/sequence;
- broad reaction/defense mechanics;
- full engagement geometry;
- named saved combat-loadout presets;
- B5 Brasshaven/Redstone playable combat-training proof.

## Next bounded unit

**Packet B4 — Weapon Cadence, Ranged Action, and Minimal Kata** is queued and **NOT STARTED**.

Do not start B5 automatically.
