# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Required read order

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/DEVELOPMENT_DIRECTION.md`
4. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
5. `docs/ROADMAP.md`
6. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
7. `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`
8. `docs/ARCHITECTURE.md`, `docs/TRANSITIONAL_ARCHITECTURE.md`, `docs/QUALITY_GATES.md`, `docs/PERFORMANCE_BUDGET.md`, `docs/RESOURCE_LIFECYCLE.md`, `js/text/version.js`, and systems/tests relevant to the next bounded work order.

## Workflow and pre-alpha policy

Work directly on `main` by default. Treat each prompt as a bounded work order and stop at a coherent checkpoint.

Hearth & Horizon is pre-alpha. Old local saves/accounts are **not** a compatibility requirement. Prefer one clean current schema and one clear authority over compatibility-only migrations, duplicate fields, aliases, lazy reconstruction, or fallback storage keys. A migration is deliberate future engineering work when explicitly required or independently useful; it is not automatic.

Runtime first. Freeze runtime before documentation. Update this handoff last. Report only validation that actually ran.

## Product laws

Working title: **Hearth & Horizon**. FFXI-derived material is legacy research/reference/migration material only.

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

Maps/campaign guidance represent acquired character knowledge. Fictional time is separate from wall-clock scheduling. Resources retain provenance. Companions are persistent NPC-backed people. Commitments/relationships remain separate canonical authorities. Presentation/view models remain derived.

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

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` remain complete and audited. `0.8.600.2` is a maintenance/schema cleanup revision and does **not** open `0.8.700`.

## Current promoted checkpoint

Cleanup PR **#325** (`cleanup/current-schema-canonical-names`) was squash-merged to `main` as:

```text
bc42c7a00050f73704f19f2c3287d1426a788fa1
```

The merge tree is the same content validated on final PR head:

```text
9cbeff6b619ea35581958e3e7aac2b15f6d6ebe5
Check 32105075836
Test      success
Benchmark success
```

The runtime was frozen earlier at checkpoint `23c373310bac90b20e14b840cc4221e3ca648daf`; Check `32104815961` observed:

```text
tests       507
pass        507
fail        0
cancelled   0
skipped     0
Benchmark   success
```

Benchmark 1:

```text
1,000 player combat profiles      465.978ms  0.465978ms/op
1,000 enemy combat profiles       117.722ms  0.117722ms/op
1,000 basic attacks               538.805ms  0.538805ms/op
10,000 ticks / 5 subscribers       47.154ms  0.004715ms/op
10,000 direct route lookups      8945.601ms  0.894560ms/op
```

The test count is lower than historical `0.8.600.1` because obsolete save-migration integration tests were removed with the compatibility layer. New current-schema persistence tests verify rejection/no-rewrite of old account/game-state versions and deterministic current save/load.

## `0.8.600.2` cleanup completed

### Current-schema persistence

`js/text/save.js` now accepts only the current persistence contract:

```text
storage keys:
  hearthHorizonAccounts
  hearthHorizonAccountSession

encoding:
  base64-json-v1

account registry/session version:
  exactly VERSION.accountSave

game state version:
  exactly VERSION.gameState
```

Older pre-alpha account registries/game states are rejected rather than migrated, rewritten, or lazily reconstructed. The active `js/text/systems/saveMigrations.js` layer was removed. `migrationEngine.js` remains only as a generic utility for a future deliberate migration requirement.

`createNewGameState()` and validation now derive Game State version from the runtime version manifest instead of maintaining a duplicate hard-coded schema number.

### Canonical home/container vocabulary

Persisted canonical home state is now:

```text
player.inventoryState.home
  isAtHome
  placedFurniture
```

Canonical relevant container IDs are:

```text
inventory
homeSafe
homeSafe2
storage
homeLocker
fieldSatchel
fieldSack
fieldCase
wardrobe1 ... wardrobe8
```

`homeFurnishings.js` replaces the old `mogHouseFurniture.js` module. Old `mogHouse` state and `mog*` canonical home/portable container IDs are not preserved as aliases or translated during load.

