import { getCapability } from './capabilities.js';
import { getCanonicalGatheringSource } from './ecologyRegistry.js';
import { getPointOfInterest } from './pointsOfInterest.js';
import { getPlace } from './places.js';
import { getProductionItem } from './productionItems.js';
import { getCanonicalResourceItem } from './resourceItemRegistry.js';
import { STARFEN_MARSHCRAFT_COMMITMENT_DATA } from './starfenMarshcraftCommitments.js';
import { normalizeRelationshipRequirements, validateRelationshipRequirements } from './socialRequirements.js';

export const COMMITMENT_CATALOG_VERSION = 8;

const DYNAMIC_PROVENANCE_SOURCES = Object.freeze({
    'plot-home-sweetroot-bed': Object.freeze({ itemId: 'item-elderwood-sweetroot', domain: 'cultivation' }),
});

const COMMITMENT_DEFINITIONS = Object.freeze({
    'commitment-thornwall-sweetroot-return': commitment({
        id: 'commitment-thornwall-sweetroot-return', name: 'Sweetroot for Southgate', giverNpcId: 'npc-thornwall-sera-talwin', offerPoiId: 'poi-sandoria-s-alaune', offerPlaceId: 'thornwall-southgate',
        description: 'Sera Talwin needs two fresh Elderwood Sweetroots for the Southgate road pantry, where wardens and travelers keep simple food and field remedies close at hand.', objective: 'Forage two Elderwood Sweetroots in West Elderwood and bring them back to Sera Talwin at Southgate.',
        requiredItems: [{ itemId: 'item-elderwood-sweetroot', quantity: 2, provenanceSourceId: 'source-west-elderwood-sweetroot-patch' }], fieldSourceId: 'source-west-elderwood-sweetroot-patch', reward: { gil: 20, relationship: { familiarity: 1, respect: 1 } }, followUpDelayDays: 1,
        offerText: 'Sera asks for two fresh Sweetroots from West Elderwood. Southgate keeps them for plain road food and simple field remedies, and she would rather know who actually gathered this batch than buy an anonymous bundle from a stall.', resolvedText: 'Sera checks the roots, trims away the bruised ends, and puts your name beside the delivery in the gate pantry book. The work is small, but Southgate now has a reason to remember you as someone who went out and came back useful.', followUpText: 'On a later day, Sera remembers the Sweetroot before you mention it. She notes that the west road still offers several kinds of work: resin cutters are making their rounds, Brush Hares are thick along the safer trails, and the deeper woods reward people who choose their preparation instead of following one chore after another.',
    }),
    'commitment-brasshaven-copper-return': commitment({
        id: 'commitment-brasshaven-copper-return', name: 'Copper for the Ring', giverNpcId: 'npc-brasshaven-marshal-varric-stone', offerPoiId: 'poi-bastok-markets-rabid-wolf', offerPlaceId: 'brasshaven-market-ring',
        description: 'Marshal Varric Stone needs a clean Redstone copper ingot returned to the Market Ring so local crews can compare field supply against workshop demand.', objective: 'Bring Marshal Varric Stone one Redstone Copper Ingot smelted through the Redstone copper process.',
        requiredItems: [{ itemId: 'item-redstone-copper-ingot', quantity: 1, provenanceSourceId: 'process-redstone-copper-ingot' }], reward: { gil: 36, relationship: { familiarity: 1, respect: 2 } }, followUpDelayDays: 1,
        offerText: 'Varric has a small practical request: bring one properly smelted Redstone copper ingot back to the Market Ring. He is interested in whether you can complete the whole route, not merely buy a piece of metal.', resolvedText: 'Varric checks the ingot, compares its working marks against the Ring ledger, and credits the delivery. The payment is modest; the useful part is that your name is now attached to completed work.', followUpText: 'When you return the next day, Varric remembers the copper without consulting the newcomer roll. He points out that a Copper Trail Clasp needs Starfen reed fiber as well as metalwork: one reliable route has become a reason to learn another.',
    }),
    'commitment-mistmere-marrowleaf-return': commitment({
        id: 'commitment-mistmere-marrowleaf-return', name: 'Marrowleaf for the Ward', giverNpcId: 'npc-mistmere-reader-soli-venn', offerPoiId: 'poi-waters-dagoza-beruza', offerPlaceId: 'mistmere-canal-ward',
        description: 'Reader Soli Venn wants two fresh Marrowleaf samples gathered in West Starfen so the Canal Ward can compare this season’s growth with the civic readers’ older field notes.', objective: 'Gather two Marrowleaf in West Starfen and bring them back to Reader Soli Venn in the Canal Ward.',
        requiredItems: [{ itemId: 'item-starfen-marrowleaf', quantity: 2, provenanceSourceId: 'source-west-starfen-marrowleaf-bed' }], fieldSourceId: 'source-west-starfen-marrowleaf-bed', returnViaPlaceId: 'mistmere-reedport', reward: { gil: 24, relationship: { familiarity: 1, respect: 1 } }, followUpDelayDays: 1,
        offerText: 'Soli asks for two fresh Marrowleaf samples from West Starfen. The Ward has old notes and dried specimens, but current growth tells them more about the marsh than a copied ledger does.', resolvedText: 'Soli compares the leaves against the Ward notes, marks where you gathered them, and credits the work. Your name is written beside a useful observation rather than beside another newcomer instruction.', followUpText: 'When you return on a later day, Soli remembers the Marrowleaf without reopening the old notes. They point out that the same reed country supports useful gathering and troublesome rootlings: knowing Starfen means learning when to work the marsh and when to make the ground safer first.',
    }),
    'commitment-slatewater-resin-waymarks': commitment({
        id: 'commitment-slatewater-resin-waymarks',
        name: 'Resin for the Mile Posts',
        giverNpcId: 'npc-slatewater-sable-renn',
        offerPoiId: 'poi-slatewater-road-scout',
        offerPlaceId: 'slatewater-waylodge',
        description: 'Slatewater road scout Sable Renn needs fresh Pitch Pine Resin from the foothills to reseal exposed mile-post caps before the next wet spell.',
        objective: 'Forage two Pitch Pine Resin bundles in Slatewater Foothills and bring them back to Sable Renn at the Waylodge.',
        requiredItems: [{ itemId: 'item-slatewater-pitch-pine-resin', quantity: 2, provenanceSourceId: 'source-slatewater-pitch-pine-stand' }],
        fieldSourceId: 'source-slatewater-pitch-pine-stand',
        reward: { gil: 30, relationship: { familiarity: 1, trust: 1 } },
        followUpDelayDays: 1,
        offerText: 'Sable taps two weather-split mile-post caps beside the lodge wall. “Bring me resin you took from the foothill pines yourself. I want to know whether you can leave this road, find what the road actually needs, and come back without turning a supply problem into somebody else’s rescue.”',
        resolvedText: 'Sable smells the resin, checks the fresh scoring where it was cut, and seals one cracked cap while you stand there. “Good. You brought the right thing from the right ground.” The work is ordinary, but Sable has started judging you as a field partner rather than another traveler.',
        followUpText: 'On a later day Sable points toward the mist-facing ravines. “Resin keeps rain out. It does not help when fog erases the next marker. There is another job if you still want to learn how this road stays readable.”',
    }),
    'commitment-slatewater-lichen-fogmarks': commitment({
        id: 'commitment-slatewater-lichen-fogmarks',
        name: 'Silver for the Fog Marks',
        giverNpcId: 'npc-slatewater-sable-renn',
        offerPoiId: 'poi-slatewater-road-scout',
        offerPlaceId: 'slatewater-waylodge',
        description: 'After the mile-post repair, Sable needs Silver Lichen gathered from Slatewater’s shaded cliff faces for reflective trail-marking pigment used on fog-side route stones.',
        objective: 'Forage one Silver Lichen sample from a Slatewater cliff face and return it to Sable Renn.',
        requiredItems: [{ itemId: 'item-slatewater-silver-lichen', quantity: 1, provenanceSourceId: 'source-slatewater-silver-lichen-face' }],
        fieldSourceId: 'source-slatewater-silver-lichen-face',
        prerequisiteCommitmentIds: ['commitment-slatewater-resin-waymarks'],
        relationshipRequirements: [{ npcId: 'npc-slatewater-sable-renn', minimums: { trust: 1 } }],
        reward: { gil: 46, relationship: { respect: 1, trust: 2 } },
        followUpDelayDays: 1,
        offerText: 'Sable only offers the second job after the resin work is credited. “The fog side is less forgiving. Silver lichen grows where the stone stays damp and footing turns mean. Bring one clean sample from the face itself. If you know when to stop reaching and start finding another line, I can use you on the road.”',
        resolvedText: 'Sable turns the pale lichen toward the hearthlight and checks the stone dust caught at its base. “That came off the face, not an exchange shelf.” A small smile follows. “You have done enough proving. If you want another pair of eyes on the road, ask me.”',
        followUpText: 'When you speak again, Sable no longer frames the foothills as a test. The conversation shifts to shared routes, field approaches, and which risks are worth taking when two travelers have to come home together.',
    }),
    'commitment-thornwall-hearth-sweetroot-share': commitment({
        id: 'commitment-thornwall-hearth-sweetroot-share', name: 'A Root for the Morning Pot', giverNpcId: 'npc-thornwall-mira-fen', offerPoiId: 'poi-sandoria-s-aveline', offerPlaceId: 'thornwall-southgate', description: 'Mira Fen wants one Sweetroot grown at a Southgate lodging for the neighborhood breakfast pot, where a home-grown root means more than another anonymous bundle from the road.', objective: 'Bring Mira Fen one Elderwood Sweetroot harvested from your own home cultivation bed.', requiredItems: [{ itemId: 'item-elderwood-sweetroot', quantity: 1, provenanceSourceId: 'plot-home-sweetroot-bed' }], reward: { gil: 18, relationship: { familiarity: 1, obligation: 1 } }, followUpDelayDays: 2,
        offerText: 'Mira has seen plenty of forest Sweetroot come through Southgate. She asks for something different: one root you kept alive and brought to harvest at your own lodging, for the shared morning pot used by neighbors and road hands.', resolvedText: 'Mira turns the cultivated root over in her hand, recognizes the care marks from a tended bed, and slices it into the morning pot. Your lodging is no longer only somewhere you sleep; it has supplied a meal other people will remember.', followUpText: 'Two mornings later, Mira points out the empty place in the pot where your root went first. A pair of regulars now ask whether the lodging garden is still producing, and she treats your next visit like a neighbor returning rather than a customer passing through.',
    }),
    'commitment-brasshaven-courtyard-sweetroot-share': commitment({
        id: 'commitment-brasshaven-courtyard-sweetroot-share', name: 'Courtyard-Grown Sweetroot', giverNpcId: 'npc-brasshaven-mae-oris', offerPoiId: 'poi-bastok-markets-carmelide', offerPlaceId: 'brasshaven-market-ring', description: 'Mae Oris wants one Sweetroot grown at a Market Ring lodging to prove the crowded courtyards can contribute something useful instead of importing every fresh root through the gates.', objective: 'Bring Mae Oris one Elderwood Sweetroot harvested from your own home cultivation bed.', requiredItems: [{ itemId: 'item-elderwood-sweetroot', quantity: 1, provenanceSourceId: 'plot-home-sweetroot-bed' }], reward: { gil: 24, relationship: { respect: 1, trust: 1 } }, followUpDelayDays: 1,
        offerText: 'Mae has a practical wager with two courtyard cooks: if a traveler can keep a Sweetroot bed producing in the Ring, the block can stop treating every patch of soil as wasted space. She wants one root from your own bed, not one bought back from a stall.', resolvedText: 'Mae checks the root against the little cultivation notes she has been keeping and wins her wager without ceremony. By evening, your lodging is being cited as evidence that the Ring can grow a little of what it consumes.', followUpText: 'The next day Mae has already lent her notes to another courtyard. She trusts your account of the bed enough to stop asking for proof and starts asking what you learned about keeping routine work from swallowing the rest of your day.',
    }),
    'commitment-mistmere-canalside-sweetroot-share': commitment({
        id: 'commitment-mistmere-canalside-sweetroot-share', name: 'Sweetroot for the Remedy Shelf', giverNpcId: 'npc-mistmere-kiri-fen', offerPoiId: 'poi-waters-hilkomu-makimu', offerPlaceId: 'mistmere-canal-ward', description: 'Kiri Fen wants one Sweetroot raised at a Canal Ward lodging for the neighborhood remedy shelf, where its known home history matters as much as the root itself.', objective: 'Bring Kiri Fen one Elderwood Sweetroot harvested from your own home cultivation bed.', requiredItems: [{ itemId: 'item-elderwood-sweetroot', quantity: 1, provenanceSourceId: 'plot-home-sweetroot-bed' }], reward: { gil: 20, relationship: { familiarity: 1, trust: 1 } }, followUpDelayDays: 2,
        offerText: 'Kiri is comparing roots whose history she actually knows. She asks for one Sweetroot grown at your own Canal Ward lodging so the shared remedy shelf has a batch tied to a person, a place, and days of care rather than a market label.', resolvedText: 'Kiri records the root beside your name and sets it among the practical remedies kept for the nearest households. The small bed at your lodging has become part of how the ward looks after people who live there.', followUpText: 'When you return two days later, Kiri has already used part of the root in a simple broth for a feverish neighbor. She remembers exactly where it came from and asks after the bed before asking whether you need to buy anything.',
    }),
    'commitment-brasshaven-iron-bloom-return': commitment({
        id: 'commitment-brasshaven-iron-bloom-return', name: 'Iron for Foundry Hall', giverNpcId: 'npc-brasshaven-mae-oris', offerPoiId: 'poi-bastok-markets-carmelide', offerPlaceId: 'brasshaven-market-ring',
        description: 'Foundry crews want one bloom that can be traced from Redstone ore through a real forge rather than a market purchase.', objective: 'Bring Mae one Redstone Iron Bloom smelted from South Redstone ore.',
        requiredItems: [{ itemId: 'item-redstone-iron-bloom', quantity: 1, provenanceSourceId: 'process-redstone-iron-bloom' }], reward: { gil: 48, relationship: { respect: 2, trust: 1 } }, followUpDelayDays: 1,
        offerText: 'Mae asks for a single iron bloom whose work marks still tell the whole story: ore from the Reach, a forge, and your own metalworking.', resolvedText: 'Mae weighs the bloom, checks the slag line, and sends it onward to Foundry Hall with your name attached to the batch.', followUpText: 'The next day Mae notes that the bloom was sound but ordinary. Foundry Hall is paying more attention to people who can refine flux and temper iron without wasting either material.',
    }),
    'commitment-brasshaven-rivet-run': commitment({
        id: 'commitment-brasshaven-rivet-run', name: 'Rivets for the Market Repairs', giverNpcId: 'npc-brasshaven-mae-oris', offerPoiId: 'poi-bastok-markets-carmelide', offerPlaceId: 'brasshaven-market-ring',
        description: 'Mae needs a matched set of locally forged rivets for awning braces and cart fittings around the Market Ring.', objective: 'Bring Mae two Redstone Rivet Sets forged from tempered Redstone iron.',
        requiredItems: [{ itemId: 'item-redstone-rivet-set', quantity: 2, provenanceSourceId: 'craft-redstone-rivet-set' }], reward: { gil: 58, relationship: { familiarity: 1, trust: 2 } }, followUpDelayDays: 2,
        offerText: 'Mae has stopped treating metalwork as something that happens somewhere else. She wants two matched rivet sets for repairs the courtyard crews can finish themselves.', resolvedText: 'Mae separates the rivets by size, hands one bundle to an awning crew, and sets the other aside for cart fittings. The Ring has a visible use for what you forged.', followUpText: 'Two days later, Mae points out three repairs using your rivets. She is less interested in another identical batch than in whether the same tempered iron can solve a harder caravan problem.',
    }),
    'commitment-brasshaven-caravan-shoes': commitment({
        id: 'commitment-brasshaven-caravan-shoes', name: 'Shoes for the Forge Road', giverNpcId: 'npc-brasshaven-mae-oris', offerPoiId: 'poi-bastok-markets-carmelide', offerPlaceId: 'brasshaven-market-ring',
        description: 'The Forge Road caravan pool needs replacement iron shoes fabricated from the same tempered stock used for civic repairs.', objective: 'Bring Mae two Redstone Caravan Shoes forged from tempered Redstone iron and matching rivets.',
        requiredItems: [{ itemId: 'item-redstone-caravan-shoe', quantity: 2, provenanceSourceId: 'craft-redstone-caravan-shoe' }], reward: { gil: 76, relationship: { respect: 2, trust: 2 } }, followUpDelayDays: 2,
        offerText: 'Mae has a practical Forge Road order: two replacement shoes for caravan draft stock. The job only matters if the iron is good enough to leave Brasshaven and come back worn rather than broken.', resolvedText: 'Mae checks the bend and nail holes, then marks the pair for the next Forge Road rotation. Your metalwork is leaving the city as working infrastructure.', followUpText: 'When the caravan returns, Mae shows you the scuffed shoes rather than a ledger entry. They held. The next useful question is what else the road can carry, repair, or teach without turning every improvement into a new isolated system.',
    }),
    'commitment-thornwall-tanned-hide-order': commitment({
        id: 'commitment-thornwall-tanned-hide-order', name: 'A Hide Worth Stitching', giverNpcId: 'npc-thornwall-edrin-bale', offerPoiId: 'poi-sandoria-s-faulpie', offerPlaceId: 'thornwall-southgate',
        description: 'Edrin Bale wants a Barkboar hide that has been recovered in the Elderwood and properly worked with Duskcap at a tannery.', objective: 'Bring Edrin one Dusk-Tanned Barkboar Hide made from recovered Elderwood hide.',
        requiredItems: [{ itemId: 'item-elderwood-tanned-hide', quantity: 1, provenanceSourceId: 'process-elderwood-tanned-hide' }], reward: { gil: 52, relationship: { respect: 2, trust: 1 } }, followUpDelayDays: 1,
        offerText: 'Edrin has no shortage of rough hides. He asks for one you recovered, cleaned, and tanned well enough that the guild can judge the fieldwork and the bench work together.', resolvedText: 'Edrin bends the hide across both hands, checks the grain and cure, and marks the piece as usable stock rather than practice scrap. Your hunt has become material another craftsperson would trust.', followUpText: 'The next day Edrin has cut a narrow test strip from the hide. He points out that useful leather is only the middle of the chain: bindings and field gear matter when they solve the next problem instead of ending at the tannery door.',
    }),
    'commitment-thornwall-forester-gloves': commitment({
        id: 'commitment-thornwall-forester-gloves', name: 'Grip for the Resin Crews', giverNpcId: 'npc-thornwall-nessa-woodmere', offerPoiId: 'poi-sandoria-s-corua', offerPlaceId: 'thornwall-southgate',
        description: 'Nessa Woodmere needs a pair of locally made gloves suited to cutters working resinous Elderwood bark and rough timber.', objective: 'Bring Nessa one pair of Forester Grip Gloves stitched from Elderwood-tanned hide and cured binding.',
        requiredItems: [{ itemId: 'item-elderwood-forester-gloves', quantity: 1, provenanceSourceId: 'craft-elderwood-forester-gloves' }], reward: { gil: 68, relationship: { familiarity: 1, respect: 2 } }, followUpDelayDays: 2,
        offerText: 'Nessa wants a pair of gloves whose materials can be traced back through the woods. Resin crews need grip and protection, not another decorative market piece.', resolvedText: 'Nessa flexes the gloves, rubs the palms against a resin-marked billet, and sets them aside for the next cutter heading west. The value is visible because someone will use them where the materials came from.', followUpText: 'Two days later Nessa reports that the gloves came back stained but intact. She is already asking whether the same boards, bindings, and pitch can be packed into repair stock for crews farther down the road.',
    }),
    'commitment-thornwall-trail-repair-bundles': commitment({
        id: 'commitment-thornwall-trail-repair-bundles', name: 'Bundles for the West Road', giverNpcId: 'npc-thornwall-oren-vale', offerPoiId: 'poi-sandoria-s-ambrotien', offerPlaceId: 'thornwall-southgate',
        description: 'Oren Vale needs compact repair stock assembled from Elderwood boards, hide binding, and resin pitch for crews maintaining the west road.', objective: 'Bring Oren two Elderwood Trail Repair Bundles assembled through the woodshop chain.',
        requiredItems: [{ itemId: 'item-elderwood-trail-repair-bundle', quantity: 2, provenanceSourceId: 'craft-elderwood-trail-repair-bundle' }], reward: { gil: 84, relationship: { respect: 2, trust: 2 } }, followUpDelayDays: 2,
        offerText: 'Oren asks for two matched repair bundles. He wants the sort of stock a road crew can carry into the trees and use without hauling half a workshop behind them.', resolvedText: 'Oren checks the sealed boards, binding, and pitch, then assigns both bundles to west-road crews. What began as hunting and gathering has become infrastructure that will be used outside the gate.', followUpText: 'When Oren is back at the desk two days later, one crew has already returned an empty wrapping. The repair held. He treats your next Elderwood trip as part of an ongoing road economy rather than an isolated errand.',
    }),
});

