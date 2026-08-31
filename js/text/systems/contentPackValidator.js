import {
    ABILITY_CONTEXTS,
    ABILITY_EFFECT_TYPES,
    ABILITY_KINDS,
    ABILITY_RESOURCE_KEYS,
    ABILITY_SCALING_STATS,
    ABILITY_TARGET_KINDS,
} from '../data/abilities.js';
import {
    CAPABILITY_CONTEXTS,
    CAPABILITY_TYPES,
} from '../data/capabilities.js';
import {
    getContentCatalogEntry,
    hasContentCatalogResolver,
    validateConnectedContentCatalogs,
} from '../data/contentCatalogRegistry.js';
import {
    CONTENT_PACK_COLLECTIONS,
    listContentPackRecords,
    validateContentPackManifest,
} from '../data/contentPackSchema.js';
import { JOB_DEFINITIONS } from '../data/jobs.js';
import {
    LEGACY_DISCIPLINE_IDS,
    LEGACY_ENEMY_IDS,
    LEGACY_MAP_IDS,
    LEGACY_NATION_IDS,
    LEGACY_PLACE_IDS,
    LEGACY_RACE_IDS,
} from '../data/legacyIdentity.js';
import { validateNpcScheduleDefinition } from '../data/npcSchedules.js';
import { validateItemResourceMetadata } from '../data/resourceProvenance.js';
import { SKILL_KEYS } from '../data/systemConstants.js';

export const CONTENT_PACK_VALIDATOR_VERSION = 3;

const LEGACY_IDS = new Set([
    ...Object.keys(LEGACY_NATION_IDS),
    ...Object.keys(LEGACY_RACE_IDS),
    ...Object.keys(LEGACY_DISCIPLINE_IDS),
    ...Object.keys(LEGACY_PLACE_IDS),
    ...Object.keys(LEGACY_MAP_IDS),
    ...Object.keys(LEGACY_ENEMY_IDS),
]);

const LEGACY_PREFIXES = Object.freeze([
    'poi-sandoria',
    'poi-bastok',
    'poi-waters',
    'poi-port-bastok',
]);

const CATALOG_REF_CROSS_REFERENCE_COLLECTIONS = new Set([
    'abilities',
    'quests',
    'npcSchedules',
    'companions',
]);

export function validateContentPacks(packs, options = {}) {
    const issues = [];
    if (!Array.isArray(packs)) return ['content packs must be an array.'];

    const context = buildContext(packs);
    issues.push(...context.issues);

    if (options.includeCanonicalCatalogs !== false) {
        issues.push(...validateConnectedContentCatalogs());
    }

    for (const pack of packs) {
        if (!pack || typeof pack !== 'object' || Array.isArray(pack)) continue;
        for (const issue of validateContentPackManifest(pack)) issues.push(`[${pack.id || 'pack'}] ${issue}`);
        validateDependencies(pack, context, issues);
        validateLegacyLeaks(pack, issues);
        validatePackRecords(pack, context, issues);
    }

    return [...new Set(issues)];
}

export function buildContentPackIndex(packs) {
    const context = buildContext(Array.isArray(packs) ? packs : []);
    return Object.freeze({
        packIds: Object.freeze([...context.packById.keys()]),
        recordCounts: Object.freeze(Object.fromEntries(
            CONTENT_PACK_COLLECTIONS.map((collection) => [collection, context.recordsByCollection.get(collection)?.size ?? 0]),
        )),
        ownerCount: context.ownerByKey.size,
        issues: Object.freeze([...context.issues]),
    });
}

