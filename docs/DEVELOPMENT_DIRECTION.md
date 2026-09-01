# Development Direction

This document is the design north star for the project. It defines the product laws that should survive implementation changes and the architectural direction that future work should follow.

The project is an **original text-first persistent fantasy life RPG**, currently using the working title **Hearth & Horizon**. Earlier FFXI-derived code and data remain useful research/reference material, but inherited world identity, proper nouns, class terminology, and content catalogs are not the target product.

`docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` is authoritative for original-setting nomenclature, legacy-data boundaries, content provenance, scale targets, and content-pack rules.

## Product identity

The player develops one continuous person and one persistent life across a connected fantasy world.

The game combines:

- meaningful preparation, travel danger, mastery, equipment choice, and earned accomplishment;
- life-building through livelihood, property, tools, relationships, reputation, and infrastructure;
- long-horizon progress without requiring avoidable real-world waiting;
- a sandbox world where cities, smaller settlements, roads, wilderness, dungeons, caravans, ferries, resources, creatures, and economies belong to the same simulation;
- tabletop-style presentation where prose and imagination render most of the world while restrained maps, icons, cards, meters, tokens, and diagrams make state legible;
- deterministic, testable systems capable of supporting thousands of cross-linked content records without tying game logic to the UI.

The game should not feel like several disconnected minigames joined by menus. Hunting, gathering, work, crafting, trade, quests, relationships, travel, combat, and home-building should continually feed one another.

## Core progression law

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

Progression should not primarily be:

```text
effort -> arbitrary larger denominator -> identical activity again
```

Repeated work may consume substantial fictional time and resources, but it should leave residue:

- improved proficiency;
- learned capabilities;
- better tools or equipment;
- improved infrastructure;
- stronger relationships/reputation;
- better maps and route knowledge;
- reduced labor or safer travel;
- better yield/quality;
- access to more ambitious projects, regions, services, or training.

Earlier chores should eventually demand less player attention because the character has earned ways to perform them more efficiently.

## Long-duration play without real-time punishment

Simulation time and wall-clock time are separate concepts.

A four-hour fictional task consumes four hours of world time whether the player watches it, fast-forwards, advances directly to completion, or advances until a meaningful interrupt occurs.

The player pays with character time, resources, risk, preparation, fatigue/opportunity cost, and world consequences. The player should not be forced to pay with needless real-world waiting.

The simulation should support:

- normal-speed progression;
- pause;
- configurable fast-forward;
- advance-to-task-completion;
- advance-to-next-event;
- day-boundary review;
- meaningful interrupts such as combat, exhaustion, tool failure, dangerous weather, project completion, NPC events, transport arrival, or important discoveries.

Hardcore modes may restrict saving, injury tolerance, pause behavior, or information, but should not simply turn fictional duration into mandatory wall-clock waiting.

## End-of-day review

Standard play defaults to an end-of-day pause/review.

A useful day summary can include:

- work and travel completed;
- resources acquired/spent/processed;
- skill/proficiency/capability gains;
- project progress;
- notable encounters/discoveries;
- relationship/reputation changes;
- injuries, fatigue, tool/equipment wear, shortages, or failed work;
- newly available opportunities;
- reminders or commitments for the next day.

The player can inspect, plan, save/quit, or continue.

## The world is larger than the home base

The player may build a meaningful foothold, home, workshop, room, farm, camp, or property, but that location is not the entire game.

The world should support:

- multiple major cities and regional hubs;
- smaller towns, villages, camps, forts, mines, ports, monasteries/colleges, farms, and roadside services;
- wilderness routes and landmarks;
- caves, ruins, dungeons, resource sites, and dangerous regions;
- caravan roads and scheduled transport;
- ferries and other waterways;
- mounts, hired transport, pack animals, or equivalent logistics where appropriate;
- trade and production differences that create real reasons to travel.

A home base creates storage, preparation, social, production, and recovery advantages. Travel expands what the character can know, acquire, learn, sell, build, and become.

## Internal world partitions are not mandatory player-facing zones

The engine may partition geography into places, regions, route segments, cells, maps, encounter populations, or streaming/content units. These boundaries are implementation and navigation tools.

Player-facing transitions should usually be expressed naturally through geography and prose rather than artificial level-loading language.

Example:

