import { getCanonicalGatheringSource } from './ecologyRegistry.js';
import { getPointOfInterest } from './pointsOfInterest.js';
import { getPlace } from './places.js';
import { getProductionItem } from './productionItems.js';
import { getCanonicalResourceItem } from './resourceItemRegistry.js';

export const COMMITMENT_CATALOG_VERSION = 2;

const COMMITMENT_DEFINITIONS = Object.freeze({
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
            if (requirement.provenanceSourceId && !item.provenance.some((entry) => entry.sourceId === requirement.provenanceSourceId)) {
                issues.push(`${definition.id} provenance requirement ${requirement.provenanceSourceId} is not a source for ${requirement.itemId}.`);
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
