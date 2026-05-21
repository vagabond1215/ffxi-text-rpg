# Stale Branch Audit

This audit records useful data recovered from stale branches before pruning old work branches.

## Consolidated into main

The following branches had useful non-UI data pulled into `js/text/data/legacyRecoveredData.js` as unverified legacy source material:

| Branch | Useful data recovered | Main destination |
| --- | --- | --- |
| `codex/create-ffxi-database-for-races-and-jobs` | Job abilities and job traits | `RECOVERED_JOB_ABILITIES`, `RECOVERED_JOB_TRAITS` |
| `codex/update-weaponskill-and-tp-systems` | Initial weapon skill formula records | `RECOVERED_WEAPON_SKILLS` |
| `codex/update-bronze-armor-item-data` | Starter weapons, bronze/leather armor, consumables, scrolls, tools | `RECOVERED_STARTER_ITEMS` |
| `codex/update-south-gustaberg-monster-spawn-data` | Bestiary notes, drops, aggro/linking/detection, South Gustaberg spawn counts | `RECOVERED_BESTIARY_NOTES` |

The recovered data is intentionally marked `legacy-branch-import-unverified`. It should be treated as source material for future systems, not final balance data.

## Already contained by main

These branches compare as `behind` with `ahead_by: 0`, meaning they do not currently contain commits ahead of main:

- `codex/update-items-and-vendors-lists`
- `codex/update-white-mage-abilities-in-jobs.js`
- `codex/verify-and-update-warrior-traits-and-abilities`

These are safe prune candidates from a Git history perspective.

## Pure UI/layout prune candidates

The reset branch deliberately abandoned the old graphical/menu-heavy UI. These branches appear to target stale UI layout behavior and should generally be pruned unless a human wants to manually inspect screenshots or CSS ideas first:

- `codex/add-padding-to-main-menu-and-adjust-layout`
- `codex/adjust-character-creation-page-layout`
- `codex/fix-outlining-reset-behavior`
- `codex/investigate-character-profile-position`
- `codex/move-user-select-and-new-user-buttons`
- `codex/remove-outlining-function-and-unused-code`
- `codex/remove-specified-buttons-from-main-menu`
- `codex/reorganize-character-creation-layout`
- `codex/update-attack-buttons-layout-and-history-display`
- `codex/update-character-profile-ui-layout`
- `codex/update-persistent-settings-bar-and-log-functionality`
- `xlru6s-codex/add-equipment-button-to-main-screen`

## Branches needing future manual review before pruning

These may contain logic ideas that should be checked before deletion:

- `codex/clear-combat-data-on-player-death` - possible death/reset behavior.
- `codex/extend-npcinventories-mapping-and-update-openmenu` - possible NPC inventory/vendor mapping ideas.
- `codex/fix-target-selection-issue-using-monster-list` - possible target-selection logic.
- `codex/implement-index-system-for-current-target` - possible targeting/indexing logic.
- `codex/add-rest-feature-and-starting-gear` - starting gear was noted but not fully imported; rest behavior may still be useful.

## Pruning rule

Do not prune a branch until one of these is true:

1. It compares as `ahead_by: 0` against `main`.
2. Its useful data has been migrated into `main` and documented here.
3. It only changes abandoned UI code from the pre-reset runtime.

## Next migration candidates

Recommended next data migrations:

1. Convert `RECOVERED_STARTER_ITEMS` into proper item and vendor databases.
2. Convert `RECOVERED_JOB_ABILITIES` and `RECOVERED_JOB_TRAITS` into ability/trait schemas with recasts, durations, targets, and tick hooks.
3. Convert `RECOVERED_WEAPON_SKILLS` into combat action records tied to TP cost and weapon type.
4. Convert `RECOVERED_BESTIARY_NOTES` into enemy species, loot tables, and zone spawn tables.
5. Review death/reset, target selection, NPC inventory, and rest behavior branches before pruning.
