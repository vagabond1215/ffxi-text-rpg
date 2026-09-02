import { getCommitmentDefinition } from './commitments.js';
import { normalizeRelationshipRequirements, validateRelationshipRequirements } from './socialRequirements.js';

export const COMPANION_CATALOG_VERSION = 5;

const COMPANIONS = Object.freeze({
    'companion-sable-renn': companion({
        id: 'companion-sable-renn',
        npcId: 'npc-slatewater-sable-renn',
        name: 'Sable Renn',
        title: 'Slatewater Road Scout',
        description: 'A neutral foothill scout who reads washouts, animal sign, loose slate, and caravan wear as one connected road problem rather than separate errands.',
        homePlaceId: 'slatewater-waylodge',
        recruitment: {
            placeIds: ['slatewater-waylodge'],
            requiredFlags: [],
            requiredCommitmentIds: [
                'commitment-slatewater-resin-waymarks',
                'commitment-slatewater-lichen-fogmarks',
            ],
            relationshipRequirements: [
                { npcId: 'npc-slatewater-sable-renn', minimums: { trust: 3, respect: 1 } },
            ],
        },
        level: 4,
        baseAttributes: { str: 1, dex: 2, vit: 1, agi: 3, mnd: 1, chr: 1 },
        skills: { sword: 7, dagger: 11, evasion: 11, parrying: 6 },
        tactics: { role: 'scout', policy: 'basic-attack-v1', defaultApproachId: 'read-the-road' },
        fieldApproaches: [
            {
                id: 'read-the-road',
                name: 'Read the Road',
                summary: 'Sable stays mobile and alert, favoring avoidance and clean angles over force.',
                quote: '“Watch the shoulders of the road. Trouble tells on itself there first.”',
                attributeModifiers: { agi: 2, str: -1 },
            },
            {
                id: 'cut-the-gap',
                name: 'Cut the Gap',
                summary: 'Sable commits hard when an opening appears, trading some caution for a sharper attack.',
                quote: '“There. Before it closes.”',
                attributeModifiers: { dex: 2, vit: -1 },
            },
        ],
        relationshipDimensions: ['trust', 'respect', 'familiarity'],
    }),
    'companion-dain-rove': companion({
        id: 'companion-dain-rove',
        npcId: 'npc-ironspine-dain-rove',
        name: 'Dain Rove',
        title: 'Ironspine Warden',
        description: 'A high-pass warden who treats route choice, weather, animal sign, and keeping a retreat line open as parts of the same field decision.',
        homePlaceId: 'ironspine-watchpost',
        recruitment: {
            placeIds: ['ironspine-watchpost'],
            requiredFlags: [],
            requiredCommitmentIds: [
                'commitment-ironspine-survey-compass',
                'commitment-ironspine-frost-salve-readiness',
                'commitment-ironspine-bearhide-bedroll',
            ],
            relationshipRequirements: [
                { npcId: 'npc-ironspine-dain-rove', minimums: { trust: 2, respect: 1 } },
            ],
        },
        level: 4,
        baseAttributes: { str: 2, dex: 1, vit: 3, agi: 1, mnd: 1, chr: 1 },
        skills: { sword: 9, axe: 10, evasion: 7, parrying: 10 },
        tactics: { role: 'warden', policy: 'basic-attack-v1', defaultApproachId: 'hold-the-pass' },
        fieldApproaches: [
            {
                id: 'hold-the-pass',
                name: 'Hold the Pass',
                summary: 'Dain anchors the line and absorbs pressure, trading mobility for steadier protection.',
                quote: '“Nothing gets through us for free.”',
                attributeModifiers: { vit: 2, agi: -1 },
            },
            {
                id: 'drive-the-ridge',
                name: 'Drive the Ridge',
                summary: 'Dain presses an opening before weather or terrain can close it, trading some endurance for force.',
                quote: '“Move now. The ridge will not stay kind.”',
                attributeModifiers: { str: 2, vit: -1 },
            },
        ],
        relationshipDimensions: ['trust', 'respect', 'familiarity'],
    }),
    'companion-mara-venn': companion({
        id: 'companion-mara-venn',
        npcId: 'npc-elderwood-waywarden',
        name: 'Mara Venn',
        title: 'Waywarden',
        description: 'An Elderwood waywarden who reads bent grass, bird-silence, and bad tracks before trouble reaches the road.',
        homePlaceId: 'timbercross-landing',
        recruitment: {
            placeIds: ['timbercross-landing'],
            requiredFlags: [],
        },
        level: 4,
        baseAttributes: { str: 1, dex: 2, vit: 1, agi: 2, mnd: 1 },
        skills: { sword: 10, dagger: 8, evasion: 10, parrying: 7 },
        tactics: { role: 'skirmisher', policy: 'basic-attack-v1', defaultApproachId: 'guard-the-road' },
        fieldApproaches: [
            {
                id: 'guard-the-road',
                name: 'Guard the Road',
                summary: 'Mara keeps her guard tight, trading some striking power for a harder target when trouble closes in.',
                quote: '“Stay inside my reach. We get home together.”',
                attributeModifiers: { str: -1, agi: 2 },
            },
            {
                id: 'seek-the-opening',
                name: 'Seek the Opening',
                summary: 'Mara fights for decisive angles, trading some caution for a stronger attack.',
                quote: '“Hold their eye. I’ll find the seam.”',
                attributeModifiers: { str: 2, agi: -1 },
            },
        ],
        relationshipDimensions: ['trust', 'respect', 'familiarity'],
    }),
});

export function getCompanionDefinition(companionId) {
    return COMPANIONS[String(companionId ?? '').trim()] ?? null;
}