A paved road narrowing into forest track, a ridge opening onto dry uplands, or cultivated outskirts giving way to marsh can mark an internal dataset transition without announcing a gamey `ZONE CHANGE`.

Hard boundaries remain appropriate where the fiction calls for them: gates, ferries, passes, locked doors, border controls, dungeon entrances, magical barriers, etc.

## Macro geography is not a global tile grid

The world should be geographically continuous and irregular rather than forced into one global square or hex tessellation.

Use separate authorities for separate scales:

- macro geographic envelopes describe relative placement, approximate extent, climate, drainage, and boundaries;
- canonical routes/passages own actual inter-place traversability, distance, fictional travel time, hazards, and allowed modes;
- local grids or topology coordinates support fine exploration inside a place.

A local rectangular grid does not mean the represented forest, marsh, valley, or mountain basin is rectangular in world geography. Two regions touching on a map do not automatically create a walkable edge.

Approximate regional length/width may be tracked for scale, but physical barriers and authored routes remain authoritative.

A specialized local hex coordinate system may be introduced later if a specific place benefits from six-way uniform movement; this is not a reason to convert the entire world to hexes.

See `docs/WORLD_MACRO_TOPOLOGY.md`.

## Maps are knowledge

Maps are not merely menus containing automatically known coordinates.

A character may:

- own or borrow maps;
- discover routes without owning a formal map;
- buy incomplete regional maps;
- learn landmarks from NPC directions;
- reveal terrain/routes through exploration;
- annotate resource sites, hazards, shortcuts, camps, ruins, and services;
- know that a destination exists without knowing the safest/fastest route.

Map knowledge should improve navigation, planning, route confidence, and transport decisions without requiring graphical terrain rendering.

### Localities must be learned, not enumerated

Player-facing locality information follows `docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md`.

The **Local Knowledge & Familiarity Foundation is implemented** at Product 0.9.100.24 / Game State 15 / Data 62. The rules below are current runtime constraints; richer ambient events, wandering merchants, personality dialogue, and deeper shop-category conversation remain follow-on work rather than prerequisites to the foundation.

Entering a town, district, port, wilderness area, or other place must not automatically expose every authored POI, NPC, exit, shop, service, or interaction. The character learns the world through observation, exploration, directions, introductions, signage/iconography, maps, repeated purposeful visits, and contextual events.

Important consequences:
- seeing an entrance is not the same as entering it;
- sighting a POI is not the same as knowing how to reliably return to it;
- canonical NPC names are not automatically player-facing;
- direct same-locality navigation is earned through familiarity rather than one binary discovery;
- temporary directions should bias exploration rather than teleport the character;
- wandering/conditional merchants and events can remain exploration-only even after static landmarks are familiar;
- town navigation may use an abstract learned locality graph instead of a literal city coordinate grid;
- player-facing controls should progressively disclose only actions supported by current context and learned knowledge.

`Look Around` should represent immediate observation. `Explore` should represent fictional-time local movement plus context-weighted discovery/event resolution. Transition verbs such as **Enter**, **Go to**, **Walk to**, **Board**, **Ride**, and **Travel** should reflect the actual boundary or movement mode rather than one universal fast-travel command.

## Resource provenance is gameplay

Rewards should normally have a physical, economic, or social explanation.

Combat against a creature can create access to a body; it does not automatically manufacture finished crafting materials in inventory.

Depending on creature and context, the player may need to:

- search carried belongings;
- skin or flay;
- butcher/dress meat;
- recover bone, horn, teeth, feathers, shell, glands, venom, organs, or other useful parts;
- dismantle/salvage a construct;
- spend tools and fictional time;
- possess enough knowledge/proficiency to recover delicate material;
- choose which outputs are worth weight, time, spoilage, or inventory space.

Likewise, environmental resources come from places that support them:

- plants/fungi through foraging/harvesting;
- timber through logging;
- ore/stone/clay through mining/quarrying/digging;
- fish/shellfish through fishing/trapping/shore gathering;
- salvage through ruins, machinery, containers, wrecks, and discarded equipment.

Exceptional magical creation is allowed when the world explicitly supports it, but unexplained reward confetti should not be the default economy.

## Materials circulate through the world

The economy spine is transformation and use:

