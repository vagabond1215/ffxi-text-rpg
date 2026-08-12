# Roadmap

This roadmap is the current implementation summary and release-phase index for the text-first fantasy life RPG.

Authoritative companion documents:

- `docs/DEVELOPMENT_DIRECTION.md` — design north star and non-negotiable product direction.
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — detailed four-part version protocol, sub-milestones, exit gates, and path to 1.0.
- `docs/ARCHITECTURE.md` — current runtime/module boundaries.
- `docs/THREAD_HANDOFF.md` — current implementation state for a new development thread.

The older `docs/planning/DEVELOPMENT_PIPELINE_AND_MILESTONES.md` remains useful as historical planning context for the formula/item-behavior era, but its recommended milestone order is superseded by this roadmap and the two authoritative direction documents above.

## Current baseline

Historical product version:

```text
0.4.4
```

Current baseline remains a rough pre-alpha foundation rather than a nearly half-complete product.

Implemented foundations include:

- canvas-first text UI and command compatibility;
- local account/character saves;
- character creation;
- structured player/NPC/enemy entities;
- San d'Oria coordinate navigation and atlas discovery;
- world places, travel, aggro, POIs, shops, guild hooks, and starter quest hooks;
- inventory/storage/wardrobes;
- item schema, inspection, equipment, buying, and selling;
- character-owned skills and deterministic skill-gain hooks;
- combat/reward/EXP/loot scaffolds;
- status and live-tick scaffolds;
- validation, tests, benchmarks, version/system manifests, and documentation.

Important transitional assumptions:

- the current wall-clock tick engine is not the final world-time model;
- `mainJob`/support-job/current-job behavior is not the final capability model;
- current formulas are conservative scaffolds, not the main product roadmap;
- current broad FFXI data/system coverage is less important than proving a cohesive life/adventure loop.

## Product direction summary

The intended game is a long-form, text-first fantasy life RPG built around:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

The character should remain one continuous person. Jobs become recognizable disciplines/classifications rather than magical transformations. Learned capabilities may cross discipline boundaries when the character satisfies their proficiency, equipment, preparation, resource, and context requirements.

Simulation time and wall-clock time must be separable so fictional grind can retain weight without forcing unnecessary real-world waiting.

Construction/resource progression should be driven by physical scale, upgrades, specialization, logistics, and infrastructure rather than arbitrary exponential costs for repeated identical work.

The game remains text-first; limited icons, tokens, meters, cards, and diagrams are encouraged where they improve comprehension without creating a full graphical-world production burden.

See `docs/DEVELOPMENT_DIRECTION.md` for the full policy.

## Release phases

| Product phase | Theme | Player-facing gate |
| --- | --- | --- |
| `0.4` | Foundation closeout and direction lock | Architecture is ready for simulation/capability work without another rewrite. |
| `0.5` | World time, tasks, projects | Multi-hour/day fictional work can be advanced, interrupted, summarized, and completed without real-time waiting. |
| `0.6` | Capabilities, disciplines, origins, livelihood | One continuous character can mix learned disciplines logically through loadout/preparation and participate in a livelihood. |
| `0.7` | First complete game loop | A new player can live through a representative first week combining work, preparation, travel, danger, recovery, and permanent progress. |
| `0.8` | Life/infrastructure expansion | Buildings, tools, farming/gathering, crafting, taming, relationships, and logistics materially transform earlier work. |
| `0.9` | Adventure depth and release hardening | Combat/magic/content/balance/UI/persistence are content-complete and release-candidate quality. |
| `1.0` | Live Foundation | Core product promise is coherent, stable, migratable, and playable as a persistent long-form RPG. |

Detailed sub-milestones (`0.x.100`, `0.x.200`, etc.) are defined in `docs/VERSIONING_AND_RELEASE_ROADMAP.md`.

## Version protocol summary

Future product versions use:

```text
MAJOR.PHASE.TRACK.REVISION
```

Example:

```text
0.5.300.4
```

- `MAJOR`: product stability generation (`0` pre-live, `1` live).
- `PHASE`: major release milestone.
- `TRACK`: three-digit scoped sub-milestone, normally in increments of 100.
- `REVISION`: simple integration counter within the track.

The historical `0.4.4` release is not retroactively renumbered.

Because npm package versions are three-part SemVer, the product version must be decoupled from `package.json.version` when the new protocol is implemented. Do not write a four-numeric-segment product version directly into `package.json.version`.

## 0.4 current work

### Complete enough

