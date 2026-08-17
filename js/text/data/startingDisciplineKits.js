import { getEquipmentCatalogEntry } from './equipmentCatalog.js';
import { getJob } from './jobs.js';

export const STARTING_DISCIPLINE_KIT_VERSION = 1;

const KITS = Object.freeze({
    vanguard: kit({
        itemIds: ['bronze-sword', 'leather-vest'],
        weaponTraining: 'Sword, axe, and shield fundamentals',
        protection: 'Light-to-sturdy armor with shield training',
        playStyle: 'Hold the line, trade blows well, and adapt among common martial weapons.',
    }),
    pugilist: kit({
        itemIds: ['traveler-gloves', 'leather-vest'],
        weaponTraining: 'Hand-to-hand, guard, and evasive footwork',
        protection: 'Flexible light protection that keeps the hands and feet free',
        playStyle: 'Fight at close range through conditioning, counters, and sustained pressure.',
    }),
    lifewarden: kit({
        itemIds: ['maple-wand', 'road-cloak'],
        weaponTraining: 'Simple casting implements and defensive positioning',
        protection: 'Light travel layers; survival comes from protection and restoration',
        playStyle: 'Keep yourself and companions standing through healing and protective magic.',
    }),
    elementalist: kit({
        itemIds: ['ash-staff', 'road-cloak'],
        weaponTraining: 'Staff work and prepared elemental spellcasting',
        protection: 'Light travel layers; distance and spell preparation matter',
        playStyle: 'Commit magical power to direct offense, accuracy, and battlefield pressure.',
    }),
    spellblade: kit({
        itemIds: ['bronze-sword', 'leather-vest'],
        weaponTraining: 'Sword work blended with enhancing and hindering magic',
        protection: 'Light armor suited to moving between weapon and spell work',
        playStyle: 'Shift between melee, control, and support instead of relying on one answer.',
    }),
    shadowhand: kit({
        itemIds: ['bronze-dagger', 'road-cloak'],
        weaponTraining: 'Dagger, throwing, evasion, and opening attacks',
        protection: 'Light mobile protection that favors movement over absorbing hits',
        playStyle: 'Create angles, avoid return blows, and punish exposed targets.',
    }),
});

export function getStartingDisciplineKit(jobId = 'vanguard') {
    const job = getJob(jobId);
    const definition = KITS[job.id] ?? KITS.vanguard;
    return {
        disciplineId: job.id,
        itemIds: [...definition.itemIds],
        items: definition.itemIds.map((itemId) => getEquipmentCatalogEntry(itemId)).filter(Boolean),
        weaponTraining: definition.weaponTraining,
        protection: definition.protection,
        playStyle: definition.playStyle,
    };
}

export function listStartingDisciplineKits() {
    return Object.keys(KITS).map((jobId) => getStartingDisciplineKit(jobId));
}

export function validateStartingDisciplineKits() {
    const issues = [];
    for (const [jobId, definition] of Object.entries(KITS)) {
        for (const itemId of definition.itemIds) {
            if (!getEquipmentCatalogEntry(itemId)) issues.push(`${jobId} starting kit references unknown equipment ${itemId}.`);
        }
    }
    return issues;
}

function kit(definition) {
    return Object.freeze({
        ...definition,
        itemIds: Object.freeze([...definition.itemIds]),
    });
}
