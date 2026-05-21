# System Catalog

This catalog assigns every known major system to a roadmap phase and version target.

## Legend

| Status | Meaning |
| --- | --- |
| planned | Known need, no runtime implementation. |
| seeded | Schema or seed definitions exist. |
| integrated | Runtime can read/use the system. |
| playable | Player-facing command/gameplay exists. |
| balanced | Tested, benchmarked, and tuned. |

## Core foundation

| System | Status | Target | Notes |
| --- | --- | --- | --- |
| Text command shell | integrated | 0.2.0 | Active runtime. |
| Command parser | integrated | 0.2.0 | Positional and named args. |
| Validation | integrated | 0.2.0 | Save and state validation baseline. |
| Version tracking | integrated | 0.2.0 | App/save/data/benchmark versions. |
| Benchmark harness | seeded | 0.2.0 | Combat profile, attack, tick dispatch. |
| Live tick engine | seeded | 0.2.0 | Needs runtime integration. |

## World and travel

| System | Status | Target | Notes |
| --- | --- | --- | --- |
| Places database | planned | 0.3.0 | Cities, zones, dungeons, interiors. |
| Zone connections | planned | 0.3.0 | Directed graph with restrictions. |
| Travel restrictions | planned | 0.3.0 | Level, key item, nation, quest, mount, time. |
| Travel command | planned | 0.3.0 | Tick-based travel progress. |
| Zone discovery | planned | 0.3.0 | Maps, home points, survival guides later. |

## Character progression

| System | Status | Target | Notes |
| --- | --- | --- | --- |
| Player identity | seeded | 0.2.0 | Race, sex, nation, title, job. |
| Jobs | seeded | 0.2.0 | All standard jobs listed. |
| Support jobs | planned | 0.4.0 | Unlocks, half-level behavior, restrictions. |
| EXP and leveling | planned | 0.4.0 | Level curves and caps. |
| Skills and caps | planned | 0.5.0 | Combat/magic/crafting skill growth. |
| Merits/job points | planned | later | Advanced progression. |

## Combat and magic

| System | Status | Target | Notes |
| --- | --- | --- | --- |
| Stat engine | seeded | 0.2.0 | Conservative placeholders. |
| Battle state | seeded | 0.2.0 | Basic attack flow. |
| Enemy AI | planned | 0.5.0 | Tick/subturn based. |
| Magic database | planned | 0.5.0 | Spells, costs, recasts, elements. |
| Casting engine | planned | 0.5.0 | Cast time, interruption, recast. |
| Abilities and traits | planned | 0.5.0 | Job abilities, traits, enemy abilities. |
| Enmity | planned | 0.6.0 | Needed for trusts/party play. |
| Weapon skills | planned | 0.6.0 | TP spenders. |
| Skillchains | planned | 0.7.0 | Requires weapon skills. |
| Magic bursts | planned | 0.7.0 | Requires magic + skillchains. |

## Data and economy

| System | Status | Target | Notes |
| --- | --- | --- | --- |
| Items database | planned | 0.4.0 | Equipment, consumables, materials. |
| Key items | planned | 0.4.0 | Unlocks, maps, travel permissions, quest flags. |
| Inventory | seeded | 0.2.0 | Minimal list only. |
| Equipment | seeded | 0.2.0 | Slots exist; validation pending. |
| Loot tables | planned | 0.5.0 | Drop rates, quest drops, currency. |
| Vendors | planned | 0.5.0 | Shops, guilds, conquest rewards. |
| Crafting | planned | 0.8.0 | Recipes, crystals, ingredients, HQ tiers. |

## Quests and achievements

| System | Status | Target | Notes |
| --- | --- | --- | --- |
| Quest database | planned | 0.6.0 | Prereqs, objectives, rewards, flags. |
| Quest engine | planned | 0.6.0 | Objective evaluation and turn-in flow. |
| Achievements | planned | 0.7.0 | Milestones, titles, unlocks. |
| Mission/rank progression | planned | 0.7.0 | Nation rank and story gates. |
| Reputation/fame | planned | 0.7.0 | Zone/nation fame. |

## Companions and movement extras

| System | Status | Target | Notes |
| --- | --- | --- | --- |
| Trust database | planned | 0.6.0 | AI companions and unlock records. |
| Trust AI | planned | 0.6.0 | Role profiles and action choices. |
| Mount database | planned | 0.8.0 | Mount unlocks and travel modifiers. |
| Mount restrictions | planned | 0.8.0 | Zone and state restrictions. |

## Implementation priority

1. Places and zone connections.
2. Travel restrictions and tick-based travel.
3. Item/key item schemas.
4. Leveling and EXP.
5. Combat loop with enemy turns.
6. Magic/casting/recasts.
7. Loot and drops.
8. Quests and achievements.
9. Trust AI companions.
10. Crafting and mounts.
