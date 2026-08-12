# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Read order

1. `docs/DEVELOPMENT_DIRECTION.md` — authoritative design north star.
2. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-setting, naming, legacy-data, provenance, scale, and content-pack policy.
3. `docs/ROADMAP.md` — current implementation status and immediate sequence.
4. `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — product-version protocol and detailed release gates.
5. `docs/TRANSITIONAL_ARCHITECTURE.md` — temporary seams that must not harden into final design.
6. `docs/ARCHITECTURE.md` — module/runtime boundaries.
7. `js/text/version.js` — runtime/system version manifest.

Older planning documents may preserve useful history but do not override these files.

## Product identity

Working title: **Hearth & Horizon**.

This is an original text-first persistent fantasy life RPG about one continuous character building livelihood, skills, relationships, reputation, material capability, home/infrastructure, and geographic reach across a connected fantasy world.

Earlier code/data contains extensive FFXI-derived experiments. Those are now **legacy research/reference/migration material**, not canonical world content.

Do not author new canonical databases using inherited FFXI place, nation, race, class, currency, creature, NPC, or item proper nouns.

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
