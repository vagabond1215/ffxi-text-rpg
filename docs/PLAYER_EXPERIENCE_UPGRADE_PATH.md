# Player Experience Upgrade Path

This document defines the player-facing upgrade path for Phase 0.7. It is ordered by what a normal player must understand and accomplish, not by how many underlying engines exist.

## Player promise

A new player should be able to answer these questions from normal browser play:

1. **Why am I here?** — the character has an origin-specific arrival circumstance and a first local connection.
2. **What should I do next?** — the game presents one clear first contact and then several small, non-exclusive ambitions.
3. **How does progress work?** — actions connect effort to persistent mastery, efficiency, capability, preparation, knowledge, or relationships.
4. **Why would I leave town?** — nearby regions contain work, resources, danger, people, and knowledge that feed back into the character’s life.
5. **Why would I return?** — settlements convert what the character earned into recovery, trade, processing, equipment, training, social continuity, and larger ambitions.

The intended loop remains:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

No onboarding or convenience layer may create a parallel quest clock, hidden teleport graph, omniscient map, duplicate progression counter, duplicate economy, or reward path that bypasses provenance.

## Pre-alpha implementation rule

Player-experience work targets the clean current model. Old local-save compatibility is not a Phase 0.7 design requirement. Prefer one explicit authority, keep derived values derived, and version real contract changes deliberately.

## PX-1 — Arrival and footing

**Implemented and audited.** All three origins name the starting settlement, regional horizon, and a real first contact; new games begin at a believable morning hour; and the opening explains that the starting discipline is initial training rather than a permanent class identity.

## PX-2 — First-day actionable opportunities

**Implemented and audited.** The Journal projects real livelihood, training/danger, exploration/travel, and settlement/service preparation. All three origins can claim and equip a real starter field tool through semantic actions.

## PX-3 — First regional loop

**Implemented and audited.** Marshal Varric Stone and a Prospector Pick lead into Redstone Reach, timed copper gathering, return to Brasshaven, forge selection, copper-ingot processing, persistent work mastery, and a larger crafting horizon.

## PX-4 — Several fictional days of continuity

**Implemented and audited.** `Copper for the Ring` is canonical commitment state. Provenance-qualified delivery changes Varric's relationship, pays once, survives account save/load, and creates later-day follow-up.

## PX-5 — Multi-region campaign readability

**Implemented and audited.** Known opportunities are grouped by region/readiness without exposing hidden topology. Knowing why a distant region matters is distinct from knowing every route/resource site there.

## PX-6 — Danger, combat, and recovery

**Implemented and audited.** Redstone livelihood and danger compete in ordinary play. Combat rewards progression/currency once, physical creature material remains a separate recovery opportunity, and recovery/defeat consume canonical fictional time before the same campaign resumes.

## Player-language hygiene

**Implemented and audited.** Journal cards use character-facing motivation/blockers/actions; details are collapsible; completed entries recede; Day Review reads as memory rather than telemetry; ordinary player surfaces avoid implementation jargon.

## PX-7 — Second community breadth

**Implemented and audited.** Reader Soli Venn / `Marrowleaf for the Ward` proves Mistmere/Starfen several-day continuity while ordinary reed livelihood and Rootling danger remain independent choices.

## PX-8 — Third-origin continuity

**Implemented and audited.** Sera Talwin / `Sweetroot for Southgate` proves Thornwall/Elderwood several-day continuity while Amber Resin livelihood and Brush Hare danger remain independent choices.

## PX-9 — Cross-community rotation / `0.7.100`

**Implemented and audited.** `transportServiceBoardEngine` derives actual scheduled destinations, fares, cadence, next boardable departure, journey duration, and blockers from the existing route/service catalog and character state. The UI dispatches direct `transport.start`; transport authority still owns payment, cargo, fictional time, departure/arrival, and party movement.

The proving rotation is:

```text
Thornwall Rivergate
  -> Crown-Forge Caravan
  -> Brasshaven Iron Quay
  -> Forge-Mere Caravan
  -> Mistmere Reedport
  -> save/load and reorient
  -> return through the same service graph
```

`0.7.100` closes at Product `0.7.100.1`, with 485/485 tests plus Benchmark 1 at runtime checkpoint `d15bd9517803faf6bceae5fb3376193648cca09d`.

# `0.7.200` — Settlement service and economy depth

**Goal:** make returning to a settlement create useful repeated decisions rather than only ending a field task.

**Status: implemented, audited, and closed.**

## Settlement-service browser contract

`settlementServiceBoardEngine` is a derived projection over existing locality, POI/workstation, production, inventory, wallet, shop, work-proficiency, activity, and recovery state. It stores no settlement-economy registry.

