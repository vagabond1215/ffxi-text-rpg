# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Read order

1. `AGENTS.md` — direct-`main` workflow, autonomous-session budget, scope boundaries, and handoff protocol.
2. `docs/DEVELOPMENT_DIRECTION.md` — authoritative design north star.
3. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-setting, naming, legacy-data, provenance, scale, and content-pack policy.
4. `docs/ROADMAP.md` — current implementation sequence and milestone gates.
5. `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — version protocol.
6. `docs/TRANSITIONAL_ARCHITECTURE.md` — temporary seams that must not harden into final design.
7. Relevant runtime/data/tests for the next bounded unit.

Older planning documents preserve useful history but do not override the files above.

## Current Git workflow

The repository is in an early single-maintainer development phase. Per `AGENTS.md`, **continue directly on `main` by default**.

Do not create a branch/PR merely as ceremony. Use isolation if the user asks, a tool requires it, or the change is unusually risky enough that isolation materially helps.

Remote branch deletion is not exposed by the current GitHub connector, so stale remote branches remain a manual repository-maintenance task. Do not create replacement cleanup branches.

## Autonomous work-session limit

`AGENTS.md` sets the operating guardrail:

- maximum autonomous session: **2 hours 45 minutes**;
- **2:15** stabilization checkpoint;
- **2:30** start no new implementation unit;
- by **2:45** persist a coherent state, update this handoff, and report;
- if elapsed time cannot be measured reliably, use the fallback maximum of **6 autonomous work cycles**, reserving cycle 6 for stabilization/handoff.

A new user message starts a new budget. Roadmap `Next` sections do not authorize an endless autonomous chain.

## Product identity

Working title: **Hearth & Horizon**.

This is an original text-first persistent fantasy life RPG about one continuous character building livelihood, skills, relationships, reputation, material capability, home/infrastructure, and geographic reach across a connected fantasy world.

Earlier FFXI-derived material is **legacy research/reference/migration material**, not canonical world content.

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

## Current baseline

```text
Product:      0.5.550.2
Package:      0.5.550
Account Save: 4
Game State:   5
Data:         15
Benchmark:    1
Codename:     Original World Identity
```

`js/text/version.js` is authoritative.

## 0.5.550 — exit status

The original-world identity and canonical nomenclature migration is **complete enough to exit the track**.

Implemented on `main`:

- canonical powers: Thornwall, Brasshaven, Mistmere;
- canonical regions/places/maps including Elderwood, Redstone Reach, and Starfen;
- canonical ancestries: Human, Lethari, Miri, Veyra, Korren;
- original transitional discipline IDs/names and canonical starting disciplines;
- bounded legacy-to-canonical identity adapters;
- ordered Game State v4 -> v5 identity migration;
- Data contract advanced to v15;
- canonical character-creation defaults and fast-create vocabulary;
- canonical normal help vocabulary (`powers`, `ancestries`, `disciplines`, `home`, `companion`, `places`, `exits`);
- originalized starter NPC/service/world-facing names;
- canonical POI companion and route-exit types/actions;
- canonical home-storage player-facing terminology;
- canonical travel fallback/arrival terminology;
- canonical database/system diagnostic vocabulary;
- historical FFXI-derived modules clearly isolated as legacy/reference data;
- stale tests migrated to canonical IDs/names rather than weakening runtime canonicalization.

### CI checkpoint

The runtime identity/nomenclature series reached a fully green GitHub Actions checkpoint at commit:

```text
96dcdd8efe3e404af68a15c126c2839934c55520
```

At that checkpoint:

- `test` — success;
- benchmark step — success;
- `build` — success;
- Pages build/deploy reporting — success.

After that checkpoint, only version-manifest/test synchronization and documentation closeout commits were added. Inspect the newest `main` checks before starting the next runtime unit, and fix any real regression directly on `main` if necessary.

## Deliberate bounded compatibility debt

Do not “clean up” these by inventing new canon casually:

- **Currency:** keep `gil` unchanged until an original currency design is deliberately defined. Do not invent a replacement solely to erase the term.
- **Save keys:** historical localStorage key names remain for compatibility.
- **POI hook IDs:** some legacy-shaped POI stable IDs remain while shop/quest/guild dependencies still reference them; migrate these atomically later.
- **Legacy adapters:** `legacyIdentity`, save migrations, bounded command aliases, and migration tests may contain historical IDs by design.
- **Research modules:** `legacyRecoveredData`, `ffxi*` formula/reference modules, root historical `data/`, and historical planning/audit documents may retain FFXI terminology because they are explicitly non-canonical sources.

The 0.5.550 exit rule is not “zero historical strings anywhere in the repository.” It is: **new canonical gameplay records and normal world-facing runtime state no longer depend on inherited FFXI proper nouns or stable IDs.**

## Canonical world anchors

- **Thornwall** — western crown realm/capital context;
- **Elderwood** — surrounding western forest region;
- **Brasshaven** — industrial/mercantile forge republic;
- **Redstone Reach** — its mineral-rich hinterland;
- **Mistmere** — scholastic canal city;
- **Starfen** — surrounding wetland/grassland region;
- **Waymeet** — future neutral central trade/transport hub.

## Canonical ancestry mapping

Historical input aliases map at bounded compatibility seams:

- Hume -> Human
- Elvaan -> Lethari
- Tarutaru -> Miri
- Mithra -> Veyra
- Galka -> Korren

New canonical runtime state emits only the original IDs.

## Transitional discipline mapping

Current player-facing discipline names include:

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

These remain transitional training disciplines, not permanent magical class locks. Long-term capability use belongs to the continuous character and is constrained by real preparation/equipment/resources/context.

## Next target

```text
0.5.600 — Resource provenance and persistent projects
```

**Do not restart identity migration work.** Inspect current CI, then begin the first bounded 0.5.600 unit.

Recommended first unit:

1. Define a persistent project schema/state with stable project IDs.
2. Track material requirements/contributions, labor/time requirements, status/progress, and deterministic completion boundaries.
3. Emit structured project semantic events rather than deriving state from prose.
4. Define provenance/source metadata that can represent carried goods, creature bodies, flora, minerals, fishing, salvage, crafting, commerce, contracts, and deliberate exceptional magic.
5. Introduce post-combat body/resource opportunities so creature rewards can transition away from automatic finished-item drops.
6. Establish search/skin/butcher/pluck/extract/salvage action contracts with future hooks for tools, time, condition, and proficiency.
7. Add item source/sink metadata and cross-reference validation hooks at representative scale.

Keep this first unit substrate-focused. Do not explode into high-volume item/monster/recipe generation before the schema, provenance, and validation seams are coherent.

## Resource/economy design law

Rewards should have physical, economic, or social provenance.

A defeated animal normally creates access to a body; it does not automatically create a finished pelt in inventory.

Desired acquisition paths include:

- search carried belongings;
- skin/butcher/pluck/extract;
- gather/forage/log/mine/dig/fish/trap;
- dismantle/salvage;
- craft/process/cook;
- buy/barter/earn wages;
- quest/contract/reputation/social rewards;
- deliberate exceptional magic when the fiction explicitly supports it.

Item chains should create source/sink graphs such as:

```text
creature/body -> raw materials -> processing -> ingredients/components -> recipes -> usable goods -> consumption/wear/repair/salvage
```

## World/navigation law

A home base is useful but is not the whole game. The target supports multiple cities, smaller settlements, roads, wilderness, dungeons, caravans, ferries, mounts/pack logistics, and regional trade.

Internal place/map/content partitions remain useful for simulation and data management. Avoid turning those boundaries into mandatory gamey player-facing loading transitions unless a real physical/fantastical boundary requires it.

Maps represent knowledge. Exploration, NPC directions, purchases, landmarks, and discovered routes should matter.

## Data-scale law

Do not confuse a schema with a complete system.

The intended product eventually contains hundreds/thousands of cross-linked places, NPCs, creatures, resources, items, recipes, techniques/spells, quests, relationships, shops/services, and transport routes.

Mechanics and representative content must grow together. Regional content packs and validation are required before large-scale generation.

## Current transitional technical debt

Treat these as temporary and replace incrementally behind migrations/tested interfaces:

- `mainJobId` as a broad capability gate;
- sparse placeholder skill-rank math;
- placeholder spell/weapon-skill combat actions;
- automatic generic battle loot where provenance/body processing should replace it;
- tiny starter equipment/shop/enemy catalogs;
- legacy `data/` and `ffxi*` research tables;
- historical localStorage key names;
- legacy-shaped POI hook IDs.

Do not solve these through an unbounded rewrite.
