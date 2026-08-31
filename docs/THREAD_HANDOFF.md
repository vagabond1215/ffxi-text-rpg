# Thread Handoff

Repository evidence beats conversation memory.

## Current contract

```text
Product:       0.9.100.24
Package:       0.9.100
Account Save:  5
Game State:    15
Data:          62
Benchmark:     3
Codename:      Local Knowledge & Familiarity
Runtime:       Node >=24
Phase:         0.9
Gate A:        COMPLETE through Packet E
Latest unit:   Local Knowledge & Familiarity Foundation COMPLETE
Next formal:   0.9.200 Adventure Vertical Slice A QUEUED / NOT AUTO-STARTED
```

## Latest bounded unit — Local Knowledge & Familiarity Foundation

**COMPLETE on `main`.**

Implementation freeze:
- `da168ddff6cc9e3611c9b8c06165b117081ea5c0`.

Hosted implementation validation:
- Check #1770;
- run `33355620265`;
- exact implementation-freeze SHA;
- Repository Audit PASS;
- **823/823 tests PASS**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS.

The final semantic audit before freeze also closed two subtle authority leaks:
- a merely sighted commitment giver does not disclose their commitment until actual interaction;
- an origin guide can create a real Referenced supplier lead plus temporary search guidance, but the referred service is not directly navigable until learned.

## Version / persistence decision

The foundation intentionally changes runtime persistence without changing canonical authored content:

```text
Product       0.9.100.23 -> 0.9.100.24
Package       0.9.100    -> 0.9.100
Account Save  5          -> 5
Game State    14         -> 15
Data          62         -> 62
Benchmark     3          -> 3
```

Why Game State changes:
- layered place/POI knowledge affects future navigation;
- learned names and NPC identity linkage affect future presentation/social access;
- connector familiarity affects available local movement;
- POI interaction history affects commitment/service disclosure;
- temporary guidance/search bias changes future exploration probability;
- current local POI/interior context must survive save/load coherently.

Why Data does not change:
- no canonical place/locality;
- no canonical route or transport service;
- no canonical POI/NPC/schedule;
- no ecology/resource/item/process;
- no commitment/quest definition;
- no Pack-v2 ownership record
was added or changed as authored-content scope for this unit.

No supported-save migration was added. The project remains strict pre-alpha current-schema-only. Game State 14 saves are not silently coerced into Game State 15.

No new simulation clock, direct timed-task owner, timer, listener, background worker, inventory authority, or duplicate route/world database was introduced.

## Canonical Data 62 continuity

The latest canonical authored-data bounded unit remains **Cross-Biome Family Breadth**:
- implementation freeze `c5e12b5d8f0b6ddf7a76f5df01316567b43d4528`;
- promoted Data 62 SHA `bc472b60374a048686b0ee6c877ba26c515aec35`.

Packet E / Content Scale Gate A remains complete:
- permanent audit `docs/GATE_A_INTEGRATION_CENSUS_AUDIT.md`;
- audit implementation freeze `81b2928611a297d765eaa64f7cedeadb5fd697ee`;
- Check #1638 / run `33332932015`;
- Gate A result **PASS / COMPLETE**.

The five-part flora/fauna diversity repair sequence remains complete through Data 62 and must not be restarted automatically.

## Current census

Validated on the Local Knowledge & Familiarity implementation freeze:

```text
places/localities       55
named NPCs              47
shop/service sites      37
creature definitions   123
resource sources       143
canonical items        408
recipes/processes      234
abilities/techniques    41
quests/contracts        18
companions               1
transport services       7
routes                   25
spell schools             4
capabilities             44
NPC schedules            27
regional/shared packs    39
pack-owned records     1320
runtime seed NPCs        46
runtime seed enemies     17
raw-resource use      145/154
luxury-raw use          14/14
```

Mechanics-scale gate remains **NOT READY**:
- companions 1/4 — largest relative gap;
- abilities/techniques 41/100 — largest absolute gap;
- quests/contracts 18/30;
- named NPCs 47/50.

Do not manufacture filler merely to satisfy those later mechanics floors.

## Implemented locality-knowledge authority

