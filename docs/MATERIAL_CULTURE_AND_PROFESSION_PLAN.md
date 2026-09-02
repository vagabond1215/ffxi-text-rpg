# Material Culture & Profession Economy Plan

Status: **Data 50 material foundation complete; 0.9.400 A0-A4 conversion proofs complete through the established bronze starter set; A5 Basic Leather Garment Conversion is the next candidate / not started.**

## Purpose

Hearth & Horizon should treat ordinary material culture as part of the simulated economy. Portable, replaceable, tradeable, repairable, or cross-profession components should normally be canonical items with explicit sources, transformations, and sinks rather than implied scenery.

The canonical dependency shape is:

```text
ecological/mineral source
  -> raw material
  -> standardized stock
  -> reusable component
  -> profession-specific tool / implement / fixture
  -> repair, trade, construction, service, or further production
```

Large permanent structures remain projects/workstations; replaceable parts such as hinges, millstones, cogs, blocks, sheaves, hoops, handles, blades, ropes, and fittings may remain ordinary items.

## Granularity rule

A component deserves its own canonical item when it is independently traded, repaired, replaced, stocked, or reused across multiple recipes.

Prefer:
- nail sets rather than individual nails;
- buckle/ring sets rather than each tiny fitting;
- wheel-spoke sets rather than each spoke;
- net webbing rather than every knot;
- rope or hawser coils rather than length-by-length inventory micromanagement.

## Data 50 foundation

Data 50 establishes:

### Metals and industrial minerals
- tin;
- lead;
- silver;
- gold;
- calamine/zinc-bearing ore;
- bronze;
- brass;
- pewter;
- soft solder;
- steel;
- copper and silver wire;
- bronze and brass sheet;
- iron nails, hinges, buckle/ring sets, ferrules/sockets, chain, hoops, tool-head blanks;
- steel blade blanks;
- silver setting kits;
- Cloudsilver Spellwire as a cross-regional magical conductor;
- limestone/quicklime;
- whetstone stone and dressed whetstones;
- alum shale/mordant;
- glass sand, potash, and clear glass batch.

### Working woods
- ash: resilient handle and shaft stock;
- Crown Oak: broad structural hardwood;
- Silvermaple: pale fine-grained decorative stock;
- Silvermaple sap: syrup/binder economy;
- yew: elastic bow/stave stock;
- hazel coppice rods: hoops, wicker, wattle;
- Slatewater spruce: tall straight spar/mast stock;
- fragrant cedar: rot-resistant fine/boat/storage stock;
- Crownfields applewood: dense fruitwood carving stock;
- Starfen Giant Cane: hollow lightweight bamboo analogue.

Reusable wood components now include handles, planks, beams, boards, bow staves, hoops, spars, cane poles, dowels/pegs, wheel-spoke sets, and cooper staves.

### Plant fibers and cordage
- existing flax;
- new hemp;
- Starfen nettle bast;
- existing reed/rush fibers.

Hemp now has an explicit hierarchy:

```text
hemp stalk
  -> dressed hemp fiber
  -> yarn
  -> twine
  -> cord
  -> rope
  -> heavy hawser
```

Parallel outputs:
- hemp canvas;
- hemp net webbing;
- flax lamp wick;
- nettle thread.

### Industrial consumables
- hardwood charcoal;
- pine tar;
- hide glue;
- quicklime;
- alum mordant;
- wood-ash potash;
- glass batch;
- whetstones.

## Husbandry boundary

Wool is intentionally **not** represented as a flora gathering source.

Crownfields already has sheep ecology, but fleece, milk, eggs, honey, manure, domestic meat, and similar managed-animal products require an explicit husbandry/managed-animal source model. Until that authority exists, animal products must continue to come from legitimate body recovery or remain deferred.

A future husbandry packet should add:
- shearing/fleece recovery;
- washing/scouring;
- carding/combing;
- wool yarn;
- wool cloth;
- felt;
- padding;
- blankets;
- selected dairy/egg/honey loops where separately justified.

