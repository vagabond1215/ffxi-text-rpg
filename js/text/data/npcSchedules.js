export const NPC_SCHEDULE_DATA_VERSION = 2;

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
];

export const NPC_SCHEDULES = Object.freeze(DAILY_SCHEDULES);

export function listNpcSchedules() {
    return NPC_SCHEDULES;
}

export function getNpcScheduleByNpcId(npcId) {
    const key = String(npcId ?? '').trim();
    return NPC_SCHEDULES.find((entry) => entry.npcId === key) ?? null;
}

export function getNpcScheduleByPoiId(poiId) {
    const key = String(poiId ?? '').trim();
    return NPC_SCHEDULES.find((entry) => entry.poiId === key) ?? null;
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