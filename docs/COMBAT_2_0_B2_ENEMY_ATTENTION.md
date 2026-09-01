# Combat 2.0 Packet B2 — Enemy Attention Foundation

Status: **COMPLETE.**

## Runtime checkpoint

```text
Product:       0.9.200.3
Package:       0.9.200
Account Save:  5
Game State:    16
Data:          64
Benchmark:     3
Codename:      Enemy Attention Foundation
```

Behavioral implementation freeze:

`92e6d1623470fbc923ef9beebe148829418b7080`

Hosted evidence:
- Check #1881 / run `33459747237`;
- Repository Audit PASS;
- **837/837 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS;
- Pages #2011 / run `33459746331` PASS.

The freeze deliberately retained Product 0.9.200.2 / Game State 15 so runtime behavior could be validated before the durable-schema/version synchronization.

## Authority boundary

New stateless calculation/selection authority:
- `js/text/systems/combatAttentionEngine.js`.

Durable state authority:
- existing `activeBattle.enmity`.

The helper does **not** own battle lifecycle, combatants, fictional time, status storage, ability cooldowns, or persistence. It calculates and reconciles attention owned by the active battle.

## Implemented attention contract

Per hostile, B2 stores actor-linked:
- baseline Enmity;
- transient Enmity;
- Enmity floor;
- fictional-time decay rate and last-update anchor;
- sticky Aggro target;
- optional Fixation/Priority;
- selection tuning policy.

Effective attention flows as:

```text
absolute Enmity
    -> normalized Focus
    -> nonlinear selection weight
    -> sticky Aggro
    -> optional Fixation / Priority
```

Focus is relative attention, **not literal attack probability**.

The default concentration exponent is 3, the sticky switch ratio is 1.25, and the current-target weight multiplier is 1.2. These are initial tuning values, not permanent genre laws.

There is no universal minimum target probability.

## Action integration

`recordCombatAction()` is the common attention input seam.

Representative Enmity pressure can derive from:
- damage;
- healing;
- landed statuses/control;
- explicit `data.attention.enmityBonus` for authored high-salience actions.

The action record stores applied attention evidence inside its existing structured `data` envelope.

## Aggro and reassessment

Enemy selection no longer hard-selects the player.

`selectEnemyAction()` delegates target choice to the attention authority while retaining the existing enemy action-policy selection.

Aggro is sticky. Ordinary reassessment occurs only when the caller requests a meaningful reassessment event. A challenger must overcome current-target stickiness before Aggro transfers.

Fixation can override ordinary switching without destroying underlying Enmity/Focus; when fixation ends, ordinary attention resumes coherently.

## Representative proof

`tests/combatAttentionEngine.test.js` proves:
- 40/40/20 Focus normalizes correctly and exponent-3 weighting strongly de-weights the low-Focus actor;
- one high-Enmity shield/bash-style test action moves Focus without necessarily stealing Aggro;
- repeated tank pressure can genuinely transfer Aggro;
- Fixation overrides ordinary switching while underlying Enmity continues changing;
- decay and floors are deterministic in fictional time;
- persisted attention rejects unknown actor links.

## Persistence/version decision

```text
Product       0.9.200.2 -> 0.9.200.3
Package       0.9.200   -> 0.9.200
Account Save  5         -> 5
Game State    15        -> 16
Data          64        -> 64
Benchmark     3         -> 3
```

Game State advances because attention state changes future resumable target selection and cannot be reconstructed safely from battle prose or canonical catalogs.

No supported-save migration is added. Pre-alpha current-schema-only persistence remains the policy.

Data remains 64 because B2 adds no canonical authored content record. The explicit high-Enmity bash/stun proof is an engine-level fixture rather than a counterfeit rewrite of Rivet Guard.

## Not part of B2

Still deferred:
- B3 timed combat loadout transitions and armor-pressure locking;
- B4 weapon-delay cadence, first-class ranged attacks, minimal configurable kata;
- B5 playable Brasshaven / Redstone combat-training integration;
- richer reachability/LOS/personality-specific attention policies;
- broad catalog authoring merely to raise census counts.

## Next bounded unit

**Packet B3 — Combat Loadout Transition Foundation** is queued and **NOT STARTED**.

Do not start B4/B5 automatically.