The Craft browser surface is now **Work, Trade & Recover**. In a safe settlement the player can see and act on real choices:

- which authored workshop is needed;
- which processes are possible somewhere in the locality;
- actual carried inputs and produced outputs;
- current work duration and mastery;
- blockers such as missing material/workstation context;
- conservative material/output shop-value comparison;
- real local merchants and current stock;
- affordability before purchase;
- actual sellable carried goods and current quote;
- safe recovery and its fictional-time cost.

Ordinary actions are semantic: workshop selection, `production.start`, activity completion, pending-output claim, merchant selection, `shop.buy`, `shop.sell`, and `recovery.start`. Commands are no longer required for this settlement loop.

## Proving return-to-town loop

```text
Brasshaven
  -> South Redstone Reach
  -> gather 2 Redstone Copper Ore
  -> return to Brasshaven Market Ring
  -> visit Selka Aurum's workshop
  -> compare raw sale value with processing
  -> smelt Redstone Copper Ingot
  -> gain persistent metalworking mastery
  -> sell the ingot to Mae Oris
  -> buy preparation stock with the proceeds
  -> choose whether to spend one fictional hour recovering
  -> save/load and continue
```

The proof exposes an actual tradeoff rather than a fake economy. Two raw ore carry a typical shop value of 10 gil; the finished ingot carries 14 gil. The first smelt takes 300 fictional seconds and grants +2 metalworking; the same projected work then takes 295 seconds. The initial 0-gil character cannot buy an 8-gil Flask of Water; after selling the ingot for 14 gil, that preparation purchase becomes available and leaves 6 gil. Selling the already-sold ingot cannot pay again.

Production output retains process/input provenance. Save/load preserves world time, wallet, purchased item, and metalworking mastery.

## Breadth check

The same derived board is tested against existing authored facilities in all three origin settlements:

- Thornwall — tannery work;
- Brasshaven — forge work;
- Mistmere — kitchen work.

It also derives each community's existing local merchant providers. No origin-specific economy branch or mass-authored inventory was added.

Safe settlement recovery remains a one-hour fictional-time choice with no fabricated fee. A paid/service-quality recovery economy should only be added after real authored service authority exists.

## `0.7.200` closure

Product advances to **`0.7.200.1`** / Package **`0.7.200`**, codename **Settlement Economy Depth**. Account Save remains 4, Game State 5, Data 30, Benchmark 1.

Authoritative promoted runtime checkpoint:

```text
61c8c6c602bc71a4e7325d04b3e7698f669843c4
487/487 tests
Benchmark 1 success
```

Benchmark 1 at that checkpoint:

```text
1,000 player combat profiles     413.227ms  0.413227ms/op
1,000 enemy combat profiles      102.942ms  0.102942ms/op
1,000 basic attacks              513.096ms  0.513096ms/op
10,000 ticks / 5 subscribers      44.538ms  0.004454ms/op
10,000 direct route lookups     7769.865ms  0.776987ms/op
```

# Next Phase 0.7 bounded track — `0.7.300` semantic information access and locality usability

The next track should remove remaining ordinary-player dependence on command-backed information surfaces and improve safe-locality interaction hierarchy without a full UI rewrite.

First audit:

1. Character/Inventory/Equipment information and actions.
2. Spellbook/technique/skill presentation.
3. Codex/World known-information presentation.
4. Locality point/service lists and safe-settlement density.
5. Search-or-act routing and which known semantic actions can replace command text.

The first concrete proof should let a normal player inspect preparation, learned capabilities/knowledge, and relevant local options through the browser UI without knowing command vocabulary. Any search layer must respect acquired knowledge and may not become an omniscient world index.

Do not begin by rewriting the entire UI, adding general natural-language control, or reintroducing wilderness map/D-pad controls in safe settlements.

## Player-facing acceptance checks

For remaining Phase 0.7 work, evaluate from a fresh save:

- Is one useful next action obvious without command expertise?
- Are several competing ambitions understandable?
- Does each activity expose persistent character/world consequences?
- Does acquired knowledge remain distinct from hidden authored topology?
- Can save/load resume without duplicated rewards, fares, trades, or progress?
- Do prior days and relationships alter later opportunities?
- Does combat/recovery return to the same campaign?
- Can the player move among relevant communities through semantic browser actions?
- On return to settlement, are trade, production, recovery, preparation, and social choices useful enough to support another outing?
- Can core information needed for a decision be inspected without command vocabulary?

## Architecture rule

Player-experience guidance and service boards are projections over canonical state, not second simulation authorities. Commitments, relationships, battle consequences, recovery tasks, transport journeys, inventory, production, shops, resource opportunities, fictional time, and wallet ownership remain in their domain systems; UI projections may summarize and expose semantic actions but may not secretly own those states.
