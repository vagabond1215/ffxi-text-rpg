# Combat Adjacency, Stale-System, and Missing-Authority Audit

Status: CURRENT COMBAT ADJACENCY AUTHORITY / B3 ENTRY AUDIT COMPLETE.

This audit prevents Combat 2.0 work from extending stale legacy paths, reusing dead placeholder fields, or pretending planned systems already exist. It supplements the permanent combat design, Slice B implementation plan, and architecture documents.

## Audit baseline

Head at audit start: d579bc3f63173345c732678a436a635b49464796. Product 0.9.200.3, Game State 16, Data 64. B1 and B2 are complete; B3 is next.

## Canonical live combat authority

The live owners are battleEngine/activeBattle for encounter state, combatTurnEngine for readiness and action history, combatResolutionEngine for formulas, combatAttentionEngine plus activeBattle.enmity for hostile attention, abilityEngine for canonical activation/cooldowns, statusEngine for statuses, timedTaskEngine plus simulationInterruptEngine for fictional-time scheduling, and equipmentEngine plus inventory/container authority for physical equipment.

B3 must not create a second combat clock, equipment store, attention store, or loadout-only cooldown store.

## Exploration detection is not combat Aggro

js/text/systems/aggroEngine.js owns exploration spawn detection and encounter initiation. B2 combat Aggro is a hostile's sticky current target inside activeBattle. The shared word is historical terminology, not shared state authority. Do not read exploration spawn detection as combat Enmity/Aggro, and do not make combatAttentionEngine decide whether a world encounter begins.

## Live B3 defect: in-combat equipment split

equipmentEngine.equipItem() and unequipItem() currently mutate root state.player.equipment immediately during active combat. The active-battle player is a detached encounter snapshot, so this can make root equipment and encounter combat-driving authority disagree. B3 must close this immediate mutation path and route active-combat equipment changes through one canonical timed transition owner. Completion must synchronize root and battle-player equipment and recompute the battle combat profile.

## Stale combatant placeholders

battleEngine.refreshCombatant() still creates battle.targetId, battle.actionDelay, battle.recasts, and battle.casting. Repository search found no production consumer beyond persistence validation. They overlap newer authorities: B2 attention owns selected hostile target, the combat timeline owns readiness, and ability runtime owns activation/cooldowns. B3 must not reuse these fields. Removal is a bounded schema-cleanup candidate; otherwise leave them inert and tracked as debt.

## Legacy/reference combat surfaces

The active browser path is index.html -> js/main.js -> js/text. Root js/ui.js timer combat, root js/encounter.js, root data/weaponskills.js, and recovered legacy job/weapon-skill data are not canonical Combat 2.0 runtime authorities. Some remain referenced by old scripts/reference modules, so this audit does not authorize blind deletion. No new B3/B4 semantics may be implemented there. The current recovered techniques/job-ability presentation is live migration debt for a deliberately selected B4/B5/0.9.300 cleanup.

## Planned systems that do not exist yet

There is currently no canonical combat-loadout task owner, item stow/draw/ready handling schema, durable named loadout-preset store, LOS/reachability/pursuit/search engagement model, broad hard-disable vocabulary, weapon kata/sequence owner, or first-class ranged attack action. Do not synthesize compatibility fields merely to make those systems appear implemented.

## Adjacent calculated-but-nonexecuting stats

shieldBlock, parry, guard, counter, spellInterruptionRate, and ranged attack/accuracy are calculated or authored but are not yet complete executable mechanics. B3 does not turn them into universal passive rolls.

## Resolved B3 implementation contract

1. Add combatLoadoutEngine.js as a new audited direct timed-task owner with durable transition consequence, exactly-once reconciliation, and terminal task release.
2. Store the active transition on activeBattle because it exists only in encounter context and changes resumable outcomes. Expected persistence decision: Game State 16 -> 17.
3. Add optional normalized item handling metadata: stowSeconds, drawSeconds, readySeconds, cumbersome. Use deterministic family/two-handed fallbacks when metadata is absent.
4. Add explicit handling values only to a small representative canonical equipment set for deterministic proof. If canonical item definitions change, Data advances independently, expected 64 -> 65.
5. B3 foundation transitions are atomic: old equipment remains mechanically equipped until successful completion; interruption causes no equipment mutation.
6. Weapon slots mainHand/offHand/ranged/ammo are quick weapon-set transitions. Armor/accessory slots are full equipment transitions. Named saved presets are deferred.
7. During a transition, another equipment mutation, player attack, legacy technique/cast, and canonical ability activation are blocked. Existing canonical cooldown timestamps are untouched.
8. Completion applies equipment exactly once, synchronizes root and battle-player equipment/profile, imposes ready/recovery time, records structured evidence, and releases the task.
9. Weapon changes record resetWeaponSequence intent for future B4; B3 does not invent kata state.

## Armor-pressure rule for current runtime

Use real B2 attention only. Armor/accessory changes are blocked when a living threatening hostile has Aggro on the actor, Fixation on the actor, or actor Focus at/above a documented tunable armor-pressure threshold. A defeated or explicitly hard-disabled hostile does not exert immediate pressure.

LOS/pursuit/reachability do not exist in the runtime, so B3 must not grant an armor-swap exception from invented LOS flags. Until a real engagement model exists, living non-disabled encounter hostiles remain threatening. A later engagement model must add genuine pursuit/search/disengagement state before relaxing this conservative rule.

## Hard-disable boundary

B3 may add one narrow helper over status flags to answer whether an actor can presently act/threaten. This is not a claim that the full crowd-control system exists. A hard-disabled player cannot start a transition; a transition hard-disabled before completion is cancelled without equipment mutation.

## B3 validation

Prove direct combat equip no longer splits authority; directional timing; quick versus full transitions; unchanged equipment before completion; root/battle coherence after completion; attacks/abilities blocked during transition; cooldown preservation; Aggro/Fixation/Focus armor locks; hard-disable block/interruption; active-transition save/load; owner/task-link validation; and terminal task release without leakage.

## Deferred user/design input

Keep these as explicit future decisions rather than hidden B3 assumptions: whether detailed future transitions expose partial stowed/not-ready equipment state or stay atomic; whether named prepared loadouts become durable player configuration and under what limits; what LOS/reachability/pursuit/search/disengagement model breaks pressure; whether shield/parry/guard/counter/interruption are passive, stance/reaction, technique-specific, or enemy/weapon dependent; and whether recovered techniques/discipline menus migrate during B4/B5 or the broader 0.9.300 pass.

## Next work

With this audit recorded, proceed with B3 Combat Loadout Transition Foundation only. B4/B5 remain separately bounded.
