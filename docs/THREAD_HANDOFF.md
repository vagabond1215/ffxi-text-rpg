# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

```text
Product:       0.9.300.4
Package:       0.9.300
Account Save:  5
Game State:    20
Data:          71
Benchmark:     3
Codename:      Thunder Cage Control Foundation
Runtime:       Node >=24
Phase:         0.9
0.9.100:       COMPLETE
0.9.200:       COMPLETE — Adventure Vertical Slices
0.9.300:       ACTIVE — Advanced Combat / Training
Packet 1:      COMPLETE — Current Melee Kata Breadth
Packet 2:      COMPLETE — Character Affinity & Kata Substitution Foundation
Packet 3:      COMPLETE — Novice Elemental Resolution Breadth
Packet 4:      COMPLETE — Thunder Cage Control Foundation
Next packet:   UNSELECTED — requires fresh bounded work order
```

## Latest bounded unit — 0.9.300 Packet 4

Permanent record:
- `docs/ADVANCED_COMBAT_0_9_300_P4_THUNDER_CAGE_CONTROL_FOUNDATION.md`.

Permanent combat design authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Previous packet:
- `docs/ADVANCED_COMBAT_0_9_300_P3_NOVICE_ELEMENTAL_RESOLUTION_BREADTH.md`.

Adjacent/stale combat audit:
- `docs/COMBAT_ADJACENCY_AND_DEBT_AUDIT.md`.

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

This freeze intentionally predates Product/Data promotion and authority synchronization.

### Promoted authority checkpoint before this handoff

`9d60d84333c640bac2e7770eaabbc6ff213acbfe`

At this checkpoint:
- Product 0.9.300.4 / Package 0.9.300 / Game State 20 / Data 71 promotion is complete;
- runtime and system-version guards are synchronized;
- README, execution pipeline, roadmap, system catalog, version roadmap, project profile, combat design, architecture, Phase 0.9 plan, development direction, quality gates, resource lifecycle, changelog, and Packet 4 record are synchronized;
- Packet 4 is complete;
- no subsequent advanced-combat packet has been selected or implemented.

This handoff write is intended to be the final repository-file mutation for Packet 4.

## Why Packet 4 was selected

Packet 3 migrated the eight novice Elemental Form attacks but deliberately did not flatten adept names whose semantics imply richer behavior.

Thunder Cage was the smallest honest next semantic family:
- it already existed as a canonical learned/executable adept spell;
- its name implies containment/control, not merely higher damage;
- generic persisted statuses already had flags and expiry;
- B3 already recognized a narrow hard-disable vocabulary for loadout/armor pressure;
- enemy combat action paths did not yet honor that disable fact.

Packet 4 therefore closes one real semantic gap and one adjacent action-policy gap without opening general geometry or a broad crowd-control subsystem.

## What Packet 4 implements

### Thunder Cage authored contract

Thunder Cage keeps:
- ability ID `ability-thunder-cage`;
- capability ID `spell-thunder-cage`;
- Elemental Form school;
- adept/lightning identity;
- single-target enemy targeting;
- 6-second interruptible activation;
- 20 MP cost;
- 18-second cooldown;
- INT scaling;
- base damage 16;
- coefficient 1.75.

It gains:
- `recoverySeconds: 3`;
- explicit lightning magical damage resolution;
- a separate resistible containment status.

The ability catalog version advances:
```text
ABILITY_CATALOG_VERSION 7 -> 8
```

Executable ability count remains **41**.

### Damage resolution

Thunder Cage damage uses:
- delivery: `spell`;
- channel: `magical`;
- damage type: `spell`;
- element: `lightning`;
- element source: `ability`;
- accuracy model: `magic`;
- resistance model: `magicDefense`;
- critical eligible: false.

Damage therefore uses the existing B1 magic-accuracy, magic-defense, and elemental-resistance path.

### Containment resolution

Thunder Cage containment is a second effect, not an automatic consequence of damage.

Control resolution uses:
- delivery: `spell`;
- channel: `magical`;
- element: `lightning`;
- element source: `ability`;
- accuracy model: `magic`;
- resistance model: `magicEvasion`.

Because the B1 magic-evasion path already includes elemental resistance in its accuracy calculation, lightning resistance contributes to resisting containment.

A target may therefore:
- take Thunder Cage damage;
- resist Thunder Cage containment.

That distinction is deliberate and tested.

### Status record

Landed containment applies:

```text
id:              status-thunder-cage
name:            Thunder Cage
category:        debuff
duration:        6 seconds
stack group:     elemental-control-cage
stack rule:      replace
flags:
  cannotAct:     true
  caged:         true
```

No cage geometry, persistent zone object, or separate control-state record exists.

## Shared hard-disable status authority

Before Packet 4, the recognized hard-disable flag list was local to `combatLoadoutEngine.js`.