function buildContext(packs) {
    const issues = [];
    const packById = new Map();
    const recordsByCollection = new Map(CONTENT_PACK_COLLECTIONS.map((collection) => [collection, new Map()]));
    const ownerByKey = new Map();
    const globalOwnerById = new Map();

    for (const pack of packs) {
        if (!pack || typeof pack !== 'object' || Array.isArray(pack)) {
            issues.push('content pack entry must be an object.');
            continue;
        }
        if (packById.has(pack.id)) issues.push(`duplicate content pack id ${pack.id}.`);
        else packById.set(pack.id, pack);

        for (const { collection, record } of listContentPackRecords(pack)) {
            if (!record || typeof record !== 'object' || Array.isArray(record) || typeof record.id !== 'string') continue;
            const key = recordKey(collection, record.id);
            const priorOwner = ownerByKey.get(key);
            if (priorOwner && priorOwner !== pack.id) {
                issues.push(`stable-id ownership conflict for ${collection}:${record.id} between ${priorOwner} and ${pack.id}.`);
            } else {
                ownerByKey.set(key, pack.id);
            }

            const priorGlobal = globalOwnerById.get(record.id);
            if (priorGlobal && priorGlobal.collection !== collection) {
                issues.push(`canonical id ${record.id} is reused across ${priorGlobal.collection} and ${collection}.`);
            } else if (!priorGlobal) {
                globalOwnerById.set(record.id, { collection, packId: pack.id });
            }

            const collectionIndex = recordsByCollection.get(collection);
            if (!collectionIndex.has(record.id)) collectionIndex.set(record.id, record);
        }
    }

    return { issues, packById, recordsByCollection, ownerByKey };
}

function validateDependencies(pack, context, issues) {
    for (const dependencyId of pack.dependencies ?? []) {
        if (dependencyId === pack.id) issues.push(`[${pack.id}] content pack cannot depend on itself.`);
        else if (!context.packById.has(dependencyId)) issues.push(`[${pack.id}] missing dependency ${dependencyId}.`);
    }

    const visited = new Set();
    const active = new Set();
    const visit = (packId) => {
        if (active.has(packId)) return true;
        if (visited.has(packId)) return false;
        visited.add(packId);
        active.add(packId);
        const candidate = context.packById.get(packId);
        for (const dependencyId of candidate?.dependencies ?? []) {
            if (context.packById.has(dependencyId) && visit(dependencyId)) return true;
        }
        active.delete(packId);
        return false;
    };
    if (visit(pack.id)) issues.push(`[${pack.id}] content pack dependencies contain a cycle.`);
}

function validateLegacyLeaks(pack, issues) {
    const allowed = new Set((pack.legacyAdapters ?? []).map((entry) => entry.legacyId));
    for (const token of collectIdentifierValues(pack)) {
        if (allowed.has(token.value)) continue;
        if (isLegacyIdentifier(token.value)) {
            issues.push(`[${pack.id}] legacy identifier ${token.value} leaks into canonical pack at ${token.path}.`);
        }
    }
}

function validatePackRecords(pack, context, issues) {
    for (const { collection, record } of listContentPackRecords(pack)) {
        const label = `[${pack.id}] ${collection}:${record?.id ?? 'unknown'}`;
        if (!record || typeof record !== 'object' || Array.isArray(record)) continue;

        if (record.catalogRef === true) {
            if (!hasContentCatalogResolver(collection)) {
                issues.push(`${label} cannot be a catalogRef because ${collection} has no canonical resolver.`);
                continue;
            }
            const resolved = getContentCatalogEntry(collection, record.id);
            if (!resolved) {
                issues.push(`${label} references a missing canonical catalog record.`);
                continue;
            }
            if (CATALOG_REF_CROSS_REFERENCE_COLLECTIONS.has(collection)) {
                validatePackRecord(pack, collection, resolved, context, issues, label);
            }
            continue;
        }

        validatePackRecord(pack, collection, record, context, issues, label);
    }
}

function validatePackRecord(pack, collection, record, context, issues, label) {
    if (collection === 'routes') validateRouteRecord(pack, record, context, issues, label);
    else if (collection === 'transportServices') validateTransportRecord(pack, record, context, issues, label);
    else if (collection === 'species') validateSpeciesRecord(pack, record, context, issues, label);
    else if (collection === 'populations') validatePopulationRecord(pack, record, context, issues, label);
    else if (collection === 'gatheringSources') validateGatheringSourceRecord(pack, record, context, issues, label);
    else if (collection === 'items') validateItemRecord(pack, record, context, issues, label);
    else if (collection === 'npcs') validateNpcRecord(pack, record, context, issues, label);
    else if (collection === 'shops') validateShopRecord(pack, record, context, issues, label);
    else if (collection === 'recipes') validateRecipeRecord(pack, record, context, issues, label);
    else if (collection === 'quests') validateQuestRecord(pack, record, context, issues, label);
    else if (collection === 'relationships') validateRelationshipRecord(pack, record, context, issues, label);
    else if (collection === 'spellSchools') validateSpellSchoolRecord(record, issues, label);
    else if (collection === 'capabilities') validateCapabilityRecord(record, issues, label);
    else if (collection === 'abilities') validateAbilityRecord(pack, record, context, issues, label);
    else if (collection === 'npcSchedules') validateNpcScheduleRecord(pack, record, context, issues, label);
    else if (collection === 'companions') validateCompanionRecord(pack, record, context, issues, label);
}