const STARFEN_MARSHCRAFT_COMMITMENTS = Object.freeze(Object.fromEntries(
    STARFEN_MARSHCRAFT_COMMITMENT_DATA.map((definition) => [definition.id, commitment(definition)]),
));

export function getCommitmentDefinition(commitmentId) {
    const id = String(commitmentId ?? '').trim();
    return COMMITMENT_DEFINITIONS[id] ?? STARFEN_MARSHCRAFT_COMMITMENTS[id] ?? null;
}
export function listCommitmentDefinitions() { return [...Object.values(COMMITMENT_DEFINITIONS), ...Object.values(STARFEN_MARSHCRAFT_COMMITMENTS)]; }

export function validateCommitmentCatalog() {
    const issues = [];
    for (const definition of listCommitmentDefinitions()) {
        if (!stableId(definition.id)) issues.push(`${definition.id || 'commitment'} has an invalid id.`);
        if (!stableId(definition.giverNpcId)) issues.push(`${definition.id} has an invalid giverNpcId.`);
        const poi = getPointOfInterest(definition.offerPoiId); if (!poi) issues.push(`${definition.id} references unknown offer POI ${definition.offerPoiId}.`);
        const place = getPlace(definition.offerPlaceId); if (!place) issues.push(`${definition.id} references unknown offer place ${definition.offerPlaceId}.`);
        if (poi && poi.placeId !== definition.offerPlaceId) issues.push(`${definition.id} offer POI is not in offer place.`);
        if (!Array.isArray(definition.requiredItems) || !definition.requiredItems.length) issues.push(`${definition.id} requires at least one item.`);
        for (const requirement of definition.requiredItems ?? []) {
            const item = getCommitmentItem(requirement.itemId);
            if (!item) { issues.push(`${definition.id} references unknown required item ${requirement.itemId}.`); continue; }
            if (!positiveInteger(requirement.quantity)) issues.push(`${definition.id} has invalid quantity for ${requirement.itemId}.`);
            if (requirement.provenanceSourceId) {
                const staticSource = item.provenance.some((entry) => entry.sourceId === requirement.provenanceSourceId);
                const dynamicSource = DYNAMIC_PROVENANCE_SOURCES[requirement.provenanceSourceId];
                if (!staticSource && dynamicSource?.itemId !== requirement.itemId) issues.push(`${definition.id} provenance requirement ${requirement.provenanceSourceId} is not a source for ${requirement.itemId}.`);
            }
        }
        if (definition.fieldSourceId) { const source = getCanonicalGatheringSource(definition.fieldSourceId); if (!source) issues.push(`${definition.id} references unknown field source ${definition.fieldSourceId}.`); else if (!definition.requiredItems.some((requirement) => requirement.itemId === source.outputItemId)) issues.push(`${definition.id} field source ${definition.fieldSourceId} does not produce a required item.`); }
        if (definition.returnViaPlaceId && !getPlace(definition.returnViaPlaceId)) issues.push(`${definition.id} references unknown return-via place ${definition.returnViaPlaceId}.`);
        if (!Array.isArray(definition.prerequisiteCommitmentIds)) issues.push(`${definition.id}.prerequisiteCommitmentIds must be an array.`);
        issues.push(...validateRelationshipRequirements(definition.relationshipRequirements, { label: `${definition.id}.relationshipRequirements` }));
        for (const prerequisiteId of definition.prerequisiteCommitmentIds ?? []) {
            if (prerequisiteId === definition.id) issues.push(`${definition.id} cannot require itself.`);
            else if (!getCommitmentDefinition(prerequisiteId)) issues.push(`${definition.id} references unknown prerequisite commitment ${prerequisiteId}.`);
        }
        if (!nonNegativeInteger(definition.reward.gil)) issues.push(`${definition.id} reward.gil must be a non-negative integer.`);
        for (const [dimension, delta] of Object.entries(definition.reward.relationship)) { if (!['familiarity', 'respect', 'trust', 'obligation'].includes(dimension)) issues.push(`${definition.id} uses unknown relationship dimension ${dimension}.`); if (!Number.isInteger(delta)) issues.push(`${definition.id} relationship delta ${dimension} must be an integer.`); }
        if (definition.reward.capabilityId && !getCapability(definition.reward.capabilityId)) issues.push(`${definition.id} reward references unknown capability ${definition.reward.capabilityId}.`);
        if (!positiveInteger(definition.followUpDelayDays)) issues.push(`${definition.id} followUpDelayDays must be positive.`);
    }
    issues.push(...validateCommitmentPrerequisiteCycles());
    return issues;
}

