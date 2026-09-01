# Advanced Combat 0.9.300 Packet 4 — Thunder Cage Control Foundation

Status: **COMPLETE / PRODUCT 0.9.300.4 / GAME STATE 20 / DATA 71.**

Entry baseline:
```text
Product:       0.9.300.3
Package:       0.9.300
Account Save:  5
Game State:    20
Data:          70
Benchmark:     3
```

Permanent combat authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Previous packet:
- `docs/ADVANCED_COMBAT_0_9_300_P3_NOVICE_ELEMENTAL_RESOLUTION_BREADTH.md`.

## Why this packet is selected

Packet 3 deliberately left the adept Elemental Form tranche unmigrated because several names imply richer mechanics than generic single-target damage.

Thunder Cage is the smallest honest next semantic family:
- the ability already exists;
- its name implies containment/control;
- the generic status engine already persists status flags;
- Combat 2.0 already recognizes a narrow hard-disable boundary for loadout pressure;
- enemy action selection does not yet honor that disable boundary.

Packet 4 therefore establishes one shared hard-disable/status-control seam and makes Thunder Cage the first canonical authored ability to exercise it.

## Selected contract

Thunder Cage remains a single-target enemy spell. It does **not** introduce area/ring/zone geometry.

It gains:
- explicit lightning magical damage resolution;
- explicit action recovery;
- one separate resistible control status;
- a bounded `cannotAct` hard-disable flag for a short canonical duration.

Damage and control are independently resolved:
- damage uses magic accuracy + magic defense + lightning resistance for damage;
- control uses magic accuracy + magic evasion, with lightning resistance contributing to the resist chance.

A target may therefore take Thunder Cage damage while resisting containment.

## Shared hard-disable seam

The existing hard-disable flag vocabulary currently lives inside `combatLoadoutEngine`. Packet 4 must move status-flag recognition to the existing status authority rather than creating a combat-control subsystem.

Expected shared flags remain:
- `hardDisabled`;
- `stunned`;
- `asleep`;
- `cannotAct`;
- `incapacitated`.

Combat loadout continues to consume that shared status fact.

Enemy combat readiness/action paths also consume it:
- a hard-disabled enemy cannot select or resolve an action;
- combat-time interrupts defer a ready enemy until the active hard-disable expiry;
- when the disable expires, normal existing readiness/action selection resumes;
- indefinite hard-disable statuses produce no ready interrupt until the status is removed.

No new combat clock or status scheduler is added.

## Expected version decision

If green:

```text
Product       0.9.300.3 -> 0.9.300.4
Package       0.9.300   -> 0.9.300
Account Save  5         -> 5
Game State    20        -> 20
Data          70        -> 71
Benchmark     3         -> 3
```

Game State should remain 20 because generic status flags/timing are already serialized by the current schema and no new required durable field is introduced.

Data should advance to 71 because Thunder Cage's canonical authored ability definition gains executable damage/control/recovery metadata.

No supported-save migration is added.

## Focused proof requirements

Packet 4 is complete only when tests prove:
1. Thunder Cage retains its existing stable IDs, capability, activation, MP cost, cooldown, potency, and scaling;
2. its damage uses lightning magic resolution and elemental resistance;
3. its control effect is separately resistible;
4. a landed cage creates a timed `cannotAct` status with structured evidence;
5. a caged enemy cannot act through direct response or combat-ready paths;
6. simulation defers enemy readiness to cage expiry without a zero-time interrupt loop;
7. the enemy can act normally once the cage expires;
8. existing B3 hard-disable armor-pressure/loadout behavior still consumes the shared flag vocabulary;
9. no geometry, zone, aura, stance, channel, reaction, or new state family is introduced;
10. ability count remains unchanged.

## Explicit non-goals

Not part of Packet 4:
- Tempest Ring geometry;
- Umbral Well field/zone behavior;
- area targeting for Thunder Cage;
- general crowd-control taxonomy or diminishing returns;
- boss immunity/resistance tiers;
- break-on-damage rules;
- player/companion hard-disable action policy expansion beyond existing consumers;
- broad adept Elemental Form migration;
- new abilities or mechanics-census filler.

## Implementation result

`statusEngine.js` now owns `HARD_DISABLE_STATUS_FLAGS` and derives whether a status-disabled actor is active plus the latest finite expiry. The shared vocabulary remains `hardDisabled`, `stunned`, `asleep`, `cannotAct`, and `incapacitated`.

`combatLoadoutEngine.js` consumes that shared status authority and retains its existing defeat/HP checks. `combatTurnEngine.js` now also consumes it:
- disabled enemies cannot select actions;
- forced/ready action resolution returns `combat.enemy-disabled` while the disable is active;
- immediate enemy response skips disabled enemies;
- ready interrupts are deferred to the latest finite disable expiry;
- indefinite disables emit no ready interrupt until the status is removed.

Thunder Cage keeps its original stable ability/capability identity, six-second interruptible activation, 20 MP cost, 18-second cooldown, base 16 / INT 1.75 damage scaling, and single-target enemy contract. It adds three-second post-action recovery and two effects:
1. lightning magical damage through magic accuracy + magic defense;
2. a separately resistible six-second `status-thunder-cage` using magic accuracy + magic evasion, lightning element evidence, and `{ cannotAct: true, caged: true }`.

The ability catalog version advances 7 -> 8. Executable ability count remains 41.

### Focused guard

Primary guard: `tests/advancedCombatThunderCageControl.test.js`.

It proves definition stability, damage/control independence, lightning-resistance damage evidence, shared hard-disable recognition, forced-action suppression, no zero-time readiness loop, exact expiry resumption, and B3 armor-pressure release.

The first hosted implementation run (Check #2005 / run `33518195679`) had one test-fixture failure: the resistance proof applied resistance only to a detached battle combatant and normal combat-profile refresh correctly rebuilt it. The proof was repaired by placing the resistance status on the source enemy before encounter creation, matching the canonical projection path. Runtime behavior required no repair.

### Behavioral/data implementation freeze

`f2b5ca9e1936e9ef7f334de16a9fd83908323642`

Hosted evidence:
- Check #2006 / run `33518317562`;
- Repository Audit PASS;
- **875/875 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #2136 / run `33518315622` PASS.

### Promotion result

```text
Product       0.9.300.3 -> 0.9.300.4
Package       0.9.300   -> 0.9.300
Account Save  5         -> 5
Game State    20        -> 20
Data          70        -> 71
Benchmark     3         -> 3
```

Game State remains 20 because generic persisted statuses already carry flags and expiry, and the combat timeline already persists readiness. No new required durable field or migration is introduced. Data 71 records the changed Thunder Cage definition.

## Next decision boundary

Packet 4 does not authorize a broad crowd-control pass. Tempest Ring geometry, Umbral Well field/zone behavior, general control taxonomy/diminishing returns, passive defense reactions, engagement geometry, weapon resonance, and broad adept/martial catalog migration all require fresh bounded selection.

## Closure discipline

`docs/THREAD_HANDOFF.md` remains the final repository-file write for the packet, followed only by exact-head hosted validation.