function validateRouteRecord(pack, route, context, issues, label) {
    if (!Array.isArray(route.stops) || route.stops.length < 2) issues.push(`${label} requires at least two stops.`);
    const stopIds = new Set();
    for (const stop of route.stops ?? []) {
        if (!stop?.id || stopIds.has(stop.id)) issues.push(`${label} has missing or duplicate stop id ${stop?.id}.`);
        stopIds.add(stop?.id);
        requireRef(pack, 'places', stop?.placeId, `${label} stop ${stop?.id}`, context, issues);
    }
    if (!Array.isArray(route.segments) || route.segments.length !== Math.max(0, (route.stops?.length ?? 0) - 1)) {
        issues.push(`${label} segment count must equal stops - 1.`);
    }
    for (const segment of route.segments ?? []) {
        if (!stopIds.has(segment?.fromStopId) || !stopIds.has(segment?.toStopId)) issues.push(`${label} segment references an unknown stop.`);
        if (!positiveInteger(segment?.durationSeconds)) issues.push(`${label} segment durationSeconds must be positive.`);
    }
}

function validateTransportRecord(pack, service, context, issues, label) {
    const route = resolveRef('routes', service.routeId, context);
    requireRef(pack, 'routes', service.routeId, label, context, issues);
    if (!Array.isArray(service.stopIds) || service.stopIds.length < 2) issues.push(`${label} requires at least two stopIds.`);
    if (route) {
        const routeStopIds = new Set((route.stops ?? []).map((entry) => entry.id));
        for (const stopId of service.stopIds ?? []) {
            if (!routeStopIds.has(stopId)) issues.push(`${label} references unknown route stop ${stopId}.`);
        }
    }
    if (!positiveInteger(service.cadenceSeconds)) issues.push(`${label} cadenceSeconds must be positive.`);
}

function validateSpeciesRecord(pack, species, context, issues, label) {
    requireRef(pack, 'ecologyFamilies', species.familyId, label, context, issues);
}

function validatePopulationRecord(pack, population, context, issues, label) {
    requireRef(pack, 'species', population.speciesId, label, context, issues);
    requireRef(pack, 'places', population.placeId, label, context, issues);
    if (!positiveInteger(population.capacity)) issues.push(`${label} capacity must be positive.`);
}

function validateGatheringSourceRecord(pack, source, context, issues, label) {
    requireRef(pack, 'places', source.placeId, label, context, issues);
    requireRef(pack, 'items', source.outputItemId, label, context, issues);
}

function validateItemRecord(pack, item, context, issues, label) {
    const exemptSource = item.exemptions?.source === true;
    const exemptSink = item.exemptions?.sink === true;
    for (const issue of validateItemResourceMetadata(item, { requireSource: !exemptSource, requireSink: !exemptSink })) {
        issues.push(`${label} ${issue}`);
    }
    for (const provenance of item.provenance ?? []) {
        if (provenance.placeId) requireRef(pack, 'places', provenance.placeId, `${label} provenance`, context, issues);
        if (!provenance.sourceId) continue;
        const collection = provenance.type === 'crafting'
            ? 'recipes'
            : ['flora', 'mineral', 'fishing'].includes(provenance.type)
                ? 'gatheringSources'
                : provenance.type === 'contract'
                    ? 'quests'
                    : null;
        if (collection) requireRef(pack, collection, provenance.sourceId, `${label} provenance`, context, issues);
    }
    for (const sink of item.sinks ?? []) {
        if (!sink.targetId) continue;
        if (['contract', 'quest'].includes(sink.type)) requireRef(pack, 'quests', sink.targetId, `${label} sink`, context, issues);
        if (['craftIngredient', 'processInput'].includes(sink.type)) requireRef(pack, 'recipes', sink.targetId, `${label} sink`, context, issues);
    }
}