Permanent design authority:
- `docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md`.

Game State 15 now persists `localKnowledge` as character-specific knowledge references rather than duplicate canonical records.

Implemented knowledge layers:
1. Unknown;
2. Referenced;
3. Sighted;
4. Recognized;
5. Familiar.

Current tuning defaults:
- Tier 1 Familiar threshold: 5;
- Tier 2: 7;
- Tier 3: 10;
- Tier 4: 14.

These remain defaults rather than a mandate to grind repeated clicks.

### Place / POI / connector behavior

- Fresh starting locality is Sighted, not automatically Familiar.
- A reference can teach a name without teaching a route.
- Sighted targets can be acted on only while currently before them.
- Direct same-locality `Go to` behavior requires Familiar knowledge.
- Known adjacent settlement connectors support `Walk to`/boundary movement.
- Directly adjacent but unknown settlement links must not fall through to omniscient long-range travel; Journal/campaign/commitment guidance may direct the player to Explore for the local way.
- Canonical routes remain actual inter-place traversability authority.
- Touching map/place envelopes still do not imply travel.

### Look Around / Explore

`Look Around`:
- immediate/local observation;
- no fictional-time exploration cost;
- reveals one contextually obvious target instead of enumerating the locality;
- never auto-enters or auto-crosses the target.

`Explore`:
- advances fictional time;
- uses deterministic/injectable weighted resolution;
- can reveal/reinforce POIs and local connectors;
- increases locality familiarity;
- consumes temporary guidance as weighted search bias rather than teleportation;
- may resolve ambient/no-new-target outcomes.

Broader street-event variety remains future work.

### NPC identity / referrals / commitments

NPC knowledge keeps separate concepts for:
- appearance known;
- referenced name known;
- identity linked;
- contact familiarity.

Knowing a name by referral does not automatically mean the character can identify or locate that person.

Origin orientation contact:
- begins as a legitimate name reference from character creation;
- must still be found and actually interacted with;
- real talk can refer the player to one practical supplier;
- that referral creates Referenced POI knowledge and save-persistent temporary guidance;
- it does not create direct navigation.

Commitment disclosure:
- requires actual prior interaction with the giver;
- sighting the giver alone is insufficient.

### Staged POI interaction

Current semantic sequence:

```text
discover/sight
-> approach / go to
-> enter when venue type requires it
-> greet / shop / guild / quest / travel / other service
-> leave
```

Important details:
- buildings such as shops/guilds/storage require explicit entry;
- person/stall-like POIs do not receive fake interiors merely to satisfy the state machine;
- `activePoiId` is persisted and validated against current place/local anchor;
- real position changes clear stale local interaction context;
- indoor workstation access requires actual entry;
- service boards route visits through the staged POI transition rather than direct interaction.

### Services / schedules / transport

- Settlement shops/workshops are filtered through learned POIs.
- Shop stock is not exposed merely because the canonical shop exists in the district.
- NPC availability uses canonical fictional-time schedule authority.
- Schedule status is shared by UI and legacy command paths.
- Public scheduled transport is exposed only through a known travel point or Familiar transport hub.
- Dense familiar transport hubs may devote the contextual action budget to their actual scheduled departure board.
- Coppergrass remains transit wilderness: Forge-Mere physically crosses it, but no staffed/scheduled Coppergrass boarding stop is implied.

## Deferred locality work

The foundation is complete; these are **not** auto-started:
- broader ambient/risk street-event catalog;
- wandering/seasonal merchants;
- generalized guard/help direction encounters beyond the proven guide-referral mechanism;
- personality-varied greetings/dialogue;
- deeper NPC-mediated shop stock-category/browse conversation;
- richer learned-locality graphical map presentation;
- broad UI polish built on top of these semantics.

Select these only through a fresh bounded work order.

## Authorities synchronized

