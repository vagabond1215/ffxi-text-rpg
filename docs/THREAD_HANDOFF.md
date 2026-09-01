# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

```text
Product:       0.9.300.2
Package:       0.9.300
Account Save:  5
Game State:    20
Data:          69
Benchmark:     3
Codename:      Character Affinity & Kata Substitution
Runtime:       Node >=24
Phase:         0.9
0.9.100:       COMPLETE
0.9.200:       COMPLETE — Adventure Vertical Slices
0.9.300:       ACTIVE — Advanced Combat / Training
Packet 1:      COMPLETE — Current Melee Kata Breadth
Packet 2:      COMPLETE — Character Affinity & Kata Substitution Foundation
Next packet:   UNSELECTED — requires fresh bounded work order
```

## Latest bounded unit — 0.9.300 Packet 2

Permanent record:
- `docs/ADVANCED_COMBAT_0_9_300_P2_CHARACTER_AFFINITY_KATA_SUBSTITUTION.md`.

Permanent combat design authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Previous packet:
- `docs/ADVANCED_COMBAT_0_9_300_P1_MELEE_KATA_BREADTH.md`.

Adjacent/stale combat audit:
- `docs/COMBAT_ADJACENCY_AND_DEBT_AUDIT.md`.

### Behavioral implementation freeze

`cbbec82e7d908c32dcb849e13f59461c83b6637a`

Hosted evidence:
- Check #1956 / run `33477009897`;
- Repository Audit PASS;
- **867/867 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #2086 / run `33477008886` PASS.

This freeze intentionally predates Product/Game State/Data promotion and authority synchronization.

### Promoted authority checkpoint before this handoff

`e81412fe51c244ddc093d5417c6dc82e7f8eb4c2`

At this checkpoint:
- Product 0.9.300.2 / Package 0.9.300 / Game State 20 / Data 69 promotion is complete;
- runtime version guards and stale current-Game-State test titles/assertions are synchronized;
- README, execution pipeline, roadmap, system catalog, version roadmap, project profile, combat design, architecture, Phase 0.9 plan, development direction, quality gates, resource lifecycle, changelog, and Packet 2 record are synchronized;
- Packet 2 is complete;
- no subsequent advanced-combat packet has been selected or implemented.

This handoff write is intended to be the final repository-file mutation for Packet 2.

## What Packet 2 implements

### Character affinity authority

`js/text/systems/characterAffinityEngine.js` now owns:

```text
player.progression.affinities
```

State version: 1.

Canonical element keys:
- fire;
- ice;
- wind;
- earth;
- lightning;
- water;
- light;
- dark.

Each affinity is a small non-negative integer rank. Rank 0 means no earned affinity.

The foundation exposes create/ensure/read/set/gain/validate operations. It does not create a separate affinity XP economy, timer, task owner, or battle-local affinity store.

Affinity is character-owned. It is not inferred from:
- active discipline/job;
- known elemental spells;
- elemental-magic proficiency;
- equipment;
- active battle.

Changing active discipline does not erase or transform earned affinity.

### Kata substitutions

The existing `weaponKataCatalog.js` remains authored kata data authority.

The existing `weaponKataEngine.js` remains configuration/eligibility/cursor authority.

Packet 2 adds exactly two representative affinity substitutions:

- **Rimepoint Thrust** — dagger slot 1, Ice, requires dagger proficiency 2 + Ice affinity rank 1;
- **Cinder-Braced Drive** — staff slot 3, Fire, requires staff proficiency 4 + Fire affinity rank 1.

Both remain ordinary selected move IDs in the existing configuration shape.

Eligibility is conjunctive:

```text
weapon proficiency requirement
AND
character affinity requirement
```

Physical defaults remain valid without affinity.

If a configured elemental substitution later becomes affinity-ineligible, runtime selection falls back to that slot's physical default instead of creating invalid encounter state.

### Combat-resolution integration

No elemental-kata resolver was created.

`battleEngine.resolveBasicAttack()` was widened only enough to pass authored:
- channel;
- damage type;
- element;
- element source;
- resistance model;