Packet 4 moves the shared vocabulary to `statusEngine.js`:

```text
hardDisabled
stunned
asleep
cannotAct
incapacitated
```

New status helpers derive:
- whether an entity is presently hard-disabled by status;
- the latest finite expiry of active hard-disable statuses;
- `Infinity` when any active hard-disable status has no finite expiry;
- null when no active hard-disable status remains.

Expired statuses do not continue to suppress action merely because their records have not yet been physically removed.

`combatLoadoutEngine.js` remains the owner of loadout legality and still owns defeat/HP checks, but it consumes status hard-disable semantics from `statusEngine` instead of defining a second flag list.

## Enemy action/control integration

`combatTurnEngine.js` now consumes the same status authority.

### Action selection

A status-hard-disabled enemy cannot select an action.

### Immediate enemy response

The existing immediate response path skips disabled enemies, so Thunder Cage does not apply successfully and then allow the caged target to retaliate in the same resolution sequence.

### Ready action resolution

A forced or ordinary ready action against an actively disabled enemy returns:

```text
combat.enemy-disabled
```

with the active disable expiry evidence.

### Fictional-time readiness

Packet 4 does not create a cage timer.

The existing combat-ready interrupt is adjusted:

```text
existing enemy readyAt
        |
        + active finite hard disable?
        |      -> effective interrupt = max(readyAt, latest disable expiry)
        |
        + active indefinite hard disable?
        |      -> no ready interrupt until status removal
        |
        + no active hard disable?
               -> ordinary readyAt
```

At the finite expiry boundary:
1. canonical world time reaches the existing interrupt;
2. normal status reconciliation removes the expired cage;
3. the already-ready enemy may act normally;
4. ordinary enemy recovery is then recorded.

This prevents:
- acting through containment;
- a second control clock;
- zero-time repeated enemy-ready interrupts;
- artificial readiness reset when the disable ends.

## Focused Packet 4 guard

Primary guard:
- `tests/advancedCombatThunderCageControl.test.js`.

It proves:
- ability catalog version 8;
- executable ability count remains 41;
- Thunder Cage stable contract is preserved except intended recovery/resolution/control metadata;
- lightning damage resolution;
- damage/control independence;
- separately resisted containment;
- lightning resistance evidence and reduced damage;
- six-second `cannotAct` status;
- shared hard-disable recognition;
- `combat.enemy-disabled` forced-action rejection;
- five seconds of cage hold without enemy action;
- action resumes at exactly the sixth-second expiry boundary;
- existing combat readiness recovery continues after resumed action;
- B3 armor-pressure logic consumes the shared hard-disable status fact.

The pre-existing B3/B5 hard-disable tests also remain green after the shared-authority refactor.

## First hosted-run fixture repair

The first Packet 4 hosted run:
- Check #2005 / run `33518195679`;
- 874/875 tests passed;
- one focused resistance proof failed.

The failure was a **test fixture issue**, not a runtime-control defect.

The failing proof applied lightning resistance only to the detached active-battle enemy after encounter creation. Normal combat/profile refresh correctly rebuilt derived resistance from the canonical projected source, so the ad hoc cache mutation disappeared.

The repaired proof applies the resistance status to the source Training Dummy before encounter creation. Encounter projection then carries the canonical status into the battle combatant and recalculation preserves the intended resistance.

No runtime implementation change was required for that repair.

## Version decisions

```text
Product       0.9.300.3 -> 0.9.300.4
Package       0.9.300   -> 0.9.300
Account Save  5         -> 5
Game State    20        -> 20
Data          70        -> 71
Benchmark     3         -> 3
```

System-version promotions:
- ability catalog: 0.6.0 -> 0.7.0;
- status engine: 0.3.0 -> 0.4.0;
- combat turns: 0.5.0 -> 0.6.0.

### Why Game State remains 20

Packet 4 introduces no new required durable field.

Generic statuses already persist:
- IDs;
- flags;
- applied/expiry world seconds;
- duration/remaining seconds;
- stack semantics;
- modifiers.

The combat timeline already persists actor readiness.

Thunder Cage therefore composes existing serialized authorities rather than creating a new one.

No supported-save migration is added.

### Why Data advances to 71

The existing canonical Thunder Cage authored definition gains:
- structured lightning damage resolution;
- structured resistible control resolution;
- canonical status definition;
- explicit recovery metadata.

No new ability/capability record is added.

## Existing authorities preserved

- `abilities.js` owns authored ability/effect contracts.
- `capabilities.js` owns learned capability requirements.
- `abilityEngine.js` owns activation, resource costs, cooldowns, status application, and ability-result sequencing.
- `statusEngine.js` owns generic status records and shared hard-disable flag interpretation.
- `combatResolutionEngine.js` owns damage, hit, magic-defense, magic-evasion, and elemental-resistance formulas.
- `combatTurnEngine.js` owns combat readiness/action history and consumes status disable facts.
- `combatLoadoutEngine.js` owns timed equipment-transition legality and consumes shared disable facts.
- active battle remains encounter authority.
- canonical fictional world time remains the only simulation/combat clock.