## Profession POV inventory targets

### Scribes, clerks, mapmakers, bookbinders
Quills/reed pens, charcoal/chalk, ink, inkwells, parchment/paper, wax tablets, styluses, straightedges, dividers, seals, sealing wax, book boards, binding thread/cord, leather covers, clasps, ledgers.

### Farmers, orchardists, gardeners
Hoes, spades, rakes, sickles, scythes, flails, pitchforks, pruning knives, grafting knives, baskets, sacks, ladders, stakes, cord, plow beams, plowshares, coulters, yokes.

### Foresters, loggers, charcoal burners
Felling axes, hatchets, saws, wedges, mauls, billhooks, drawknives, ropes, log hooks, shovels, rakes, charcoal baskets.

### Miners, quarry workers, masons
Picks, sledges, hammers, chisels, wedges, shovels, baskets, lamps, rope, windlass parts, timber props, trowels, plumb bobs, measuring lines, mortar, dressed stone, bricks/tiles.

### Millers
Millstones, spindles, axles, gearwheels, replaceable cogs/teeth, hopper parts, sieves, sacks, scoops.

### Brewers, vintners, bakers, cooks
Kettles, mash paddles, tubs, strainers, buckets, funnels, casks, staves, hoops, bungs, taps, jugs/bottles, flour sieves, troughs, oven peels, cauldrons, pots, skillets, ladles, spits, skewers.

### Butchers and game processors
Skinning/slaughter knives, cleavers, bone saws, hooks, hanging bars, tubs, salt vessels, whetstones.

### Blacksmiths, farriers, armorers, weaponsmiths
Hammers, sledges, tongs, chisels, punches, drifts, files, rasps, hardy/swage tools, anvils, bellows, crucibles, molds, quench vessels, shoe nails, horseshoes, mail wire/rings, rivets, blade blanks, guards, pommels, ferrules, arrowheads.

### Coppersmiths, founders, locksmiths, hardware smiths
Sheet, wire, rod, solder, crucibles, molds, hinges, hasps, staples, hooks, chain, locks, keys, door rings, vessel fittings.

### Jewelers and lapidaries
Precious metal sheet/wire, bezels/settings, prongs, clasps, chains, solder, gravers, files, punches, polishing media.

### Carpenters, joiners, wheelwrights, cartwrights, coopers
Saws, axes, adzes, planes, chisels, gouges, augers, mallets, squares, clamps, pegs/dowels, glue, nails, hubs, spokes, rim sections, axles, linchpins, tires, staves, hoops, bungs, spigots.

### Spinners, weavers, dyers, tailors
Spindles, distaffs, bobbins, carders/combs, loom shuttles, heddles, reeds/beaters, warp weights/beams, yarn, cloth, vats, paddles, mordants, shears, needles, pins, thimbles, awls, waxed thread, buttons/toggles/hooks/eyelets.

### Ropemakers, netmakers, sailmakers
Ropewalk hooks/spindles, yarn, twine, cord, rope, hawser, net needles/gauges, floats, sinkers, net webbing, canvas/sailcloth, heavy needles, reinforcement leather, grommets/eyelets.

### Fishers, boatbuilders, shipwrights, riggers, chandlers
Rods/poles, line, hooks, sinkers, floats, nets, traps, creels, gaffs, spars, planks, ribs, keel stock, caulking tow, pitch/tar, blocks, sheaves, cleats, rings, shackles, anchors, sails, rope, lamps, candles, wicks.

### Tanners, cobblers, saddlers, harness makers
Lime, bark/tannin, fleshing knives, scrapers, hides, leather, rawhide, thongs, lasts, awls, waxed thread, pegs, shoe nails, straps, buckles, rings, reins, bridles, bits, stirrups, saddle trees, padding.

### Apothecaries, healers, chandlers, soapmakers
Mortars/pestles, balances/weights, sieves, jars/bottles, stoppers, bandages, splints, retorts/alembics where appropriate, tallow/oils, beeswax, wicks, molds, wood ash/lye, soap stock.