from the kata attack profile into the existing `combatResolutionEngine`.

The representative substitutions therefore use the same physical-defense and elemental-resistance evidence path already established by B1.

## Persistence and version decisions

```text
Product       0.9.300.1 -> 0.9.300.2
Package       0.9.300   -> 0.9.300
Account Save  5         -> 5
Game State    19        -> 20
Data          68        -> 69
Benchmark     3         -> 3
```

### Why Game State 20

`player.progression.affinities` is a new required durable character fact that affects future combat configuration and outcomes.

Current-schema persistence validation requires the versioned affinity object and every canonical element rank.

No supported-save migration is added under the current pre-alpha policy.

### Why Data 69

Canonical authored kata data adds:
- Rimepoint Thrust;
- Cinder-Braced Drive.

No equipment, NPC, POI, route, item, quest, companion, spell, capability, or filler record was added for count.

### Why kata configuration stays version 2

The serialized shape remains:

```text
version
selections[familyId][slot] = moveId
```

Affinity substitutions are additional allowed move IDs, not a new configuration field.

`WEAPON_KATA_CONFIGURATION_VERSION` therefore remains 2.

### Why active-battle kata stays version 1

`activeBattle.weaponKata.byActorId` still stores:
- family;
- next slot;
- last move ID;
- action count;
- reset count;
- last reset reason.

No encounter-local affinity or substitution field was needed.

`BATTLE_WEAPON_KATA_STATE_VERSION` remains 1.

## Focused Packet 2 guard

Primary guard:
- `tests/advancedCombatAffinitySubstitution.test.js`.

It proves:
- valid default affinity state;
- affinity independence from active discipline;
- invalid element/rank rejection;
- affinity + weapon-proficiency conjunctive eligibility;
- Rimepoint Thrust execution through existing resolution;
- elemental resistance in structured action evidence;
- safe fallback to physical default when affinity is removed;
- Cinder-Braced Drive as a second-family proof;
- current-schema affinity + configured-substitution save/load.

The first hosted implementation run found one test-fixture issue: the staff resistance proof mutated a battle combat-profile cache directly, and normal combat refresh correctly discarded that mutation. The repaired proof places resistance in source status modifiers before encounter creation, so recalculation preserves the canonical resistance input. Runtime behavior did not need a repair.

## Existing authorities preserved

- `characterAffinityEngine.js` owns durable character affinity only.
- `weaponKataCatalog.js` owns authored kata moves/options.
- `weaponKataEngine.js` owns kata configuration, eligibility, and cursor semantics.
- `weaponCadenceEngine.js` owns weapon-delay -> fictional-time recovery conversion only.
- `combatResolutionEngine.js` owns hit/defense/damage/elemental-resistance math.
- `combatLoadoutEngine.js` owns timed equipment transitions.
- equipment/inventory remain physical item authorities.
- capability engine remains learned-capability authority.
- active battle remains encounter authority.
- canonical world time remains the only combat/simulation time authority.

No new direct timed-task owner was introduced.

## Explicitly deferred / still nonexistent

Packet 2 does **not** make the following systems real:
1. weapon resonance or enchanted-weapon supplied elements;
2. generic temporary elemental imbuements;
3. aura, stance, zone, channel, or reaction first-class action families;
4. LOS/reachability/pursuit/search/disengagement simulation;
5. generalized ranged line-of-fire geometry;
6. universal passive block/parry/guard/counter/interruption rolls;
7. named prepared loadout presets;
8. partial stowed/not-ready equipment state;
9. kata for unsupported great axe, polearm, great sword, katana, hand-to-hand, archery, marksmanship, or other families without current canonical runtime support;
10. broad recovered `/techniques` migration;
11. broad affinity-substitution catalog expansion;
12. mechanics-census filler.

Do not infer these from the permanent design document.

## Stale/noncanonical combat surfaces remain non-authoritative

