export const NPC_SCHEDULE_DATA_VERSION = 2;

const SECONDS_PER_DAY = 24 * 60 * 60;

const DAILY_SCHEDULES = [
    schedule({
        id: 'schedule-thornwall-sera-talwin',
        npcId: 'npc-thornwall-sera-talwin',
        poiId: 'poi-sandoria-s-alaune',
        placeId: 'thornwall-southgate',
        label: 'Southgate guide duty',
        windows: [
            window(8, 0, 18, 0, 'On duty at Southgate'),
        ],
        unavailableText: 'Sera is away from Southgate duties.',
    }),
    schedule({
        id: 'schedule-thornwall-mira-fen',
        npcId: 'npc-thornwall-mira-fen',
        poiId: 'poi-sandoria-s-aveline',
        placeId: 'thornwall-southgate',
        label: 'Morning cookfire and pantry round',
        windows: [
            window(6, 0, 11, 0, 'Serving the Southgate morning pot'),
        ],
        unavailableText: 'Mira has closed the morning cookfire and is away handling household errands.',
    }),
    schedule({
        id: 'schedule-thornwall-oren-vale',
        npcId: 'npc-thornwall-oren-vale',
        poiId: 'poi-sandoria-s-ambrotien',
        placeId: 'thornwall-southgate',
        label: 'West-road works desk',
        windows: [
            window(7, 0, 15, 0, 'Coordinating West-road repairs'),
        ],
        unavailableText: 'Oren is away from the works desk inspecting road crews and timber deliveries.',
    }),
    schedule({
        id: 'schedule-brasshaven-mae-oris',
        npcId: 'npc-brasshaven-mae-oris',
        poiId: 'poi-bastok-markets-carmelide',
        placeId: 'brasshaven-market-ring',
        label: 'Market Ring provision hours',
        windows: [
            window(11, 0, 17, 0, 'Keeping the courtyard provision stall'),
        ],
        unavailableText: 'Mae is away from the stall making courtyard deliveries.',
    }),
    schedule({
        id: 'schedule-mistmere-kiri-fen',
        npcId: 'npc-mistmere-kiri-fen',
        poiId: 'poi-waters-hilkomu-makimu',
        placeId: 'mistmere-canal-ward',
        label: 'Canalside remedy hours',
        windows: [
            window(16, 0, 21, 0, 'Tending the evening remedy shelf'),
        ],
        unavailableText: 'Kiri is away from the remedy shelf visiting nearby households.',
    }),
    schedule({
        id: 'schedule-mistmere-pelu-senn',
        npcId: 'npc-mistmere-pelu-senn',
        poiId: 'poi-waters-baehu-faehu',
        placeId: 'mistmere-canal-ward',
        label: 'Starfen factor hours',
        windows: [
            window(7, 0, 14, 0, 'Sorting marsh goods and instructing field hands'),
        ],
        unavailableText: 'Pelu is away from the Canal Ward checking reed lots and ferry-bound marsh goods.',
    }),
    schedule({
        id: 'schedule-mistmere-tavi-meren',
        npcId: 'npc-mistmere-tavi-meren',
        poiId: 'poi-waters-chomo-jinjahl',
        placeId: 'mistmere-canal-ward',
        label: 'Culinary guild instruction hours',
        windows: [
            window(8, 0, 18, 0, 'Working the guild kitchen and teaching marsh preparations'),
        ],
        unavailableText: 'Tavi has closed the guild lesson bench and is away buying fresh marsh ingredients.',
    }),
];

export const NPC_SCHEDULES = Object.freeze(DAILY_SCHEDULES);

export function listNpcSchedules() {
    return NPC_SCHEDULES;
}

export function getNpcScheduleById(scheduleId) {
    const key = String(scheduleId ?? '').trim();
    return NPC_SCHEDULES.find((entry) => entry.id === key) ?? null;
}

export function getNpcScheduleByNpcId(npcId) {
    const key = String(npcId ?? '').trim();
    return NPC_SCHEDULES.find((entry) => entry.npcId === key) ?? null;
}