## 0.9.400 selection status

Packet A — Occupational Tool Conversion is **ACTIVE** for `0.9.400 Economy / Production Depth`.

A0 — Production & Item Authority Hardening is complete at Product 0.9.400.1 / Package 0.9.400 / Data 75 / Game State 21. Permanent authority: `docs/ECONOMY_0_9_400_A0_PRODUCTION_ITEM_AUTHORITY.md`.

A1 — Existing Field-Tool Conversion Proof is **COMPLETE** at Product 0.9.400.2 / Data 76 / Game State 21. Permanent record: `docs/ECONOMY_0_9_400_A1_FIELD_TOOL_CONVERSION.md`. It converts the six existing field tools through canonical production and proves crafted-tool use/persistence.

A2 — Bronze Martial Conversion Proof is **COMPLETE** at Product 0.9.400.3 / Data 77 / Game State 21. Permanent record: `docs/ECONOMY_0_9_400_A2_BRONZE_MARTIAL_CONVERSION.md`. It converts Bronze Sword, Bronze Cap, and Bronze Harness using existing material-foundation stocks and proves A1 cutting-tool integration plus combat-profile/cadence/save-load use.

A3 — Caster / Offhand Starter Conversion Proof is **COMPLETE** at Product 0.9.400.4 / Data 78 / Game State 21. Permanent record: `docs/ECONOMY_0_9_400_A3_CASTER_OFFHAND_CONVERSION.md`. It converts Ash Staff, Maple Wand, Iron Buckler, and Brass Ring using existing wood/common-component/brass/Redstone supply chains and proves real loadout/cadence/stat/persistence behavior.

A4 — Remaining Bronze Starter Set Conversion Proof is **COMPLETE** at Product 0.9.400.5 / Data 79 / Game State 21. Permanent record: `docs/ECONOMY_0_9_400_A4_REMAINING_BRONZE_CONVERSION.md`. It converts Bronze Axe, Bronze Dagger, Bronze Pick, Bronze Subligar, and Bronze Mittens, extends the existing bronze ownership pack, preserves Bronze Pick as combat-only, and proves cadence/stat/persistence behavior.

A5 — Basic Leather Garment Conversion is the **NEXT CANDIDATE / NOT STARTED**. Begin with existing Leather Vest and Leather Trousers only. Selection does not authorize Traveler Gloves/Boots, broad profession tools, or Packets B-F.

## Future bounded packets

### Packet A — Occupational tool conversion

#### A0 — Production & Item Authority Hardening — COMPLETE

A0 established:
- one canonical item resolver across resource, production, and equipment authorities;
- production output resolution to existing equipment IDs;
- canonical shop purchase materialization with commerce provenance;
- portable/equipped/contextual production tool bindings;
- active-work locking for physical bound tools.

#### A1 — Existing field-tool conversion proof — COMPLETE

Converted through real production using existing material-foundation stocks/components:
- Field Knife;
- Prospector Pick;
- Woodsman Hatchet;
- Digging Spade;
- Reed Sickle;
- Marsh Fishing Rod.

The crafted Field Knife is proven through real cutting-gated downstream work and Marsh Fishing Rod assembly, with crafted identities/provenance surviving current-schema save/load.

#### A2 — Bronze martial conversion proof — COMPLETE

Converted:
- Bronze Sword;
- Bronze Cap;
- Bronze Harness.

A2 uses Bronze Ingot, Bronze Sheet, Ash Handle Blank, Hemp Twine/Canvas, and Iron Buckle and Ring Set from the established material foundation. Bronze Harness assembly requires `cutting`, proving the A1 Field Knife binding outside the field-tool cluster. Crafted gear drives real combat profile and weapon cadence and survives current-schema save/load.

#### A3 — Caster / offhand starter conversion proof — COMPLETE

Converted:
- Ash Staff;
- Maple Wand;
- Iron Buckler;
- Brass Ring.

