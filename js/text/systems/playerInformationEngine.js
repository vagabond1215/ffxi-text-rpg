import { getContainerDefinition, listContainerDefinitions } from '../data/inventoryContainers.js';
import { describeItemConsumption } from '../data/itemSchema.js';
import { getMap } from '../data/maps.js';
import { getPlace } from '../data/places.js';
import { listAbilityAvailability } from './abilityEngine.js';
import { listKnownCapabilities } from './capabilityEngine.js';
import { inferEquipmentSlot, validateEquipmentEligibility } from './equipmentEngine.js';
import { getContainerCapacity, isContainerAccessible } from './inventoryEngine.js';
import { getNavigationMode, listLocalityDestinations, listLocalityPoints } from './localityEngine.js';
import { getDiscoveredPoisForPlace } from './poiEngine.js';
import { listEffectiveSkillsForCurrentJob } from './skillProgressionEngine.js';

export const PLAYER_INFORMATION_VERSION = 1;

const LOCALITY_ACTION_PRIORITY = Object.freeze(['shop', 'guild', 'quest', 'storage', 'companion', 'travel', 'talk']);
const LOCALITY_ACTION_LABELS = Object.freeze({
    shop: 'Shop',
    guild: 'Guild',
    quest: 'Commission',
    storage: 'Storage',
    companion: 'Companion',
    travel: 'Travel Desk',
    talk: 'Talk',
});

export function createPlayerInformationModel(state, options = {}) {
    if (!state?.player) return emptyInformationModel(options.query);

    const preparation = createPreparationModel(state);
    const skills = createSkillModel(state);
    const capabilities = createCapabilityModel(state);
    const abilities = createAbilityModel(state);
    const knowledge = createKnowledgeModel(state);
    const local = createLocalModel(state);
    const searchable = buildSearchEntries({ preparation, skills, capabilities, abilities, knowledge, local });
    const search = createSearchModel(searchable, options.query);
    const actions = collectActions({ preparation, abilities, local, search });

    return Object.freeze({
        version: PLAYER_INFORMATION_VERSION,
        preparation,
        skills,
        capabilities,
        abilities,
        knowledge,
        local,
        search,
        actions: Object.freeze(actions),
    });
}

function createPreparationModel(state) {
    const inventoryState = state.player.inventoryState;
    const containers = listContainerDefinitions()
        .filter((definition) => inventoryState?.containers?.[definition.id]?.unlocked)
        .filter((definition) => isContainerAccessible(inventoryState, definition.id))
        .map((definition) => {
            const container = inventoryState.containers[definition.id];
            const items = (container.items ?? []).map((item, index) => toCarriedItem(state, item, definition.id, index));
            return Object.freeze({
                id: definition.id,
                label: definition.label,
                capacity: getContainerCapacity(inventoryState, definition.id),
                used: container.items?.length ?? 0,
                items: Object.freeze(items),
            });
        });

    const equipment = Object.entries(state.player.equipment ?? {})
        .filter(([, item]) => Boolean(item))
        .map(([slot, item]) => Object.freeze({
            id: `equipment:${slot}`,
            slot,
            slotLabel: formatLabel(slot),
            itemId: item.id,
            name: item.name ?? item.id,
            kind: item.kind ?? 'equipment',
            action: Object.freeze({
                id: `information:unequip:${slot}`,
                label: `Unequip ${item.name ?? item.id}`,
                intent: 'equipment.unequip',
                payload: Object.freeze({ slot, destinationContainerId: 'inventory' }),
            }),
        }));

    const itemCount = containers.reduce((sum, container) => sum + container.items.reduce((inner, item) => inner + item.quantity, 0), 0);
    return Object.freeze({
        gil: Math.max(0, Number(state.player.gil) || 0),
        itemCount,
        equipment: Object.freeze(equipment),
        containers: Object.freeze(containers),
    });
}