export function getNpcScheduleByPoiId(poiId) {
    const key = String(poiId ?? '').trim();
    return NPC_SCHEDULES.find((entry) => entry.poiId === key) ?? null;
}

export function validateNpcScheduleDefinition(definition) {
    const issues = [];
    const label = definition?.id || 'npc schedule';
    if (!definition || typeof definition !== 'object' || Array.isArray(definition)) return ['npc schedule must be an object.'];
    if (!stableId(definition.id, 'schedule-')) issues.push(`${label}.id must be a stable schedule id.`);
    if (!stableId(definition.npcId, 'npc-')) issues.push(`${label}.npcId must be a stable NPC id.`);
    if (!stableId(definition.poiId, 'poi-')) issues.push(`${label}.poiId must be a stable POI id.`);
    if (!stableId(definition.placeId)) issues.push(`${label}.placeId must be a stable place id.`);
    if (!String(definition.label ?? '').trim()) issues.push(`${label}.label is required.`);
    if (!String(definition.unavailableText ?? '').trim()) issues.push(`${label}.unavailableText is required.`);
    if (!Array.isArray(definition.windows) || definition.windows.length === 0) {
        issues.push(`${label}.windows must be a non-empty array.`);
        return issues;
    }

    const sorted = [...definition.windows].sort((a, b) => Number(a?.startSecond) - Number(b?.startSecond));
    let priorEnd = -1;
    for (const [index, entry] of sorted.entries()) {
        const windowLabel = `${label}.windows[${index}]`;
        if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
            issues.push(`${windowLabel} must be an object.`);
            continue;
        }
        if (!Number.isInteger(entry.startSecond) || entry.startSecond < 0 || entry.startSecond >= SECONDS_PER_DAY) {
            issues.push(`${windowLabel}.startSecond must be within the fictional day.`);
        }
        if (!Number.isInteger(entry.endSecond) || entry.endSecond <= 0 || entry.endSecond > SECONDS_PER_DAY) {
            issues.push(`${windowLabel}.endSecond must be within the fictional day.`);
        }
        if (Number.isInteger(entry.startSecond) && Number.isInteger(entry.endSecond) && entry.endSecond <= entry.startSecond) {
            issues.push(`${windowLabel} must end after it starts.`);
        }
        if (Number.isInteger(entry.startSecond) && entry.startSecond < priorEnd) {
            issues.push(`${windowLabel} overlaps an earlier schedule window.`);
        }
        if (!String(entry.label ?? '').trim()) issues.push(`${windowLabel}.label is required.`);
        if (Number.isInteger(entry.endSecond)) priorEnd = Math.max(priorEnd, entry.endSecond);
    }
    return issues;
}

export function validateNpcScheduleCatalog() {
    const issues = [];
    const ids = new Set();
    const npcIds = new Set();
    for (const definition of NPC_SCHEDULES) {
        issues.push(...validateNpcScheduleDefinition(definition));
        if (ids.has(definition.id)) issues.push(`Duplicate NPC schedule id ${definition.id}.`);
        ids.add(definition.id);
        if (npcIds.has(definition.npcId)) issues.push(`NPC ${definition.npcId} has more than one canonical daily schedule.`);
        npcIds.add(definition.npcId);
    }
    return issues;
}

function schedule(definition) {
    return Object.freeze({
        ...definition,
        windows: Object.freeze([...(definition.windows ?? [])]),
    });
}

function window(startHour, startMinute, endHour, endMinute, label) {
    return Object.freeze({
        startSecond: toSecondOfDay(startHour, startMinute),
        endSecond: toSecondOfDay(endHour, endMinute),
        label,
    });
}

function toSecondOfDay(hour, minute) {
    return (hour * 60 * 60) + (minute * 60);
}

function stableId(value, prefix = '') {
    return typeof value === 'string'
        && (!prefix || value.startsWith(prefix))
        && /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(value);
}
