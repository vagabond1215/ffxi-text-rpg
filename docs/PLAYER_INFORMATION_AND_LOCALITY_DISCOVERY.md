# Player Information & Locality Discovery

This document defines the pre-UI gameplay contract for what the player character knows about places, routes, services, NPC identities, and local opportunities.

It exists to prevent the player-facing interface from becoming an omniscient database or an automatic list of every authored option in the current place.

Repository/world truth and player knowledge are separate authorities.

## Core rule

**The world may know an entity exists. The player interface may expose it only to the extent that the character has actually perceived, learned, or been told about it.**

Entering a place does not automatically reveal:
- all districts;
- all buildings;
- all exits;
- all shops/services;
- all NPCs;
- NPC names;
- shop stock;
- quests/contracts;
- hidden or temporary opportunities.

Exploration, conversation, signage/iconography, direct introduction, directions, prior visits, maps, reputation, schedules, and contextual events are the normal ways player knowledge grows.

## Canonical world truth vs player knowledge

Canonical catalogs remain authoritative for:
- places/localities;
- routes and connectors;
- POIs/buildings/services;
- NPC definitions;
- schedules;
- shops and stock;
- commitments/relationships;
- ecology and encounters.

A future durable **local knowledge/familiarity authority** should own the character's learned projection of those records.

The UI must render from that learned projection rather than directly from canonical catalogs.

Do not duplicate canonical records into player state. Store only character-specific knowledge/familiarity facts and references to canonical stable IDs.

## This replaces binary POI discovery semantics

Current runtime has:
- atlas visit knowledge;
- `discoveredPois`;
- contextual POIs;
- same-place POI fast travel after discovery.

That one-step `discovered -> fast travel` rule is too permissive for the intended game.

Future implementation should replace binary POI discovery with layered knowledge/familiarity. During pre-alpha, prefer a clean current schema rather than preserving obsolete discovery semantics merely for save compatibility.

The exact schema/version change is deferred until implementation. Because knowledge/familiarity and temporary guidance must survive save/load, implementation is expected to introduce or materially change durable Game State authority.

## Place/locality knowledge states

Place knowledge must distinguish **knowing something exists** from **being able to reliably navigate to it**.

Recommended semantic states:

1. **Unknown**
   - not player-visible;
   - no direct action;
   - no map/contact listing.

2. **Referenced / Rumored**
   - the character has heard of the place or service;
   - a name or rough description may be known;
   - no precise direct navigation;
   - exploration can receive a contextual search bonus.

3. **Sighted**
   - the character has physically seen the building, stall, entrance, district gate, or other target;
   - if currently standing before it, the player may choose to enter/interact;
   - sighting alone does not guarantee future direct navigation.

4. **Recognized**
   - repeated exposure makes the target reliably recognizable;
   - the player can distinguish it from surrounding streets/structures;
   - it may appear in remembered-locality information.

5. **Familiar**
   - the character knows how to reach it reliably from the current parent district/locality;
   - the UI may offer a direct **Go to**-class action while the character is in that parent locality.

A place can be referenced before it is sighted, or sighted before its proper name is known.

### Familiarity thresholds

Familiarity is exposure-based and data-driven.

Initial tuning defaults:

| Familiarity tier | Typical use | Default exposure points to become Familiar |
| --- | --- | ---: |
| Tier 1 | major gate, inn, guildhall, central market, common civic facility | 5 |
| Tier 2 | ordinary specialist shop, secondary district feature | 7 |
| Tier 3 | tucked-away specialist, uncommon service, minor hidden court | 10 |
| Tier 4 | obscure/secretive location intended to remain discovery-driven | 14 |

These are defaults, not universal hard-coded constants. Individual records may override them.

Exposure points need not equal raw visit count one-for-one. Examples:
- arriving at the place intentionally: +1;
- entering/using the place: +1 where appropriate;
- being personally led there: stronger familiarity gain;
- receiving clear directions: may add familiarity and/or a temporary search bonus;
- owning a useful local map: may add route/location knowledge without social knowledge;
- seeing only a distant sign/entrance: lower information gain.