```text
world source
  -> raw material
  -> processing
  -> component/ingredient
  -> finished good
  -> use/wear/consumption
  -> repair/recycling/salvage or replacement
```

A raw resource should ideally participate in multiple decisions rather than one recipe.

Example:

```text
small game carcass
  -> meat -> meals/preservation/bait/contracts
  -> hide -> tanning -> leather -> equipment/tools
  -> bone -> craft components/glue/medicine/decorative goods
```

Items need sources and sinks. Regional economies need demand beyond vendors buying infinite junk.

## Gathering and crafting are world systems, not menu checklists

Gathering depends on:

- geography/habitat;
- tool suitability;
- proficiency;
- time;
- resource condition/quality;
- depletion/regeneration or population logic where useful;
- danger/weather/time-of-day where meaningful;
- storage/encumbrance/logistics.

Crafting/processing depends on:

- real ingredients/components;
- tools/stations/facilities;
- time and labor;
- proficiency/knowledge;
- recipe/process discovery or instruction where appropriate;
- quality and byproducts where they create useful choices;
- regional access to materials and services.

Cooking, medicine/alchemy, smithing, woodworking, leatherwork, textiles, construction, repair, and other disciplines should exchange materials rather than live in isolated inventories.

## Construction and resource economy

Construction costs follow physical/economic logic rather than arbitrary exponential repetition penalties.

A second comparable barn should cost approximately what a comparable barn physically requires. Costs legitimately change because of:

- size/design;
- material choice;
- terrain;
- transport distance;
- regional scarcity;
- labor availability;
- specialized machinery/magic;
- renovation constraints;
- structural upgrades;
- capacity and prestige requirements.

Long-term resource sinks come from larger ambition:

- more/larger buildings;
- roads and bridges;
- irrigation;
- carts/wagons/boats;
- workshops and specialized facilities;
- storage and warehouses;
- repairs and maintenance;
- hired labor;
- civic/regional projects;
- prestige and high-complexity work.

## Disciplines are training traditions, not magical transformations

The final design does not treat a selected class/job as a magical state that rewrites the character.

A discipline is a recognized school, profession, guild tradition, martial method, magical curriculum, or social classification.

The character remains one person. Equipping a sword does not transform them into another identity; removing a focus does not erase learned magic.

Use these concepts distinctly:

| Term | Meaning |
| --- | --- |
| Discipline | Recognized training school/profession/archetype. |
| Capability | Learned spell, technique, recipe knowledge, practical skill, trait, or action. |
| Proficiency | Degree of practice/competence in a domain. |
| Loadout | Equipment and immediately ready tools/supplies. |
| Preparation | Ammunition, reagents, focus, stance, memorization, tools, mounts, provisions, companions, route plans, etc. |

Core rule:

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

### Capability eligibility

A capability check may consider:

- whether the character learned it;
- proficiency/mastery;
- hard equipment/tool requirements;
- preferred/enhancing equipment;
- free hands, weapon family, shield, focus, ammunition, reagent, station, mount, etc.;
- MP/TP/stamina/charges/material resources;
- silence, injury, fatigue, encumbrance, statuses;
- terrain, workshop, travel, mounted, underwater, social, or other context;
- formal certification/training when the fiction requires it.

### Hard, soft, and enhancing requirements

**Hard requirement:** the action makes no sense without the prerequisite.

**Soft requirement:** the action is possible but inefficient, slower, weaker, riskier, or more expensive without preferred preparation.

**Enhancer:** optional preparation improves the result without enabling the basic action.

These relationships should be data-driven and testable.

### Cross-discipline use

A character may combine capabilities associated with several disciplines if they know them and satisfy actual prerequisites.

Balance comes from equipment slots, action economy, resources, encumbrance, preparation, proficiency, context, and opportunity cost—not from pretending learned knowledge disappears when a class toggle changes.

Advanced training can still require mentors, guild standing, certification, quests, reputation, prerequisite proficiencies, facilities, or difficult accomplishments.

## Combat mastery, action language, and attention

Permanent advanced-combat authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Combat progression should visibly change **how** a character fights, not only increase damage numbers.

