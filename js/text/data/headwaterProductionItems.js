import { ITEM_KINDS, normalizeItem, validateItemConsumption } from './itemSchema.js';

export const HEADWATER_PRODUCTION_ITEM_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-headwater-dressed-trout': item({ id: 'item-headwater-dressed-trout', name: 'Cleaned Coldstream Trout', kind: ITEM_KINDS.MATERIAL, tags: ['fish','food','cleaned','freshwater','headwater'], valueGil: 18, sourceId: 'process-headwater-dress-trout', action: 'process', consumption: { mode: 'processRequired', hazard: 'pathogenRisk', preparation: ['cook-or-smoke'], notes: 'The fish has been cleaned but is still raw; cook or properly smoke it before eating.' }, sinks: ['processInput','craftIngredient','trade'] }),
    'item-headwater-trout-cress-stew': item({ id: 'item-headwater-trout-cress-stew', name: 'Headwater Trout-Cress Stew', kind: ITEM_KINDS.CONSUMABLE, tags: ['food','meal','cooked','fish','headwater'], valueGil: 34, sourceId: 'cook-headwater-trout-cress-stew', action: 'craft', consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'The trout is thoroughly cooked with spring cress and is ready to eat.' }, sinks: ['consume','trade'] }),
    'item-headwater-alder-smoked-trout': item({ id: 'item-headwater-alder-smoked-trout', name: 'Alder-Smoked Coldstream Trout', kind: ITEM_KINDS.CONSUMABLE, tags: ['food','preserved','smoked','fish','travel','headwater'], valueGil: 31, sourceId: 'process-headwater-alder-smoked-trout', action: 'process', consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Cleaned trout is properly smoked over split alder and prepared for eating or carrying on the road.' }, sinks: ['consume','trade'] }),
    'item-headwater-dried-meadowsweet': item({ id: 'item-headwater-dried-meadowsweet', name: 'Dried Headwater Meadowsweet', kind: ITEM_KINDS.MATERIAL, tags: ['herb','remedy','dried','aromatic','component','headwater'], valueGil: 22, sourceId: 'process-headwater-dry-meadowsweet', action: 'process', sinks: ['craftIngredient','processInput','trade'] }),
    'item-headwater-alder-tanned-leather': item({ id: 'item-headwater-alder-tanned-leather', name: 'Alder-Tanned Deer Leather', kind: ITEM_KINDS.MATERIAL, tags: ['hide','leather','component','fieldcraft','headwater'], valueGil: 49, sourceId: 'process-headwater-alder-tanned-leather', action: 'process', sinks: ['craftIngredient','repair','trade'] }),
    'item-headwater-antler-toggle-set': item({ id: 'item-headwater-antler-toggle-set', name: 'Carved Antler Toggle Set', kind: ITEM_KINDS.MATERIAL, tags: ['antler','carved','fastener','component','headwater'], valueGil: 35, sourceId: 'craft-headwater-antler-toggle-set', action: 'craft', sinks: ['craftIngredient','repair','trade','decorative'] }),
    'item-headwater-alder-board': item({ id: 'item-headwater-alder-board', name: 'Headwater Alder Board', kind: ITEM_KINDS.MATERIAL, tags: ['wood','board','component','riverwork','headwater'], valueGil: 28, sourceId: 'process-headwater-alder-board', action: 'process', sinks: ['craftIngredient','construction','repair','trade'] }),
    'item-headwater-willow-creel': item({ id: 'item-headwater-willow-creel', name: 'Headwater Willow Creel', kind: ITEM_KINDS.MATERIAL, tags: ['basketry','fishing-gear','container','fieldcraft','headwater'], valueGil: 62, sourceId: 'craft-headwater-willow-creel', action: 'craft', sinks: ['toolUse','repair','trade'] }),
    'item-headwater-smoked-venison': item({ id: 'item-headwater-smoked-venison', name: 'Alder-Smoked Headwater Venison', kind: ITEM_KINDS.CONSUMABLE, tags: ['food','preserved','smoked','game','travel','headwater'], valueGil: 36, sourceId: 'process-headwater-smoked-venison', action: 'process', consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'The venison has been cut thin and thoroughly smoked over alder for safe road use.' }, sinks: ['consume','trade'] }),
    'item-headwater-bridge-repair-kit': item({ id: 'item-headwater-bridge-repair-kit', name: 'Headwater Bridge Repair Kit', kind: ITEM_KINDS.MATERIAL, tags: ['construction','repair','roadwork','river-crossing','headwater'], valueGil: 96, sourceId: 'craft-headwater-bridge-repair-kit', action: 'craft', sinks: ['construction','repair','contract','trade'] }),
});
export function getHeadwaterProductionItem(id) { const entry = DEFINITIONS[String(id ?? '').trim()] ?? null; return entry ? normalizeItem(entry) : null; }
export function listHeadwaterProductionItems() { return Object.values(DEFINITIONS).map((entry) => normalizeItem(entry)); }
export function validateHeadwaterProductionItems() {
    const issues = []; const ids = new Set();
    for (const entry of listHeadwaterProductionItems()) {
        if (ids.has(entry.id)) issues.push(`Duplicate Headwater production item ${entry.id}.`);
        ids.add(entry.id);
        for (const issue of validateItemConsumption(entry)) issues.push(`${entry.id} ${issue}`);
    }
    return issues;
}
function item({ id, name, kind, tags, valueGil, sourceId, action, consumption = null, sinks }) {
    return Object.freeze({
        id, name, kind, quantity: 1, maxStack: 99, valueGil, tags: Object.freeze([...tags]), consumption,
        provenance: Object.freeze([Object.freeze({ type: 'crafting', sourceId, placeId: null, action, data: Object.freeze({ catalogVersion: HEADWATER_PRODUCTION_ITEM_CATALOG_VERSION }) })]),
        sinks: Object.freeze(sinks.map((type) => Object.freeze({ type, data: Object.freeze({}) }))),
        equipmentSlot: null, allowedSlots: Object.freeze([]), requirements: Object.freeze({ minLevel: 1, allowedJobs: [], allowedRaces: [] }),
        flags: Object.freeze([]), modifiers: Object.freeze({}),
        metadata: Object.freeze({ confidence: 'intentionalSimplification', source: 'Hearth & Horizon Headwater Vale production', notes: 'Original vale production output connected to river, forest, hunt, repair, and trade loops.' }),
    });
}