Do not turn familiarity into repetitive button grinding. Strong guidance, repeated purposeful use, professional background, or appropriate maps can accelerate learning.

## Direct navigation rule

Finding something is not the same as transitioning into it.

If exploration reveals a district entrance:

> You emerge from the press of dock carts into a broader junction. Beyond an arch of soot-dark stone, hammer noise rolls down a climbing street—the entrance to the Foundry Ward.

The state change is **entrance sighted**.

The UI may then offer:

**Enter Foundry Ward**

The character does not automatically cross the boundary.

The same rule applies to:
- shops;
- inns;
- guildhalls;
- workshops;
- taverns;
- residences;
- dungeons;
- ferries/ships;
- district gates;
- hidden venues.

Once a destination is Familiar, direct navigation is allowed only within the locality scope the character actually knows.

Example:
- from Port District, a Familiar chandlery may expose **Go to Chandlery**;
- a Familiar Foundry Ward connector may expose **Walk to Foundry Ward**;
- a shop inside Foundry Ward is not directly reachable from Port District merely because the player has visited it before.

## Traversal vocabulary is contextual

Do not force one global "fast travel" label.

Player-facing verbs should reflect the fiction and movement mode:

- **Go to** — direct movement within a familiar district/locality;
- **Walk to** — adjacent known district or nearby locality;
- **Enter** — cross a discovered boundary into a district/building/dungeon;
- **Leave / Exit** — leave an interior or bounded venue;
- **Board** — ship, ferry, caravan, rail-like transport if ever authored;
- **Ride** — mount/cart/coach service where appropriate;
- **Travel** — longer route movement;
- other original setting-specific verbs where fiction calls for them.

Canonical route/passages remain the actual inter-place traversability authority.

## Town/city representation

A town does not require a visible coordinate grid.

For settlements, prefer an **abstract locality graph**:
- entry anchors;
- districts;
- junctions;
- notable streets/courts where useful;
- POI entrances;
- known connectors between them.

This supports an old labyrinth/adventure-game sense of movement without requiring directional buttons or a literal overhead city map.

Narrative movement can say the character:
- leaves a crowded pier;
- follows warehouse traffic uphill;
- crosses a parade ground;
- reaches a market junction;
- passes under a district arch;
- emerges beside a canal stair.

The player chooses semantic actions, not compass headings.

Fine coordinates remain valid where they are genuinely useful, especially wilderness, dungeon, or tightly spatial exploration.

If a locality map is rendered later, it must reveal only learned nodes/connectors. Unknown locality structure stays hidden.

## Entry/spawn anchors

First entry into a place should not drop the character into an arbitrary omniscient center.

Arrival context chooses from legal entry anchors.

Examples:
- ship/ferry arrival -> port/quay;
- overland route -> appropriate gate/roadhead;
- caravan/coach -> station/yard;
- mountain pass -> pass mouth or trailhead;
- underground route -> lift, stair, tunnel mouth;
- new-character civic origin -> plausible common public arrival point.

If several anchors are equally valid, deterministic context-aware RNG may choose among them.

Arrival mode takes priority over randomness.

## Look Around vs Explore

Both are context-aware actions but serve different scopes.

### Look Around

A low-cost immediate observation of the character's present surroundings.

It can reveal:
- obvious visible entrances;
- prominent buildings;
- nearby stalls;
- conspicuous uniforms/badges/crests;
- visible NPC descriptors;
- current crowd/weather/lighting;
- immediately readable or recognizable signage where character capability permits.

It should not automatically enumerate every authored option in the district.

### Explore

A time-consuming local movement/discovery action.

It advances fictional time and resolves a weighted contextual exploration event.