- [x] Text/canvas shell.
- [x] Command adapters.
- [x] Current account/save foundation.
- [x] Core entity/state/data separation.
- [x] World/travel/atlas scaffolds.
- [x] Inventory/equipment/item/shop foundations.
- [x] Combat/reward/progression scaffolds.
- [x] Validation/test/benchmark infrastructure.
- [x] Development direction documented on planning branch.
- [x] Four-part version protocol and 1.0 milestone plan documented on planning branch.

### Remaining 0.4 closeout

- [ ] Implement product/package version separation.
- [ ] Add ordered persistence migrations.
- [ ] Introduce a small structured action-result contract.
- [ ] Add lightweight semantic events without full event sourcing.
- [ ] Stabilize existing systems against the new contracts.

## 0.5 focus — simulation substrate

- [ ] Deterministic world clock independent of `Date.now()`.
- [ ] Pause and speed/fast-forward semantics.
- [ ] Canonical timed task model.
- [ ] Meaningful interrupt model.
- [ ] Day boundary and end-of-day auto-pause/review.
- [ ] Persistent material/labor project model.
- [ ] Integrate travel plus one work activity with world time.

## 0.6 focus — continuous character capability

- [ ] Learned capability/proficiency model.
- [ ] Jobs represented as disciplines/classifications rather than magical active states.
- [ ] Hard/soft/enhancing equipment and preparation prerequisites.
- [ ] Cross-discipline capability use where prerequisites are met.
- [ ] Origin-based starting circumstances.
- [ ] First complete livelihood loop.
- [ ] Loadout UX showing enabled/penalized/blocked capabilities.

## 0.7 focus — first complete representative game

Working slice: **A Week Beyond the West Gate**.

- [ ] Lightweight objective/quest state foundation.
- [ ] Real starting foothold/home-base context.
- [ ] One permanent project.
- [ ] One livelihood/economy loop.
- [ ] One meaningful West Gate expedition route.
- [ ] Combat/KO/recovery adequate for the slice.
- [ ] Multiple simulated days and end-of-day summaries.
- [ ] Permanent end-of-week accomplishment/unlock.
- [ ] At least two meaningfully different origin openings.
- [ ] UI/action discoverability without command memorization.

## 0.8 focus — systemic life expansion

- [ ] Construction instances, renovations, capacity, and efficiency upgrades.
- [ ] Gathering/farming depth.
- [ ] Crafting/tools/facilities.
- [ ] Taming/husbandry with practical value.
- [ ] Persistent relationships and local/guild reputation.
- [ ] Logistics and labor-saving infrastructure.
- [ ] Additional disciplines/livelihood interactions.
- [ ] Economy/resource sink balancing.

## 0.9 focus — content, adventure, and release candidate

- [ ] Deeper enemy/combat behavior.
- [ ] Structured magic and advanced capabilities consistent with the loadout model.
- [ ] Second dense region proving content scalability.
- [ ] Long-form progression/economy balance.
- [ ] UI/accessibility/readability hardening.
- [ ] Save migration/compatibility hardening.
- [ ] Deterministic simulation/content validation/performance gates.
- [ ] Content-complete beta.
- [ ] Release-candidate feature freeze.

## 1.0 minimum promise

1.0 should not be declared merely because a checklist is large. It requires a coherent persistent game.

At minimum, a player must be able to:

- begin from meaningful starting circumstances;
- develop one persistent character across disciplines;
- alter practical capability through logical equipment/preparation rather than magical job changes;
- work, learn, build, travel, prepare, fight, recover, and improve;
- use pause/fast-forward while preserving fictional time costs and meaningful interrupts;
- pursue long-duration projects with logical material/labor costs;
- improve infrastructure so mastered chores consume less attention;
- build relationships/reputation that affect available opportunities;
- experience representative taming/creature systems if retained in the 1.0 scope;
- play through at least two dense regional content spaces;
- save/load under an explicit supported migration contract;
- play normal flows without command-line expertise;
- understand game state through text-first presentation with limited visual polish.

## Formula policy

Formula work remains important but no longer leads the product roadmap.

Use formula confidence categories:

- exact / sourced;
- researched approximation;
- intentional simplification;
- placeholder.

Refine formulas when they improve a player-facing loop that already has a reason to exist. Do not delay world time, capabilities, livelihoods, objectives, projects, or the first complete slice merely to chase retail-exact combat math.

## Current recommended next pass

After this planning branch is reviewed/merged, the next runtime pass should target `0.4.200`:

1. introduce an authoritative four-part product version;
2. decouple it from the private npm package SemVer;
3. update version display/tests/docs;
4. then proceed to ordered persistence migrations before adding new persistent simulation state.
