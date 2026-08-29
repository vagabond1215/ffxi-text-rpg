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
        id: 'schedule-crownfields-maelin-rook',
        npcId: 'npc-crownfields-maelin-rook',
        poiId: 'poi-crownfields-grange-exchange',
        placeId: 'crownfields-grange',
        label: 'Grange produce-market hours',
        windows: [
            window(5, 30, 16, 30, 'Weighing loads and keeping the produce exchange'),
        ],
        unavailableText: 'Maelin has closed the public scales and is reconciling farm ledgers and wagon lots.',
    }),
    schedule({
        id: 'schedule-crownfields-hessa-vale',
        npcId: 'npc-crownfields-hessa-vale',
        poiId: 'poi-crownfields-grange-growers-hall',
        placeId: 'crownfields-grange',
        label: 'Growers’ Hall desk',
        windows: [
            window(7, 0, 18, 0, 'Posting harvest, grazing, and market notices'),
        ],
        unavailableText: 'Hessa is away from the hall walking field boundaries and speaking with tenant farmers.',
    }),
    schedule({
        id: 'schedule-great-mere-essel-wren',
        npcId: 'npc-great-mere-essel-wren',
        poiId: 'poi-great-mere-fishery-exchange',
        placeId: 'merewatch-landing',
        label: 'Merewatch fish market hours',
        windows: [
            window(5, 0, 15, 0, 'Weighing catches and keeping the fishery exchange'),
        ],
        unavailableText: 'Essel has closed the public scales and is tallying boats, ice, salt, and smokehouse lots.',
    }),
    schedule({
        id: 'schedule-great-mere-jory-tamm',
        npcId: 'npc-great-mere-jory-tamm',
        poiId: 'poi-great-mere-lakesmens-hall',
        placeId: 'merewatch-landing',
        label: 'Lakesmen’s Hall desk',
        windows: [
            window(7, 0, 19, 0, 'Posting lake conditions, catch notices, and processing guidance'),
        ],
        unavailableText: 'Jory is away checking traps, shore paths, and the morning catch.',
    }),
    schedule({
        id: 'schedule-tideglass-lessa-venn',
        npcId: 'npc-tideglass-lessa-venn',
        poiId: 'poi-tideglass-exchange',
        placeId: 'tideglass-landing',
        label: 'Tideglass exchange hours',
        windows: [window(6, 0, 16, 0, 'Weighing catches, shell lots, salt crust, and marsh goods')],
        unavailableText: 'Lessa has closed the exchange scales and is checking smokehouse, salt, and packet-boat lots.',
    }),
    schedule({
        id: 'schedule-tideglass-orin-cade',
        npcId: 'npc-tideglass-orin-cade',
        poiId: 'poi-tideglass-pilot-house',
        placeId: 'tideglass-landing',
        label: 'Tideglass pilot desk',
        windows: [window(5, 0, 18, 0, 'Posting tide turns, shoal warnings, and packet departures')],
        unavailableText: 'Orin is away from the pilot house checking channel stakes, shoals, and the lower distributaries.',
    }),
    schedule({
        id: 'schedule-oldbough-mara-oren',
        npcId: 'npc-oldbough-mara-oren',
        poiId: 'poi-oldbough-exchange',
        placeId: 'oldbough-refuge',
        label: 'Oldbough exchange hours',
        windows: [window(6, 0, 16, 0, 'Weighing forest goods, route stock, and preserved provisions')],
        unavailableText: 'Mara has closed the refuge scales and is checking stores, repair stock, and incoming forest lots.',
    }),
    schedule({
        id: 'schedule-oldbough-hale-rowan',
        npcId: 'npc-oldbough-hale-rowan',
        poiId: 'poi-oldbough-forester-desk',
        placeId: 'oldbough-refuge',
        label: 'Oldbough forester desk',
        windows: [window(7, 0, 18, 0, 'Posting track conditions, deadfall reports, and deepwood trail notices')],
        unavailableText: 'Hale is away from the desk walking the cart track, checking deadfall, or marking the deepwood trail.',
    }),
    schedule({
        id: 'schedule-headwater-elin-marr',
        npcId: 'npc-headwater-elin-marr',
        poiId: 'poi-headwater-river-exchange',
        placeId: 'headwater-warden-lodge',
        label: 'Headwater river exchange hours',
        windows: [window(6, 0, 17, 0, 'Weighing catches, timber lots, and field goods')],
        unavailableText: 'Elin has closed the exchange counter and is checking river lots, smoke racks, and incoming timber.',
    }),
    schedule({
        id: 'schedule-headwater-torin-ash',
        npcId: 'npc-headwater-torin-ash',
        poiId: 'poi-headwater-warden-desk',
        placeId: 'headwater-warden-lodge',
        label: 'Headwater warden desk',
        windows: [window(7, 0, 18, 0, 'Posting bridge, flood, trail, and wildlife conditions')],
        unavailableText: 'Torin is away from the lodge desk walking bridges, fords, and the upper trail.',
    }),
    schedule({
        id: 'schedule-ironspine-vara-kell',
        npcId: 'npc-ironspine-vara-kell',
        poiId: 'poi-ironspine-survey-exchange',
        placeId: 'ironspine-watchpost',
        label: 'High-pass survey exchange hours',
        windows: [window(6, 0, 17, 0, 'Weighing mountain finds and keeping survey ledgers')],
        unavailableText: 'Vara has closed the exchange counter and is checking stores, maps, and incoming survey lots.',
    }),
    schedule({
        id: 'schedule-ironspine-dain-rove',
        npcId: 'npc-ironspine-dain-rove',
        poiId: 'poi-ironspine-warden-desk',
        placeId: 'ironspine-watchpost',
        label: 'Ironspine warden desk',
        windows: [window(7, 0, 18, 0, 'Posting trail conditions, weather warnings, and wildlife sign')],
        unavailableText: 'Dain is away from the watchpost desk walking the pass and checking high-country markers.',
    }),
    schedule({
        id: 'schedule-slatewater-eira-voss',
        npcId: 'npc-slatewater-eira-voss',
        poiId: 'poi-slatewater-waylodge-exchange',
        placeId: 'slatewater-waylodge',
        label: 'Waylodge exchange hours',
        windows: [
            window(6, 0, 21, 0, 'Buying field finds and keeping the exchange counter'),
        ],
        unavailableText: 'Eira has closed the exchange ledger and is counting stores in the back room.',
    }),
    schedule({
        id: 'schedule-slatewater-toren-marr',
        npcId: 'npc-slatewater-toren-marr',
        poiId: 'poi-slatewater-waylodge-trailguild',
        placeId: 'slatewater-waylodge',
        label: 'Foothill guild desk',
        windows: [
            window(7, 0, 19, 0, 'Posting route conditions and field notices'),
        ],
        unavailableText: 'Toren is away from the lodge desk checking trails, camps, and reported wildlife.',
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
