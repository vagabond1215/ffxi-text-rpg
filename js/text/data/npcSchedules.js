export const NPC_SCHEDULE_DATA_VERSION = 1;

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
