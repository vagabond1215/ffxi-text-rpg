# Roadmap

This is the authoritative implementation summary and phase index for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/VERSIONING_AND_RELEASE_ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`, and `docs/THREAD_HANDOFF.md`.

## Current baseline

```text
Product:       0.8.600.2
Package:       0.8.600
Account Save:  5
Game State:    6
Data:          37
Benchmark:     1
Codename:      Current Schema Cleanup
Compatibility: pre-release-current-schema
Released:      false
```

**Phases 0.4–0.7 are complete. Phase 0.8 — Life and infrastructure expansion is in progress. Tracks `0.8.100` through `0.8.600` are complete and audited. `0.8.600.2` is a maintenance/schema cleanup revision, not a new Phase 0.8 track.**

## Product laws

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

```text
Use fine movement where movement itself creates decisions.
Use named localities and actions where destinations and relationships create decisions.
```

Campaign guidance reflects acquired knowledge. Resources preserve provenance. Projects, inventory, transport, production, commitments, relationships, party state, recovery, NPC schedules, and fictional time remain canonical authorities; Journal/service/information/home/social presentation remains derived or bounded adapters. Legacy FFXI-derived material is research/reference/migration material only.

## Phase summary

| Phase | Theme | Status |
| --- | --- | --- |
| `0.4` | Foundation and direction lock | **Complete** |
| `0.5` | Simulation + original-world/content substrate | **Complete** |
| `0.6` | Integrated character/mechanics | **Complete** |
| `0.7` | Multi-region playable alpha | **Complete** |
| `0.8` | Life and infrastructure expansion | **In progress** |
| `0.9` | Adventure depth and release hardening | Planned |
| `1.0` | Live foundation | Planned |

# Phase 0.7 — complete

The multi-region playable-alpha proof covers Thornwall/Elderwood, Brasshaven/Redstone Reach, and Mistmere/Starfen; persistent community continuity; livelihood/production/mastery; danger/combat/recovery; acquired-knowledge readability; semantic transport and settlement services; semantic information access; persistent companion preparation; and deterministic save/load.

Final Phase 0.7 checkpoint:

```text
1e217fe1f7e62593fa9ed33eebdf1b3878490336
495/495 tests
Benchmark 1 success
Product 0.7.400.1
Data 31
```

Later shared-authority work does not reopen Phase 0.7.

# Phase 0.8 — Life and infrastructure expansion — in progress

## `0.8.100` — Home Foothold & Infrastructure — complete

**Build a Storage Chest** consumes 2 Resin-Sealed Hardwood Boards, 1 Redstone Copper Ingot, and 30 minutes of canonical project labor, then places the Storage Chest exactly once and raises furnishing-backed home storage from 3 to 8 slots.

Original checkpoint: `0b9251a43285443087050127da36b977cabdf7ee` — 496/496 tests, Benchmark 1, Product `0.8.100.1`, Data 32.

`0.8.100.2` subsequently closed onboarding/creator polish: Light/Dark palettes, corrupt-save deletion/reset, original-world randomization, truthful discipline previews/starter kits, and distinct authored origin arrivals. Checkpoint `0f00ef68a01ad001063803d67ff0efffc48ab3ef` — 505/505 tests, Benchmark 1, Data 33.

## `0.8.200` — Home Workshop Capability — complete

**Build a Joiner's Workbench** consumes 2 Resin-Sealed Hardwood Boards, 1 Copper Trail Clasp, and 45 minutes of project labor. The zero-storage furnishing grants `woodshop`/`workshop` context only while the character is physically at home. The existing production engine can then run the existing Resin-Sealed Hardwood Board recipe there, preserving normal fictional time, provenance, output, and crafting mastery.

Checkpoint `03ab71c7e96c54eaeffb75598ed01243fd390f21` — 506/506 tests, Benchmark 1, Product `0.8.200.1`, Data 34.

## `0.8.300` — Carried Load & Transport Logistics — complete

Scheduled transport cargo is derived from canonical carried inventory rather than caller/UI payload. `carriedLoadEngine`, `transportServiceBoardEngine`, and `transportEngine` share the same derived fact; booking checks allowance before fare deduction and records actual load. Home storage therefore creates a real travel-preparation choice.

Checkpoint:

```text
4f8c0de9e6ba926ee903f5787d34cca73c40eb6d
507/507 tests
0 failed
0 skipped
Benchmark 1 success
Product 0.8.300.1
Package 0.8.300
Data 34
```

## `0.8.400` — Portable Field Logistics — complete

**Make a Field Satchel** consumes 2 Resin-Cured Hide Bindings, 1 Copper Trail Clasp, and 30 minutes of project labor, then unlocks the existing 8-slot portable Field Satchel exactly once. Inventory remains authority for unlock/access/capacity/transfer.

Every unlocked portable container marked as carried cargo contributes occupied slots to `carriedLoadEngine`. Moving goods from Inventory to Field Satchel preserves total transport load; only leaving goods in non-carried home storage reduces it.

Promoted runtime checkpoint:

```text
d1a43568c5ca4dd7e57fb86316b422c35025ce07
Product 0.8.400.1
Package 0.8.400
Data 35
Check 32080844409 SUCCESS
```

## `0.8.500` — Daily Social Availability — complete

Sera Talwin's Southgate guide duty is available daily from 08:00–18:00. `npcScheduleEngine` derives availability from canonical fictional time; no schedule state is serialized. Locality interaction, command-path talk, commitment accept/resolve/follow-up, Journal projection, and contextual browser actions all consume the same availability authority.

At 18:30 Sera remains known but is unavailable; interaction is blocked without hidden movement/time cost and the player is told when she returns. Save/load preserves world time and re-derives availability. At next-day 08:00 the interaction becomes available again.

Authoritative promoted checkpoint:

```text
fde1d30d76264ea25af6bad4d829545c488eec9b
509/509 tests
0 failed
0 skipped
Benchmark 1 success
Product 0.8.500.1
Package 0.8.500
Data 36
```

## `0.8.600` — Companion Convalescence — complete

This track closes a real companion-life dead end: before `0.8.600`, a recruited companion reduced to 0 HP could be left inactive, but settlement recovery restored only the active party and `joinCompanion` correctly refused a 0-HP companion. That could make an injured inactive companion permanently unavailable.

The existing campaign-recovery authority now owns the repair. **Settlement** recovery includes recruited companions physically present in the current safe settlement, whether active or inactive. Field and defeat recovery keep their previous active-party scope. Recovery still uses the existing `recovery.settlement` timed task and canonical fictional time; there is no passive wall-clock healing, companion recovery registry, or second clock.

The proving loop is:

```text
Mara is downed
  -> reach a safe settlement
  -> part ways there
  -> immediate reunion is blocked at 0 HP
  -> the healthy player can choose Rest in safety
  -> 3600 fictional seconds pass through canonical recovery/task authority
  -> nearby inactive Mara reaches full HP/MP
  -> she remains inactive until the player explicitly asks her to travel again
  -> Travel together becomes available
  -> reunion succeeds
  -> save/load preserves the result
