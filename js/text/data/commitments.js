import { getCanonicalGatheringSource } from './ecologyRegistry.js';
import { getPointOfInterest } from './pointsOfInterest.js';
import { getPlace } from './places.js';
import { getProductionItem } from './productionItems.js';
import { getCanonicalResourceItem } from './resourceItemRegistry.js';

export const COMMITMENT_CATALOG_VERSION = 3;

const DYNAMIC_PROVENANCE_SOURCES = Object.freeze({
    'plot-home-sweetroot-bed': Object.freeze({
        itemId: 'item-elderwood-sweetroot',
        domain: 'cultivation',
    }),
});

const COMMITMENT_DEFINITIONS = Object.freeze({
    'commitment-thornwall-sweetroot-return': commitment({
        id: 'commitment-thornwall-sweetroot-return',
        name: 'Sweetroot for Southgate',
        giverNpcId: 'npc-thornwall-sera-talwin',
        offerPoiId: 'poi-sandoria-s-alaune',
        offerPlaceId: 'thornwall-southgate',
        description: 'Sera Talwin needs two fresh Elderwood Sweetroots for the Southgate road pantry, where wardens and travelers keep simple food and field remedies close at hand.',
        objective: 'Forage two Elderwood Sweetroots in West Elderwood and bring them back to Sera Talwin at Southgate.',
        requiredItems: [{
            itemId: 'item-elderwood-sweetroot',
            quantity: 2,
            provenanceSourceId: 'source-west-elderwood-sweetroot-patch',
        }],
        fieldSourceId: 'source-west-elderwood-sweetroot-patch',
        reward: {
            gil: 20,
            relationship: { familiarity: 1, respect: 1 },
        },
        followUpDelayDays: 1,
        offerText: 'Sera asks for two fresh Sweetroots from West Elderwood. Southgate keeps them for plain road food and simple field remedies, and she would rather know who actually gathered this batch than buy an anonymous bundle from a stall.',
        resolvedText: 'Sera checks the roots, trims away the bruised ends, and puts your name beside the delivery in the gate pantry book. The work is small, but Southgate now has a reason to remember you as someone who went out and came back useful.',
        followUpText: 'On a later day, Sera remembers the Sweetroot before you mention it. She notes that the west road still offers several kinds of work: resin cutters are making their rounds, Brush Hares are thick along the safer trails, and the deeper woods reward people who choose their preparation instead of following one chore after another.',
    }),
    'commitment-brasshaven-copper-return': commitment({
        id: 'commitment-brasshaven-copper-return',
        name: 'Copper for the Ring',
        giverNpcId: 'npc-brasshaven-marshal-varric-stone',
        offerPoiId: 'poi-bastok-markets-rabid-wolf',
        offerPlaceId: 'brasshaven-market-ring',
        description: 'Marshal Varric Stone needs a clean Redstone copper ingot returned to the Market Ring so local crews can compare field supply against workshop demand.',
        objective: 'Bring Marshal Varric Stone one Redstone Copper Ingot smelted through the Redstone copper process.',
        requiredItems: [{
            itemId: 'item-redstone-copper-ingot',
            quantity: 1,
            provenanceSourceId: 'process-redstone-copper-ingot',
        }],
        reward: {
            gil: 36,
            relationship: { familiarity: 1, respect: 2 },
        },
        followUpDelayDays: 1,
        offerText: 'Varric has a small practical request: bring one properly smelted Redstone copper ingot back to the Market Ring. He is interested in whether you can complete the whole route, not merely buy a piece of metal.',
        resolvedText: 'Varric checks the ingot, compares its working marks against the Ring ledger, and credits the delivery. The payment is modest; the useful part is that your name is now attached to completed work.',
        followUpText: 'When you return the next day, Varric remembers the copper without consulting the newcomer roll. He points out that a Copper Trail Clasp needs Starfen reed fiber as well as metalwork: one reliable route has become a reason to learn another.',
    }),
    'commitment-mistmere-marrowleaf-return': commitment({
        id: 'commitment-mistmere-marrowleaf-return',
        name: 'Marrowleaf for the Ward',
        giverNpcId: 'npc-mistmere-reader-soli-venn',
        offerPoiId: 'poi-waters-dagoza-beruza',
        offerPlaceId: 'mistmere-canal-ward',
        description: 'Reader Soli Venn wants two fresh Marrowleaf samples gathered in West Starfen so the Canal Ward can compare this season’s growth with the civic readers’ older field notes.',
        objective: 'Gather two Marrowleaf in West Starfen and bring them back to Reader Soli Venn in the Canal Ward.',
        requiredItems: [{
            itemId: 'item-starfen-marrowleaf',
            quantity: 2,
            provenanceSourceId: 'source-west-starfen-marrowleaf-bed',
        }],
        fieldSourceId: 'source-west-starfen-marrowleaf-bed',
        returnViaPlaceId: 'mistmere-reedport',
        reward: {
            gil: 24,
            relationship: { familiarity: 1, respect: 1 },
        },
        followUpDelayDays: 1,
        offerText: 'Soli asks for two fresh Marrowleaf samples from West Starfen. The Ward has old notes and dried specimens, but current growth tells them more about the marsh than a copied ledger does.',
        resolvedText: 'Soli compares the leaves against the Ward notes, marks where you gathered them, and credits the work. Your name is written beside a useful observation rather than beside another newcomer instruction.',
        followUpText: 'When you return on a later day, Soli remembers the Marrowleaf without reopening the old notes. They point out that the same reed country supports useful gathering and troublesome rootlings: knowing Starfen means learning when to work the marsh and when to make the ground safer first.',
    }),
    'commitment-thornwall-hearth-sweetroot-share': commitment({
        id: 'commitment-thornwall-hearth-sweetroot-share',
        name: 'A Root for the Morning Pot',
        giverNpcId: 'npc-thornwall-mira-fen',
        offerPoiId: 'poi-sandoria-s-aveline',
        offerPlaceId: 'thornwall-southgate',
        description: 'Mira Fen wants one Sweetroot grown at a Southgate lodging for the neighborhood breakfast pot, where a home-grown root means more than another anonymous bundle from the road.',
        objective: 'Bring Mira Fen one Elderwood Sweetroot harvested from your own home cultivation bed.',
        requiredItems: [{
            itemId: 'item-elderwood-sweetroot',
            quantity: 1,
            provenanceSourceId: 'plot-home-sweetroot-bed',
        }],
        reward: {
            gil: 18,
            relationship: { familiarity: 1, obligation: 1 },
        },
        followUpDelayDays: 2,
        offerText: 'Mira has seen plenty of forest Sweetroot come through Southgate. She asks for something different: one root you kept alive and brought to harvest at your own lodging, for the shared morning pot used by neighbors and road hands.',
        resolvedText: 'Mira turns the cultivated root over in her hand, recognizes the care marks from a tended bed, and slices it into the morning pot. Your lodging is no longer only somewhere you sleep; it has supplied a meal other people will remember.',
        followUpText: 'Two mornings later, Mira points out the empty place in the pot where your root went first. A pair of regulars now ask whether the lodging garden is still producing, and she treats your next visit like a neighbor returning rather than a customer passing through.',
    }),
    'commitment-brasshaven-courtyard-sweetroot-share': commitment({
        id: 'commitment-brasshaven-courtyard-sweetroot-share',
        name: 'Courtyard-Grown Sweetroot',
        giverNpcId: 'npc-brasshaven-mae-oris',
        offerPoiId: 'poi-bastok-markets-carmelide',
        offerPlaceId: 'brasshaven-market-ring',
        description: 'Mae Oris wants one Sweetroot grown at a Market Ring lodging to prove the crowded courtyards can contribute something useful instead of importing every fresh root through the gates.',
        objective: 'Bring Mae Oris one Elderwood Sweetroot harvested from your own home cultivation bed.',
        requiredItems: [{
            itemId: 'item-elderwood-sweetroot',
            quantity: 1,
            provenanceSourceId: 'plot-home-sweetroot-bed',
        }],
        reward: {
            gil: 24,
            relationship: { respect: 1, trust: 1 },
        },
        followUpDelayDays: 1,
        offerText: 'Mae has a practical wager with two courtyard cooks: if a traveler can keep a Sweetroot bed producing in the Ring, the block can stop treating every patch of soil as wasted space. She wants one root from your own bed, not one bought back from a stall.',
        resolvedText: 'Mae checks the root against the little cultivation notes she has been keeping and wins her wager without ceremony. By evening, your lodging is being cited as evidence that the Ring can grow a little of what it consumes.',
        followUpText: 'The next day Mae has already lent her notes to another courtyard. She trusts your account of the bed enough to stop asking for proof and starts asking what you learned about keeping routine work from swallowing the rest of your day.',
    }),
    'commitment-mistmere-canalside-sweetroot-share': commitment({
        id: 'commitment-mistmere-canalside-sweetroot-share',
        name: 'Sweetroot for the Remedy Shelf',
        giverNpcId: 'npc-mistmere-kiri-fen',
        offerPoiId: 'poi-waters-hilkomu-makimu',
        offerPlaceId: 'mistmere-canal-ward',
        description: 'Kiri Fen wants one Sweetroot raised at a Canal Ward lodging for the neighborhood remedy shelf, where its known home history matters as much as the root itself.',
        objective: 'Bring Kiri Fen one Elderwood Sweetroot harvested from your own home cultivation bed.',
        requiredItems: [{
            itemId: 'item-elderwood-sweetroot',
            quantity: 1,
            provenanceSourceId: 'plot-home-sweetroot-bed',
        }],
        reward: {
            gil: 20,
            relationship: { familiarity: 1, trust: 1 },
        },
        followUpDelayDays: 2,
        offerText: 'Kiri is comparing roots whose history she actually knows. She asks for one Sweetroot grown at your own Canal Ward lodging so the shared remedy shelf has a batch tied to a person, a place, and days of care rather than a market label.',
        resolvedText: 'Kiri records the root beside your name and sets it among the practical remedies kept for the nearest households. The small bed at your lodging has become part of how the ward looks after people who live there.',
        followUpText: 'When you return two days later, Kiri has already used part of the root in a simple broth for a feverish neighbor. She remembers exactly where it came from and asks after the bed before asking whether you need to buy anything.',
    }),
});