export function findCompanionDefinition(query) {
    const normalized = normalize(query);
    if (!normalized) return null;
    return Object.values(COMPANIONS).find((entry) => normalize(entry.id) === normalized || normalize(entry.name).includes(normalized)) ?? null;
}

export function listCompanionDefinitions() {
    return Object.values(COMPANIONS);
}

export function listCompanionFieldApproaches(companionId) {
    return getCompanionDefinition(companionId)?.fieldApproaches ?? Object.freeze([]);
}

export function getCompanionFieldApproach(companionId, approachId) {
    const normalized = normalize(approachId);
    if (!normalized) return null;
    return listCompanionFieldApproaches(companionId).find((entry) => normalize(entry.id) === normalized) ?? null;
}

export function validateCompanionCatalog() {
    const issues = [];
    const ids = new Set();
    const npcIds = new Set();
    for (const entry of listCompanionDefinitions()) {
        if (!stableId(entry.id)) issues.push(`Invalid companion id ${entry.id}.`);
        if (ids.has(entry.id)) issues.push(`Duplicate companion id ${entry.id}.`);
        ids.add(entry.id);
        if (!stableId(entry.npcId)) issues.push(`${entry.id}.npcId is invalid.`);
        if (npcIds.has(entry.npcId)) issues.push(`NPC ${entry.npcId} backs more than one companion definition.`);
        npcIds.add(entry.npcId);
        if (!entry.name) issues.push(`${entry.id}.name is required.`);
        if (!entry.description) issues.push(`${entry.id}.description is required.`);
        if (!stableId(entry.homePlaceId)) issues.push(`${entry.id}.homePlaceId is invalid.`);
        if (!Number.isInteger(entry.level) || entry.level < 1) issues.push(`${entry.id}.level must be positive.`);
        if (!Array.isArray(entry.recruitment.placeIds) || !entry.recruitment.placeIds.length) issues.push(`${entry.id} requires recruitment places.`);
        if (!Array.isArray(entry.recruitment.requiredFlags)) issues.push(`${entry.id}.recruitment.requiredFlags must be an array.`);
        if (!Array.isArray(entry.recruitment.requiredCommitmentIds)) issues.push(`${entry.id}.recruitment.requiredCommitmentIds must be an array.`);
        issues.push(...validateRelationshipRequirements(entry.recruitment.relationshipRequirements, { label: `${entry.id}.recruitment.relationshipRequirements` }));
        for (const commitmentId of entry.recruitment.requiredCommitmentIds ?? []) {
            if (!stableId(commitmentId) || !getCommitmentDefinition(commitmentId)) issues.push(`${entry.id} references unknown recruitment commitment ${commitmentId}.`);
        }
        if (!Array.isArray(entry.relationshipDimensions) || !entry.relationshipDimensions.length) issues.push(`${entry.id} requires relationship dimensions.`);
        if (!entry.tactics?.policy) issues.push(`${entry.id} requires a tactics policy.`);
        if (!stableId(entry.tactics?.defaultApproachId)) issues.push(`${entry.id} requires a default field approach.`);
        if (!Array.isArray(entry.fieldApproaches) || entry.fieldApproaches.length < 2) issues.push(`${entry.id} requires at least two field approaches.`);
        const approachIds = new Set();
        for (const approach of entry.fieldApproaches ?? []) {
            if (!stableId(approach.id)) issues.push(`${entry.id} has invalid field approach id ${String(approach.id)}.`);
            if (approachIds.has(approach.id)) issues.push(`${entry.id} duplicates field approach ${approach.id}.`);
            approachIds.add(approach.id);
            if (!approach.name || !approach.summary || !approach.quote) issues.push(`${entry.id}.${approach.id} requires player-facing name, summary, and quote.`);
            if (!approach.attributeModifiers || typeof approach.attributeModifiers !== 'object' || Array.isArray(approach.attributeModifiers)) issues.push(`${entry.id}.${approach.id}.attributeModifiers must be an object.`);
            else for (const [attribute, modifier] of Object.entries(approach.attributeModifiers)) {
                if (!['str', 'dex', 'vit', 'agi', 'int', 'mnd', 'chr'].includes(attribute) || !Number.isInteger(modifier)) issues.push(`${entry.id}.${approach.id} has invalid attribute modifier ${attribute}.`);
            }
        }
        if (!approachIds.has(entry.tactics?.defaultApproachId)) issues.push(`${entry.id}.tactics.defaultApproachId must reference a field approach.`);
    }
    return issues;
}

function companion(definition) {
    return deepFreeze({
        version: COMPANION_CATALOG_VERSION,
        id: definition.id,
        npcId: definition.npcId,
        name: definition.name,
        title: definition.title ?? '',
        description: definition.description ?? '',
        homePlaceId: definition.homePlaceId,
        recruitment: {
            placeIds: [...(definition.recruitment?.placeIds ?? [])],
            requiredFlags: [...(definition.recruitment?.requiredFlags ?? [])],
            requiredCommitmentIds: [...(definition.recruitment?.requiredCommitmentIds ?? [])],
            relationshipRequirements: normalizeRelationshipRequirements(definition.recruitment?.relationshipRequirements),
        },
        level: definition.level,
        baseAttributes: { ...(definition.baseAttributes ?? {}) },
        skills: { ...(definition.skills ?? {}) },
        tactics: { ...(definition.tactics ?? {}) },
        fieldApproaches: (definition.fieldApproaches ?? []).map((entry) => ({
            ...entry,
            attributeModifiers: { ...(entry.attributeModifiers ?? {}) },
        })),
        relationshipDimensions: [...(definition.relationshipDimensions ?? [])],
    });
}

function normalize(value) { return String(value ?? '').trim().toLowerCase(); }
function stableId(value) { return typeof value === 'string' && /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(value); }
function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
}