function toCarriedItem(state, item, containerId, index) {
    const slot = inferEquipmentSlot(item);
    const eligibility = slot ? validateEquipmentEligibility(state, item, slot) : null;
    const action = slot && eligibility?.ok
        ? Object.freeze({
            id: `information:equip:${containerId}:${item.id}:${index}`,
            label: `Equip ${item.name ?? item.id}`,
            intent: 'equipment.equip',
            payload: Object.freeze({ itemId: item.id, fromContainerId: containerId, slot }),
        })
        : null;
    return Object.freeze({
        id: `carried:${containerId}:${item.id}:${index}`,
        itemId: item.id,
        name: item.name ?? item.id,
        kind: item.kind ?? 'misc',
        quantity: Math.max(1, Number(item.quantity) || 1),
        containerId,
        containerLabel: getContainerDefinition(containerId)?.label ?? 'Inventory',
        slot,
        equipReady: Boolean(action),
        blocker: slot && !eligibility?.ok ? eligibility?.reason ?? 'Cannot equip now.' : null,
        consumptionLabel: item.consumption?.explicit ? describeItemConsumption(item) : null,
        action,
    });
}

function createSkillModel(state) {
    const entries = listEffectiveSkillsForCurrentJob(state.player)
        .map((entry) => Object.freeze({
            id: entry.skillId,
            name: formatLabel(entry.skillId),
            learned: entry.learned,
            cap: entry.cap,
            effective: entry.effective,
            rank: entry.rank ?? null,
            capped: Boolean(entry.cappedForCurrentJob),
        }));
    return Object.freeze({ entries: Object.freeze(entries) });
}

function createCapabilityModel(state) {
    const entries = listKnownCapabilities(state.player)
        .map((definition) => Object.freeze({
            id: definition.id,
            name: definition.name,
            kind: definition.type,
            description: definition.description ?? '',
        }));
    return Object.freeze({ entries: Object.freeze(entries) });
}

function createAbilityModel(state) {
    const entries = listAbilityAvailability(state)
        .filter((entry) => entry.known)
        .map((entry) => Object.freeze({
            id: entry.ability.id,
            name: entry.ability.name,
            kind: entry.ability.kind,
            schoolName: entry.school?.name ?? null,
            available: entry.available,
            reason: entry.reason ?? null,
            action: entry.available ? Object.freeze({
                id: `information:ability:${entry.ability.id}`,
                label: `Use ${entry.ability.name}`,
                intent: 'ability.activate',
                payload: Object.freeze({ abilityId: entry.ability.id }),
            }) : null,
        }));
    return Object.freeze({ entries: Object.freeze(entries) });
}

function createKnowledgeModel(state) {
    const maps = [...new Set(state.player.progression?.unlockedMaps ?? [])]
        .map((mapId) => getMap(mapId))
        .filter(Boolean)
        .map((map) => Object.freeze({ id: map.id, name: map.name, region: map.region ?? '' }));

    const places = Object.keys(state.atlas ?? {})
        .map((placeId) => getPlace(placeId))
        .filter(Boolean)
        .map((place) => Object.freeze({ id: place.id, name: place.name, region: place.region ?? '', type: place.type ?? '' }));

    const discoveredPois = [];
    const learnedPlaceIds = [...new Set(Object.values(state.localKnowledge?.pois ?? {}).map((entry) => entry.placeId))];
    for (const placeId of learnedPlaceIds) {
        const place = getPlace(placeId);
        for (const poi of getDiscoveredPoisForPlace(state, placeId)) {
            discoveredPois.push(Object.freeze({
                id: poi.id,
                name: poi.name,
                type: poi.type,
                placeId,
                placeName: place?.name ?? '',
                notes: poi.notes ?? '',
            }));
        }
    }

    return Object.freeze({
        maps: Object.freeze(maps),
        places: Object.freeze(places),
        discoveredPois: Object.freeze(discoveredPois),
    });
}

