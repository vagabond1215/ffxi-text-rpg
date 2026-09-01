# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

```text
Product:       0.9.300.3
Package:       0.9.300
Account Save:  5
Game State:    20
Data:          70
Benchmark:     3
Codename:      Novice Elemental Resolution Breadth
Runtime:       Node >=24
Phase:         0.9
0.9.100:       COMPLETE
0.9.200:       COMPLETE — Adventure Vertical Slices
0.9.300:       ACTIVE — Advanced Combat / Training
Packet 1:      COMPLETE — Current Melee Kata Breadth
Packet 2:      COMPLETE — Character Affinity & Kata Substitution Foundation
Packet 3:      COMPLETE — Novice Elemental Resolution Breadth
Next packet:   UNSELECTED — requires fresh bounded work order
```

## Latest bounded unit — 0.9.300 Packet 3

Permanent record:
- `docs/ADVANCED_COMBAT_0_9_300_P3_NOVICE_ELEMENTAL_RESOLUTION_BREADTH.md`.

Permanent combat design authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Previous packet:
- `docs/ADVANCED_COMBAT_0_9_300_P2_CHARACTER_AFFINITY_KATA_SUBSTITUTION.md`.

Adjacent/stale combat audit:
- `docs/COMBAT_ADJACENCY_AND_DEBT_AUDIT.md`.

### Behavioral/data implementation freeze

`32f0ee268525f096f40421414af180e90a724397`

Hosted evidence:
- Check #1981 / run `33515422352`;
- Repository Audit PASS;
- **870/870 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #2111 / run `33515422056` PASS.

This freeze intentionally predates Product/Data promotion and authority synchronization.

### Promoted authority checkpoint before this handoff

`cef5145b8356563cb43594cbb7ce39874e4014a4`

At this checkpoint:
- Product 0.9.300.3 / Package 0.9.300 / Game State 20 / Data 70 promotion is complete;
- runtime version guards are synchronized;
- README, execution pipeline, roadmap, system catalog, version roadmap, project profile, combat design, architecture, Phase 0.9 plan, development direction, quality gates, resource lifecycle, changelog, and Packet 3 record are synchronized;
- Packet 3 is complete;
- no subsequent advanced-combat packet has been selected or implemented.

This handoff write is intended to be the final repository-file mutation for Packet 3.

## Why Packet 3 was selected

The post-Packet-2 debt boundary listed action-contract/catalog migration as the highest-leverage next combat domain.

The existing novice Elemental Form tranche was the smallest coherent migration:
- all eight abilities already existed;
- all eight were already character-learnable/executable;
- their names are compatible with direct single-target delivery;
- their pre-Packet-3 effects were generic flat damage without B1 structured resolution metadata;
- migrating them required no geometry, new state family, new ability, or new task owner.

Packet 3 therefore improves real executable mechanics instead of increasing the 41/100 ability count with filler.

## What Packet 3 implements

### Eight migrated novice Elemental Form attacks

The canonical migrated set is:

1. **Cinder Bolt** — fire / INT;
2. **Stone Shards** — earth / INT;
3. **Gale Cutter** — wind / INT;
4. **Tide Needle** — water / INT;
5. **Storm Jolt** — lightning / INT;
6. **Rime Splinters** — ice / INT;
7. **Sunlance** — light / MND;
8. **Gloam Spike** — dark / INT.

No IDs, capability links, learning contracts, activation durations, MP costs, cooldowns, base potency, coefficients, or scaling stats changed.

Executable ability count remains **41**.

### Unified resolution metadata

Each migrated damage effect now carries:
- `channel: magical`;
- canonical elemental identity matching its authored tag;
- `elementSource: ability`;
- `accuracyModel: magic`;
- `resistanceModel: magicDefense`;
- `criticalEligible: false`.

Direct-delivery metadata is bounded to the current single-target model:
- projectile: Cinder Bolt, Stone Shards, Tide Needle, Rime Splinters, Sunlance, Gloam Spike;
- spell delivery: Gale Cutter, Storm Jolt.

Each migrated ability now also carries:
- `recoverySeconds: 2`.

Activation, action recovery, and cooldown therefore remain mechanically distinct.

### Resolution authority remains singular

No new spell-damage or elemental resolver exists.

The runtime flow remains:

```text
ability definition
  -> abilityEngine activation / costs / target
  -> combatResolutionEngine
      magic accuracy
      magic defense
      elemental resistance
      structured evidence
  -> combat action history / recovery
```

`combatResolutionEngine` remains formula authority.

## Focused Packet 3 guard

Primary guard:
- `tests/advancedCombatNoviceElementalResolution.test.js`.

It proves:
- `ABILITY_CATALOG_VERSION === 7`;
- ability count remains 41;
- all eight definitions retain existing contracts except the intended resolution/recovery metadata;
- each ability carries the correct canonical element;
- all eight use magic accuracy and magic defense;
- 50 elemental resistance produces structured resistance 50 / multiplier 0.5 and lower damage;
- all eight impose explicit 2-second post-action recovery;
- Sunlance retains MND scaling;
- the other seven retain their prior INT scaling;
- Tempest Ring, Thunder Cage, and Umbral Well remain deliberately unmigrated.

