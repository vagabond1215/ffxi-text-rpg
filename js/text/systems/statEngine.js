import {
    ATTRIBUTE_KEYS,
    DERIVED_STAT_KEYS,
    ELEMENT_KEYS,
    SKILL_KEYS,
    createZeroBlock,
} from '../data/systemConstants.js';
import { getRace } from '../data/races.js';
import { getJob } from '../data/jobs.js';

const BASE_ATTRIBUTE_VALUE = 6;
const BASE_HP = 24;
const BASE_MP = 0;

export function calculateCombatProfile(entity) {
    const level = getEntityLevel(entity);
    const attributes = calculateAttributes(entity, level);
    const skills = calculateSkills(entity, level);
    const equipmentModifiers = collectEquipmentModifiers(entity.equipment);
    const statusModifiers = collectStatusModifiers(entity.statuses);
    const resources = calculateResources(entity, level, attributes, equipmentModifiers, statusModifiers);
    const derived = calculateDerivedStats(entity, level, attributes, skills, equipmentModifiers, statusModifiers);

    return {
        level,
        attributes,
        resources,
        derived,
        skills,
        resistances: calculateResistances(equipmentModifiers, statusModifiers),
    };
}

export function calculateAttributes(entity, level = getEntityLevel(entity)) {
    const race = entity.type === 'player' ? getRace(entity.identity?.raceId) : null;
    const mainJob = entity.type === 'player' ? getJob(entity.jobs?.mainJobId) : null;
    const base = createZeroBlock(ATTRIBUTE_KEYS);

    for (const key of ATTRIBUTE_KEYS) {
        const raceBias = race?.attributeBias?.[key] ?? 0;
        const jobBias = mainJob?.primaryAttributes?.includes(key) ? 2 : 0;
        const enemyBias = entity.baseAttributes?.[key] ?? 0;
        base[key] = BASE_ATTRIBUTE_VALUE + Math.floor(level * 0.85) + raceBias + jobBias + enemyBias;
    }

    const equipment = collectEquipmentModifiers(entity.equipment).attributes;
    const statuses = collectStatusModifiers(entity.statuses).attributes;

    return addBlocks(base, equipment, statuses);
}

export function calculateResources(entity, level = getEntityLevel(entity), attributes = calculateAttributes(entity, level), equipment = collectEquipmentModifiers(entity.equipment), statuses = collectStatusModifiers(entity.statuses)) {
    const race = entity.type === 'player' ? getRace(entity.identity?.raceId) : null;
    const mainJob = entity.type === 'player' ? getJob(entity.jobs?.mainJobId) : null;
    const hpBias = race?.resourceBias?.hp ?? 0;
    const mpBias = race?.resourceBias?.mp ?? 0;
    const isCaster = ['whiteMage', 'blackMage', 'redMage', 'summoner', 'blueMage', 'scholar', 'geomancer'].includes(mainJob?.id);
    const enemyHpBonus = entity.type === 'enemy' ? level * 6 : 0;

    return {
        maxHp: Math.max(1, BASE_HP + level * 8 + attributes.vit * 2 + hpBias * level + enemyHpBonus + (equipment.resources.hp ?? 0) + (statuses.resources.hp ?? 0)),
        maxMp: Math.max(0, BASE_MP + (isCaster ? level * 5 : level) + attributes.mnd + attributes.int + mpBias * level + (equipment.resources.mp ?? 0) + (statuses.resources.mp ?? 0)),
        maxTp: 3000,
    };
}

export function calculateSkills(entity, level = getEntityLevel(entity)) {
    const mainJob = entity.type === 'player' ? getJob(entity.jobs?.mainJobId) : null;
    const skills = createZeroBlock(SKILL_KEYS);

    for (const key of SKILL_KEYS) {
        const focused = mainJob?.skillFocus?.includes(key);
        const enemySkill = entity.skills?.[key];
        if (typeof enemySkill === 'number') {
            skills[key] = enemySkill;
        } else {
            skills[key] = focused ? level * 3 : Math.floor(level * 1.5);
        }
    }

    return skills;
}