export function getCommitmentDefinition(commitmentId) {
    return COMMITMENT_DEFINITIONS[String(commitmentId ?? '').trim()] ?? null;
}

export function listCommitmentDefinitions() {
    return Object.values(COMMITMENT_DEFINITIONS);
}

export function validateCommitmentCatalog() {
    const issues = [];
    for (const definition of listCommitmentDefinitions()) {
        if (!stableId(definition.id)) issues.push(`${definition.id || 'commitment'} has an invalid id.`);
        if (!stableId(definition.giverNpcId)) issues.push(`${definition.id} has an invalid giverNpcId.`);
        const poi = getPointOfInterest(definition.offerPoiId);
        if (!poi) issues.push(`${definition.id} references unknown offer POI ${definition.offerPoiId}.`);
        const place = getPlace(definition.offerPlaceId);
        if (!place) issues.push(`${definition.id} references unknown offer place ${definition.offerPlaceId}.`);
        if (poi && poi.placeId !== definition.offerPlaceId) issues.push(`${definition.id} offer POI is not in offer place.`);
        if (!Array.isArray(definition.requiredItems) || !definition.requiredItems.length) issues.push(`${definition.id} requires at least one item.`);
        for (const requirement of definition.requiredItems ?? []) {
            const item = getCommitmentItem(requirement.itemId);
            if (!item) {
                issues.push(`${definition.id} references unknown required item ${requirement.itemId}.`);
                continue;
            }
            if (!positiveInteger(requirement.quantity)) issues.push(`${definition.id} has invalid quantity for ${requirement.itemId}.`);
            if (requirement.provenanceSourceId) {
                const staticSource = item.provenance.some((entry) => entry.sourceId === requirement.provenanceSourceId);
                const dynamicSource = DYNAMIC_PROVENANCE_SOURCES[requirement.provenanceSourceId];
                const validDynamicSource = dynamicSource?.itemId === requirement.itemId;
                if (!staticSource && !validDynamicSource) {
                    issues.push(`${definition.id} provenance requirement ${requirement.provenanceSourceId} is not a source for ${requirement.itemId}.`);
                }
            }
        }
        if (definition.fieldSourceId) {
            const source = getCanonicalGatheringSource(definition.fieldSourceId);
            if (!source) issues.push(`${definition.id} references unknown field source ${definition.fieldSourceId}.`);
            else if (!definition.requiredItems.some((requirement) => requirement.itemId === source.outputItemId)) {
                issues.push(`${definition.id} field source ${definition.fieldSourceId} does not produce a required item.`);
            }
        }
        if (definition.returnViaPlaceId && !getPlace(definition.returnViaPlaceId)) {
            issues.push(`${definition.id} references unknown return-via place ${definition.returnViaPlaceId}.`);
        }
        if (!nonNegativeInteger(definition.reward.gil)) issues.push(`${definition.id} reward.gil must be a non-negative integer.`);
        for (const [dimension, delta] of Object.entries(definition.reward.relationship)) {
            if (!['familiarity', 'respect', 'trust', 'obligation'].includes(dimension)) issues.push(`${definition.id} uses unknown relationship dimension ${dimension}.`);
            if (!Number.isInteger(delta)) issues.push(`${definition.id} relationship delta ${dimension} must be an integer.`);
        }
        if (!positiveInteger(definition.followUpDelayDays)) issues.push(`${definition.id} followUpDelayDays must be positive.`);
    }
    return issues;
}

function commitment(definition) {
    return Object.freeze({
        ...definition,
        fieldSourceId: definition.fieldSourceId ?? null,
        returnViaPlaceId: definition.returnViaPlaceId ?? null,
        requiredItems: Object.freeze(definition.requiredItems.map((entry) => Object.freeze({ ...entry }))),
        reward: Object.freeze({
            ...definition.reward,
            relationship: Object.freeze({ ...definition.reward.relationship }),
        }),
    });
}

function getCommitmentItem(itemId) {
    return getCanonicalResourceItem(itemId) ?? getProductionItem(itemId);
}

function stableId(value) {
    return typeof value === 'string' && /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(value);
}

function positiveInteger(value) { return Number.isInteger(value) && value > 0; }
function nonNegativeInteger(value) { return Number.isInteger(value) && value >= 0; }