# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

```text
Product:       0.9.300.8
Package:       0.9.300
Account Save:  5
Game State:    21
Data:          75
Benchmark:     3
Codename:      Martial Structured Resolution Breadth
Runtime:       Node >=24
Phase:         0.9
0.9.100:       COMPLETE
0.9.200:       COMPLETE — Adventure Vertical Slices
0.9.300:       ACTIVE — Advanced Combat / Training
Packet 1:      COMPLETE — Current Melee Kata Breadth
Packet 2:      COMPLETE — Character Affinity & Kata Substitution Foundation
Packet 3:      COMPLETE — Novice Elemental Resolution Breadth
Packet 4:      COMPLETE — Thunder Cage Control Foundation
Packet 5:      COMPLETE — Tempest Ring Geometry Foundation
Packet 6:      COMPLETE — Umbral Well Field Foundation
Packet 7:      COMPLETE — Radiant Arc Propagation Foundation
Packet 8:      COMPLETE — Martial Structured Resolution Breadth
Next unit:     UNSELECTED IMPLEMENTATION — 0.9.300 maturity reassessment is the next bounded decision unit
```

## Latest bounded unit — 0.9.300 Packet 8

Permanent record:
- `docs/ADVANCED_COMBAT_0_9_300_P8_MARTIAL_STRUCTURED_RESOLUTION_BREADTH.md`.

Permanent combat design authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Behavioral/data implementation freeze:
- `4a89df88f408062aa3e90b1284c9c3497e248f6e`.

Hosted freeze evidence:
- Check #2132 / run `33575392561`;
- Repository Audit PASS;
- **895/895 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #2261 / run `33575391923` PASS.

Promoted authority checkpoint before this handoff:
- `c62008302eb35ed5477d2e453d4e813053ac68e6`.

This handoff write is intended to be the final repository-file mutation for Packet 8.

## Packet 8 behavior

Exactly three existing executable techniques were migrated from raw fixed damage to the shared physical combat-resolution contract:

### Guarded Cut
- sword requirement preserved;
- STR / base 4 / coefficient 0.9 preserved;
- 250 TP / 8s cooldown preserved;
- 12s defense +2 `guarded` self-buff preserved;
- adds 3s recovery;
- melee / physical / slashing;
- physical accuracy vs evasion;
- physical defense;
- explicitly non-critical.

### Barkboar Brace
- axe requirement preserved;
- STR / base 6 / coefficient 1.05 preserved;
- 300 TP / 10s cooldown preserved;
- 15s defense +3 `braced` self-buff preserved;
- adds 4s recovery;
- melee / physical / slashing;
- physical accuracy vs evasion;
- physical defense;
- explicitly non-critical.

### Thicket Feint
- dagger requirement preserved;
- DEX / base 5 / coefficient 1.0 preserved;
- 225 TP / 8s cooldown preserved;
- 10s defense +1 `mobile` self-buff preserved;
- adds 2s recovery;
- melee / physical / piercing;
- physical accuracy vs evasion;
- physical defense;
- critical-eligible through existing character critical stats.

The existing effect-order law is unchanged: target damage and self-buff are separate effects. A missed target attack still applies the authored self-buff.

No Packet-8-specific runtime owner or branch was added.

## Martial maturity consequence

Ridge Breaker and Rivet Guard were already structured before Packet 8.

After Packet 8, all five current executable martial techniques use structured damage resolution where applicable:

1. Guarded Cut;
2. Ridge Breaker;
3. Rivet Guard;
4. Barkboar Brace;
5. Thicket Feint.

Executable ability count remains **41**.

Legacy recovered Weapon Skill data and non-executable capability names remain research/migration debt; they are not current combat authority.

## Persistence/version decision

```text
Product       0.9.300.7 -> 0.9.300.8
Package       0.9.300   -> 0.9.300
Account Save  5         -> 5
Game State    21        -> 21
Data          74        -> 75
Benchmark     3         -> 3
```

System-version changes:
- version manifest: 0.9.300.7 -> 0.9.300.8;
- ability catalog: 0.10.0 -> 0.11.0.

`ABILITY_CATALOG_VERSION` advances 11 -> 12.

Game State remains 21 because Packet 8 adds no new durable fact. Existing status expiry, ability cooldowns, combat readiness, action history, capability state, and equipment state already own all future consequences.

No supported-save migration is added.

## Focused guard

Primary guard:
- `tests/advancedCombatMartialStructuredResolution.test.js`.

