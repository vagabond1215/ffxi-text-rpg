# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

```text
Product:       0.9.200.4
Package:       0.9.200
Account Save:  5
Game State:    17
Data:          65
Benchmark:     3
Codename:      Combat Loadout Transitions
Runtime:       Node >=24
Phase:         0.9
Track:         0.9.200 Adventure Vertical Slices ACTIVE
Slice A:       COMPLETE
Slice B B1:    COMPLETE
Slice B B2:    COMPLETE
Slice B B3:    COMPLETE
Next packet:   B4 Weapon Cadence, Ranged Action, and Minimal Kata — QUEUED / NOT STARTED
```

## Latest bounded unit — Combat 2.0 Packet B3

Permanent record:
- `docs/COMBAT_2_0_B3_LOADOUT_TRANSITIONS.md`.

Entry audit:
- `docs/COMBAT_ADJACENCY_AND_DEBT_AUDIT.md`.

Permanent design authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Slice B plan:
- `docs/COMBAT_2_0_SLICE_B_IMPLEMENTATION_PLAN.md`.

### Behavioral implementation freeze

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

This freeze intentionally predates Product/Game State/Data promotion.

### Pre-handoff synchronized-authority checkpoint

`7a0418805a81b0db323d32faf4f371388d276961`

At this checkpoint the promoted runtime and all top-level/deep B3 authorities were synchronized except this handoff. Check #1921 confirmed the **only Repository Audit failure** was that `docs/THREAD_HANDOFF.md` still advertised Product 0.9.200.3 / Game State 16.

The final handoff write below is therefore the intended last repository mutation for B3.

## What B3 implements

New direct timed-task owner:
- `js/text/systems/combatLoadoutEngine.js`.

Durable encounter authority:
- `activeBattle.loadoutTransition`.

B3 now provides:
- timed active-combat equipment transitions on canonical fictional time;
- directional stow/draw/ready handling;
- quick weapon-set vs full-equipment transition classification;
- atomic completion/cancellation;
- no direct root-player equipment mutation during active battle;
- attack, legacy technique/cast, and canonical ability lock during transition;
- canonical ability cooldown preservation;
- root/battle equipment synchronization plus combat-profile refresh on completion;
- structured `resetWeaponSequence` intent for future B4;
- terminal timed-task release after durable consequence;
- save/load of an active transition with strict owner-task validation;
- B2 Aggro/Focus/Fixation armor-pressure legality;
- narrow hard-disable start/interruption rules.

Representative authored handling exists for:
- Bronze Sword;
- Bronze Axe;
- Bronze Dagger;
- Ash Staff;
- Iron Buckler;
- Leather Vest;
- Bronze starter armor.

## Adjacent / stale / nonexistent combat-system decisions

The B3 entry audit is authoritative for these boundaries.

### Exploration detection vs combat Aggro

`js/text/systems/aggroEngine.js` owns world/exploration encounter detection.

B2 combat Aggro is a hostile's sticky current target inside `activeBattle.enmity`.

The shared word does **not** imply shared state authority.

### Stale combatant placeholders

Do not build B4 on:
- `battle.targetId`;
- `battle.actionDelay`;
- `battle.recasts`;
- `battle.casting`.

They have no current production authority beyond persistence shape and overlap newer combat/ability authorities. Removal is a separate bounded cleanup.

### Legacy/reference combat surfaces

Do not implement new B4 semantics in:
- root `js/ui.js` timer combat;
- root `js/encounter.js`;
- root `data/weaponskills.js`;
- recovered legacy job/weapon-skill data.

The active browser/runtime path remains `index.html -> js/main.js -> js/text/...`.

### Systems that still do not exist

Do not pretend the runtime already has:
- LOS/reachability/pursuit/search/disengagement;
- named prepared combat-loadout presets;
- partial physical “stowed but not ready” equipment states;
- canonical weapon kata/sequence state;
- first-class ranged attack actions;
- a comprehensive hard-disable/reaction vocabulary.

### Calculated-but-not-yet-executing combat stats

Do not silently convert these into universal passive mechanics:
- shieldBlock;
- parry;
- guard;
- counter;
- spellInterruptionRate;
- ranged attack/accuracy without first-class ranged action authority.

## Armor-pressure rule carried forward

Another party member being current Aggro target is **not sufficient** to permit armor swapping.

B3 blocks armor/accessory transitions when any living, non-hard-disabled hostile:
- currently has Aggro on the actor;
- is Fixated on the actor;
- or maintains actor Focus at/above the B3 pressure threshold.

Focus is relative pressure, not literal attack probability.

Because LOS/pursuit does not exist yet, B3 does not invent an LOS escape hatch. Active encounter hostiles remain threatening until later work adds genuine engagement/disengagement state.

## Version / persistence decision

```text
Product       0.9.200.3 -> 0.9.200.4
Package       0.9.200   -> 0.9.200
Account Save  5         -> 5
Game State    16        -> 17
Data          64        -> 65
Benchmark     3         -> 3
```

Game State advances because an active loadout transition changes future resumable combat outcomes through its owner/task identity, operation and equipment plan, fictional-time boundaries, recovery, and sequence-reset intent.

