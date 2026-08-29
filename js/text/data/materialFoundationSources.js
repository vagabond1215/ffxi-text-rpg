import { ECOLOGY_SOURCE_TYPES } from './ecologyCatalog.js';
import { getMaterialFoundationResourceItem } from './materialFoundationResourceItems.js';
import { getPlace } from './places.js';
import { RESOURCE_RECOVERY_ACTIONS } from './resourceProvenance.js';

export const MATERIAL_FOUNDATION_SOURCE_VERSION = 1;

const SOURCES = Object.freeze({
    'source-north-redstone-tin-lode': source({ id: 'source-north-redstone-tin-lode', name: 'Grey Tin Lode', type: 'mineral', placeId: 'north-redstone-reach', biomeTags: ['ore-bearing-rock','upland-cut'], action: 'mine', outputItemId: 'item-redstone-tin-ore', capacity: 4, regeneration: regen(1, 18000), requiredToolTags: ['mining'], proficiencyId: 'mining', minProficiency: 2 }),
    'source-south-redstone-calamine-pocket': source({ id: 'source-south-redstone-calamine-pocket', name: 'Calamine Pocket', type: 'mineral', placeId: 'south-redstone-reach', biomeTags: ['dry-upland','weathered-ore'], action: 'mine', outputItemId: 'item-redstone-calamine-ore', capacity: 4, regeneration: regen(1, 16200), requiredToolTags: ['mining'], proficiencyId: 'mining', minProficiency: 2 }),
    'source-deepvein-lead-seam': source({ id: 'source-deepvein-lead-seam', name: 'Deepvein Lead Seam', type: 'mineral', placeId: 'deepvein-mine', biomeTags: ['mine','heavy-ore'], action: 'mine', outputItemId: 'item-redstone-lead-ore', capacity: 5, regeneration: regen(1, 18000), requiredToolTags: ['mining'], proficiencyId: 'mining', minProficiency: 2 }),
    'source-deepvein-silver-stringer': source({ id: 'source-deepvein-silver-stringer', name: 'Deepvein Silver Stringer', type: 'mineral', placeId: 'deepvein-mine', biomeTags: ['mine','fault-stringer'], action: 'mine', outputItemId: 'item-redstone-silver-ore', capacity: 2, regeneration: regen(1, 28800), requiredToolTags: ['mining'], proficiencyId: 'mining', minProficiency: 4 }),
    'source-ironspine-high-meadow-gold-vein': source({ id: 'source-ironspine-high-meadow-gold-vein', name: 'High Meadow Gold Vein', type: 'mineral', placeId: 'ironspine-high-meadow', biomeTags: ['alpine-scree','quartz-vein'], action: 'mine', outputItemId: 'item-ironspine-gold-ore', capacity: 2, regeneration: regen(1, 32400), requiredToolTags: ['mining'], proficiencyId: 'mining', minProficiency: 4 }),
    'source-slatewater-limestone-bench': source({ id: 'source-slatewater-limestone-bench', name: 'Slatewater Limestone Bench', type: 'mineral', placeId: 'slatewater-foothills', biomeTags: ['foothill','limestone-bench'], action: 'mine', outputItemId: 'item-slatewater-limestone', capacity: 8, regeneration: regen(2, 10800), requiredToolTags: ['mining'], proficiencyId: 'mining', minProficiency: 1 }),
    'source-slatewater-whetstone-ridge': source({ id: 'source-slatewater-whetstone-ridge', name: 'Finegrit Whetstone Ridge', type: 'mineral', placeId: 'slatewater-foothills', biomeTags: ['slate-ridge','fine-abrasive'], action: 'mine', outputItemId: 'item-slatewater-whetstone-stone', capacity: 6, regeneration: regen(1, 12600), requiredToolTags: ['mining'], proficiencyId: 'mining', minProficiency: 2 }),
    'source-south-redstone-alum-shale-cut': source({ id: 'source-south-redstone-alum-shale-cut', name: 'Alum Shale Cut', type: 'mineral', placeId: 'south-redstone-reach', biomeTags: ['dry-cut','shale'], action: 'mine', outputItemId: 'item-redstone-alum-shale', capacity: 5, regeneration: regen(1, 14400), requiredToolTags: ['mining'], proficiencyId: 'mining', minProficiency: 2 }),
    'source-south-redstone-glass-sand-wash': source({ id: 'source-south-redstone-glass-sand-wash', name: 'Pale Glass-Sand Wash', type: 'mineral', placeId: 'south-redstone-reach', biomeTags: ['dry-wash','silica-sand'], action: 'gather', outputItemId: 'item-redstone-glass-sand', capacity: 10, regeneration: regen(2, 7200), requiredToolTags: ['digging'], proficiencyId: 'gathering', minProficiency: 1 }),

    'source-east-elderwood-ash-stand': source({ id: 'source-east-elderwood-ash-stand', name: 'Straight Ash Stand', type: 'flora', placeId: 'east-elderwood', biomeTags: ['managed-woodland','straight-grain'], action: 'log', outputItemId: 'item-elderwood-ash-timber', capacity: 5, regeneration: regen(1, 18000), requiredToolTags: ['woodcutting'], proficiencyId: 'logging', minProficiency: 1 }),
    'source-west-elderwood-crown-oak-fall': source({ id: 'source-west-elderwood-crown-oak-fall', name: 'Crown Oak Windfall', type: 'flora', placeId: 'west-elderwood', biomeTags: ['old-growth','broad-trunk','stormfall'], action: 'log', outputItemId: 'item-elderwood-crown-oak-timber', capacity: 4, regeneration: regen(1, 21600), requiredToolTags: ['woodcutting'], proficiencyId: 'logging', minProficiency: 2 }),
    'source-east-elderwood-silvermaple-stand': source({ id: 'source-east-elderwood-silvermaple-stand', name: 'Silvermaple Stand', type: 'flora', placeId: 'east-elderwood', biomeTags: ['managed-woodland','pale-timber'], action: 'log', outputItemId: 'item-elderwood-silvermaple-timber', capacity: 5, regeneration: regen(1, 19800), requiredToolTags: ['woodcutting'], proficiencyId: 'logging', minProficiency: 2 }),
    'source-east-elderwood-silvermaple-taps': source({ id: 'source-east-elderwood-silvermaple-taps', name: 'Silvermaple Tap Grove', type: 'flora', placeId: 'east-elderwood', biomeTags: ['managed-woodland','sap-grove'], action: 'gather', outputItemId: 'item-elderwood-silvermaple-sap', capacity: 8, regeneration: regen(2, 5400), requiredToolTags: ['cutting'], proficiencyId: 'gathering', minProficiency: 1 }),
    'source-west-elderwood-yew-grove': source({ id: 'source-west-elderwood-yew-grove', name: 'Old Yew Grove', type: 'flora', placeId: 'west-elderwood', biomeTags: ['old-growth','elastic-heartwood'], action: 'log', outputItemId: 'item-elderwood-yew-stavewood', capacity: 3, regeneration: regen(1, 25200), requiredToolTags: ['woodcutting'], proficiencyId: 'logging', minProficiency: 3 }),
    'source-east-elderwood-hazel-rod-coppice': source({ id: 'source-east-elderwood-hazel-rod-coppice', name: 'Hazel Rod Coppice', type: 'flora', placeId: 'east-elderwood', biomeTags: ['coppice','forest-edge'], action: 'gather', outputItemId: 'item-elderwood-hazel-rods', capacity: 9, regeneration: regen(2, 5400), requiredToolTags: ['cutting'], proficiencyId: 'gathering', minProficiency: 1 }),
    'source-slatewater-spruce-stand': source({ id: 'source-slatewater-spruce-stand', name: 'Tall Spruce Stand', type: 'flora', placeId: 'slatewater-foothills', biomeTags: ['foothill-forest','tall-straight-trunk'], action: 'log', outputItemId: 'item-slatewater-spruce-timber', capacity: 5, regeneration: regen(1, 21600), requiredToolTags: ['woodcutting'], proficiencyId: 'logging', minProficiency: 2 }),
    'source-slatewater-fragrant-cedar-grove': source({ id: 'source-slatewater-fragrant-cedar-grove', name: 'Fragrant Cedar Grove', type: 'flora', placeId: 'slatewater-foothills', biomeTags: ['foothill-forest','fragrant','rot-resistant'], action: 'log', outputItemId: 'item-slatewater-cedar-timber', capacity: 4, regeneration: regen(1, 23400), requiredToolTags: ['woodcutting'], proficiencyId: 'logging', minProficiency: 2 }),
    'source-crownfields-orchard-pruning-stack': source({ id: 'source-crownfields-orchard-pruning-stack', name: 'Orchard Pruning Stack', type: 'flora', placeId: 'crownfields', biomeTags: ['orchard','pruning'], action: 'gather', outputItemId: 'item-crownfields-applewood', capacity: 8, regeneration: regen(2, 7200), requiredToolTags: ['cutting'], proficiencyId: 'gathering', minProficiency: 1 }),
    'source-east-starfen-giant-cane-brake': source({ id: 'source-east-starfen-giant-cane-brake', name: 'Giant Cane Brake', type: 'flora', placeId: 'east-starfen', biomeTags: ['wetland-edge','tall-cane'], action: 'gather', outputItemId: 'item-starfen-giant-cane', capacity: 10, regeneration: regen(2, 5400), requiredToolTags: ['cutting'], proficiencyId: 'gathering', minProficiency: 1 }),
    'source-crownfields-hemp-strip': source({ id: 'source-crownfields-hemp-strip', name: 'Hemp Strip', type: 'flora', placeId: 'crownfields', biomeTags: ['fiber-crop','field-strip'], action: 'gather', outputItemId: 'item-crownfields-hemp-stalk', capacity: 10, regeneration: regen(2, 7200), requiredToolTags: ['cutting'], proficiencyId: 'gathering', minProficiency: 1 }),
    'source-east-starfen-nettle-bank': source({ id: 'source-east-starfen-nettle-bank', name: 'Nettle Bast Bank', type: 'flora', placeId: 'east-starfen', biomeTags: ['wetland-edge','bast-fiber'], action: 'gather', outputItemId: 'item-starfen-nettle-bast', capacity: 9, regeneration: regen(2, 5400), requiredToolTags: ['cutting'], proficiencyId: 'gathering', minProficiency: 1 }),
});

