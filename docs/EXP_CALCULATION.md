# Experience Point Calculation Model

Reference: https://ffxiclopedia.fandom.com/wiki/Experience_Point_Calculation_Guide

This document captures the FFXI-style EXP calculation flow for later implementation. It is **not implemented yet** because the current text foundation still needs stable battle result, party, level sync, enemy con, chain, and bonus state.

## Core Understanding

The EXP guide is not a single flat formula. It is a staged calculation:

1. Determine the monster's level.
2. Determine the relevant player or party level used for base EXP.
3. Determine the base EXP value from level difference.
4. Apply party/level spread penalties where appropriate.
5. Divide/adjust for party size.
6. Apply caps.
7. Apply EXP chain bonuses.
8. Apply ring/campaign/event/other bonuses after the base calculation layer.

## Base EXP

Base EXP depends on the monster level compared to the player's level, or the highest eligible party member's level in a party context.

The guide presents this as level-difference bands rather than a single universal curve.

Implementation should therefore use data tables, not hard-coded scattered conditionals.

Suggested future module:

```text
js/text/data/expTables.js
js/text/systems/expEngine.js
```

## Party Level Logic

Party EXP is calculated from the highest-level party member who is eligible for EXP. Lower-level party members can receive less EXP depending on level spread.

Future implementation needs explicit party-member records before this can be modeled safely:

```text
member level
member is alive/eligible
member distance/range eligibility
member level sync state
member contribution/claim state
```

## Level Sync

Level sync changes the effective level used for EXP calculation. It should be treated as an effective-level layer rather than directly mutating true job level.

Suggested future shape:

```js
{
    trueLevel: 75,
    effectiveLevel: 30,
    levelSyncSource: 'party-member-id'
}
```

## EXP Chains

EXP chains are a separate bonus layer after the base EXP calculation. The guide includes chain timing and bonus behavior.

Future implementation should track:

```text
lastEligibleKillAt
chainCount
chainWindowSeconds
chainBonusPercent
```

This belongs in battle/session state, not static player data.

## Bonuses

Bonuses from rings, campaigns, food, events, trusts, or other modifiers should be additive/multiplicative layers after the base and chain layers are known.

Do not bake them into base EXP tables.

Suggested future shape:

```js
const expResult = {
    baseExp,
    partyAdjustedExp,
    cappedExp,
    chainBonus,
    bonusModifiers,
    finalExp,
    breakdown,
};
```

## Implementation Rule

When implemented, EXP calculation should return a full breakdown instead of a single number. This will make balancing and debugging much easier.

Bad:

```js
return exp;
```

Good:

```js
return {
    baseExp,
    partyPenalty,
    partyShare,
    cap,
    chainBonus,
    bonuses,
    finalExp,
    notes,
};
```

## Next Implementation Steps

1. Add `expTables.js` with the base EXP level-difference table.
2. Add `expEngine.js` with pure functions only.
3. Add tests for solo even-match, too-weak, incredibly-tough, party spread penalty, and EXP chain bonus.
4. Wire battle rewards only after enemy defeat flow and player progression storage are stable.