Before this handoff, the following current authorities were synchronized:
- `README.md`;
- `PROJECT_PROFILE.yaml`;
- `docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md`;
- `docs/DEVELOPMENT_DIRECTION.md`;
- `docs/ARCHITECTURE.md`;
- `docs/SYSTEM_CATALOG.md`;
- `docs/QUALITY_GATES.md`;
- `docs/EXECUTION_PIPELINE.md`;
- `docs/ROADMAP.md`;
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md`;
- `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md`.

Last pre-handoff authority commit:
- `1408aec55d2b740d5e34ab59ad0dd5a8c44fe7ee`.

Pre-handoff hosted validation:
- Check #1782 / run `33355940369`;
- Repository Audit, 823/823 tests, Census, Benchmark 3, Benchmark Sample all green.

**This file is the final repository-file write for the Local Knowledge & Familiarity Foundation continuity pass.**

## Standing rules preserved

Continue to preserve:
- route graph as inter-place traversability/distance/time/hazard/mode authority;
- touching map envelopes do not imply travel;
- acquired map/locality knowledge instead of omniscient presentation;
- ecology distribution does not automatically create recovery sources;
- passive/wary wildlife remains non-hostile unless behavior justifies otherwise;
- exact source/place/action provenance for recoverables;
- explicit food safety for food-capable items;
- intentional production/economic/use sinks or explicit exemptions;
- Pack-v2 ownership/dependency metadata is not a duplicate gameplay database;
- generated scale fixtures remain excluded from canonical census;
- deterministic census and deterministic/injectable simulation conventions;
- canonical fictional time, never wall-clock canonical schedules;
- Game State 15 unless another genuinely new durable player/world fact requires change;
- no hard benchmark timing thresholds;
- Benchmark remains version 3;
- normal low-risk work may proceed directly on `main`;
- any future handoff remains the final repository-file write before final validation.

## Next decision boundary

No next packet is auto-started.

Formal roadmap ranking:
1. **`0.9.200 Adventure Vertical Slice A`**
   - prefer a character-centered slice;
   - naturally add a justified recruitable companion where character authorship supports it;
   - add connected quests/contracts and NPC/service relationships;
   - reuse existing geography where practical rather than expanding the map for counts.
2. **`0.9.300 Advanced Combat / Training`**
   - deepen ability/technique breadth through real learning/equipment/discipline/encounter requirements.
3. **`0.9.400 Economy / Production Depth`**
   - Occupational Tool Conversion remains the strongest already-planned bounded candidate.
4. **`0.9.500 Quest / Social Depth`**.
5. **`0.9.600 Playable-Alpha Scale Push`**.

Separate world-edge ranking:
1. Waymeet Inner Marches / outer crossroads approach;
2. Coppergrass extensions;
3. Drowned Vaults.

Separate optional ecology queue still requires fresh selection:
- broader Crownfields ordinary-wildlife spread using existing families;
- secondary Deepvein Mine / Sunken Archive ecology/substrate cleanup;
- shorebird/wader breadth if coastal depth warrants it;
- snake breadth only with a concrete ecological/player/economic loop.

Richer locality events/dialogue/UI work is also a separate optional queue. The Local Knowledge & Familiarity Foundation does not auto-authorize it.

## Restart order

1. `AGENTS.md`;
2. this file;
3. `PROJECT_PROFILE.yaml`;
4. `docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md`;
5. `docs/EXECUTION_PIPELINE.md`;
6. `docs/ROADMAP.md`;
7. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`;
8. relevant runtime files only for the newly selected bounded unit.

For locality-foundation maintenance, primary runtime authorities are:
- `js/text/systems/localKnowledgeEngine.js`;
- `js/text/systems/localityEngine.js`;
- `js/text/systems/playerInformationEngine.js`;
- `js/text/systems/playerOpportunityEngine.js`;
- `js/text/systems/playerContinuityEngine.js`;
- `js/text/systems/playerExperienceEngine.js`;
- `js/text/systems/poiEngine.js`;
- `js/text/systems/currentGameStateSchema.js`;
- `js/text/systems/validation.js`;
- `js/text/ui/gameViewModel.js`;
- `js/text/ui/domApp.js`;
- `js/text/ui/uiIntentDispatcher.js`.

## Final validation requirement

Validate the exact final `main` head with hosted Check and Pages.

Hosted Check includes:

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

After final exact-head validation, stop at the decision boundary above.
