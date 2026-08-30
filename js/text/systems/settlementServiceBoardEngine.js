import { getProductionInputItem, listProductionDefinitions } from '../data/productionCatalog.js';
import { getProductionItem } from '../data/productionItems.js';
import { getPoisForPlace } from '../data/pointsOfInterest.js';
import { getKnownPoisForPlace, getPlayerFacingPoiName } from './localKnowledgeEngine.js';
import { getShopCatalogForPoi } from '../data/shopCatalogs.js';
import { createCampaignRecoveryModel } from './campaignRecoveryEngine.js';
import { calculateSellValue, canSellItem } from './itemBehaviorEngine.js';
import { isSettlementLocality } from './localityEngine.js';
import { checkProductionRequirements } from './productionEngine.js';
import { findCurrentShopPoi } from './shopEngine.js';
import {
    collectAvailableWorkstationTags,
    collectHomeWorkstationTags,
    getWorkstationTagsForPoi,
} from './workstationEngine.js';
import { workDurationForProficiency } from './workProficiencyEngine.js';

export const SETTLEMENT_SERVICE_BOARD_VERSION = 2;

export function createSettlementServiceBoard(state) {
    const placeId = state?.currentPlaceId ?? null;
    if (!state?.player || !isSettlementLocality(placeId)) return emptyBoard(placeId);

    const actions = [];
    const localPois = state
        ? getKnownPoisForPlace(state, placeId).map((poi) => ({ ...poi, name: getPlayerFacingPoiName(state, poi) }))
        : getPoisForPlace(placeId);
    const workshopPois = localPois
        .map((poi) => ({ poi, stationTags: getWorkstationTagsForPoi(poi) }))
        .filter((entry) => entry.stationTags.length > 0);
    const currentStationTags = new Set(collectAvailableWorkstationTags(state));
    const homeStationTags = new Set(collectHomeWorkstationTags(state));
    const localStationTags = new Set([
        ...workshopPois.flatMap((entry) => entry.stationTags),
        ...homeStationTags,
    ]);
    const currentShopPoi = findCurrentShopPoi(state);
    const currentShopCatalog = currentShopPoi ? getShopCatalogForPoi(currentShopPoi.id) : null;

    const workshops = workshopPois.map(({ poi, stationTags }) => {
        const action = createAction(
            `settlement:workshop:${poi.id}`,
            `Visit · ${poi.name}`,
            'locality.poi.visit',
            { poiId: poi.id },
            'work',
        );
        actions.push(action);
        return Object.freeze({
            poiId: poi.id,
            name: poi.name,
            stationTags: Object.freeze([...stationTags]),
            current: stationTags.some((tag) => currentStationTags.has(tag)),
            action,
        });
    });

    const homeWorkshop = homeStationTags.size
        ? Object.freeze({
            name: 'Your lodging workshop',
            stationTags: Object.freeze(Array.from(homeStationTags)),
            current: true,
        })
        : null;

    const localShops = localPois
        .filter((poi) => poi.actions.includes('shop') && getShopCatalogForPoi(poi.id))
        .map((poi) => {
            const catalog = getShopCatalogForPoi(poi.id);
            const current = currentShopPoi?.id === poi.id;
            const action = current ? null : createAction(
                `settlement:shop:${poi.id}`,
                `Visit · ${poi.name}`,
                'locality.poi.visit',
                { poiId: poi.id },
                'trade',
            );
            if (action) actions.push(action);
            return Object.freeze({
                poiId: poi.id,
                name: poi.name,
                catalogName: catalog.name,
                current,
                action,
            });
        });

    const production = listProductionDefinitions()
        .filter((definition) => definition.requiredStationTags.every((tag) => localStationTags.has(tag)))
        .map((definition) => createProductionEntry(state, definition, workshopPois, currentStationTags, actions));

    const trade = createTradeModel(state, currentShopPoi, currentShopCatalog, localShops, actions);
    const recovery = createRecoveryEntry(state, actions);

    return Object.freeze({
        version: SETTLEMENT_SERVICE_BOARD_VERSION,
        available: true,
        placeId,
        walletGil: Math.max(0, Number(state.player.wallet?.gil) || 0),
        currentStationTags: Object.freeze(Array.from(currentStationTags)),
        homeWorkshop,
        workshops: Object.freeze(workshops),
        production: Object.freeze(production),
        trade,
        recovery,
        actions: Object.freeze(actions),
    });
}