function validateNpcRecord(pack, npc, context, issues, label) {
    const placeId = npc.placeId ?? npc.locationId;
    requireRef(pack, 'places', placeId, label, context, issues);
}

function validateShopRecord(pack, shop, context, issues, label) {
    requireRef(pack, 'places', shop.placeId, label, context, issues);
    requireRef(pack, 'npcs', shop.keeperNpcId, label, context, issues);
    if (!Array.isArray(shop.stockItemIds)) issues.push(`${label} stockItemIds must be an array.`);
    for (const itemId of shop.stockItemIds ?? []) requireRef(pack, 'items', itemId, label, context, issues);
}

function validateRecipeRecord(pack, recipe, context, issues, label) {
    for (const placeId of recipe.placeIds ?? []) requireRef(pack, 'places', placeId, label, context, issues);
    if (!Array.isArray(recipe.inputs) || recipe.inputs.length === 0) issues.push(`${label} requires at least one input.`);
    if (!Array.isArray(recipe.outputs) || recipe.outputs.length === 0) issues.push(`${label} requires at least one output.`);
    for (const entry of [...(recipe.inputs ?? []), ...(recipe.outputs ?? [])]) {
        requireRef(pack, 'items', entry?.itemId, label, context, issues);
        if (!positiveInteger(entry?.quantity)) issues.push(`${label} item quantity must be positive.`);
    }
}

function validateQuestRecord(pack, quest, context, issues, label) {
    if (Array.isArray(quest.requiredItems)) {
        validateCommitmentQuestRecord(pack, quest, context, issues, label);
        return;
    }

    requireRef(pack, 'npcs', quest.giverNpcId, label, context, issues);
    requireRef(pack, 'places', quest.placeId, label, context, issues);
    if (!Array.isArray(quest.objectives) || quest.objectives.length === 0) issues.push(`${label} requires objectives.`);
    for (const objective of quest.objectives ?? []) {
        if (objective.itemId) requireRef(pack, 'items', objective.itemId, `${label} objective`, context, issues);
        if (objective.placeId) requireRef(pack, 'places', objective.placeId, `${label} objective`, context, issues);
        if (objective.quantity !== undefined && !positiveInteger(objective.quantity)) issues.push(`${label} objective quantity must be positive.`);
    }
    for (const reward of quest.rewards ?? []) {
        if (reward.type === 'item') requireRef(pack, 'items', reward.itemId, `${label} reward`, context, issues);
        if (reward.type === 'quest') requireRef(pack, 'quests', reward.questId, `${label} reward`, context, issues);
    }
}

function validateCommitmentQuestRecord(pack, commitment, context, issues, label) {
    requireRef(pack, 'npcs', commitment.giverNpcId, label, context, issues);
    requireRef(pack, 'places', commitment.offerPlaceId, label, context, issues);
    if (commitment.returnViaPlaceId) requireRef(pack, 'places', commitment.returnViaPlaceId, `${label} return`, context, issues);
    if (commitment.fieldSourceId) requireRef(pack, 'gatheringSources', commitment.fieldSourceId, `${label} field source`, context, issues);
    if (!Array.isArray(commitment.prerequisiteCommitmentIds)) issues.push(`${label}.prerequisiteCommitmentIds must be an array.`);
    for (const prerequisiteId of commitment.prerequisiteCommitmentIds ?? []) requireRef(pack, 'quests', prerequisiteId, `${label} prerequisite`, context, issues);
    if (!Array.isArray(commitment.requiredItems) || commitment.requiredItems.length === 0) issues.push(`${label} requires delivered items.`);
    for (const requirement of commitment.requiredItems ?? []) {
        requireRef(pack, 'items', requirement.itemId, `${label} requirement`, context, issues);
        if (!positiveInteger(requirement.quantity)) issues.push(`${label} requirement quantity must be positive.`);
    }
    if (commitment.reward?.capabilityId) {
        requireRef(pack, 'capabilities', commitment.reward.capabilityId, `${label} capability reward`, context, issues);
    }
}

