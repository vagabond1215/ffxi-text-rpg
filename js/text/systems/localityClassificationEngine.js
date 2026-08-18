import { getPlace } from '../data/places.js';

export const SETTLEMENT_LOCALITY_TYPES = Object.freeze(['city', 'cityInterior', 'travelHub']);

export function isSettlementLocality(placeOrId) {
    const place = typeof placeOrId === 'string' ? getPlace(placeOrId) : placeOrId;
    return Boolean(place
        && Number(place.dangerLevel ?? 0) === 0
        && SETTLEMENT_LOCALITY_TYPES.includes(place.type)
        && !place.flags?.externalPlaceholder);
}
