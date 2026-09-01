# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

```text
Product:       0.9.200.3
Package:       0.9.200
Account Save:  5
Game State:    16
Data:          64
Benchmark:     3
Codename:      Enemy Attention Foundation
Runtime:       Node >=24
Phase:         0.9
Track:         0.9.200 Adventure Vertical Slices ACTIVE
Slice A:       COMPLETE
Slice B B1:    COMPLETE
Slice B B2:    COMPLETE
Next packet:   B3 Combat Loadout Transition Foundation — QUEUED / NOT STARTED
```

## Latest bounded unit — Combat 2.0 Packet B2

Permanent record:
- `docs/COMBAT_2_0_B2_ENEMY_ATTENTION.md`.

Permanent design authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Slice B plan:
- `docs/COMBAT_2_0_SLICE_B_IMPLEMENTATION_PLAN.md`.

### Behavioral implementation freeze

`92e6d1623470fbc923ef9beebe148829418b7080`

Hosted evidence:
- Check #1881 / run `33459747237`;
- Repository Audit PASS;
- **837/837 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #2011 / run `33459746331` PASS.

This freeze intentionally predates Product/Game State promotion.

### Promoted synchronized-authority checkpoint

`72ecbeec0fb9519dac781b76c1c20a4d73bec6d1`

Hosted evidence:
- Check #1884 / run `33460313633`;
- job `99708891784`;
- Repository Audit PASS;
- **837/837 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #2014 / run `33460312671` PASS.

The promoted synchronization required one test-only follow-up after `e1a65752d1d6693966b2b132eecc99bbd079798f`: a stale pipeline assertion still expected validation system version 0.47.0 after the manifest advanced it to 0.48.0. Commit `72ecbeec0fb9519dac781b76c1c20a4d73bec6d1` corrects that expectation and changes no B2 runtime behavior.

## What B2 implements

New stateless runtime helper:
- `js/text/systems/combatAttentionEngine.js`.

Durable authority remains:
- `activeBattle.enmity`.

Per hostile, the battle persists actor-linked baseline/transient Enmity, floors, fictional-time decay anchors, sticky Aggro, optional Fixation/Priority, and target-selection policy.

Focus is normalized relative attention, not literal attack probability. No universal minimum target probability exists.

`recordCombatAction()` feeds representative pressure into the same attention contract. Enemy target selection no longer hard-selects the player.

## Version / persistence decision

```text
Product       0.9.200.2 -> 0.9.200.3
Package       0.9.200   -> 0.9.200
Account Save  5         -> 5
Game State    15        -> 16
Data          64        -> 64
Benchmark     3         -> 3
```

Game State advances because attention affects future resumable combat outcomes and cannot be reconstructed from prose. Data remains 64 because no authored content record changed.

No supported-save migration is added.

## Next bounded unit — B3 only

**Packet B3 — Combat Loadout Transition Foundation** is queued and **NOT STARTED**.

A future explicit `continue` should start B3 only.

B3 scope:
- directional stow/draw/equip/ready timing;
- prepared quick weapon-set swap vs full loadout change;
- canonical fictional-time consumption;
- attacks/weapon abilities locked during transition/recovery;
- canonical ability cooldown preservation;
- weapon-sequence reset by default;
- hard-disable interruption/block rules;
- armor-pressure lock based on actual Aggro/Focus/Fixation/pursuit.

B4/B5 remain separately bounded and must not auto-start.

## Preserved interrupted/resumable circles

B2 completion does **not** cancel previous queues.

- **Locality enrichment:** deferred/resumable after the completed foundation.
- **Occupational Tool Conversion:** preserved strongest prepared `0.9.400` candidate; resume existing Packet A audit.
- **World edge:** Waymeet Inner Marches first, then Coppergrass extensions, then Drowned Vaults.
- **Ecology:** five-part repair sequence complete; do not restart automatically.

## Standing architecture/governance rules

Preserve:
- one canonical fictional world clock;
- one domain authority per state family;
- active battle owns encounter and attention state;
- combat attention owns calculations/selection, not battle lifecycle;
- combat resolution owns formulas/results, not battle lifecycle;
- ability engine owns canonical activation/cooldowns;
- action history stores structured evidence; prose is not authority;
- current-schema-only pre-alpha persistence;
- Data and Game State advance independently;
- exact implementation freeze before continuity sync;
- `docs/THREAD_HANDOFF.md` final repository-file write after promoted validation.

## Restart order for B3

1. `AGENTS.md`
2. this handoff
3. `PROJECT_PROFILE.yaml`
4. `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`
5. `docs/COMBAT_2_0_B2_ENEMY_ATTENTION.md`
6. `docs/COMBAT_2_0_SLICE_B_IMPLEMENTATION_PLAN.md`
7. `docs/EXECUTION_PIPELINE.md`
8. `docs/ROADMAP.md`
9. `docs/ARCHITECTURE.md`
10. equipment/loadout authority
11. `js/text/systems/combatTurnEngine.js`
12. `js/text/systems/combatAttentionEngine.js`
13. current-schema persistence and combat tests

## Final validation contract

This handoff is the final repository-file mutation for B2.

After this write:
- perform **no repository-file mutations**;
- validate the exact resulting `main` SHA with hosted Check;
- confirm Repository Audit, **837/837 tests**, Census, Benchmark 3, and Benchmark Sample;
- confirm Pages succeeds on the same exact SHA.

The final SHA and final Check/Pages run IDs are external validation evidence and must not be inserted by another repository write.