function validateRelationshipRecord(pack, relationship, context, issues, label) {
    requireRef(pack, 'npcs', relationship.npcId, label, context, issues);
    for (const questId of relationship.unlockQuestIds ?? []) requireRef(pack, 'quests', questId, label, context, issues);
    if (!Array.isArray(relationship.dimensions) || relationship.dimensions.length === 0) issues.push(`${label} requires at least one relationship dimension.`);
}

function validateSpellSchoolRecord(record, issues, label) {
    if (!stableId(record.id, 'school-')) issues.push(`${label} id must be a stable school id.`);
    if (!String(record.name ?? '').trim()) issues.push(`${label} requires a name.`);
    if (!String(record.tradition ?? '').trim()) issues.push(`${label} requires a tradition.`);
    if (!Array.isArray(record.tags)) issues.push(`${label} tags must be an array.`);
}

function validateCapabilityRecord(record, issues, label) {
    if (!stableId(record.id)) issues.push(`${label} id must be stable.`);
    if (!String(record.name ?? '').trim()) issues.push(`${label} requires a name.`);
    if (!CAPABILITY_TYPES.includes(record.type)) issues.push(`${label} has unknown type ${record.type}.`);
    if (!Array.isArray(record.tags)) issues.push(`${label} tags must be an array.`);

    const learning = record.learning ?? {};
    if (learning.open !== true && !(learning.anyDiscipline?.length)) issues.push(`${label} requires an open or discipline learning path.`);
    for (const requirement of learning.anyDiscipline ?? []) {
        if (!JOB_DEFINITIONS[requirement.disciplineId]) issues.push(`${label} learning references unknown discipline ${requirement.disciplineId}.`);
        if (!positiveInteger(requirement.minLevel)) issues.push(`${label} has invalid learning level for ${requirement.disciplineId}.`);
    }

    const use = record.use ?? {};
    for (const contextId of use.contexts ?? []) {
        if (!CAPABILITY_CONTEXTS.includes(contextId)) issues.push(`${label} references unknown context ${contextId}.`);
    }
    for (const requirement of use.requiredSkills ?? []) {
        if (!SKILL_KEYS.includes(requirement.skillId)) issues.push(`${label} use references unknown skill ${requirement.skillId}.`);
        if (!positiveInteger(requirement.min)) issues.push(`${label} has invalid minimum for skill ${requirement.skillId}.`);
    }
    for (const field of ['mainHandTags', 'requiredToolTags', 'requiredPreparationTags', 'requiredFlags']) {
        if (!Array.isArray(use[field])) issues.push(`${label} use.${field} must be an array.`);
    }
    for (const [resourceId, amount] of Object.entries(use.resources ?? {})) {
        if (!ABILITY_RESOURCE_KEYS.includes(resourceId)) issues.push(`${label} references unknown resource ${resourceId}.`);
        if (!nonNegativeInteger(amount)) issues.push(`${label} has invalid ${resourceId} resource requirement.`);
    }
}

function validateAbilityRecord(pack, record, context, issues, label) {
    if (!stableId(record.id, 'ability-')) issues.push(`${label} id must be a stable ability id.`);
    if (!String(record.name ?? '').trim()) issues.push(`${label} requires a name.`);
    if (!ABILITY_KINDS.includes(record.kind)) issues.push(`${label} has unknown kind ${record.kind}.`);
    if (record.kind === 'spell' && !record.schoolId) issues.push(`${label} spell requires schoolId.`);
    if (record.schoolId) requireRef(pack, 'spellSchools', record.schoolId, label, context, issues);
    requireRef(pack, 'capabilities', record.capabilityId, label, context, issues);
    if (!Array.isArray(record.tags)) issues.push(`${label} tags must be an array.`);
    if (!Array.isArray(record.contexts) || record.contexts.length === 0) issues.push(`${label} contexts must be a non-empty array.`);
    for (const contextId of record.contexts ?? []) {
        if (!ABILITY_CONTEXTS.includes(contextId)) issues.push(`${label} references unknown context ${contextId}.`);
    }
    if (!ABILITY_TARGET_KINDS.includes(record.target?.kind)) issues.push(`${label} has invalid target kind ${record.target?.kind}.`);
    if (!nonNegativeInteger(record.activation?.durationSeconds)) issues.push(`${label} activation duration must be a non-negative integer.`);
    if (typeof record.activation?.interruptible !== 'boolean') issues.push(`${label} activation interruptible must be boolean.`);
    if (!nonNegativeInteger(record.cooldownSeconds)) issues.push(`${label} cooldownSeconds must be a non-negative integer.`);
    for (const [resourceId, amount] of Object.entries(record.costs ?? {})) {
        if (!ABILITY_RESOURCE_KEYS.includes(resourceId)) issues.push(`${label} references unknown cost resource ${resourceId}.`);
        if (!nonNegativeInteger(amount)) issues.push(`${label} has invalid ${resourceId} cost.`);
    }
    if (!Array.isArray(record.effects) || record.effects.length === 0) issues.push(`${label} effects must be a non-empty array.`);
    for (const [index, effect] of (record.effects ?? []).entries()) validateAbilityEffect(effect, `${label}.effects[${index}]`, issues);
}