function createProductionEntry(state, definition, workshopPois, currentStationTags, actions) {
    const activeRecord = (state.work?.records ?? [])
        .find((record) => record.data?.processId === definition.id && ['active', 'awaitingStorage'].includes(record.status));
    const check = checkProductionRequirements(state, definition);
    const proficiency = Math.max(0, Number(check.proficiency) || 0);
    const missingStationTags = definition.requiredStationTags.filter((tag) => !currentStationTags.has(tag));
    const target = missingStationTags.length
        ? workshopPois.find(({ stationTags }) => missingStationTags.every((tag) => stationTags.includes(tag)))?.poi ?? null
        : null;
    const inputs = definition.inputs.map((input) => {
        const item = getProductionInputItem(input.itemId);
        return Object.freeze({
            itemId: input.itemId,
            name: item?.name ?? input.itemId,
            requiredQuantity: input.quantity,
            carriedQuantity: carriedQuantity(state, input.itemId),
            estimatedSellGil: (item ? calculateSellValue(item) : 0) * input.quantity,
        });
    });
    const outputs = definition.outputs.map((output) => {
        const item = getProductionItem(output.itemId);
        return Object.freeze({
            itemId: output.itemId,
            name: item?.name ?? output.itemId,
            quantity: output.quantity,
            estimatedSellGil: (item ? calculateSellValue(item) : 0) * output.quantity,
            sinks: Object.freeze((item?.sinks ?? []).map((sink) => sink.type)),
        });
    });

    let status = check.ok ? 'ready' : 'blocked';
    let action = null;
    if (activeRecord?.status === 'active') {
        status = 'active';
        action = createAction(
            `settlement:production:advance:${activeRecord.id}`,
            `Finish · ${definition.name}`,
            'activity.advanceToCompletion',
            {},
            'work',
        );
    } else if (activeRecord?.status === 'awaitingStorage') {
        status = 'awaitingStorage';
        action = createAction(
            `settlement:production:claim:${activeRecord.id}`,
            'Claim finished goods',
            'production.claimOutputs',
            { workId: activeRecord.id },
            'work',
        );
    } else if (check.ok) {
        action = createAction(
            `settlement:production:start:${definition.id}`,
            `Start · ${definition.name}`,
            'production.start',
            { processId: definition.id, containerId: 'inventory' },
            'work',
        );
    } else if (target) {
        status = 'needsWorkshop';
        action = createAction(
            `settlement:production:workshop:${definition.id}:${target.id}`,
            `Go to · ${target.name}`,
            'locality.poi.visit',
            { poiId: target.id },
            'work',
        );
    }
    if (action) actions.push(action);

    const inputSellGil = inputs.reduce((sum, item) => sum + item.estimatedSellGil, 0);
    const outputSellGil = outputs.reduce((sum, item) => sum + item.estimatedSellGil, 0);
    return Object.freeze({
        id: definition.id,
        name: definition.name,
        kind: definition.kind,
        status,
        available: check.ok,
        durationSeconds: workDurationForProficiency(definition.durationSeconds, proficiency),
        proficiencyId: definition.proficiencyId,
        proficiency,
        proficiencyGain: definition.proficiencyGain,
        requiredStationTags: Object.freeze([...definition.requiredStationTags]),
        inputs: Object.freeze(inputs),
        outputs: Object.freeze(outputs),
        inputSellGil,
        outputSellGil,
        tradeDeltaGil: outputSellGil - inputSellGil,
        blockers: Object.freeze(activeRecord ? [] : [...check.blockers]),
        action,
    });
}

