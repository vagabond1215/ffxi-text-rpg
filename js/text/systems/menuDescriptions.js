import {
    RECOVERED_BESTIARY_NOTES,
    RECOVERED_JOB_ABILITIES,
    RECOVERED_JOB_TRAITS,
    RECOVERED_WEAPON_SKILLS,
} from '../data/legacyRecoveredData.js';
import { describeEquipmentAndWardrobes } from './inventoryEngine.js';

export function describeEquipment(state) {
    return describeEquipmentAndWardrobes(state);
}

export function describeSpells(state) {
    const knownSpells = state.player?.progression?.knownSpells ?? [];
    if (!knownSpells.length) {
        return [
            'Spells:',
            '- No learned spells yet.',
            '',
            'Placeholder: spell learning will come from scrolls, jobs, and magic skill systems.',
        ].join('\n');
    }
    return ['Spells:', ...knownSpells.map((spell) => `- ${spell}`)].join('\n');
}

export function describeWeaponSkills() {
    return [
        'Recovered Weapon Skills:',
        ...Object.values(RECOVERED_WEAPON_SKILLS).map((skill) => `- ${skill.name} [${skill.skillType}] hits ${skill.hits}, fTP ${skill.ftp.join('/')}`),
        '',
        'These are unverified recovered records and should be migrated into the real combat action schema later.',
    ].join('\n');
}

export function describeJobAbilities(state) {
    const jobId = state.player?.jobs?.mainJobId ?? 'warrior';
    const abilities = RECOVERED_JOB_ABILITIES[jobId] ?? [];
    const traits = RECOVERED_JOB_TRAITS[jobId] ?? [];
    return [
        `Recovered Job Data: ${state.player?.jobs?.mainJobName ?? jobId}`,
        '',
        'Abilities:',
        ...(abilities.length ? abilities.map((entry) => `- Lv.${entry.level} ${entry.name}: ${entry.effect}`) : ['- No recovered ability records for this job yet.']),
        '',
        'Traits:',
        ...(traits.length ? traits.map((entry) => `- Lv.${entry.level} ${entry.name}: ${entry.effect}`) : ['- No recovered trait records for this job yet.']),
    ].join('\n');
}

export function describeBestiary(state) {
    const zoneKey = toCamelId(state.currentPlaceId);
    const entries = RECOVERED_BESTIARY_NOTES[zoneKey] ?? [];
    if (!entries.length) return `No recovered bestiary notes for ${state.location}.`;
    return [
        `Recovered Bestiary Notes: ${state.location}`,
        ...entries.map((entry) => `- ${entry.name} Lv.${entry.levelRange} aggro=${entry.aggressive ? 'yes' : 'no'} link=${entry.linking ? 'yes' : 'no'} detect=${entry.detection}`),
    ].join('\n');
}

function toCamelId(value) {
    return String(value ?? '').replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
}
