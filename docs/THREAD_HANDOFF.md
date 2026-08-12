# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Read order

1. `AGENTS.md` — direct-`main` workflow, autonomous-session budget, scope boundaries, and handoff protocol.
2. `docs/DEVELOPMENT_DIRECTION.md` — authoritative design north star.
3. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-setting, naming, legacy-data, provenance, scale, and content-pack policy.
4. `docs/ROADMAP.md` — implementation sequence and milestone gates.
5. `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — version protocol.
6. `docs/TRANSITIONAL_ARCHITECTURE.md` — temporary seams that must not harden into final design.
7. Relevant runtime/data/tests for the current bounded unit.

Older planning documents preserve useful history but do not override the files above.

## Current Git workflow

The repository is currently in an early single-maintainer development phase. Per `AGENTS.md`, **continue directly on `main` by default**.

Do not create a branch/PR merely as routine ceremony. Use isolation only if the user asks, a tool requires it, or the change is unusually risky enough that isolation materially helps.

A green full suite is desirable, but it is not currently a mandatory gate before every incremental change. Run relevant validation, distinguish stale assertions from real regressions, and record known failures. Tighten branch/review/CI rules later when the project reaches active stabilization/release work.

## Autonomous work-session limit

`AGENTS.md` sets the operating guardrail:

- maximum autonomous session: **2 hours 45 minutes**;
- **2:15** stabilization checkpoint;
- **2:30** no new implementation unit;
- by **2:45**, persist coherent work, update this handoff, and report even if more roadmap work is available;
- if elapsed time cannot be measured reliably, use at most **6 autonomous work cycles**, with cycle 6 reserved for stabilization/handoff.

A new explicit user message starts a fresh budget. Roadmap `Next` sections are sequencing information, not permission for an endless autonomous chain.

## Product identity and non-negotiable intent

Working title: **Hearth & Horizon**.

This is an original text-first persistent fantasy life RPG about one continuous character building livelihood, skills, relationships, reputation, material capability, home/infrastructure, and geographic reach across a connected fantasy world.

Earlier FFXI-derived code/data is **legacy research/reference/migration material**, not canonical player-facing world content. Useful mechanics may survive, but inherited FFXI proper nouns and wording should not be preserved merely because old data used them.

Core progression law:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

Core capability law:

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

A discipline/job is not a magical transformation state. Learned capabilities belong to the continuous character; actual use is constrained by learned skill/proficiency plus real equipment, tools, resources, preparation, status, and context.

## Current authoritative baseline

```text
Branch:        main
Open PRs:      none
Product:       0.5.550.1
Package:       0.5.550
Account Save:  4
Game State:    5
Data:          14
Codename:      Original World Identity
Track:         0.5.550 — original-world identity and canonical nomenclature
```

PR #310 (`codex/original-world-identity-migration`) is no longer the continuation point. The connector could not merge it normally while it was draft, so `main` was fast-forwarded to the coherent branch head and PR #310 was closed. Continue on `main`.

The connector currently exposes no remote branch-delete action. Many historical `codex/*` branches therefore remain and require manual deletion if repository branch hygiene is desired. Do not create new branches just to compensate for that limitation.

## What 0.5.550.1 already delivered

- bounded legacy-to-canonical identity adapters;
- canonical powers: Thornwall, Brasshaven, Mistmere;
- canonical surrounding regions: Elderwood, Redstone Reach, Starfen;
- original place/map identities and Thornwall topology;
- ancestries: Human, Lethari, Miri, Veyra, Korren;
- transitional job scaffold migrated to original discipline names/IDs;
- starter creature/NPC seed identities and spawn references originalized;
- Game State v4 -> v5 ordered identity migration;
- Data version 14;
- canonical starting equipment eligibility and skill-cap data;
- historical stat research bounded behind canonical-to-legacy adapters;
- character-creation/progression language moved toward ancestry/discipline terminology.

Old world/race/job/place/map IDs should be accepted only at bounded migration/input compatibility seams. Do not maintain two permanent full schemas.

## Work completed in the latest direct-main session

Repository/PR cleanup:

- adopted the direct-`main` policy in `AGENTS.md`;
- fast-forwarded `main` to the completed PR #310 branch head;
- closed PR #310;
- verified there are no open PRs;
- confirmed stale branch deletion is not available through the current GitHub connector.

Player-facing originalization:

- replaced FFXI page/launcher/dev-server/text-shell/canvas/top-bar branding with **Hearth & Horizon**;
- originalized starter POI/NPC/service display names across Thornwall, Brasshaven, and Mistmere while temporarily retaining legacy-shaped POI IDs needed by dependent shop/quest/guild hooks;
- replaced player-facing Mog-storage vocabulary with Home Safe, Furnishing Storage, Home Locker, Field Satchel/Sack/Case, and Wardrobe terminology;
- added canonical `setHomeAccess()` while retaining `setMogHouseAccess()` as a bounded API compatibility alias;
- stopped inventory output from leaking the internal persisted `mogHouse` access token;
- introduced canonical `HOME_FURNITURE` while retaining the older export as a compatibility alias;
- canonicalized benchmark fixtures and branding.

Actual runtime defect fixed:

- `characterCreationModel.js` still used legacy `hume`/`sandoria`/`warrior` defaults and starting-job IDs after the identity migration;
- it now defaults to Human / Thornwall / Vanguard and exposes the canonical starting disciplines Vanguard, Pugilist, Lifewarden, Elementalist, Spellblade, and Shadowhand.

Stale assertion/fixture cleanup completed across:

- UI panels;
- POI engine;
- travel engine;
- navigation engine;
- atlas/controls;
- shop engine;
- combat actions;
- command parser;
- guided character creation;
- inventory engine;
- skill command router;
- skill progression engine;
- skill progression validation;
- UI intent dispatcher.

## Validation checkpoint

The last fully inspected completed test job, before the final batch of fixes above, was commit `e1ccac404a0caefd8a289b93427d91f7e3ea29a9`:

```text
298 tests
263 pass
35 fail
```

That was already an improvement from the earlier 248/50 and the original PR's 239/59 state.

Several fixes were committed after that snapshot, so 263/35 is intentionally conservative and stale. At the end of this session, the latest `main` check for commit `d8e6bb84f33b5b41f5a834937d77b8c7e72b774c` had both `test` and `build` **in progress**. Per the session guardrail, do not wait indefinitely for CI before reporting.

The GitHub Actions warning about checkout/setup actions being forced from their Node 20 action runtime to Node 24 is not the cause of the current application-test failures.

## Next bounded implementation unit

Do **not** start 0.5.600 yet. Continue finishing the 0.5.550 canonicalization/compatibility cleanup on `main`.

Highest-value remaining work, based on the most recently inspected failing suite:

1. Inspect the latest completed CI result after `d8e6bb84f33b5b41f5a834937d77b8c7e72b774c` and work from the actual remaining failures rather than the old 35-failure list.
2. Expected remaining stale groups include:
   - `tests/slashCommandRouter.test.js` — old Southern San d'Oria / starting-nation wording and IDs;
   - current-state version assertions that still expect Game State 4 instead of 5 in day-cycle/foundation/save-migration/semantic-event/simulation-control/timed-task tests, while preserving fixtures that deliberately represent pre-migration v4 input;
   - `tests/foundationReadiness.test.js` / semantic-event fixtures still using West Ronfaure rather than West Elderwood;
   - `tests/equipmentEngine.test.js` legacy job names/IDs and old Mog-storage display wording;
   - progression/reward tests that may still assert pre-ActionResult return shapes or old discipline IDs; inspect `progressionEngine.js` before changing these;
   - any other failures surfaced by the newest CI run.
3. Continue removing player-facing inherited vocabulary, but retain legacy IDs/keys internally when an ordered persistence migration or dependent-reference migration is still required.
4. Keep `gil` unchanged unless/until the project defines an original currency replacement; do not invent one ad hoc.
5. Once the 0.5.550 identity/nomenclature track is coherent enough to exit, synchronize roadmap/version docs and report before moving into `0.5.600` persistent projects/resource provenance.

## Original-world anchors

- **Thornwall** — western crown realm/capital context;
- **Elderwood** — surrounding western forest region;
- **Brasshaven** — industrial/mercantile forge republic;
- **Redstone Reach** — mineral-rich hinterland;
- **Mistmere** — scholastic canal city;
- **Starfen** — wetland/grassland region;
- **Waymeet** — future neutral central trade/transport hub.

## Ancestry migration

- Hume -> Human
- Elvaan -> Lethari
- Tarutaru -> Miri
- Mithra -> Veyra
- Galka -> Korren

## Discipline migration

- Warrior -> Vanguard
- Monk -> Pugilist
- White Mage -> Lifewarden
- Black Mage -> Elementalist
- Red Mage -> Spellblade
- Thief -> Shadowhand
- Paladin -> Oathguard
- Dark Knight -> Duskblade
- Beastmaster -> Wildbinder
- Bard -> Cantor
- Ranger -> Wayfinder
- Samurai -> Blade Adept
- Ninja -> Veilrunner
- Dragoon -> Sky Lancer
- Summoner -> Eidolist
- Blue Mage -> Echo Sage
- Corsair -> Free Captain
- Puppetmaster -> Artificer
- Dancer -> Rhythmblade
- Scholar -> Savant
- Geomancer -> Leykeeper
- Rune Fencer -> Wardsword

These are disciplines/training traditions, not permanent magical class locks.

## Following tracks — sequencing only

```text
0.5.600  Persistent projects + resource provenance/body processing
0.5.650  Ecology, gathering sources, spawn populations/regeneration
0.5.700  Canonical timed routes + scheduled caravans/transport
0.5.800  Regional content packs + normalization tools + cross-reference validation
0.5.900  Simulation/content-substrate exit gate
```

Do not treat this list as authorization to chain into those tracks without returning to the user.