export function calculateDerivedStats(entity, level = getEntityLevel(entity), attributes = calculateAttributes(entity, level), skills = calculateSkills(entity, level), equipment = collectEquipmentModifiers(entity.equipment), statuses = collectStatusModifiers(entity.statuses)) {
    const derived = createZeroBlock(DERIVED_STAT_KEYS);
    const mainWeaponSkill = Math.max(skills.sword, skills.dagger, skills.axe, skills.handToHand, skills.staff, skills.club, skills.greatSword, skills.greatAxe, skills.scythe, skills.polearm, skills.katana, skills.greatKatana);

    derived.attack = level + attributes.str * 2 + Math.floor(mainWeaponSkill / 2);
    derived.defense = level + attributes.vit * 2;
    derived.accuracy = level + attributes.dex * 2 + Math.floor(mainWeaponSkill / 2);
    derived.evasion = level + attributes.agi * 2 + Math.floor(skills.evasion / 2);
    derived.rangedAttack = level + attributes.agi + Math.floor(Math.max(skills.archery, skills.marksmanship, skills.throwing) / 2);
    derived.rangedAccuracy = level + attributes.agi + attributes.dex + Math.floor(Math.max(skills.archery, skills.marksmanship, skills.throwing) / 2);
    derived.magicAttack = attributes.int + Math.floor(Math.max(skills.elementalMagic, skills.darkMagic, skills.blueMagic, skills.geomancy) / 3);
    derived.magicAccuracy = attributes.int + attributes.mnd + Math.floor(Math.max(skills.enfeeblingMagic, skills.elementalMagic, skills.divineMagic, skills.darkMagic, skills.blueMagic, skills.ninjutsu, skills.singing, skills.geomancy) / 3);
    derived.magicDefense = attributes.mnd + level;
    derived.magicEvasion = attributes.mnd + attributes.agi + Math.floor(level / 2);
    derived.criticalRate = 5 + Math.floor(attributes.dex / 10);
    derived.criticalDamage = 100;
    derived.haste = 0;
    derived.delayReduction = 0;
    derived.enmity = 0;
    derived.shieldBlock = Math.floor(skills.shield / 3);
    derived.parry = Math.floor(skills.parrying / 3);
    derived.guard = Math.floor(skills.guard / 3);
    derived.counter = 0;
    derived.curePotency = 0;
    derived.spellInterruptionRate = 100;
    derived.physicalDamageTaken = 0;
    derived.magicDamageTaken = 0;
    derived.breathDamageTaken = 0;
    derived.movementSpeed = 100;

    return addBlocks(derived, equipment.derived, statuses.derived);
}

export function collectEquipmentModifiers(equipment = {}) {
    const block = createModifierBlock();
    for (const item of Object.values(equipment ?? {})) {
        mergeModifierBlock(block, item?.modifiers);
    }
    return block;
}

export function collectStatusModifiers(statuses = []) {
    const block = createModifierBlock();
    for (const status of statuses ?? []) {
        mergeModifierBlock(block, status?.modifiers);
    }
    return block;
}

export function createModifierBlock() {
    return {
        attributes: createZeroBlock(ATTRIBUTE_KEYS),
        resources: { hp: 0, mp: 0, tp: 0 },
        derived: createZeroBlock(DERIVED_STAT_KEYS),
        resistances: createZeroBlock(ELEMENT_KEYS),
    };
}

export function calculateResistances(equipment = collectEquipmentModifiers(), statuses = collectStatusModifiers()) {
    return addBlocks(createZeroBlock(ELEMENT_KEYS), equipment.resistances, statuses.resistances);
}

export function getEntityLevel(entity) {
    return entity.jobs?.level ?? entity.level ?? 1;
}

function mergeModifierBlock(target, modifiers = {}) {
    if (!modifiers) return target;
    target.attributes = addBlocks(target.attributes, modifiers.attributes);
    target.resources = addBlocks(target.resources, modifiers.resources);
    target.derived = addBlocks(target.derived, modifiers.derived);
    target.resistances = addBlocks(target.resistances, modifiers.resistances);
    return target;
}

function addBlocks(...blocks) {
    const result = {};
    for (const block of blocks) {
        if (!block) continue;
        for (const [key, value] of Object.entries(block)) {
            result[key] = (result[key] ?? 0) + (Number(value) || 0);
        }
    }
    return result;
}