Do not build future advanced combat on:
- `battle.targetId`;
- `battle.actionDelay`;
- `battle.recasts`;
- `battle.casting`;
- root `js/ui.js` timer combat;
- root `js/encounter.js`;
- root `data/weaponskills.js`;
- legacy FFXI job/affinity terminology.

Exploration spawn detection `aggroEngine` remains separate from active-battle Enmity/Aggro.

## Next advanced-combat decision boundary

**No Packet 3 is selected.**

A future explicit combat continuation should first reassess current combat debt and choose one bounded unit. Candidate domains include, but are not automatically authorized:
- action-contract/catalog migration for names whose mechanics remain flatter than their semantics;
- weapon resonance/imbuement;
- engagement geometry / LOS / pursuit / disengagement;
- aura/stance/zone/channel/reaction action families;
- passive defense/reaction semantics;
- unsupported weapon-family support where canonical equipment/content justifies it.

Do not combine these into one packet.

The mechanics-scale ability gap remains a planning signal, not permission to mass-author mechanically duplicate actions.

## Preserved interrupted/resumable queues

Packet 2 does not cancel earlier queues:

- **Occupational Tool Conversion — preserved/queued:** strongest prepared `0.9.400 Economy / Production Depth` candidate. Authority: `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.
- **World edge — paused/resumable:** Waymeet Inner Marches / outer crossroads first, then Coppergrass extensions, then Drowned Vaults. Authorities: `docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md`, `docs/WORLD_MACRO_TOPOLOGY.md`.
- **Locality enrichment — deferred/resumable:** ambient/risk events, wandering/seasonal merchants, generalized directions/help dialogue, richer contextual dialogue, staged shop category/browse depth, learned-locality graphical presentation. Authority: `docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md`.
- **Ecology:** five-part flora/fauna diversity repair sequence remains COMPLETE. Do not restart without a fresh bounded work order.

## Standing governance rules

Preserve:
- one canonical fictional world clock;
- one domain authority per state family;
- character-owned progression survives discipline switching;
- active battle owns encounter/attention/loadout/kata encounter state;
- player progression owns durable affinity and kata configuration;
- combat resolution owns hit/damage/resistance formulas;
- combat attention owns attention calculation/selection;
- combat loadout owns timed equipment transition/reconciliation;
- weapon cadence owns delay conversion only;
- weapon kata owns configuration/eligibility/cursor semantics only;
- equipment/inventory remain physical item authorities;
- ability engine owns canonical activation/cooldowns;
- action history stores structured evidence; prose is not authority;
- current-schema-only pre-alpha persistence;
- Data and Game State advance independently;
- no hard benchmark timing thresholds;
- no census filler;
- exact behavioral implementation freeze before promotion/synchronization;
- `docs/THREAD_HANDOFF.md` is the final repository-file write for a closed packet.

## Restart order after Packet 2

1. `AGENTS.md`
2. this handoff
3. `PROJECT_PROFILE.yaml`
4. `docs/EXECUTION_PIPELINE.md`
5. `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`
6. `docs/ADVANCED_COMBAT_0_9_300_P2_CHARACTER_AFFINITY_KATA_SUBSTITUTION.md`
7. `docs/COMBAT_ADJACENCY_AND_DEBT_AUDIT.md`
8. `docs/ROADMAP.md`
9. `docs/ARCHITECTURE.md`
10. inspect current runtime/code only for the newly selected bounded domain
11. if continuing advanced combat, select exactly one next packet before implementation

Do not redo the closed broad combat-adjacency audit unless repository evidence materially diverges.

## Final validation contract

This handoff is the intended final repository-file mutation for 0.9.300 Packet 2.

After this write:
- perform **no repository-file mutations** unless exact-head validation exposes a real failure;
- validate the exact resulting `main` SHA with hosted Check;
- confirm Repository Audit, **867/867 tests**, Census, Benchmark 3, and Benchmark Sample;
- confirm Pages succeeds on the same exact SHA;
- confirm `main` remains on that exact SHA after validation.

If exact-head validation exposes a stale assertion or synchronization defect, repair it, then rewrite this handoff last again before the final validation pass.