function validateAbilityEffect(effect, label, issues) {
    if (!plainObject(effect)) {
        issues.push(`${label} must be an object.`);
        return;
    }
    if (!ABILITY_EFFECT_TYPES.includes(effect.type)) issues.push(`${label} has unknown type ${effect.type}.`);
    if (!['self', 'target', 'context'].includes(effect.recipient)) issues.push(`${label} has invalid recipient ${effect.recipient}.`);
    if (effect.type === 'damage' || effect.type === 'heal') {
        if (!ABILITY_SCALING_STATS.includes(effect.stat)) issues.push(`${label} has invalid scaling stat ${effect.stat}.`);
        if (!nonNegativeNumber(effect.base)) issues.push(`${label} base must be non-negative.`);
        if (!nonNegativeNumber(effect.coefficient)) issues.push(`${label} coefficient must be non-negative.`);
    }
    if (effect.type === 'status') {
        const status = effect.status;
        if (!plainObject(status)) issues.push(`${label}.status must be an object.`);
        else {
            if (!stableId(status.id, 'status-')) issues.push(`${label}.status.id is invalid.`);
            if (!positiveInteger(status.durationSeconds)) issues.push(`${label}.status.durationSeconds must be positive.`);
            if (!status.stackGroup) issues.push(`${label}.status.stackGroup is required.`);
            if (!['replace', 'ignore', 'stack'].includes(status.stackRule)) issues.push(`${label}.status.stackRule is invalid.`);
        }
    }
    if (effect.type === 'context' && !effect.operation) issues.push(`${label}.operation is required.`);
}

function validateNpcScheduleRecord(pack, record, context, issues, label) {
    for (const issue of validateNpcScheduleDefinition(record)) issues.push(`${label} ${issue}`);
    requireRef(pack, 'npcs', record.npcId, label, context, issues);
    requireRef(pack, 'places', record.placeId, label, context, issues);
    // POI ownership is still a separate transitional catalog. Pack v2 validates the stable POI shape
    // through the schedule definition but does not invent a second POI authority merely for packing.
}