It proves:
- ability catalog version 12;
- ability count 41;
- exact stable identity/cost/cooldown/potency/self-buff preservation;
- real weapon-context gates;
- physical-defense sensitivity;
- deterministic physical misses;
- self-buff-on-miss semantics;
- Guarded Cut / Barkboar Brace non-critical behavior;
- Thicket Feint existing-stat critical behavior;
- 3/4/2-second recovery;
- structured action-history evidence;
- no new martial/technique durable state;
- valid current Game State 21.

Packet 3–7 guards were changed only to recognize the catalog-version increase.

## Explicitly deferred / still nonexistent

Packet 8 does not implement:
- movement or repositioning from `mobile` / feint terminology;
- guard/parry/block/counter passive execution;
- reaction windows;
- combo chains;
- named loadout presets;
- weapon resonance or generic imbuement;
- LOS / line-of-fire / cover;
- pursuit / search / disengagement;
- mutable combat coordinates;
- pathfinding;
- broad legacy Weapon Skill migration;
- new martial abilities for census count;
- Shadow Feint as a new executable ability;
- broad spell-catalog cleanup.

Stale/noncanonical combat surfaces remain forbidden as new authority:
- `battle.targetId`;
- `battle.actionDelay`;
- `battle.recasts`;
- `battle.casting`;
- root `js/ui.js`;
- root `js/encounter.js`;
- root `data/weaponskills.js`;
- legacy FFXI job/affinity terminology.

Exploration aggro remains separate from active-battle attention.

## Next bounded unit — 0.9.300 maturity reassessment

**No Packet 9 is selected. Do not implement another combat packet automatically.**

The next explicit continuation should perform a bounded maturity reassessment of the now-eight-packet 0.9.300 track.

Reassess:
1. whether any remaining combat defect is an alpha-loop blocker rather than enrichment;
2. whether stale combat placeholders justify one cleanup packet;
3. whether engagement geometry / LOS / pursuit is required before leaving 0.9.300 or can remain later depth work;
4. whether passive block/parry/guard/counter/reaction semantics are required now;
5. whether remaining spell names such as Rimefall / Flare Bloom should remain deferred;
6. whether 0.9.300 is mature enough to pause/close and return to the broader persistent-life loop.

Expected recommendation absent a newly discovered blocker:
- treat 0.9.300 as mature enough to pause after the reassessment;
- switch to `0.9.400 Economy / Production Depth`;
- begin with **Occupational Tool Conversion** under `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.

The reassessment is a decision unit only. It must not silently implement Packet 9 or start 0.9.400.

## Preserved noncombat queues

- **Occupational Tool Conversion:** strongest prepared 0.9.400 candidate.
- **World edge:** Waymeet Inner Marches / outer crossroads first, then Coppergrass extensions, then Drowned Vaults.
- **Locality enrichment:** ambient/risk events, wandering/seasonal merchants, directions/help dialogue, richer contextual dialogue, shop browse/category depth, learned-locality presentation.
- **Ecology:** five-part repair sequence complete; do not restart without a fresh work order.

## Standing governance

Preserve:
- one canonical fictional world clock;
- one owner per state family;
- active battle as encounter authority;
- ability catalog as authored target/effect contract;
- ability engine as activation/cost/cooldown/effect-order/recovery authority;
- combat resolution as hit/damage/defense/resistance formula authority;
- combat geometry as projection/query, not mutable movement state;
- combat attention as Enmity/Focus/Aggro/Fixation authority;
- no cosmetic action-name semantics presented as implemented mechanics;
- current-schema-only pre-alpha persistence;
- independent Data and Game State version decisions;
- no census filler;
- implementation freeze before Product/Data promotion;
- `docs/THREAD_HANDOFF.md` written last for a closed packet.

## Restart order

1. `AGENTS.md`;
2. this handoff;
3. `PROJECT_PROFILE.yaml`;
4. `docs/EXECUTION_PIPELINE.md`;
5. `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`;
6. `docs/ADVANCED_COMBAT_0_9_300_P8_MARTIAL_STRUCTURED_RESOLUTION_BREADTH.md`;
7. `docs/COMBAT_ADJACENCY_AND_DEBT_AUDIT.md`;
8. `docs/ROADMAP.md`;
9. inspect only current combat debt relevant to the maturity reassessment;
10. make the pause/close-vs-one-more-bounded-packet recommendation before any implementation.

Do not redo the broad combat-adjacency audit unless repository evidence materially diverges.

## Final validation contract

After this handoff write:
- perform no repository-file mutation unless exact-head validation exposes a real failure;
- validate the exact resulting `main` SHA with hosted Check;
- confirm Repository Audit, **895/895 tests**, Census, Benchmark 3, and Benchmark Sample;
- confirm Pages succeeds on the same exact SHA;
- confirm `main` remains on that exact SHA.

If final validation exposes a synchronization defect, repair it and rewrite this handoff last again.