## Version decisions

```text
Product       0.9.300.2 -> 0.9.300.3
Package       0.9.300   -> 0.9.300
Account Save  5         -> 5
Game State    20        -> 20
Data          69        -> 70
Benchmark     3         -> 3
```

### Why Game State remains 20

Packet 3 adds no durable player/world fact and changes no serialized state shape.

Existing ability runtime cooldown/activation state is unchanged.

No supported-save migration is added.

### Why Data advances to 70

Eight canonical authored ability definitions gain executable resolution/recovery metadata.

`ABILITY_CATALOG_VERSION` advances 6 -> 7.

No new ability/capability/content record is added.

## Deliberately unmigrated adept elemental tranche

Packet 3 explicitly does **not** migrate:
- Flare Bloom;
- Fault Rush;
- Tempest Ring;
- Riptide Lance;
- Thunder Cage;
- Rimefall;
- Radiant Arc;
- Umbral Well.

Reason: several names imply mechanics beyond direct single-target elemental damage.

Especially:
- **Tempest Ring** implies ring/area geometry;
- **Thunder Cage** implies containment/control and possibly status/zone semantics;
- **Umbral Well** implies a persistent field/zone or draw effect.

Adding only element metadata to those definitions would make resistance behavior better while leaving their names mechanically misleading. A later packet must select the actual semantic family before changing them.

## Existing authorities preserved

- `abilities.js` owns canonical authored ability definitions.
- `capabilities.js` owns learned capability requirements.
- `abilityEngine.js` owns activation/cost/cooldown/recovery execution.
- `combatResolutionEngine.js` owns damage, accuracy, defense, and elemental resistance.
- `combatTurnEngine.js` owns canonical combat readiness/action history.
- `characterAffinityEngine.js` remains durable character-affinity authority.
- `weaponKataEngine.js` remains kata configuration/eligibility/cursor authority.
- active battle remains encounter authority.
- canonical fictional world time remains the only simulation/combat clock.

No new direct timed-task owner was introduced.

## Explicitly deferred / still nonexistent

Packet 3 does **not** make the following real:
1. ring/cone/line/chain/zone target geometry;
2. Thunder Cage binding/containment behavior;
3. Umbral Well persistent field behavior;
4. aura/stance/zone/channel/reaction action families;
5. weapon resonance or generic imbuement;
6. LOS/reachability/pursuit/search/disengagement;
7. universal passive block/parry/guard/counter/interruption;
8. named prepared loadout presets;
9. unsupported weapon-family kata;
10. broad martial-technique migration;
11. broad Veilscript migration;
12. broad adept Elemental Form migration;
13. mechanics-census filler.

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

**No Packet 4 is selected.**

A future explicit combat continuation should reassess the remaining semantic debt and select exactly one bounded family.

Strong candidates include:
- **Thunder Cage control foundation** — one status/control semantic without general geometry;
- **Tempest Ring geometry foundation** — if area/ring targeting is selected as the next architectural need;
- **Umbral Well field/zone foundation** — if persistent combat fields are selected;
- one bounded martial-technique resolution migration tranche;
- engagement geometry / LOS / pursuit / disengagement;
- weapon resonance/imbuement;
- passive defense/reaction semantics.

Do not combine these automatically.

The 41/100 ability count remains progression evidence, not permission to add duplicates.

## Preserved interrupted/resumable queues

Packet 3 does not cancel earlier queues:

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
- ability definitions own authored action contract;
- ability engine owns activation/cooldown/recovery execution;
- combat resolution owns hit/damage/resistance formulas;
- combat action history stores structured evidence;
- no cosmetic action-name semantics presented as implemented mechanics;
- current-schema-only pre-alpha persistence;
- Data and Game State advance independently;
- no hard benchmark timing thresholds;
- no census filler;
- exact behavioral/data freeze before promotion/synchronization;
- `docs/THREAD_HANDOFF.md` is the final repository-file write for a closed packet.

## Restart order after Packet 3

1. `AGENTS.md`
2. this handoff
3. `PROJECT_PROFILE.yaml`
4. `docs/EXECUTION_PIPELINE.md`
5. `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`
6. `docs/ADVANCED_COMBAT_0_9_300_P3_NOVICE_ELEMENTAL_RESOLUTION_BREADTH.md`
7. `docs/COMBAT_ADJACENCY_AND_DEBT_AUDIT.md`
8. `docs/ROADMAP.md`
9. inspect current runtime only for the freshly selected bounded domain
10. select exactly one next advanced-combat packet before implementation

Do not redo the closed broad combat-adjacency audit unless repository evidence materially diverges.

## Final validation contract

This handoff is the intended final repository-file mutation for 0.9.300 Packet 3.

After this write:
- perform **no repository-file mutations** unless exact-head validation exposes a real failure;
- validate the exact resulting `main` SHA with hosted Check;
- confirm Repository Audit, **870/870 tests**, Census, Benchmark 3, and Benchmark Sample;
- confirm Pages succeeds on the same exact SHA;
- confirm `main` remains on that exact SHA after validation.

If exact-head validation exposes a stale assertion or synchronization defect, repair it, then rewrite this handoff last again before the final validation pass.