Data advances independently because representative canonical equipment gained authored directional handling metadata.

No supported-save migration is added. Pre-alpha persistence remains strict current-schema-only.

## Deferred explicit design/user decisions

Do not silently resolve these while implementing B4:

1. Whether future loadout transitions expose partial physical state such as “old weapon stowed / new weapon not ready” or remain atomic.
2. Whether named prepared loadout presets become durable player configuration, how many may be prepared, and what preparation/rest/service constraints apply.
3. The exact LOS/reachability/pursuit/search/disengagement model that breaks hostile pressure.
4. Whether shield block, parry, guard, counter, and interruption are passive rolls, stance/reaction choices, technique-specific behavior, enemy/weapon dependent, or mixed.
5. Whether recovered `/techniques` and discipline menus migrate during B4/B5 or wait for the broader `0.9.300` combat-training pass.

## Next bounded unit — B4 only

**Packet B4 — Weapon Cadence, Ranged Action, and Minimal Kata** is queued and **NOT STARTED**.

A future explicit `continue` should start B4 only.

B4 scope:
- establish one canonical weapon-delay -> fictional-time cadence conversion;
- replace universal fixed basic-attack cadence where the B4 design requires;
- add a first-class player ranged attack action;
- define ammunition/resource consumption without creating a second inventory authority;
- implement the minimum configurable weapon sequence/kata required for the representative proof;
- consume B3 `resetWeaponSequence` evidence/state semantics coherently;
- preserve canonical ability cooldowns and active-battle authority;
- make an explicit Game State/Data decision only after the exact B4 serialized/data shape is known.

B4 must **not** auto-expand into:
- B5 playable Brasshaven/Redstone proof;
- full engagement geometry;
- universal passive defense/reaction systems;
- named prepared loadout presets;
- broad recovered-technique migration unless explicitly selected.

B5 remains separately bounded.

## Preserved interrupted/resumable circles

B3 completion does **not** cancel previous queues.

- **Locality enrichment — deferred/resumable:** ambient/risk events, wandering/seasonal merchants, generalized directions/help dialogue, richer contextual dialogue, staged shop category/browse depth, learned-locality graphical presentation. Authority: `docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md`.
- **Occupational Tool Conversion — preserved/queued:** strongest prepared `0.9.400 Economy / Production Depth` candidate; resume existing Packet A conversion list and `requiredToolTags`. Authority: `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.
- **World edge — paused/resumable:** Waymeet Inner Marches / outer crossroads approach first, then Coppergrass extensions, then Drowned Vaults. Authorities: `docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md`, `docs/WORLD_MACRO_TOPOLOGY.md`.
- **Ecology:** the five-part flora/fauna diversity repair sequence is COMPLETE. Do not restart without a fresh bounded work order.

## Standing architecture/governance rules

Preserve:
- one canonical fictional world clock;
- one domain authority per state family;
- active battle owns encounter, attention, and active combat-loadout transition state;
- combat attention owns attention calculations/selection, not battle lifecycle;
- combat loadout owns transition consequence/reconciliation, not world time or physical inventory authority;
- combat resolution owns formulas/results, not battle lifecycle;
- ability engine owns canonical activation/cooldowns;
- status engine owns statuses;
- action history stores structured evidence; prose is not authority;
- route graph owns inter-place travel;
- Pack v2 owns placement/dependencies, not duplicate definitions;
- current-schema-only pre-alpha persistence;
- Data and Game State advance independently;
- no hard benchmark timing thresholds;
- no census filler;
- exact behavioral implementation freeze before continuity sync;
- `docs/THREAD_HANDOFF.md` final repository-file write for a bounded packet.

## Restart order for B4

1. `AGENTS.md`
2. this handoff
3. `PROJECT_PROFILE.yaml`
4. `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`
5. `docs/COMBAT_2_0_B3_LOADOUT_TRANSITIONS.md`
6. `docs/COMBAT_ADJACENCY_AND_DEBT_AUDIT.md`
7. `docs/COMBAT_2_0_SLICE_B_IMPLEMENTATION_PLAN.md`
8. `docs/EXECUTION_PIPELINE.md`
9. `docs/ROADMAP.md`
10. `docs/ARCHITECTURE.md`
11. `js/text/systems/combatTurnEngine.js`
12. `js/text/systems/combatActionEngine.js`
13. `js/text/systems/combatLoadoutEngine.js`
14. `js/text/systems/combatResolutionEngine.js`
15. weapon/equipment/ammunition canonical data authorities
16. current-schema persistence and focused combat tests

## Final validation contract

This handoff is the final repository-file mutation for B3.

After this write:
- perform **no repository-file mutations**;
- validate the exact resulting `main` SHA with hosted Check;
- confirm Repository Audit, **844/844 tests**, Census, Benchmark 3, and Benchmark Sample;
- confirm Pages succeeds on the same exact SHA;
- confirm `main` still points to that exact SHA after validation.

The final SHA and final Check/Pages run IDs are external validation evidence and must not be inserted by another repository write.