```

A downed companion cannot be abandoned in unsafe wilderness. `partyEngine` rejects that separation atomically and leaves membership/location unchanged. The Character surface also withholds **Travel together** while a local inactive companion is at 0 HP, so presentation never advertises an action the domain engine will reject.

A dependency-light `localityClassificationEngine` now owns the safe-settlement predicate used by both locality and party code; `localityEngine` re-exports the public classifier. This avoids a party↔locality import cycle without changing locality-navigation semantics.

No authored gameplay catalog changed, so Data remained 36 at the original `0.8.600.1` promotion. Game State remained 5 because companion HP/location/membership and recovery timed tasks already existed. Account Save remained 4 and Benchmark remained 1.

Authoritative promoted runtime checkpoint:

```text
04211e8909996b1ac34fa91ae1cdd7aa216b86f8
511/511 tests
0 failed
0 skipped
Benchmark 1 success
Product 0.8.600.1
Package 0.8.600
Data 36
```

Benchmark 1:

```text
player combat profiles  0.436701 ms/op
enemy combat profiles   0.102201 ms/op
basic attacks            0.519382 ms/op
tick dispatch            0.005689 ms/op
direct route lookup      0.810038 ms/op
```

### `0.8.600` closure audit

**PASS.** Companion injury now creates a coherent safety/recovery/reunion decision using existing HP, place, party, recovery, timed-task, and fictional-time authorities. Settlement rest can heal a nearby inactive companion without silently changing party membership; wilderness abandonment of a downed companion is blocked; browser and domain availability agree; and the result survives current save/load.

## `0.8.600.2` — Current Schema Cleanup — maintenance revision

This revision does not open `0.8.700` and adds no new life-system track. It removes pre-alpha compatibility debt and stale canonical identifiers around persistence, home storage, and transport presentation.

- Account Save advances `4 -> 5`: local account/session storage now uses Hearth & Horizon keys and exact current-schema/versioned encoding. Older registries are rejected rather than migrated.
- Game State advances `5 -> 6`: persisted home inventory state is canonical `inventoryState.home`; old `mogHouse` state and `mog*` home/portable container IDs are removed rather than mirrored or translated.
- Data advances `36 -> 37`: canonical home furnishing/container identifiers changed, including `homeSafe`, `storage`, and `fieldSatchel`.
- The obsolete active save-migration module is removed. The generic ordered migration engine remains available for a future migration only when compatibility is deliberately required.
- New-game state derives its schema version from `VERSION.gameState` instead of duplicating a hard-coded value.
- The UI no longer emits obsolete `highContrast` theme state or the dead `cargoUnits: 0` transport payload.
- Historical phase/version tests now use compatible minimum assertions where later shared authorities legitimately advance.

Validated cleanup runtime checkpoint `23c373310bac90b20e14b840cc4221e3ca648daf` passed Check run `32104815961`: 507/507 tests, 0 failed/skipped, Benchmark 1 success.

## Next Phase 0.8 boundary

The current work order stops at the cleanup revision over closed `0.8.600`. **Do not automatically begin `0.8.700` or add passive companion healing/routines merely to continue the theme.** A new work order should re-audit one bounded Phase 0.8 seam against existing authorities.

Strong candidate families now are:

- agriculture/stewardship;
- earned automation;
- further companion or social-life breadth only when a concrete player decision and existing authority path justify it;
- another life/logistics segment only when a specific current seam warrants it.

# Later phases

## 0.9 — Adventure depth and release hardening

Difficult regions/dungeons, advanced combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, performance, and release tooling.

## 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, performant, and supported by enough interconnected content for sustained play.