export function getMaterialFoundationGatheringSource(id) {
    return SOURCES[String(id ?? '').trim()] ?? null;
}
export function listMaterialFoundationGatheringSources() {
    return Object.values(SOURCES);
}

export function validateMaterialFoundationSources() {
    const issues = [];
    const ids = new Set();
    for (const entry of listMaterialFoundationGatheringSources()) {
        if (ids.has(entry.id)) issues.push(`Duplicate material-foundation source ${entry.id}.`);
        ids.add(entry.id);
        if (!validStableId(entry.id)) issues.push(`${entry.id} has invalid id.`);
        if (!ECOLOGY_SOURCE_TYPES.includes(entry.type)) issues.push(`${entry.id} has unknown source type ${entry.type}.`);
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!RESOURCE_RECOVERY_ACTIONS.includes(entry.action)) issues.push(`${entry.id} has unknown action ${entry.action}.`);
        const item = getMaterialFoundationResourceItem(entry.outputItemId);
        if (!item) issues.push(`${entry.id} references unknown output ${entry.outputItemId}.`);
        else if (!item.provenance.some((p) => p.sourceId === entry.id && p.placeId === entry.placeId && p.action === entry.action)) issues.push(`${entry.id} output provenance does not match source.`);
        if (!positive(entry.capacity) || !positive(entry.regeneration?.units) || !positive(entry.regeneration?.everySeconds)) issues.push(`${entry.id} has invalid capacity/regeneration.`);
        if (!Array.isArray(entry.requiredToolTags)) issues.push(`${entry.id} requiredToolTags must be an array.`);
        if (!String(entry.proficiencyId ?? '').trim()) issues.push(`${entry.id} requires proficiencyId.`);
        if (!Number.isInteger(entry.minProficiency) || entry.minProficiency < 0) issues.push(`${entry.id} minProficiency must be non-negative.`);
    }
    return issues;
}

function source(definition) {
    return deepFreeze({
        id: definition.id,
        version: MATERIAL_FOUNDATION_SOURCE_VERSION,
        name: definition.name,
        type: definition.type,
        placeId: definition.placeId,
        biomeTags: [...definition.biomeTags],
        action: definition.action,
        outputItemId: definition.outputItemId,
        capacity: definition.capacity,
        regeneration: definition.regeneration,
        requiredToolTags: [...definition.requiredToolTags],
        proficiencyId: definition.proficiencyId,
        minProficiency: definition.minProficiency ?? 0,
        appearanceConditions: [],
    });
}
function regen(units, everySeconds) { return Object.freeze({ units, everySeconds }); }
function positive(value) { return Number.isInteger(value) && value > 0; }
function validStableId(value) { return typeof value === 'string' && /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(value); }
function deepFreeze(value) { if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value; for (const child of Object.values(value)) deepFreeze(child); return Object.freeze(value); }
