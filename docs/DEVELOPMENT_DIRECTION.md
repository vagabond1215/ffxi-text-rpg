# Development Direction

This document is the design north star for the project. It defines what the game is trying to become, the design laws that should survive implementation changes, and the architectural direction that future work should follow.

It supersedes the earlier assumption that the project roadmap should primarily be driven by reconstructing FFXI formulas or feature breadth. FFXI remains an important source of tone, weight, progression philosophy, jobs, equipment, travel danger, and long-form accomplishment, but the project is not intended to become a text transcription of retail FFXI.

## Product identity

The target is a long-form, text-first fantasy life RPG in which an ordinary character gradually builds a livelihood, home, skills, relationships, reputation, and material capability while venturing into an increasingly dangerous world.

The intended experience combines:

- the weight, preparation, danger, mastery, and earned accomplishment associated with older FFXI;
- the incremental life-building structure of games such as Rune Factory and Fantasy Life;
- the measurable long-horizon progress of incremental games without requiring real-world waiting;
- tabletop-style presentation where prose and imagination do most of the rendering while icons, tokens, cards, meters, and diagrams communicate state;
- a deterministic, testable simulation foundation that can support large amounts of authored content without tying game logic to the UI.

The player should feel that they are developing one continuous person and one persistent life, not switching between disconnected game modes.

## Core progression law

The primary progression loop is:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

Progression should not primarily be:

```text
effort -> arbitrary larger denominator -> same activity again
```

Repeated work may take substantial simulated time and may require substantial resources, but it should leave measurable residue: improved proficiency, better tools, better infrastructure, new options, reduced labor, improved yield, safer travel, better preparation, or access to more ambitious work.

Earlier chores should eventually consume less player attention because the character has earned ways to perform them more efficiently.

## Long-duration play without real-time punishment

The game should support long fictional timescales and meaningful grind while respecting real player time.

Simulation time and wall-clock time are separate concepts.

A four-hour fictional task should consume four hours of world time whether the player watches it at normal speed, fast-forwards, advances directly to completion, or advances until a meaningful interrupt occurs.

The player pays with character time, resources, risk, preparation, and opportunity cost. They should not be forced to pay with avoidable real-world waiting.

### Time controls

The intended simulation eventually supports:

- normal-speed ticking;
- pause;
- configurable fast-forward;
- advance-to-task-completion;
- advance-to-next-event;
- end-of-day auto-pause;
- meaningful interrupts such as combat, exhaustion, tool failure, project completion, major NPC events, dangerous weather, or important unlocks.

Hardcore modes may restrict pauses, saving, injury tolerance, or event handling, but should not simply force slower real-world waiting.

## End-of-day review

Standard play should default to an end-of-day decision pause.

The day summary should make progress legible without forcing the player to watch every low-value tick. Useful summary categories include:

- work completed;
- resources gained or spent;
- skill/proficiency changes;
- project progress;
- notable encounters;
- relationship/reputation changes;
- injuries, fatigue, equipment wear, or shortages;
- newly available opportunities;
- reminders for tomorrow.

The player should be able to inspect state, plan, save/quit, or immediately continue.

## Construction and resource economy

Construction costs should follow physical and economic logic, not arbitrary exponential repetition penalties.

If one standard barn requires a particular amount of lumber, stone, fittings, and labor, a second identical barn under comparable conditions should cost approximately the same amount.

Costs may legitimately change because of:

- different size;
- different materials;
- difficult terrain;
- transport distance;
- labor availability;
- regional scarcity;
- specialized machinery or magic;
- structural upgrades;
- capacity expansion;
- renovation complexity;
- prestige or regional scale.

The game should create long-term resource demand through expansion and sophistication rather than unexplained multipliers based only on how many copies the player has already built.

High-value resource sinks include:

- larger structures;
- renovations;
- specialized facilities;
- automation and labor-saving infrastructure;
- storage and transport capacity;
- roads, carts, warehouses, irrigation, and workshops;
- equipment maintenance and replacement;
- prestige projects;
- civic or regional projects.

## Jobs are disciplines, not magical transformations

The project should retain recognizable jobs such as Warrior, White Mage, Black Mage, Red Mage, Thief, Ranger, Paladin, Dark Knight, Bard, and other fantasy disciplines, but a job is not a magical character state.

A job is a recognized archetype, curriculum, training tradition, or classification of competencies.