A3 uses Elderwood Ash Timber, Silvermaple Fine Board, Hemp Twine/Cord, Hide Glue, Brass Sheet/Ingot, Tempered Redstone Iron Bar, and Redstone Rivet Set. Ash Staff and Maple Wand require `cutting`, proving the A1 Field Knife binding in another production family. Crafted staff/wand/buckler/ring exercise real two-handed/offhand, cadence, stat, and save/load behavior.

#### A4 — Remaining bronze starter set conversion proof — COMPLETE

Converted:
- Bronze Axe;
- Bronze Dagger;
- Bronze Pick;
- Bronze Subligar;
- Bronze Mittens.

A4 reuses the A2 bronze ingot/sheet, Ash Handle Blank, Hemp Twine/Canvas, and shared hardware graph. The existing `pack-starter-bronze-martial-equipment` is extended rather than duplicating bronze ownership. Bronze Pick remains a combat weapon identity; field mining remains owned by Prospector Pick.

#### A5 — Basic leather garment conversion — NEXT CANDIDATE / NOT STARTED

Initial existing IDs:
- Leather Vest;
- Leather Trousers.

Audit established tanned-hide, binding, thread/cord, and cutting/stitching capability before authoring. Do not automatically include Traveler Gloves or Traveler Boots.

#### Remaining Packet-A conversion backlog — DEFERRED AFTER A5 SELECTION

- shared smithing, woodworking, masonry, textile, leatherworking, cooking, and measurement tools.

Existing `requiredToolTags` are mechanically enforced and A1 proves them with crafted equipment. Durable physical tools are bound requirements, not consumed recipe inputs. Field operations may continue to require equipped tools; production may use portable equipment tools from Inventory or explicit contextual capability according to the A0 contract.

### Packet B — Cordage, fishing, rigging, and sailmaking
Build:
- fishhooks;
- lead sinkers;
- floats;
- hand/cast/seine/cargo nets;
- finished fishing rods and lines;
- blocks and sheaves;
- cleats;
- tarred rigging;
- sails/sailcloth;
- caulking tow;
- anchors/grapnels.

### Packet C — Containers, milling, brewing, and food-industry equipment
Build:
- sacks/baskets/crates;
- buckets/tubs;
- barrels/casks;
- bungs/spigots;
- millstone and mill gear parts;
- sieves;
- presses;
- cookpots, cauldrons, pans, ladles, oven peels;
- brewing/vintning vessels.

### Packet D — Construction, hardware, carts, and harness
Build:
- doors, hinges, hasps, locks/keys;
- roofing tiles/slates;
- brackets/chains/pulley assemblies;
- ladders/scaffolding;
- wheel hubs/rims/tires;
- axles/linchpins;
- cart/wagon component sets;
- reins, bridles, bits, stirrups, saddle trees, yokes, collars.

### Packet E — Scholarly, precision, luxury, and magical craft
Build:
- quills, ink, inkwells, parchment/paper;
- wax tablets, seals, ledgers/books;
- balances and standard weights;
- precision settings/chains;
- glass vessels/lenses;
- survey instruments;
- magical instruments/components using Cloudsilver Spellwire and other ordinary craft stocks.

### Packet F — Managed husbandry products
Only after husbandry source authority is explicit:
- wool/fleece;
- hair fibers;
- milk/dairy;
- eggs;
- honey/beeswax if apiary management is modeled;
- manure/fertilizer;
- domestic hides/meat where relevant.

## Design constraints

- No duplicate crafting, inventory, ecology, or persistence authority.
- No fake animal products from flora nodes.
- No one-off material whose only purpose is one recipe unless the fiction truly demands it.
- Prefer cross-profession dependencies: smiths need woodworker handles; carpenters need smith-made edges/fasteners; riggers need rope; wagons need wheelwright + smith + leatherworker output.
- Use late-medieval/fantasy practical language in world-facing descriptions.
- Magical industry should extend ordinary material culture rather than bypass it.
- Current Game State is 21. It advances only if a future packet adds a genuinely new required durable fact that cannot live in an existing authority/state envelope.