function validateCommitmentPrerequisiteCycles() {
    const issues = [];
    const definitions = new Map(listCommitmentDefinitions().map((entry) => [entry.id, entry]));
    const visited = new Set();
    const active = new Set();

    const visit = (id, path = []) => {
        if (active.has(id)) {
            issues.push(`commitment prerequisites contain a cycle: ${[...path, id].join(' -> ')}.`);
            return;
        }
        if (visited.has(id)) return;
        visited.add(id);
        active.add(id);
        const definition = definitions.get(id);
        for (const prerequisiteId of definition?.prerequisiteCommitmentIds ?? []) {
            if (definitions.has(prerequisiteId)) visit(prerequisiteId, [...path, id]);
        }
        active.delete(id);
    };

    for (const id of definitions.keys()) visit(id);
    return issues;
}

function commitment(definition) {
    return Object.freeze({
        ...definition,
        fieldSourceId: definition.fieldSourceId ?? null,
        returnViaPlaceId: definition.returnViaPlaceId ?? null,
        prerequisiteCommitmentIds: Object.freeze([...(definition.prerequisiteCommitmentIds ?? [])]),
        relationshipRequirements: normalizeRelationshipRequirements(definition.relationshipRequirements),
        requiredItems: Object.freeze(definition.requiredItems.map((entry) => Object.freeze({ ...entry }))),
        reward: Object.freeze({
            ...definition.reward,
            capabilityId: definition.reward.capabilityId ?? null,
            relationship: Object.freeze({ ...definition.reward.relationship }),
        }),
    });
}
function getCommitmentItem(itemId) { return getCanonicalResourceItem(itemId) ?? getProductionItem(itemId); }
function stableId(value) { return typeof value === 'string' && /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(value); }
function positiveInteger(value) { return Number.isInteger(value) && value > 0; }
function nonNegativeInteger(value) { return Number.isInteger(value) && value >= 0; }