Design direction:
- ordinary melee/ranged attacks evolve into weapon-specific automatic sequences on the canonical combat timeline;
- weapon proficiency unlocks additional sequence stages and selectable slot techniques;
- physical defaults remain viable;
- elemental affinity can unlock substitutions/mutations without forcing every weapon attack to become elemental;
- individual weapons may supply an element or resonate with one, but weapon-family identity is not a universal hard-coded element;
- manual techniques such as bashes, cleaves, feints, backstabs, volleys, and reactions sit above the automatic sequence;
- spells, techniques, ranged attacks, auras, stances, zones, channels, and reactions should share one structured action-resolution vocabulary.

Ability names should describe visible form/motion/element/result honestly. A name that implies a ring, chain, cage, well, rain, breaker, or similar behavior should eventually execute that behavior rather than remain decorative terminology.

Prepared combat loadouts may package equipment, weapon sequence configuration, techniques, stance/aura choices, and affinity substitutions. Switching loadouts in combat is a timed, interruptible action:
- compact weapons handle faster than cumbersome weapons;
- directional stow/draw time matters;
- cooldowns belong to canonical abilities and never reset because a loadout changed;
- armor cannot be swapped while the character remains under meaningful active hostile pressure.

Enemy attention uses distinct concepts:
- **enmity** = absolute accumulated hostility/pressure;
- **focus** = normalized relative attention;
- **aggro** = sticky current target;
- **fixation/priority** = exceptional targeting override.

Focus share is not literal attack probability. Retargeting should use nonlinear focus concentration plus reachability/perception/tactical/current-target modifiers, and should occur only at meaningful reassessment points rather than every tick.

Race/faction/species antagonism may influence baseline hostility, decay, focus floors, or priority without reducing all behavior to a hard scripted target.

## Origins and starting circumstances

Character creation should center on **where this person begins in life**, not merely a starting combat class.

Origins may provide different:

- lodging/property/camp context;
- equipment and tools;
- food/seeds/materials;
- beginner capabilities;
- relationships/contacts;
- debts/obligations;
- reputation;
- starting proficiencies;
- local maps/route knowledge;
- introductory opportunities.

Origins alter the opening without permanently locking later play.

## Preparation is gameplay

Before an expedition, workday, caravan trip, dungeon descent, hunting run, gathering route, delivery, or construction job, the player should decide what they are trying to accomplish.

Different goals naturally favor different:

- equipment;
- tools;
- food/water/medicine;
- ammunition/reagents;
- containers and carrying capacity;
- maps and route knowledge;
- companions;
- transport;
- weather/time planning;
- spare equipment/repair supplies.

This creates value for homes, storage, workshops, equipment collections, crafting, mounts, pack animals, caravans, local services, and relationships without turning preparation into pointless inventory micromanagement.

## NPCs are persistent world participants

Important NPCs should eventually have some combination of:

- home/work locations;
- schedules/availability;
- profession/services;
- relationships/faction ties;
- goals/needs;
- dialogue state;
- quest/contract involvement;
- reputation reactions;
- companion/romance eligibility where appropriate.

The world needs broad service populations and a smaller set of deeply authored social characters.

## Relationships and romance

Social progression should not collapse every person into one universal affection meter.

Possible dimensions include trust, respect, familiarity, attraction, rivalry, gratitude, fear, obligation, shared history, or faction/community standing when useful.

Romance-capable characters should:

- have goals and routines outside the player;
- have boundaries and preferences;
- react to meaningful choices and shared experiences;
- not require identical gift-spam loops;
- remain useful/interesting characters even if romance is never pursued.

## AI party systems

Companions are persistent characters, not summoned combat vending machines.

A party member can have:

- tactical role/preferences;
- learned capabilities/proficiency;
- equipment and consumables;
- resource management;
- injury/KO/recovery;
- relationship state;
- personal goals/quests;
- willingness/availability constraints;
- progression and changing behavior.

Combat AI and relationship state should be separate systems that interact deliberately.

## Content scale is part of architecture

The target game requires hundreds to thousands of interconnected records. A subsystem validated only against five toy records is not necessarily validated for the product.

Mechanics and content therefore grow together.

Examples:

- a crafting engine is tested against enough recipes to reveal categorization, lookup, dependency, and balance problems;
- an ecology engine is tested against multiple families/habitats/variants rather than two starter enemies;
- quest validation is tested across real cross-region objectives;
- shops and regional economies are tested with meaningful inventories and resource chains;
- relationship and companion systems are tested with multiple distinct behavior/personality patterns.