function createLocalModel(state) {
    if (getNavigationMode(state) !== 'locality') {
        return Object.freeze({ mode: 'exploration', points: Object.freeze([]), destinations: Object.freeze([]) });
    }

    const points = listLocalityPoints(state, { limit: 100 }).map((poi) => {
        const action = LOCALITY_ACTION_PRIORITY.find((candidate) => poi.actions.includes(candidate)) ?? 'talk';
        const primaryAction = poi.present
            ? Object.freeze({
                id: `information:local-poi:${poi.id}:${action}`,
                label: `${LOCALITY_ACTION_LABELS[action] ?? 'Use'} · ${poi.name}`,
                intent: 'locality.poi',
                payload: Object.freeze({ poiId: poi.id, action }),
            })
            : Object.freeze({
                id: `information:local-poi-visit:${poi.id}`,
                label: `${poi.knowledgeState === 'familiar' ? 'Go to' : 'Approach'} · ${poi.name}`,
                intent: 'locality.poi.visit',
                payload: Object.freeze({ poiId: poi.id }),
            });
        return Object.freeze({
            id: poi.id,
            name: poi.name,
            type: poi.type,
            notes: poi.notes ?? '',
            knowledgeState: poi.knowledgeState,
            familiarityPoints: poi.familiarityPoints,
            present: Boolean(poi.present),
            actions: Object.freeze([...(poi.actions ?? [])]),
            action: primaryAction,
        });
    });

    const destinations = listLocalityDestinations(state).map((destination) => Object.freeze({
        id: destination.id,
        name: destination.name,
        region: destination.region ?? '',
        travelSeconds: destination.travelSeconds,
        knowledgeState: destination.knowledgeState,
        navigationState: destination.navigationState,
        action: Object.freeze({
            id: `information:locality:${destination.id}`,
            label: `${destination.navigationState === 'familiar' ? 'Walk to' : 'Enter'} · ${destination.name}`,
            intent: 'locality.move',
            payload: Object.freeze({ destinationId: destination.id }),
        }),
    }));

    return Object.freeze({ mode: 'locality', points: Object.freeze(points), destinations: Object.freeze(destinations) });
}

function buildSearchEntries(model) {
    const entries = [];
    for (const item of model.preparation.equipment) {
        entries.push(searchEntry(`search:${item.id}`, 'Equipped', item.name, `${item.slotLabel} · equipped`, item.action, [item.slotLabel]));
    }
    for (const container of model.preparation.containers) {
        for (const item of container.items) {
            entries.push(searchEntry(`search:${item.id}`, 'Carried', item.name, `${item.quantity} · ${container.label}${item.consumptionLabel ? ` · ${item.consumptionLabel}` : ''}`, item.action, [item.kind, container.label, item.consumptionLabel]));
        }
    }
    for (const capability of model.capabilities.entries) {
        entries.push(searchEntry(`search:capability:${capability.id}`, 'Capability', capability.name, capability.description, viewAction('character', 'View capabilities'), [capability.kind]));
    }
    for (const ability of model.abilities.entries) {
        entries.push(searchEntry(`search:ability:${ability.id}`, 'Ability', ability.name, ability.schoolName ?? formatLabel(ability.kind), ability.action ?? viewAction('spellbook', 'Open Spellbook'), [ability.kind, ability.schoolName]));
    }
    for (const skill of model.skills.entries) {
        entries.push(searchEntry(`search:skill:${skill.id}`, 'Skill', skill.name, `Learned ${skill.learned} · effective ${skill.effective} / ${skill.cap}`, viewAction('character', 'View skills'), [skill.rank]));
    }
    for (const map of model.knowledge.maps) {
        entries.push(searchEntry(`search:map:${map.id}`, 'Map', map.name, map.region, viewAction('world', 'Open World'), [map.region]));
    }
    for (const place of model.knowledge.places) {
        entries.push(searchEntry(`search:place:${place.id}`, 'Visited place', place.name, place.region, viewAction('world', 'Open World'), [place.region, place.type]));
    }
    for (const poi of model.knowledge.discoveredPois) {
        entries.push(searchEntry(`search:known-poi:${poi.id}`, 'Known place', poi.name, poi.placeName, viewAction('world', 'Open World'), [poi.type, poi.notes]));
    }
    for (const destination of model.local.destinations) {
        entries.push(searchEntry(`search:locality:${destination.id}`, 'Nearby district', destination.name, formatDuration(destination.travelSeconds), destination.action, [destination.region]));
    }
    for (const poi of model.local.points) {
        entries.push(searchEntry(`search:local-poi:${poi.id}`, 'Here', poi.name, poi.notes, poi.action, [poi.type, ...(poi.actions ?? [])]));
    }
    return entries;
}

