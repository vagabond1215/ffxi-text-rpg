# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

```text
Product:       0.9.300.1
Package:       0.9.300
Account Save:  5
Game State:    19
Data:          68
Benchmark:     3
Codename:      Current Melee Kata Breadth
Runtime:       Node >=24
Phase:         0.9
0.9.100:       COMPLETE
0.9.200:       COMPLETE — Adventure Vertical Slices
0.9.300:       ACTIVE — Advanced Combat / Training
Packet 1:      COMPLETE — Current Melee Kata Breadth
Packet 2:      Character Affinity & Kata Substitution Foundation — QUEUED / NOT STARTED
```

## Latest bounded unit — 0.9.300 Packet 1

Permanent record:
- `docs/ADVANCED_COMBAT_0_9_300_P1_MELEE_KATA_BREADTH.md`.

Permanent combat design authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Adjacent/stale combat audit:
- `docs/COMBAT_ADJACENCY_AND_DEBT_AUDIT.md`.

### Behavioral implementation freeze

`ccd8d5ba6cc02928c0b93755b42c4f1f6aca0aef`

Hosted evidence:
- Check #1947 / run `33474558525`;
- job `99751006436`;
- Repository Audit PASS;
- **860/860 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #2077 / run `33474558121` PASS.

This freeze intentionally predates Product/Game State/Data promotion and authority synchronization.

### Promoted synchronized-authority checkpoint before final handoff

`9e2718527099e2a8167f9d94081d448cdf63def3`

At this checkpoint:
- Product 0.9.300.1 / Package 0.9.300 / Game State 19 / Data 68 promotion is complete;
- README, execution pipeline, roadmap, system catalog, version roadmap, project profile, combat design, architecture, quality gates, Phase 0.9 plan, development direction, lifecycle record, changelog, and Packet 1 record are synchronized;
- `0.9.300 Advanced Combat / Training` is active with Packet 1 complete;
- Packet 2 is queued/not started;
- Check #1950 / run `33474852387` confirmed the Repository Audit's only failures were the then-stale handoff version lines;
- no Packet 2 implementation has started.

### Final synchronization repair before this handoff rewrite

`d683ada3deb07901bb189111564f0a5564667fde`

The first exact-final-head run exposed one test-only stale assertion in `tests/playerSlatewaterRoadScoutFlow.test.js`: an older Slice A persistence guard hard-coded Game State `18`. The test now reads `VERSION.gameState` and its title no longer embeds a stale schema number. No Packet 1 runtime behavior changed.

Hosted repair-head evidence:
- Check #1952 / run `33475039939`;
- job `99752419036`;
- Repository Audit PASS;
- **860/860 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #2082 / run `33475039317` PASS.

This handoff rewrite is therefore the intended final repository mutation for Packet 1.

## What Packet 1 implements

Packet 1 broadens the already-proven B4 weapon-kata authority to every **currently equipped canonical melee weapon category** with real equipment and skill support.

Current automatic kata families:
- dagger;
- sword;
- axe;
- staff;
- club.

New authored sequences:
- **axe:** Set Hew -> Hooking Chop -> Driving Cleave;
- **staff:** Measured Thrust -> Turning Sweep -> Braced Drive;
- **club:** Short Strike -> Returning Blow -> Braced Strike.

The new families are not numeric copies:
- axe emphasizes heavier commitment, increasing defense penetration, and slower recovery;
- staff emphasizes accurate early control and a braced penetrating finish;
- club emphasizes compact accuracy with a modest committed finish.

All use the existing structured attack-profile vocabulary:
- scaling stat;
- coefficient;
- accuracy modifier;
- defense penetration;
- recovery multiplier.

No new combat-resolution formula, task owner, battle clock, or action-family subsystem was added.

## Existing authority preserved

`weaponKataCatalog.js` remains authored kata data authority.

`weaponKataEngine.js` remains the single runtime/configuration owner.

`weaponCadenceEngine.js` still owns only weapon-delay -> fictional-time recovery conversion.

`combatResolutionEngine.js` still owns hit/defense/damage math.

`combatLoadoutEngine.js` still owns timed equipment transitions and sequence-reset intent.

Equipment/inventory remain physical item authorities.

## Proficiency and sequence behavior

The B4 proficiency law remains unchanged:
```text
learned proficiency 0 -> slot 1
learned proficiency 2 -> slots 1-2
learned proficiency 4 -> slots 1-3
```

Packet 1 proves the same 1/2/3-slot progression on axe rather than inventing a separate advanced-track rule.

B3/B4 loadout resets now automatically rebind to axe/staff/club when those supported families are equipped.

The historical B5 South Redstone integration guard was updated accordingly: its Bronze Axe swap now rebinds the encounter sequence to `axe` instead of the former unsupported/null family.

## Persistence decision

```text
Product       0.9.200.6 -> 0.9.300.1
Package       0.9.200   -> 0.9.300
Account Save  5         -> 5
Game State    18        -> 19
Data          67        -> 68
Benchmark     3         -> 3
```

### Why Game State 19

`WEAPON_KATA_CONFIGURATION_VERSION` advances 1 -> 2.

`player.progression.weaponKata.selections` now requires durable selections for axe, staff, and club in addition to dagger/sword. A current-schema save therefore has a materially different required progression contract.

A real current-schema save/load round trip is covered by `tests/advancedCombatKataBreadth.test.js`.

No supported migration is added under the current pre-alpha policy.

### Why active-battle kata version stays 1

`activeBattle.weaponKata.byActorId` keeps the same fields:
- family;
- next slot;
- last move;
- action count;
- reset count;
- last reset reason.

Only the valid family catalog broadens. No new encounter-local field is required, so `BATTLE_WEAPON_KATA_STATE_VERSION` remains 1.