See `WORLD_IDENTITY_AND_CONTENT_POLICY.md` for planning-scale ranges.

## Content-pack architecture

Author dense regional content packs that cross-link:

- geography/routes/maps;
- NPCs/services/shops;
- ecology/resources;
- items/recipes;
- quests/contracts/rewards;
- relationships/companions;
- lore/descriptive text;
- transport/economy.

Do not build one enormous global hand-edited file for each category if regional ownership and validation can keep data more comprehensible.

## Original setting and legacy research

Canonical runtime content is original.

Historical FFXI-derived data may remain temporarily for research, migration, formula comparison, or candidate-data normalization, but:

- new canonical stable IDs must not be inherited FFXI proper nouns;
- player-facing content must not present the world as FFXI;
- imported structures require original names/context and review;
- legacy modules must be clearly bounded from canonical data sources.

The identity/stable-ID migration is intentionally scheduled before high-volume content expansion so this separation does not become prohibitively expensive later.

## Visual presentation policy

The game remains text-first and imagination-led.

Useful restrained visuals include:

- icons/tokens;
- status/resource meters;
- equipment silhouettes;
- cards;
- node/route diagrams;
- schematic/cartographic maps;
- project progress;
- day/time indicators;
- relationship/reputation markers;
- simple party/tactics displays.

The project does not require full graphical terrain, sprite animation, cinematic rendering, or a large art-asset pipeline to deliver its core promise.

## Architecture direction

The separation of data, state, systems, and UI remains appropriate. Continue evolutionary change rather than another broad rewrite.

Priorities:

- ordered save migrations before persistent state proliferates;
- deterministic canonical world time;
- common timed-action/task/project contracts;
- structured action results and semantic events;
- stable canonical IDs;
- content-pack boundaries and cross-reference validation;
- resource provenance and item source/sink validation;
- ecology/population data separated from encounter instances;
- UI/command input as adapters into shared gameplay actions;
- formulas/values carrying confidence/provenance metadata when uncertain;
- avoid full event sourcing unless a later requirement demonstrates its necessity.

## Transitional systems

Current systems that should not be mistaken for final commitments include:

- legacy FFXI world/place/race/job/currency terminology;
- `mainJobId` and job-switch assumptions;
- current sparse job skill-cap tables;
- partial Combat 2.0 / ability behavior: B1 now provides representative unified physical/magical/elemental/status resolution, while weapon-driven kata cadence, first-class ranged attacks, combat loadout transitions, broader catalog migration, and party attention/enmity remain transitional/future;
- automatic battle loot behavior that predates provenance/body-processing design;
- wall-clock tick scheduling as distinct from canonical simulation time;
- small starter item/shop/monster catalogs;
- legacy `data/` modules and recovered FFXI reference datasets.

Replace these incrementally behind tested interfaces and explicit migrations.

## Current priority order

1. complete deterministic time/tasks/interrupt/day-boundary foundation;
2. migrate canonical runtime identity/stable IDs to the original setting;
3. add provenance/projects/body processing;
4. add ecology/gathering/spawn substrate;
5. integrate timed routes and scheduled caravans/transport;
6. establish regional content packs, import-normalization tools, and validators;
7. complete character stats/proficiencies/disciplines/capabilities;
8. build magic/ability and Combat 2.0;
9. expand item/tool/equipment and production systems at meaningful data scale;
10. add AI party/companions;
11. expand into multiple connected regions/cities with real NPC populations/economies;
12. add systemic quests/contracts/reputation;
13. deepen relationships and romance;
14. expand infrastructure/life systems and late adventure depth;
15. release hardening at thousands-of-record scale.

## Decision test for substantial features

Before adding a major feature or content family, ask:

1. Does it help the player build persistent life, capability, relationships, knowledge, or infrastructure?
2. Does it create a meaningful decision, risk, preparation need, tradeoff, or long-term ambition?
3. Does mastery make repeated use more efficient, expressive, reliable, or valuable?
4. Does it connect to at least one other world system?
5. Does it fit a text-first UI without requiring a graphical-engine pivot?
6. Can its state/behavior be tested deterministically?
7. Can it scale to the content volume the final game needs?
8. Does it belong to this original world rather than merely reproduce another game's proper nouns/content?

If the answer to several is no, redesign or defer it.