Possible results:
- reach/sight a landmark or building;
- find a district entrance;
- encounter an NPC;
- encounter a peddler or wandering merchant;
- receive directions;
- witness a local event;
- find a temporary opportunity;
- encounter crowd friction, theft, fraud, or danger;
- discover nothing unusually useful while still receiving narrative movement.

Exploration narrative should explain movement through the locality rather than outputting a naked random-result line.

Example:

> You work your way inland through stacked rope shops and fishmongers, following the flow of handcarts until the wharf noise thins. A broad stone crossing opens ahead where three streets divide around a rain-dark statue.

## Exploration RNG

Exploration is weighted by context, not uniform random selection.

Inputs may include:
- current locality/district;
- entry point;
- canonical fictional time;
- weekday/calendar cycle where authored;
- weather when a canonical weather authority exists;
- local events/harvest/festival state where authored;
- known/referenced targets;
- temporary directions;
- reputation/faction standing;
- quest/commitment state;
- player capabilities/background;
- recent exploration results;
- NPC/service schedules;
- rarity/visibility of the target.

Randomness must use the game's deterministic/injectable RNG conventions. Do not use wall-clock randomness as canonical simulation authority.

## Temporary directions and search bias

Directions do not automatically teleport the character or permanently teach a route.

A guard, innkeeper, child, porter, vagrant, merchant, or passerby may provide a temporary **search bias** toward a target.

Example:

> "Guildhall? Keep the canal on your left until the paving turns white. You'll hear the practice yard before you see the doors."

Mechanical effect:
- increases the chance that Explore finds the referenced target;
- may reveal the target name/rough district;
- expires at the next qualifying sleep/rest reset if that is the authored rule;
- must survive save/load while active.

Because temporary guidance changes future simulation probability, it is gameplay state, not presentation-only UI state.

## NPC identity knowledge

Canonical NPC names are not automatically player-facing.

A first encounter may expose only an authored descriptor:

> A short young woman sits on a stool behind the counter, sleeves rolled above her elbows. She notices your glance and smiles.

The player may learn a name through:
- direct introduction;
- another NPC's reference;
- a badge, crest, posted roster, labeled stall, office placard, or other credible identifier;
- prior acquaintance;
- a formal service interaction where the person gives their name;
- another authored source.

Do not assume every character can read ordinary text. Visual symbols, uniforms, guild crests, spoken introductions, and remembered descriptions can communicate identity without literacy. If literacy becomes a character capability later, text-only identification should respect it.

Player knowledge should distinguish at least:
- **anonymous appearance known**;
- **name/reference known**;
- **identified person** (name and encountered identity linked);
- **familiar contact**.

Knowing the name "Mara Venn" from a reference does not necessarily mean the character can identify Mara on sight until the link is established.

Underlying canonical code may always use the NPC stable ID/name. The **player-facing projection** must mask unknown identity.

## NPC greeting and conversation

Interacting with an available NPC should be narrative and context-aware.

Inside a shop, a first view might be:

> "Welcome to the Bowyer's Rest. What can I do for you?"

Contextual actions might be:

- **Greet**
- **Shop**
- **Ask**
- **Leave**

Actions are semantic. Prose may vary.

Standard greetings should have multiple personality-consistent variants so repeated visits do not return one identical line.

Future dialogue rendering may consume:
- NPC personality;
- player-selected personality/dialogue disposition;
- relationship/familiarity;
- reputation;
- time/schedule pressure;
- quest state;
- prior conversations.

Presentation variation must not silently mutate gameplay state. Semantic outcomes remain explicit and testable.

## Shop interaction

A player should not automatically receive the complete inventory list merely by being in the same district.

Typical flow:

1. discover/reach shop entrance;
2. choose **Enter** if open/accessible;
3. receive interior/NPC description;
4. choose **Greet**, **Shop**, **Ask**, **Leave**, etc.;
5. choosing **Shop** starts an NPC-mediated commerce interaction;
6. expose relevant stock categories derived from actual shop stock;
7. choose category or **Browse**;
8. then expose actual items/prices that are available now.

Example NPC response:

> "Looking for trail gear? We've bows and small blades along that wall, leather pieces behind me, and fresh arrow bundles under the counter. What are you after?"

Possible actions:

- **Blades**
- **Bows & Arrows**
- **Armor**
- **Browse**
- **Never mind**

Categories are derived from the shop's real stock/taxonomy. Do not author fake category buttons for stock the shop does not carry.

Shop specialization should remain real:
- bowyer/hunter;
- armorer;
- weaponsmith;
- farrier;
- tool smith;
- clothier;
- apothecary;
- provisioner;
- general adventurer/guild supplier;
- other setting-appropriate professions.

The UI is an abstraction of conversation and visible goods. It is not necessarily an in-world written menu.

## Closed shops and schedules

A discovered shop entrance remains known while the proprietor/service may be unavailable.

If closed:
- the player can still recognize/go to the location when familiarity permits;
- entry may be blocked, limited, or physically possible depending on authored venue rules;
- commerce/talk actions must respect schedules.

Do not make the whole building disappear merely because its NPC is off duty.

## Specialty and hidden services

Some services should require more than ordinary street familiarity.

Possible gates:
- quest/commitment completion;
- relationship or reputation threshold;
- guild/faction membership;
- referral;
- remote geography;
- schedule/time/day;
- weather/event/harvest condition;
- limited rotating stock;
- hidden entrance;
- low-probability first encounter;
- payment to a guide;
- being led there;
- illicit-network knowledge.

Examples may include:
- black markets;
- thieves' guild contacts;
- secretive specialist artisans;
- brothels or other restricted adult venues;
- slave auctions or other criminal/abhorrent institutions where appropriate to authored world conflict;
- smugglers;
- underground fighting spaces.

Discovery never implies moral endorsement or player affiliation.

## Ephemeral people and venues

Not every useful encounter becomes a permanent **Go to** destination.

Wandering merchants, itinerant healers, peddlers, seasonal laborers, festival stalls, illicit brokers, and similar entities may be **ephemeral**.

Their availability can be conditioned on:
- weekday;
- weather;
- harvest;
- season/calendar event;
- route arrival;
- market day;
- local state.

The player may learn:
- the person's identity;
- what they sell/do;
- their usual pattern or rumor;

without learning a permanent location.

This keeps Explore relevant after static landmarks are familiar.

## Ambient and risk events

Exploration should continue to produce world life, not become a dead button after map completion.

Possible events:
- crowd jostling;
- minor delays;
- accidental collisions;
- pickpocket attempts;
- fraud/scams;
- guard patrols;
- arguments;
- street performers;
- work crews;
- children;
- vagrants;
- helpful locals;
- rumors;
- temporary traders;
- local celebrations;
- arrests/chases;
- hostile ambushes where fiction supports them;
- guides who lead the character somewhere;
- guides who charge a fee;
- guides who betray the character;
- discovery of hidden or illicit places.

Consequences must use existing gameplay authorities:
- theft -> wallet/inventory authority;
- ambush -> encounter/combat authority;
- guide fee -> wallet authority;
- reputation -> relationship/reputation authority;
- location knowledge -> local knowledge authority.

Do not resolve material consequences only in prose.

## Guard/help encounters

Common civic helpers may provide bounded assistance with major Tier-1 destinations.

Example:

> A two-person watch patrol slows as you hesitate at the junction. One guard studies you for a moment.
>
> "You look turned around. What are you after?"

Player options should be generated from reasonable major destinations the character does not yet reliably know:
- inn;
- guild;
- market;
- civic office;
- major district entrance;
- transport terminal;
- other high-traffic service.

Selecting one grants directions/search bias; it does not directly teleport the player there.

More socially marginal or unusual guides can produce rarer and less reliable outcomes.

## Information projection rule

Player-facing models must expose semantic knowledge, not raw canonical truth.

Examples:

Bad:
- list every NPC in `state.npcs` by canonical name;
- list every POI in a place;
- list every route exit because it exists in data;
- expose complete shop stock before the player reaches/engages the shop.