No new direct timed-task owner was introduced.

## Explicitly deferred / still nonexistent

Packet 4 does **not** make the following real:
1. Tempest Ring area/ring geometry;
2. Umbral Well persistent field/zone behavior;
3. area-of-effect Thunder Cage;
4. generic ring/cone/line/chain/zone targeting;
5. general crowd-control categories, diminishing returns, immunity tiers, break-on-damage, or control resistance families;
6. player/companion hard-disable action-policy expansion beyond existing consumers;
7. aura/stance/channel/reaction action families;
8. LOS/reachability/pursuit/search/disengagement;
9. weapon resonance or generic imbuement;
10. universal passive block/parry/guard/counter/interruption;
11. broad adept Elemental Form migration;
12. broad martial/Veilscript migration;
13. new abilities or mechanics-census filler.

Do not infer those systems from Thunder Cage's bounded control implementation.

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

**No Packet 5 is selected.**

A future explicit advanced-combat continuation must select exactly one bounded family.

Current strongest candidates:

1. **Tempest Ring Geometry Foundation** — introduce the smallest honest multi-target/ring targeting contract and prove it on one existing ability without opening all geometry/action families.
2. **Umbral Well Field Foundation** — one persistent combat-field semantic using canonical world time, only if field ownership/lifecycle is selected before implementation.
3. **Bounded martial resolution migration** — choose one coherent existing technique tranche whose names fit current single-target mechanics.
4. **Engagement geometry / LOS / pursuit / disengagement** — larger architecture packet; do not combine with spell geometry automatically.
5. **Weapon resonance / imbuement** — compose character affinity/equipment with existing resolution without hard-coding weapon families to elements.
6. **Passive defense/reaction semantics** — only by explicit selection.

Do not combine these automatically.

The 41/100 ability count remains progression evidence, not permission to add duplicate actions.

## Preserved interrupted/resumable queues

Packet 4 does not cancel earlier queues:

- **Occupational Tool Conversion — preserved/queued:** strongest prepared `0.9.400 Economy / Production Depth` candidate. Authority: `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.
- **World edge — paused/resumable:** Waymeet Inner Marches / outer crossroads first, then Coppergrass extensions, then Drowned Vaults.
- **Locality enrichment — deferred/resumable:** ambient/risk events, wandering/seasonal merchants, directions/help dialogue, richer contextual dialogue, shop category/browse depth, learned-locality graphical presentation.
- **Ecology:** five-part flora/fauna diversity repair sequence remains COMPLETE.

## Standing governance rules

Preserve:
- one canonical fictional world clock;
- one domain authority per state family;
- character-owned progression survives discipline switching;
- active battle owns encounter state;
- ability definitions own authored action contracts;
- ability engine owns activation/cost/cooldown/recovery/status sequencing;
- status engine owns generic status and shared hard-disable interpretation;
- combat resolution owns hit/damage/resistance formulas;
- combat turns own readiness/action history and consume status facts;
- combat loadout owns equipment-transition legality and consumes status facts;
- action history stores structured evidence;
- no cosmetic action-name semantics presented as implemented mechanics;
- current-schema-only pre-alpha persistence;
- Data and Game State advance independently;
- no hard benchmark timing thresholds;
- no census filler;
- exact behavioral/data freeze before promotion/synchronization;
- `docs/THREAD_HANDOFF.md` is the final repository-file write for a closed packet.

## Restart order after Packet 4

1. `AGENTS.md`
2. this handoff
3. `PROJECT_PROFILE.yaml`
4. `docs/EXECUTION_PIPELINE.md`
5. `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`
6. `docs/ADVANCED_COMBAT_0_9_300_P4_THUNDER_CAGE_CONTROL_FOUNDATION.md`
7. `docs/COMBAT_ADJACENCY_AND_DEBT_AUDIT.md`
8. `docs/ROADMAP.md`
9. inspect current runtime only for the freshly selected bounded domain
10. select exactly one next advanced-combat packet before implementation

Do not redo the closed broad combat-adjacency audit unless repository evidence materially diverges.

## Final validation contract

This handoff is the intended final repository-file mutation for 0.9.300 Packet 4.

After this write:
- perform **no repository-file mutations** unless exact-head validation exposes a real failure;
- validate the exact resulting `main` SHA with hosted Check;
- confirm Repository Audit, **875/875 tests**, Census, Benchmark 3, and Benchmark Sample;
- confirm Pages succeeds on the same exact SHA;
- confirm `main` remains on that exact SHA after validation.

If exact-head validation exposes a stale assertion or synchronization defect, repair it, then rewrite this handoff last again before the final validation pass.