function createTradeModel(state, currentShopPoi, catalog, localShops, actions) {
    if (!currentShopPoi || !catalog) {
        return Object.freeze({
            currentShop: null,
            localShops: Object.freeze(localShops),
            buyOffers: Object.freeze([]),
            sellOffers: Object.freeze([]),
        });
    }

    const walletGil = Math.max(0, Number(state.player.wallet?.gil) || 0);
    const buyOffers = catalog.items.map((item) => {
        const affordable = walletGil >= item.priceGil;
        const action = affordable ? createAction(
            `settlement:buy:${currentShopPoi.id}:${item.id}`,
            `Buy · ${item.name}`,
            'shop.buy',
            { itemQuery: item.id, shopQuery: currentShopPoi.id },
            'trade',
        ) : null;
        if (action) actions.push(action);
        return Object.freeze({
            itemId: item.id,
            name: item.name,
            priceGil: item.priceGil,
            affordable,
            blocker: affordable ? null : `Needs ${item.priceGil - walletGil} more gil.`,
            action,
        });
    });

    const sellOffers = (state.player.inventoryState?.containers?.inventory?.items ?? []).flatMap((item, index) => {
        const check = canSellItem(item, { shopPoi: currentShopPoi, catalog });
        if (!check.ok) return [];
        const quantity = Math.max(1, Number(item.quantity) || 1);
        const action = createAction(
            `settlement:sell:${currentShopPoi.id}:${item.id}:${index}`,
            `Sell 1 · ${item.name}`,
            'shop.sell',
            { itemQuery: item.id, shopQuery: currentShopPoi.id, quantity: 1 },
            'trade',
        );
        actions.push(action);
        return [Object.freeze({
            itemId: item.id,
            name: item.name,
            quantity,
            unitPriceGil: check.sellValueGil,
            stackPriceGil: check.sellValueGil * quantity,
            action,
        })];
    });

    return Object.freeze({
        currentShop: Object.freeze({
            poiId: currentShopPoi.id,
            name: currentShopPoi.name,
            catalogName: catalog.name,
        }),
        localShops: Object.freeze(localShops),
        buyOffers: Object.freeze(buyOffers),
        sellOffers: Object.freeze(sellOffers),
    });
}

function createRecoveryEntry(state, actions) {
    const model = createCampaignRecoveryModel(state);
    if (!model) return null;
    let action = null;
    if (model.active) {
        action = createAction('settlement:recovery:advance', 'Finish resting', 'activity.advanceToCompletion', {}, 'recovery');
    } else if (model.available) {
        action = createAction('settlement:recovery:start', 'Rest in safety', 'recovery.start', {}, 'recovery');
    }
    if (action) actions.push(action);
    return Object.freeze({
        mode: model.mode,
        active: model.active,
        available: model.available,
        injured: model.injured,
        durationSeconds: model.durationSeconds,
        hp: model.hp,
        maxHp: model.maxHp,
        mp: model.mp,
        maxMp: model.maxMp,
        blocker: model.blockedReason,
        action,
    });
}

function carriedQuantity(state, itemId) {
    return (state.player.inventoryState?.containers?.inventory?.items ?? [])
        .filter((item) => item.id === itemId || item.templateId === itemId)
        .reduce((sum, item) => sum + Math.max(1, Number(item.quantity) || 1), 0);
}

function createAction(id, label, intent, payload, kind) {
    return Object.freeze({
        id,
        label,
        intent,
        payload: Object.freeze({ ...(payload ?? {}) }),
        kind,
    });
}

function emptyBoard(placeId) {
    return Object.freeze({
        version: SETTLEMENT_SERVICE_BOARD_VERSION,
        available: false,
        placeId,
        walletGil: 0,
        currentStationTags: Object.freeze([]),
        homeWorkshop: null,
        workshops: Object.freeze([]),
        production: Object.freeze([]),
        trade: Object.freeze({ currentShop: null, localShops: Object.freeze([]), buyOffers: Object.freeze([]), sellOffers: Object.freeze([]) }),
        recovery: null,
        actions: Object.freeze([]),
    });
}
