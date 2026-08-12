import {
    canonicalizeDisciplineId,
    canonicalizeEnemyId,
    canonicalizeMapId,
    canonicalizeNationId,
    canonicalizePlaceId,
    canonicalizeRaceId,
} from './legacyIdentity.js';

export const LEGACY_CANDIDATE_VERSION = 1;
export const LEGACY_CANDIDATE_STATUS = 'candidate';

const CANONICALIZERS = Object.freeze({
    discipline: canonicalizeDisciplineId,
    enemy: canonicalizeEnemyId,
    map: canonicalizeMapId,
    nation: canonicalizeNationId,
    place: canonicalizePlaceId,
    race: canonicalizeRaceId,
});

export function normalizeLegacyCandidate(definition = {}) {
    const recordType = String(definition.recordType ?? '').trim();
    const sourceId = String(definition.sourceId ?? '').trim();
    const proposedId = String(definition.proposedId ?? suggestCanonicalId(recordType, sourceId)).trim();

    return Object.freeze({
        id: `candidate-${slug(recordType || 'record')}-${slug(sourceId || proposedId || 'unknown')}`,
        version: LEGACY_CANDIDATE_VERSION,
        recordType,
        proposedId,
        reviewStatus: LEGACY_CANDIDATE_STATUS,
        canonical: false,
        requiresOriginalityReview: true,
        source: Object.freeze({
            kind: 'legacyReference',
            system: String(definition.sourceSystem ?? 'unspecified').trim(),
            sourceId,
        }),
        payload: Object.freeze(cloneValue(definition.payload ?? {})),
        notes: String(definition.notes ?? '').trim(),
    });
}

export function suggestCanonicalId(recordType, sourceId) {
    const type = String(recordType ?? '').trim();
    const source = String(sourceId ?? '').trim();
    const canonicalizer = CANONICALIZERS[type];
    return canonicalizer ? String(canonicalizer(source) ?? '').trim() : source;
}

export function validateLegacyCandidateRecord(candidate) {
    const issues = [];
    if (!plainObject(candidate)) return ['legacy candidate must be an object.'];
    if (candidate.version !== LEGACY_CANDIDATE_VERSION) issues.push(`candidate version must be ${LEGACY_CANDIDATE_VERSION}.`);
    if (!validStableId(candidate.id)) issues.push('candidate id must be stable.');
    if (!candidate.recordType) issues.push('candidate recordType is required.');
    if (!validStableId(candidate.proposedId)) issues.push('candidate proposedId must be a stable canonical candidate id.');
    if (candidate.reviewStatus !== LEGACY_CANDIDATE_STATUS) issues.push('candidate reviewStatus must remain candidate until an explicit review step occurs outside normalization.');
    if (candidate.canonical !== false) issues.push('normalized legacy candidates cannot be canonical.');
    if (candidate.requiresOriginalityReview !== true) issues.push('normalized legacy candidates must require originality review.');
    if (!plainObject(candidate.source) || candidate.source.kind !== 'legacyReference' || !candidate.source.sourceId) {
        issues.push('candidate requires legacy source provenance.');
    }
    if (!plainObject(candidate.payload)) issues.push('candidate payload must be an object.');
    return issues;
}

function slug(value) {
    const normalized = String(value ?? '')
        .trim()
        .toLowerCase()
        .replace(/[’']/g, '')
        .replace(/[^a-z0-9.-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return normalized || 'unknown';
}

function cloneValue(value) {
    if (Array.isArray(value)) return value.map((entry) => cloneValue(entry));
    if (plainObject(value)) return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, cloneValue(entry)]));
    return value;
}

function validStableId(value) {
    return typeof value === 'string' && /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(value);
}

function plainObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