function validateCompanionRecord(pack, record, context, issues, label) {
    if (!stableId(record.id, 'companion-')) issues.push(`${label} id must be a stable companion id.`);
    requireRef(pack, 'npcs', record.npcId, label, context, issues);
    requireRef(pack, 'places', record.homePlaceId, label, context, issues);
    if (!String(record.name ?? '').trim()) issues.push(`${label}.name is required.`);
    if (!String(record.description ?? '').trim()) issues.push(`${label}.description is required.`);
    if (!positiveInteger(record.level)) issues.push(`${label}.level must be positive.`);
    if (!Array.isArray(record.recruitment?.placeIds) || record.recruitment.placeIds.length === 0) issues.push(`${label} requires recruitment places.`);
    for (const placeId of record.recruitment?.placeIds ?? []) requireRef(pack, 'places', placeId, `${label} recruitment`, context, issues);
    if (!Array.isArray(record.recruitment?.requiredFlags)) issues.push(`${label}.recruitment.requiredFlags must be an array.`);
    if (!Array.isArray(record.recruitment?.requiredCommitmentIds)) issues.push(`${label}.recruitment.requiredCommitmentIds must be an array.`);
    for (const commitmentId of record.recruitment?.requiredCommitmentIds ?? []) requireRef(pack, 'quests', commitmentId, `${label} recruitment`, context, issues);
    if (!Array.isArray(record.relationshipDimensions) || record.relationshipDimensions.length === 0) issues.push(`${label} requires relationship dimensions.`);
    if (!record.tactics?.policy) issues.push(`${label} requires a tactics policy.`);
    if (!stableId(record.tactics?.defaultApproachId)) issues.push(`${label} requires a default field approach.`);
    if (!Array.isArray(record.fieldApproaches) || record.fieldApproaches.length < 2) issues.push(`${label} requires at least two field approaches.`);
    const approachIds = new Set();
    for (const approach of record.fieldApproaches ?? []) {
        if (!stableId(approach.id)) issues.push(`${label} has invalid field approach id ${String(approach.id)}.`);
        if (approachIds.has(approach.id)) issues.push(`${label} duplicates field approach ${approach.id}.`);
        approachIds.add(approach.id);
        if (!approach.name || !approach.summary || !approach.quote) issues.push(`${label}.${approach.id} requires player-facing name, summary, and quote.`);
        if (!plainObject(approach.attributeModifiers)) issues.push(`${label}.${approach.id}.attributeModifiers must be an object.`);
        else for (const [attribute, modifier] of Object.entries(approach.attributeModifiers)) {
            if (!ABILITY_SCALING_STATS.includes(attribute) || !Number.isInteger(modifier)) issues.push(`${label}.${approach.id} has invalid attribute modifier ${attribute}.`);
        }
    }
    if (record.tactics?.defaultApproachId && !approachIds.has(record.tactics.defaultApproachId)) {
        issues.push(`${label}.tactics.defaultApproachId must reference a field approach.`);
    }
}

function requireRef(pack, collection, id, label, context, issues) {
    if (!id || !resolveRef(collection, id, context)) {
        issues.push(`${label} references missing ${collection} id ${id}.`);
        return;
    }
    const owner = context.ownerByKey.get(recordKey(collection, id));
    if (!owner || owner === pack.id) return;
    const dependencies = transitiveDependencies(pack.id, context);
    if (!dependencies.has(owner)) {
        issues.push(`${label} references ${collection}:${id} owned by ${owner} without declaring it as a dependency.`);
    }
}

function resolveRef(collection, id, context) {
    if (!id) return null;
    const packRecord = context.recordsByCollection.get(collection)?.get(id);
    if (packRecord) {
        if (packRecord.catalogRef === true) return getContentCatalogEntry(collection, id);
        return packRecord;
    }
    return getContentCatalogEntry(collection, id);
}

function transitiveDependencies(packId, context) {
    const result = new Set();
    const pending = [...(context.packById.get(packId)?.dependencies ?? [])];
    while (pending.length) {
        const dependencyId = pending.shift();
        if (result.has(dependencyId)) continue;
        result.add(dependencyId);
        pending.push(...(context.packById.get(dependencyId)?.dependencies ?? []));
    }
    return result;
}

function collectIdentifierValues(value, path = 'pack', key = '') {
    const results = [];
    if (Array.isArray(value)) {
        for (const [index, entry] of value.entries()) results.push(...collectIdentifierValues(entry, `${path}[${index}]`, key));
        return results;
    }
    if (!value || typeof value !== 'object') {
        if (typeof value === 'string' && /(^id$|ids$|id$)/i.test(key)) results.push({ value, path });
        return results;
    }
    for (const [childKey, childValue] of Object.entries(value)) {
        results.push(...collectIdentifierValues(childValue, `${path}.${childKey}`, childKey));
    }
    return results;
}

function isLegacyIdentifier(value) {
    return LEGACY_IDS.has(value) || LEGACY_PREFIXES.some((prefix) => String(value).startsWith(prefix));
}

function recordKey(collection, id) {
    return `${collection}:${id}`;
}

function stableId(value, prefix = '') {
    return typeof value === 'string'
        && (!prefix || value.startsWith(prefix))
        && /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(value);
}

function positiveInteger(value) {
    return Number.isInteger(value) && value > 0;
}

function nonNegativeInteger(value) {
    return Number.isInteger(value) && value >= 0;
}

function nonNegativeNumber(value) {
    return Number.isFinite(Number(value)) && Number(value) >= 0;
}

function plainObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
