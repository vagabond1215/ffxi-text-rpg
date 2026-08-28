# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Required read order

1. `AGENTS.md`
2. this file
3. `docs/EXECUTION_PIPELINE.md`
4. `docs/DEVELOPMENT_DIRECTION.md`
5. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
6. `docs/ROADMAP.md`
7. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
8. `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md` when Phase 0.9 work is authorized
9. only the architecture/runtime/tests named by the next bounded action

Repository evidence beats conversation memory. If this checkpoint matches repository state, do not restart broad historical discovery.

## Current checkpoint

Phase 0.8 is complete. Phase 0.9 / `0.9.100 Content Scale Gate A` is in progress.

Packets A–C are merged:

- Content Pack Scale Contract v2
- Redstone Forge-Road
- Elderwood Hunt-Timber

Packet D — **Universal Magic & Starfen Marshcraft** — is implemented, validated on its frozen gameplay/content head, promoted to the Product 0.9.100.4 / Data 43 contract, and synchronized across the repository. Only the final exact-head hosted Check + PR #385 landing remain after this handoff write.

```text
Product:       0.9.100.5
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          44
Benchmark:     3
Codename:      World Edge Expansion & Slatewater Waylodge
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

### Repository state immediately before this final handoff write

```text
main:            a013fbc8db33ff9f9e664cdbc2789d3759ed75a3
main protected:  false
PR:              #385 open / draft / mergeable
branch:          feature/0.9.100-starfen-marshcraft-practical-magic
```

GitHub-side final validation/readiness/merge occur after this write. Refresh PR #385 and `main` rather than guessing their final state from this document.

This handoff is the **final repository-file write for Packet D**. Do not modify repository files merely to record the resulting Check or merge SHA.

## Frozen Packet D gameplay/content checkpoint

The exact gameplay/content implementation freeze is:

```text
ee81069defe59a55979bc262ea595c3c9df42f40
```

A first promoted-head Check after documentation synchronization found one stale `pipeline.test.js` version-description assertion still expecting Product 0.9.100.3 / Data 42. That assertion block was corrected without gameplay/data changes; this rewritten handoff is therefore the true final repository-file write before the rerun.

Pre-promotion hosted evidence:

```text
Check:              33139128883
Job:                98745791538
Node:               24.19.0
Repository Audit:   PASS
Tests:              719/719 passed
Content Census:     success
Benchmark 3:        success
Benchmark Sample:   success
```

Validated census:

```text
places/localities       26 / mechanics 10
named NPCs              17 / 50
shop/service sites      17 / 20
creatures               16 / 40
resource sources        13 / 40
canonical items         68 / 200
recipes/processes       29 / 75
abilities/techniques    41 / 100
quests/contracts        18 / 30
companions                1 / 4
transport services        3 / 5

spell schools                            4
capability/training definitions         44
NPC schedules                            7
regional/shared packs                   10
pack-owned records                     248
pack-owned abilities/capabilities/
  schedules/companions              41/44/7/1
runtime seed NPCs                       16
runtime seed enemies                    13
```

Mechanics-scale gate remains **NOT READY**. Companions are now the largest relative gap.

## Universal-magic rule

Magic is character-owned and universal/shared, not location-owned.

Canonical spell schools and spell stable IDs are owned by `pack-shared-foundation`. Regional packs may provide teachers, stories, contracts, traditions, or contextual use, but must not:

- own a canonical spell stable ID;
- add Redstone/Elderwood/Starfen identity tags to a spell definition;
- require geographic origin/location merely to use an already learned spell.

Current shared magic contains:

- Elemental Form — fire, earth, wind, water, lightning, ice, light, dark;
- Vital Weave — restoration;
- Ward Lore — defensive/support magic;
- Veilscript — original seal magic using the existing `ninjutsu` skill;
- 33 canonical spell capabilities;
- 33 executable spell abilities.

`docs/research/TALES_OF_SYMPHONIA_MAGIC_REFERENCE.md` is non-canonical design research only. It records systemic/taxonomic observations without importing franchise spell names, lore, characters, places, or progression. Canonical Hearth & Horizon names, stable IDs, mechanics, effects, and lore remain original.

## Starfen marshcraft graph

Packet D retains Starfen regionality where it is meaningful:

```text
existing reed fiber / Bluekelp / Marrowleaf / Bogberry / Mirecrest Heron recovery
  -> existing production / work / inventory / provenance
  -> reed cord / kelp extract / marsh poultice / bogberry tonic / waterproof wraps / survey kit
  -> persistent Mistmere contacts Pelu Senn + Tavi Meren
  -> canonical fictional-time schedules
  -> provenance-qualified community/research commitments
  -> Starfen Current Reading as regional field knowledge
  -> pack-starfen-marshcraft
```

Regional Starfen contracts deliberately do not gate universal spells.

## Infrastructure changes in Packet D

- capability catalog expanded and universalized;
- ability catalog expanded to 41 executable abilities;
- Veilscript school uses existing `ninjutsu` skill;
- commitment reward contract can optionally grant a canonical capability after qualification checks, reusing existing character capability state;
- Pack-v2 commitment catalog references now validate giver NPC, place, required item/source, and capability dependencies;
- an existing Redstone Sweetroot cross-pack dependency on Elderwood is now declared explicitly;
- Tavi Meren's schedule preserves existing 08:00 Mistmere culinary service;
- no new simulation clock, direct timed-task owner, inventory authority, progression state family, social-state family, or persistence family was added.

## Version decision

```text
Product       0.9.100.3 -> 0.9.100.4
Package       0.9.100   -> 0.9.100
Data          42        -> 43
Game State    14        -> 14
Account Save  5         -> 5
Benchmark     3         -> 3
```

Data 43 is justified by new stable canonical authored IDs, universal/shared spell ownership, Starfen marshcraft records, and stronger catalog-reference validation.

Game State remains 14 because no new durable player/world fact was introduced.

## Validation contract

Ordinary hosted Check remains:

```text
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Census target completion is progression evidence, not an ordinary CI pass/fail rule. No hard Benchmark 3 timing threshold is accepted.

## Immediate next bounded work

Packet E — Gate A integration/census audit — remains queued and was **not started by Packet D**.

If a later work order instead explicitly authorizes another bounded data/infrastructure unit, refresh `main`, this handoff, the execution pipeline, and the relevant catalogs before proceeding. Do not silently bundle unrelated work into the landed Packet D history.

## Governance

Phase 0.9 work uses PR-based integration and exact-head hosted validation. Main is still unprotected because the available connector cannot safely mutate branch-protection policy. Stale remote branch cleanup remains manual administrative debt.

Do not auto-start a later roadmap unit without explicit authorization.