function createSearchModel(entries, rawQuery) {
    const query = String(rawQuery ?? '').trim();
    if (!query) return Object.freeze({ query: '', active: false, results: Object.freeze([]) });
    const terms = tokenize(query);
    const results = entries
        .map((entry) => ({ entry, score: scoreEntry(entry, terms) }))
        .filter((candidate) => candidate.score > 0)
        .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name))
        .slice(0, 12)
        .map((candidate) => candidate.entry);
    return Object.freeze({ query, active: true, results: Object.freeze(results) });
}

function scoreEntry(entry, terms) {
    const name = normalize(entry.name);
    const haystack = normalize(`${entry.category} ${entry.name} ${entry.detail} ${(entry.keywords ?? []).join(' ')}`);
    let score = 0;
    for (const term of terms) {
        if (!haystack.includes(term)) return 0;
        if (name === term) score += 100;
        else if (name.startsWith(term)) score += 40;
        else if (name.includes(term)) score += 20;
        else score += 5;
    }
    return score;
}

function searchEntry(id, category, name, detail, action, keywords = []) {
    return Object.freeze({
        id,
        category,
        name,
        detail: detail ?? '',
        keywords: Object.freeze(keywords.filter(Boolean).map(String)),
        action: action ?? null,
    });
}

function viewAction(view, label) {
    return Object.freeze({
        id: `information:view:${view}`,
        label,
        intent: 'ui.view.open',
        payload: Object.freeze({ view }),
    });
}

function collectActions(model) {
    const actions = [];
    for (const entry of model.preparation.equipment) if (entry.action) actions.push(entry.action);
    for (const container of model.preparation.containers) for (const entry of container.items) if (entry.action) actions.push(entry.action);
    for (const entry of model.abilities.entries) if (entry.action) actions.push(entry.action);
    for (const entry of model.local.points) if (entry.action) actions.push(entry.action);
    for (const entry of model.local.destinations) if (entry.action) actions.push(entry.action);
    for (const entry of model.search.results) if (entry.action) actions.push(entry.action);
    const seen = new Set();
    return actions.filter((action) => {
        if (seen.has(action.id)) return false;
        seen.add(action.id);
        return true;
    });
}

function emptyInformationModel(query) {
    const empty = Object.freeze([]);
    return Object.freeze({
        version: PLAYER_INFORMATION_VERSION,
        preparation: Object.freeze({ gil: 0, itemCount: 0, equipment: empty, containers: empty }),
        skills: Object.freeze({ entries: empty }),
        capabilities: Object.freeze({ entries: empty }),
        abilities: Object.freeze({ entries: empty }),
        knowledge: Object.freeze({ maps: empty, places: empty, discoveredPois: empty }),
        local: Object.freeze({ mode: 'exploration', points: empty, destinations: empty }),
        search: Object.freeze({ query: String(query ?? '').trim(), active: Boolean(String(query ?? '').trim()), results: empty }),
        actions: empty,
    });
}

function tokenize(value) {
    return normalize(value).split(/\s+/).filter(Boolean);
}

function normalize(value) {
    return String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function formatLabel(value) {
    return String(value ?? '')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[_-]+/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDuration(seconds) {
    const total = Math.max(0, Math.floor(Number(seconds) || 0));
    if (total >= 3600 && total % 3600 === 0) return `${total / 3600} hour${total === 3600 ? '' : 's'}`;
    if (total >= 60 && total % 60 === 0) return `${total / 60} minute${total === 60 ? '' : 's'}`;
    return `${total} seconds`;
}