The character remains one continuous person. Equipping an axe does not transform the character into a Warrior. Equipping a staff does not transform the character into a Mage. Removing equipment does not cause learned knowledge to disappear.

### Design vocabulary

Use these concepts distinctly:

| Term | Meaning |
| --- | --- |
| Discipline / Job | A recognized school, profession, archetype, or training tradition. |
| Capability | A learned spell, technique, skill, trait, or other action the character knows. |
| Proficiency | How practiced or competent the character is with a capability or skill domain. |
| Loadout | The equipment and immediately prepared state that determines what the character can effectively do now. |
| Preparation | Ammunition, reagents, focus items, stance, memorization/prepared actions, tools, mounts, supplies, or other contextual readiness. |

A useful rule is:

```text
Jobs describe.
Capabilities enable.
Loadouts constrain and enhance.
```

### Ability eligibility

Ability use should eventually resolve from actual prerequisites rather than primarily from `currentJob`.

A capability check may consider:

- whether the character has learned the ability;
- relevant proficiency or mastery;
- required or preferred equipment;
- required free hands, weapon family, shield, focus, ammunition, or tool;
- MP, TP, stamina, charges, reagents, or other resources;
- silence, injury, encumbrance, status effects, or environmental restrictions;
- mounted, workshop, travel, terrain, or other context;
- discipline-specific advanced training where instruction is genuinely required.

### Hard requirements, soft requirements, and enhancers

Abilities should support three broad equipment/preparation relationships.

**Hard requirement:** the action does not make sense without the prerequisite. Shield Bash requires a shield. Archery techniques require a bow and usable ammunition. Some rituals may require a focus.

**Soft requirement:** the action is still possible, but the character is poorly prepared. A learned healing spell may be cast without a preferred wand or staff at increased resource cost, longer cast time, lower potency, or higher interruption risk.

**Enhancer:** the item is not required but improves the action. A healing focus may improve potency or efficiency; specialist armor may improve interruption resistance.

The exact penalties and bonuses should be data-driven, confidence-labeled, and balance-tested rather than hard-coded into command handlers.

### Cross-discipline use

The design intentionally does not use FFXI's single support-job limitation as the primary capability gate.

A character may use capabilities associated with several disciplines at the same time if they genuinely know those capabilities and satisfy their prerequisites.

The balancing constraint is that the character cannot optimally deploy everything simultaneously. Equipment, preparation, resources, encumbrance, action economy, proficiency, and context create the build boundaries.

A heavily armored sword-and-shield character who studied restoration magic may still cast a basic heal, but may do so less efficiently than a character equipped and prepared as a dedicated healer.

### Discipline progression still matters

Jobs remain meaningful because advanced techniques may require formal instruction, certification, guild standing, milestones, quests, mentors, or minimum proficiencies.

A discipline can provide:

- training paths;
- advanced techniques;
- specialist traits;
- trainers and guilds;
- titles and recognition;
- access to equipment or facilities;
- reputation and narrative identity;
- shorthand for describing a loadout or play style.

The important rule is that discipline identity should represent earned training, not a toggle that rewrites the character.

## Origins and starting conditions

Character creation should eventually move from a simple starting-job choice toward origin-based starting circumstances.

Origins may provide different:

- starting tools;
- equipment;
- seeds or materials;
- learned beginner capabilities;
- local relationships;
- debts, obligations, or reputation;
- starting property or lodging;
- starting proficiencies;
- introductory objectives.

Origins should not permanently lock later play. They change the opening and early constraints while allowing a character to learn other disciplines and livelihoods over time.

Examples include Homesteader, Guard, Apprentice, Hunter, Drifter, Craftsperson, or similar setting-appropriate backgrounds.

## Preparation should be gameplay

Before an expedition, the player should think about what they are trying to accomplish rather than selecting a magical class transformation.

A hunting trip, dungeon expedition, gathering run, escort mission, or construction supply trip should naturally favor different equipment and supplies.

This gives long-term value to:

- storage;
- equipment collections;
- tools;
- crafting;
- mounts and pack animals;
- carts;
- homes and workshops;
- consumables;
- scouting and known routes;
- relationships and local services.

Preparation should create meaningful tradeoffs without becoming inventory busywork.

## Visual presentation policy

The game remains text-first and imagination-led.

Limited visual polish is encouraged when it improves comprehension or identity without creating a full graphical-world burden.

Appropriate visual elements include:

- icons;
- tokens;
- status meters;
- equipment silhouettes;
- cards;
- simple node diagrams;
- maps represented as schematic/coordinate information;
- project progress indicators;
- day/time indicators;
- relationship or reputation markers.

The project should not pivot into sprite animation, full graphical terrain, cinematic rendering, or a large asset-production pipeline unless explicitly reconsidered later.

## First lovable vertical slice

The first substantial playable target should prove the life/adventure intersection rather than only combat or only farming.

Working concept: **A Week Beyond the West Gate**.

The slice should include:

1. a small set of origins with different starting circumstances;
2. a modest home base, room, plot, workshop access, or equivalent foothold;
3. one simple livelihood/gathering loop;
4. a local shop/economy loop;
5. a persistent project that accumulates materials and labor;
6. simulated days with end-of-day review;
7. one meaningful expedition outside the city/gate;
8. travel risk and at least one dangerous combat encounter;
9. measurable proficiency or capability growth;
10. return-home recovery and preparation;
11. completion of something permanent that did not exist when the character began;
12. a resulting unlock that opens the next layer of play.

The first slice should make the player feel that a week of fictional life produced a materially different character and world state.

## Architecture direction

The current separation of data, state, systems, and UI remains appropriate. Do not rewrite the project simply to pursue the new direction.

Evolutionary priorities:

- add explicit ordered save migrations before persistent systems proliferate;
- separate deterministic simulation time from wall-clock timer delivery;
- define a canonical time-consuming action/task model used by travel, work, crafting, construction, farming, and other systems;
- move toward structured action results instead of prose-only return values;
- add lightweight semantic game events so quests, summaries, tests, achievements, and UI can react to meaning rather than parsing strings;
- keep command input and UI controls as adapters into the same gameplay actions;
- keep content data-driven and stable-ID based;
- author dense regional content packs rather than broad shallow map coverage;
- preserve formula confidence labels: exact/sourced, researched approximation, intentional simplification, placeholder;
- avoid full event sourcing unless a later requirement justifies its complexity.

## Current transitional systems

Several current systems are useful foundations but should not be mistaken for final design commitments.

In particular:

- `mainJobId`, support-job assumptions, job-specific current-state checks, and current job switching are transitional;
- job level data may later become discipline training/mastery data;
- capability eligibility should gradually migrate away from a single current-job gate;
- the existing wall-clock tick engine is a scaffold, not the final world-time model;
- current formulas are executable scaffolds, not a requirement to reproduce retail FFXI exactly;
- current San d'Oria content is a foundation for a dense region, not a mandate to reproduce every FFXI zone before the core game loop is fun.

Do not rip these systems out in one broad rewrite. Replace assumptions incrementally behind tested interfaces.

## Priority order

The broad priority order from the present repo is:

1. lock development direction and version protocol;
2. persistence/migration foundation;
3. deterministic world time, pause, advance, and day boundaries;
4. canonical tasks/projects and semantic action/event contracts;
5. capability/discipline/loadout model and origins;
6. first livelihood plus first-week vertical slice;
7. infrastructure, construction, tools, farming/gathering depth, crafting, relationships, taming, and logistics;
8. deeper adventure systems, magic, combat, objectives, and regional expansion;
9. formula refinement where it materially improves an already-compelling game loop;
10. release hardening and 1.0 content completeness.

The detailed release sequence and version-number protocol live in `docs/VERSIONING_AND_RELEASE_ROADMAP.md`.

## Non-goals for the near term

Do not let the following become the roadmap spine before the first complete loop is proven:

- exact retail FFXI formula reconstruction;
- complete FFXI job/ability/spell coverage;
- complete FFXI item database migration;
- full auction-house/economy simulation;
- broad map reproduction with low interaction density;
- full graphical world rendering;
- massive creature or recipe catalogs before one representative instance is fun;
- arbitrary exponential construction costs;
- real-world idle timers as a substitute for simulation depth.

## Decision test for new features

Before adding a substantial feature, ask:

1. Does this help the player build a persistent life or capability?
2. Does it create a meaningful decision, risk, preparation need, or long-term ambition?
3. Does repeated use become more efficient or more expressive through mastery?
4. Does it integrate with at least one other system rather than exist as an isolated checklist item?
5. Can it be represented clearly in the text-first UI without demanding a graphical-engine pivot?
6. Can its state and behavior be tested deterministically?
7. Is the implementation appropriately scoped for the current release milestone?

If the answer to most of these is no, the feature probably belongs later or should be redesigned.
