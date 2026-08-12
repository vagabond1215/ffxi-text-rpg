# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Read order

1. `AGENTS.md` — autonomous-session budget, scope boundaries, and required handoff protocol.
2. `docs/DEVELOPMENT_DIRECTION.md` — authoritative design north star.
3. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-setting, naming, legacy-data, provenance, scale, and content-pack policy.
4. `docs/ROADMAP.md` — current implementation status and immediate sequence.
5. `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — product-version protocol and detailed release gates.
6. `docs/TRANSITIONAL_ARCHITECTURE.md` — temporary seams that must not harden into final design.
7. `docs/ARCHITECTURE.md` — module/runtime boundaries.
8. `js/text/version.js` — runtime/system version manifest.

Older planning documents may preserve useful history but do not override these files.

## Autonomous work-session limit

Repository work must not become an effectively endless chain of safe follow-on runs.

`AGENTS.md` sets the hard operating rule:

- maximum autonomous session: **2 hours 45 minutes** from the start of active repo work for the user prompt;
- at **2:15**, stabilize and make the work handoff-safe;
- at **2:30**, start no new implementation unit;
- by **2:45**, persist the current coherent state, update this handoff, and report even when later roadmap work could safely continue;
- if elapsed time cannot be measured reliably, use the fallback maximum of **6 autonomous work cycles**, with cycle 6 reserved for stabilization/handoff.

A new user message starts a new budget. Roadmap and `Next` sections are sequencing information, not permission to continue autonomously forever.

## Product identity

Working title: **Hearth & Horizon**.

This is an original text-first persistent fantasy life RPG about one continuous character building livelihood, skills, relationships, reputation, material capability, home/infrastructure, and geographic reach across a connected fantasy world.

Earlier code/data contains extensive FFXI-derived experiments. Those are now **legacy research/reference/migration material**, not canonical world content.

Do not author new canonical databases using inherited FFXI place, nation, race, class, currency, creature, NPC, or item proper nouns.

Do not preserve FFXI-specific wording in player-facing canonical content simply because a useful mechanic or datum originated in earlier reference work. Preserve useful mechanics where appropriate, but rename and contextualize them as original project content before high-volume database growth.

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

A discipline/job is not a magical transformation state. Learned capabilities belong to the continuous character; actual use is gated by learned skill/proficiency plus real equipment, tool, resource, preparation, status, and situational requirements.

## Current merged baseline

```text
Product:      0.5.500.0
Package:      0.5.500
Account Save: 4
Game State:   4
Data:         13
Codename:     Day Boundary Review
```

Completed:

- `0.4` foundation: versioning, migrations, ActionResult, semantic events, architecture stabilization;
- `0.5.100` deterministic world clock;
- `0.5.200` pause/speed control;
- `0.5.300` canonical timed tasks;
- `0.5.400` deterministic simulation interrupt model;
- `0.5.500` day boundaries, structured day summaries, configurable end-of-day pause.

The 0.5.500 merge is the point at which the roadmap was deliberately re-baselined to recognize that content breadth and data-production infrastructure are first-class engineering requirements.

## In-flight checkpoint — PR #310

The interrupted prior thread did produce durable work. Continue from it rather than restarting the migration from scratch.

```text
PR:      #310 — Begin 0.5.550 canonical original-world identity migration
Branch:  codex/original-world-identity-migration
Target:  0.5.550.1 — first runtime revision of the 0.5.550 identity/stable-ID migration
State:   draft / not merged
```

Implemented on the branch before this handoff update:

- bounded legacy-to-canonical identity adapters;
- canonical powers migrated to Thornwall, Brasshaven, and Mistmere;
- regions/places/maps migrated to Elderwood, Redstone Reach, Starfen, and original localities;
- ancestries migrated to Human, Lethari, Miri, Veyra, and Korren;
- transitional job scaffold migrated to original discipline names/IDs;
- starter creature/NPC seed identities and spawn references originalized;
- Thornwall topology added under canonical IDs;
- current POI location references moved to canonical places while some POI IDs remain temporarily for dependent shop/quest/guild hooks;
- historical stat research placed behind explicit canonical-to-legacy research boundaries;
- starter equipment eligibility and skill-cap data migrated to canonical disciplines;
- Game State bumped to v5 and Data to 14 on the branch;
- ordered Game State v4 -> v5 identity migration added, including clearing obsolete active battles during migration;
- character-creation/progression wording moved toward ancestry/discipline terminology.

Compatibility intent:

- old world/race/job/place/map IDs are accepted only at bounded legacy input/migration boundaries;
- new canonical runtime records should use original IDs;
- do not solve compatibility by maintaining two permanent full schemas.

CI checkpoint from the last implementation head before the session-protocol documentation commits:

- GitHub Actions `Test` step failed;
- `Benchmark` was skipped because tests failed;
- the exact failing assertions still need to be diagnosed from the current branch/check logs;
- documentation commits may trigger newer checks, so inspect the latest PR status before changing code.

The first bounded continuation unit should therefore be **diagnose and fix PR #310 CI without restarting the identity migration**. Once `0.5.550.1` is coherent and validated, report before automatically launching later 0.5.550 revisions.

The broader 0.5.550 track still needs follow-up work to originalize retained POI/shop/quest/guild names and remove remaining player-facing inherited vocabulary such as legacy currency/storage/companion/waypoint terms before high-volume content generation begins. That follow-up is intentionally a later bounded unit, not permission to keep the same agent session running indefinitely.

## Immediate target

```text
0.5.550 — Original-world identity and canonical nomenclature
```

This runtime migration happens **before high-volume item/monster/quest/recipe database expansion**.

### Initial original-world anchors

- **Thornwall** — western crown realm/capital context;
- **Elderwood** — surrounding western forest region;
- **Brasshaven** — industrial/mercantile forge republic;
- **Redstone Reach** — its mineral-rich hinterland;
- **Mistmere** — scholastic canal city;
- **Starfen** — surrounding wetland/grassland region;
- **Waymeet** — future neutral central trade/transport hub.

### Initial ancestry migration

- Hume -> Human
- Elvaan -> Lethari
- Tarutaru -> Miri
- Mithra -> Veyra
- Galka -> Korren

Mechanical stat behavior can remain temporarily equivalent while the canonical identity changes.

### Initial discipline migration

The transitional job scaffold should migrate to original player-facing names before capability database expansion:

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

These remain disciplines/training traditions, not permanent magical class locks.

## 0.5.550 implementation expectations

The migration should update more than display strings.

1. Introduce canonical stable IDs for powers/regions/places/maps/ancestries/disciplines and other renamed runtime records.
2. Add a bounded legacy-to-canonical identifier map at save/input boundaries.
3. Use the ordered migration engine for persisted renamed identifiers; a Game State version bump is expected if saved state uses those IDs.
4. Update world connections, map records, POIs, shop catalogs, enemy/spawn references, starting-state definitions, command examples, tests, and validation atomically.
5. Rename current player-facing NPC/shop/creature/landmark content into the original setting rather than leaving a mixed canon.
6. Keep historical FFXI research modules behind explicit legacy/reference naming/boundaries.
7. New saves and canonical runtime records should not emit legacy FFXI stable IDs after the migration.

Do not solve this by maintaining two permanent full schemas.

## Following 0.5 tracks

```text
0.5.600  Persistent projects + resource provenance/body processing
0.5.650  Ecology, gathering sources, spawn populations/regeneration
0.5.700  Canonical timed routes + scheduled caravans/transport
0.5.800  Regional content packs + normalization tools + cross-reference validation
0.5.900  Simulation/content-substrate exit gate
```

Then 0.6 integrates substantial character stats/progression, skills/proficiencies/disciplines/capabilities, original magic/abilities, Combat 2.0, item/tool breadth, gathering/crafting/cooking/salvage, ecology content, and AI companions.

0.7 is the first multi-region playable-alpha phase: multiple cities/settlements, transport networks, hundreds-scale NPC population, regional economies, systemic quests/contracts/rewards/reputation, relationships/romance, and substantial regional content packs.

## Resource/economy design law

Rewards should have physical, economic, or social provenance.

A defeated animal normally creates access to a body; it does not automatically produce a finished pelt in inventory.

Desired acquisition paths include:

- search carried belongings;
- skin/butcher/pluck/extract;
- gather/forage/log/mine/dig/fish/trap;
- dismantle/salvage;
- craft/process/cook;
- buy/barter/earn wages;
- quest/contract/reputation/social rewards;
- deliberate exceptional magic when the fiction explicitly supports it.

Item chains should create meaningful source/sink graphs such as:

```text
creature/body -> raw materials -> processing -> ingredients/components -> recipes -> usable goods -> consumption/wear/repair/salvage
```

## World/navigation law

A home base is useful but is not the whole game.

The target supports multiple cities, smaller settlements, roads, wilderness, dungeons, caravans, ferries, mounts/pack logistics, and regional trade.

Internal `place`/map/content partitions may remain for simulation and navigation. Avoid making those boundaries mandatory gamey player-facing loading transitions unless a physical/fantastical boundary actually exists.

Maps represent knowledge. Exploration, NPC directions, purchases, landmarks, and discovered routes should matter.

## Data-scale law

Do not confuse a schema with a complete system.

The intended product eventually contains hundreds/thousands of cross-linked places, NPCs, creatures, resources, items, recipes, techniques/spells, quests, relationships, shops/services, and transport routes.

Mechanics and representative content must grow together. Regional content packs and validation are required before large-scale data generation.

## Current transitional technical debt

Treat these as temporary:

- FFXI-derived world/place/nation/race/job/currency naming;
- `mainJobId` as a universal ability gate;
- sparse placeholder skill-rank math;
- placeholder spell/weapon-skill combat actions;
- automatic generic battle loot where provenance/body processing should replace it;
- tiny starter equipment/shop/enemy catalogs;
- legacy `data/` modules and `ffxi*` research tables;
- historical localStorage key names.

Replace them incrementally behind migrations and tested interfaces rather than through an unbounded rewrite.

## CI rule

Before merging runtime work:

```bash
npm test
npm run benchmark
```

GitHub Actions must be green unless a failure is explicitly understood, fixed, and rerun.