Good:
- "A dockhand in a red cap";
- "You have heard there is a guildhall somewhere uphill";
- "An arched street to the Foundry Ward is visible ahead";
- "You know how to reach the chandlery from here";
- "The shopkeeper offers bows, arrows, and leather armor."

## UI progressive disclosure

The UI should remain small because unknown or irrelevant actions are absent.

At any moment, show only actions supported by:
- current physical/social context;
- learned knowledge;
- availability;
- current interaction stage.

Example progression:

Arrival at unfamiliar port:
- **Look Around**
- **Explore**

After sighting a district entrance:
- **Explore**
- **Enter Market Ward**

Inside a familiar port district:
- **Go to Chandlery**
- **Go to Inn**
- **Walk to Market Ward**
- **Walk to Foundry Ward**
- **Explore**

At a shop entrance:
- **Enter**
- **Leave / Continue exploring**

Inside:
- **Greet**
- **Shop**
- **Ask**
- **Leave**

This is the intended alternative to a permanent command console or omniscient action board.

## Relationship to atlas/map knowledge

Atlas and locality knowledge are related but not identical.

Atlas owns where the character has physically traveled/recorded.

Local knowledge owns what the character knows about:
- landmarks;
- POIs;
- identities;
- directions;
- familiarity;
- connectors;
- temporary guidance.

A character may:
- know a place by rumor without having visited it;
- have visited a street without knowing a shop's name;
- know a person's name without knowing where they are;
- know an entrance exists without being familiar enough for direct navigation.

If a city map is ever shown, it should be a learned locality graph layered over acquired knowledge, not an automatically complete coordinate board.

## Planned durable authority

Implementation should introduce one clean character/world knowledge authority rather than spreading booleans across UI models.

Conceptual shape only:

```text
localKnowledge
  places/pois
    canonicalId
    knowledgeState
    familiarityPoints
    learnedName
    knownConnectors
    firstSeenAtWorldSeconds
    lastSeenAtWorldSeconds
  npcs
    npcId
    appearanceKnown
    referencedNameKnown
    identityLinked
    familiarity
  temporaryGuidance
    targetId
    sourceId
    searchWeightBonus
    expiresOnSleep/rest rule
```

Exact field names are deferred to implementation.

Do not serialize generated prose, button lists, or duplicated canonical definitions.

## Version/persistence decision for this planning pass

This document is planning/design authority only.

No runtime or canonical authored-data change occurs here:
- Product remains 0.9.100.23;
- Package remains 0.9.100;
- Account Save remains 5;
- Game State remains 14;
- Data remains 62;
- Benchmark remains 3.

When local knowledge/familiarity is implemented, reassess Game State. A durable replacement for binary `discoveredPois` plus save-persistent temporary guidance is a genuine serialized-state contract change and should not be hidden inside UI code.

## Pre-UI implementation order

Before broad player-facing UI work:

1. define/implement local knowledge/familiarity state;
2. mask NPC identity in player-facing projections;
3. split sighting from familiarity/direct navigation;
4. implement Look Around / Explore semantic actions;
5. implement entry/exit transition gates;
6. implement locality-aware direct navigation;
7. implement temporary directions/search bias;
8. implement contextual exploration event resolver;
9. adapt shop interaction to staged NPC-mediated commerce;
10. only then build/polish the broader player-facing UI around these semantics.

Player personality/dialogue disposition may be added as a separate bounded player-identity feature and then consumed by dialogue presentation. Do not block core locality discovery on it.

## Non-goals

This contract does not authorize:
- a global city coordinate simulation;
- automatic procedural generation of all dialogue;
- wall-clock merchant schedules;
- omniscient minimaps;
- direct travel to merely sighted POIs;
- automatic NPC name disclosure;
- filler random events with no semantic effect;
- a new parallel route authority;
- a second simulation clock.

The goal is a world that must be **learned**, not a database that is displayed.