Home infrastructure and workstation derivation consume the canonical state directly. Storage Chest, Joiner's Workbench, Field Satchel, carried-load, transport, production, and save/load flows remain covered end to end.

### UI/adapter consistency fixes

- `gameViewModel` no longer sends historical `cargoUnits: 0`; transport derives canonical carried load itself.
- Active theme cycling exposes Light/Dark only; it can no longer generate obsolete `highContrast` state.
- `highContrast` input supplied directly to settings normalization falls back to the current default rather than becoming active state.
- Historical phase/version tests use compatible minimum assertions where later shared authorities legitimately advance instead of freezing obsolete exact schema versions.
- The large pipeline version test now asserts the release contract and systems actually owned by this maintenance revision rather than duplicating the entire system-version registry.

### Version decisions

```text
Product       0.8.600.1 -> 0.8.600.2
Account Save  4 -> 5
Game State    5 -> 6
Data          36 -> 37
Benchmark     1 unchanged
Package       0.8.600 unchanged
```

Account Save advances for the strict current account/session namespace/contract. Game State advances for canonical persisted home/container state. Data advances because canonical furnishing/container stable identifiers changed. No migration is provided by design.

## Stable authority boundaries to preserve

- one fictional-time/task/interrupt substrate;
- current-schema persistence only during pre-alpha unless compatibility is explicitly requested;
- inventory owns container unlock/access/capacity/transfer and carried inventory facts;
- home infrastructure composes project/inventory/furnishing/workstation authorities rather than creating parallel stores or timers;
- transport owns fares/cadence/departure/arrival/service allowance and independently derives carried load;
- projects own shared material + labor + completion state;
- `workstationEngine` owns workstation-context derivation;
- `productionEngine` owns recipe requirements/work/inputs/outputs/provenance/mastery;
- campaign recovery remains the single player/party recovery authority;
- recovery never silently changes active party membership;
- commitments remain separate from relationships and both remain separate from Journal projection;
- NPC schedules are authored recurring availability evaluated against canonical fictional time, never a second clock/state registry;
- maps/routes/resources/contacts/search preserve acquired-knowledge privacy;
- player-facing browser information describes what the character sees, knows, carries, remembers, needs, or can decide;
- legacy FFXI-derived records remain bounded research/reference material, not canonical world identity.

## Known non-blocking debt after this cleanup

- The historical command shell still contains FFXI-era aliases and at least one old raw-save fallback key. This is intentionally left as a **separate command-adapter cleanup** rather than mixing a parser/shell rewrite into the persistence-schema revision.
- Legacy research/reference datasets and historical changelog text naturally contain old FFXI terminology; do not mass-rename reference history as though it were canonical runtime data.
- Some ActionResult/prose-facing compatibility aliases remain in transitional adapter surfaces; remove them only after proving callers are gone.
- `docs/SYSTEM_CATALOG.md` contains substantial historical status material and should not override the current handoff/runtime/version authorities; a dedicated catalog refresh can be done separately.
- Original currency terminology remains deferred.
- `commitmentEngine.checkCommitmentRequirements` still examines the main inventory container rather than every carried portable container; fix through canonical inventory querying, not duplicate commitment inventory state.
- The first NPC schedule model remains static-location availability; multi-location NPC movement is future design work.
- No passive/offline companion healing or autonomous companion routine exists, deliberately.
- The recurring GitHub Actions warning about the actions runtime/Node transition remains warning-only; project tests still explicitly install Node 20.20.2.

## Next work

**Do not automatically begin `0.8.700`.** A new work order should resync `main`, reread this handoff, and audit one bounded Phase 0.8 seam before implementation.

Strong candidate families remain:

- agriculture/stewardship;
- earned automation;
- further companion/social-life breadth only where a concrete player decision and existing authority path justify it;
- another life/logistics segment only when a specific current defect or opportunity warrants it.

For cleanup work specifically, the next obvious bounded maintenance seam is the legacy command adapter/aliases. Treat that as its own work order with focused parser/command tests rather than continuing automatically from this session.