### Why Data 68

Canonical authored kata data gains the new axe/staff/club families and move definitions.

No new equipment, NPC, POI, route, item, recipe, capability, or executable ability was added merely for count.

## Focused validation

Primary guard:
- `tests/advancedCombatKataBreadth.test.js`.

It proves:
- catalog/configuration validation;
- five-family default configuration;
- axe sequence cadence and increasing penetration;
- staff/club equipment-family binding;
- proficiency-gated 1/2/3 slot behavior;
- current-schema save/load of configuration version 2.

Existing B4/B5 guards remain active and passed in the behavioral freeze.

## Explicitly deferred / still nonexistent

Packet 1 does **not** make the following systems real:
1. canonical character elemental-affinity state;
2. affinity-driven kata substitutions;
3. weapon resonance / enchanted weapon element behavior;
4. aura, stance, zone, channel, or reaction first-class action families;
5. LOS/reachability/pursuit/search/disengagement simulation;
6. universal passive block/parry/guard/counter/interruption rolls;
7. named prepared loadout presets;
8. broad recovered `/techniques` migration;
9. kata for great axe, polearm, great sword, katana, hand-to-hand, archery, marksmanship, or other unsupported families without current canonical equipment/runtime support;
10. generalized ranged line-of-fire geometry.

Do not infer these from the permanent design document.

## Stale/noncanonical combat surfaces remain non-authoritative

Do not build Packet 2 on:
- `battle.targetId`;
- `battle.actionDelay`;
- `battle.recasts`;
- `battle.casting`;
- root `js/ui.js` timer combat;
- root `js/encounter.js`;
- root `data/weaponskills.js`.

Exploration spawn detection `aggroEngine` remains separate from active-battle Enmity/Aggro.

## Next bounded unit — do not auto-start beyond it

**0.9.300 Packet 2 — Character Affinity & Kata Substitution Foundation — QUEUED / NOT STARTED.**

The current runtime has no canonical character-affinity state. A future explicit `continue` should start Packet 2 by defining the **smallest durable character affinity authority** needed for earned elemental kata substitutions, then prove a deliberately small number of substitutions through the existing kata and combat-resolution contracts.

Packet 2 must not simultaneously implement:
- aura/stance/zone/channel/reaction families;
- LOS/pursuit/disengagement;
- a broad elemental move catalog;
- every weapon family;
- passive defense reaction systems.

Expected first design questions for Packet 2:
- what constitutes character affinity and how it is earned/owned;
- whether affinity is scalar, ranked, or thresholded;
- how kata substitution eligibility reads affinity without duplicating capability/magic progression;
- which one or two existing weapon families provide the representative proof;
- whether the new durable affinity shape requires Game State 20.

Do not predeclare the answer from legacy job/element data.

## Preserved interrupted/resumable circles

Packet 1 does not cancel earlier queues:
- **Locality enrichment — deferred/resumable:** ambient/risk events, wandering/seasonal merchants, generalized directions/help dialogue, richer contextual dialogue, staged shop category/browse depth, learned-locality graphical presentation. Authority: `docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md`.
- **Occupational Tool Conversion — preserved/queued:** strongest prepared `0.9.400 Economy / Production Depth` candidate. Authority: `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.
- **World edge — paused/resumable:** Waymeet Inner Marches / outer crossroads first, then Coppergrass extensions, then Drowned Vaults. Authorities: `docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md`, `docs/WORLD_MACRO_TOPOLOGY.md`.
- **Ecology:** the five-part flora/fauna diversity repair sequence is COMPLETE. Do not restart without a fresh bounded work order.

## Standing governance rules

Preserve:
- one canonical fictional world clock;
- one domain authority per state family;
- active battle owns encounter/attention/loadout/kata encounter state;
- player progression owns durable kata configuration;
- combat resolution owns hit/damage/resistance formulas;
- combat attention owns attention calculation/selection;
- combat loadout owns timed equipment transition/reconciliation;
- weapon cadence owns delay conversion only;
- weapon kata owns configuration/cursor semantics only;
- equipment/inventory remain physical item authorities;
- ability engine owns canonical activation/cooldowns;
- action history stores structured evidence; prose is not authority;
- current-schema-only pre-alpha persistence;
- Data and Game State advance independently;
- no hard benchmark timing thresholds;
- no census filler;
- exact behavioral implementation freeze before promotion/synchronization;
- `docs/THREAD_HANDOFF.md` is the final repository-file write for the packet.

## Restart order for Packet 2

1. `AGENTS.md`
2. this handoff
3. `PROJECT_PROFILE.yaml`
4. `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`
5. `docs/ADVANCED_COMBAT_0_9_300_P1_MELEE_KATA_BREADTH.md`
6. `docs/COMBAT_ADJACENCY_AND_DEBT_AUDIT.md`
7. `docs/EXECUTION_PIPELINE.md`
8. `docs/ROADMAP.md`
9. `docs/ARCHITECTURE.md`
10. inspect current character progression/capability/magic data for any real affinity-like authority
11. inspect `weaponKataCatalog.js`, `weaponKataEngine.js`, and `combatResolutionEngine.js`
12. define one bounded Packet 2 affinity/substitution contract before implementation

## Final validation contract

This handoff is the final repository-file mutation for 0.9.300 Packet 1.

After this write:
- perform **no repository-file mutations**;
- validate the exact resulting `main` SHA with hosted Check;
- confirm Repository Audit, **860/860 tests**, Census, Benchmark 3, and Benchmark Sample;
- confirm Pages succeeds on the same exact SHA;
- confirm `main` remains on that exact SHA after validation.

The final SHA and final Check/Pages run IDs are external validation evidence and must not be inserted by another repository write.