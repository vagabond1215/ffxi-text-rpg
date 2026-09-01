import { getCapability } from './capabilities.js';
import { ELEMENT_KEYS } from './systemConstants.js';

export const ABILITY_CATALOG_VERSION = 11;
export const ABILITY_KINDS = Object.freeze(['spell', 'technique', 'utility']);
export const ABILITY_CONTEXTS = Object.freeze(['combat', 'exploration']);
export const ABILITY_TARGET_KINDS = Object.freeze(['self', 'enemy', 'context']);
export const ABILITY_GEOMETRY_KINDS = Object.freeze(['ring', 'arc']);
export const ABILITY_EFFECT_TYPES = Object.freeze(['damage', 'heal', 'status', 'field', 'context']);
export const ABILITY_RESOURCE_KEYS = Object.freeze(['hp', 'mp', 'tp']);
export const ABILITY_SCALING_STATS = Object.freeze(['str', 'dex', 'vit', 'agi', 'int', 'mnd', 'chr']);

const SPELL_SCHOOLS = Object.freeze({
    'school-elemental-form': school({ id: 'school-elemental-form', name: 'Elemental Form', tradition: 'A universal practice for shaping fire, earth, wind, water, lightning, ice, light, and darkness into controlled magical effects.', tags: ['elemental', 'universal', 'projection'] }),
    'school-vital-weave': school({ id: 'school-vital-weave', name: 'Vital Weave', tradition: 'A restorative tradition that steadies living patterns and encourages recovery.', tags: ['restoration', 'life', 'support'] }),
    'school-ward-lore': school({ id: 'school-ward-lore', name: 'Ward Lore', tradition: 'A defensive practice of shaping temporary barriers, anchors, and protective patterns.', tags: ['warding', 'defense', 'support'] }),
    'school-veilscript': school({ id: 'school-veilscript', name: 'Veilscript', tradition: 'A universal seal-magic discipline using prepared signs, breath control, and precise release to weaken, bind, misdirect, or guard.', tags: ['seal-magic', 'ninjutsu', 'debuff', 'warding'] }),
});

const ABILITIES = Object.freeze({
    'ability-ember-dart': ability({ id: 'ability-ember-dart', name: 'Ember Dart', kind: 'spell', schoolId: 'school-elemental-form', capabilityId: 'spell-ember-dart', tags: ['magic', 'offensive', 'heat'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 6, interruptible: true }, recoverySeconds: 2, cooldownSeconds: 12, costs: { mp: 10 }, effects: [{ type: 'damage', recipient: 'target', stat: 'int', base: 8, coefficient: 1.4, resolution: { delivery: 'projectile', channel: 'magical', damageType: 'spell', element: 'fire', elementSource: 'ability', accuracyModel: 'magic', resistanceModel: 'magicDefense', criticalEligible: false } }] }),
    'ability-mending-thread': ability({ id: 'ability-mending-thread', name: 'Mending Thread', kind: 'spell', schoolId: 'school-vital-weave', capabilityId: 'spell-mending-thread', tags: ['magic', 'restorative', 'support'], contexts: ['combat', 'exploration'], target: { kind: 'self' }, activation: { durationSeconds: 5, interruptible: true }, cooldownSeconds: 10, costs: { mp: 8 }, effects: [{ type: 'heal', recipient: 'self', stat: 'mnd', base: 8, coefficient: 1.5 }] }),
    'ability-stone-ward': ability({
        id: 'ability-stone-ward', name: 'Stone Ward', kind: 'spell', schoolId: 'school-ward-lore', capabilityId: 'spell-stone-ward', tags: ['magic', 'warding', 'support'], contexts: ['combat', 'exploration'], target: { kind: 'self' }, activation: { durationSeconds: 4, interruptible: true }, cooldownSeconds: 20, costs: { mp: 6 },
        effects: [{ type: 'status', recipient: 'self', status: { id: 'status-stone-ward', name: 'Stone Ward', category: 'buff', durationSeconds: 30, stackGroup: 'ward-defense', stackRule: 'replace', modifiers: { defense: 4 }, flags: { magicalWard: true } } }],
    }),
    'ability-guarded-cut': ability({
        id: 'ability-guarded-cut', name: 'Guarded Cut', kind: 'technique', capabilityId: 'technique-guarded-cut', tags: ['martial', 'weapon-technique', 'defensive'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 0, interruptible: false }, cooldownSeconds: 8, costs: { tp: 250 },
        effects: [{ type: 'damage', recipient: 'target', stat: 'str', base: 4, coefficient: 0.9 }, { type: 'status', recipient: 'self', status: { id: 'status-guarded-cut', name: 'Guarded Cut', category: 'buff', durationSeconds: 12, stackGroup: 'guarded-cut', stackRule: 'replace', modifiers: { defense: 2 }, flags: { guarded: true } } }],
    }),
    'ability-waymark-reading': ability({ id: 'ability-waymark-reading', name: 'Waymark Reading', kind: 'utility', capabilityId: 'practical-waymark-reading', tags: ['fieldcraft', 'navigation', 'observation'], contexts: ['exploration'], target: { kind: 'context' }, activation: { durationSeconds: 3, interruptible: true }, cooldownSeconds: 5, costs: {}, effects: [{ type: 'context', recipient: 'context', operation: 'survey-current-place' }] }),
    'ability-ridge-breaker': ability({
        id: 'ability-ridge-breaker', name: 'Ridge Breaker', kind: 'technique', capabilityId: 'technique-ridge-breaker', tags: ['martial', 'weapon-technique', 'axe', 'redstone'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 0, interruptible: false }, recoverySeconds: 4, cooldownSeconds: 10, costs: { tp: 300 },
        effects: [{ type: 'damage', recipient: 'target', stat: 'str', base: 7, coefficient: 1.15, resolution: { delivery: 'melee', channel: 'physical', damageType: 'impact', accuracyModel: 'physical', resistanceModel: 'physicalDefense', defensePenetration: 0.25, criticalEligible: true, criticalRateModifier: 5, criticalBonusPercent: 50 } }],
    }),
    'ability-rivet-guard': ability({
        id: 'ability-rivet-guard', name: 'Rivet Guard', kind: 'technique', capabilityId: 'technique-rivet-guard', tags: ['martial', 'weapon-technique', 'sword', 'defensive', 'redstone'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 0, interruptible: false }, recoverySeconds: 3, cooldownSeconds: 10, costs: { tp: 250 },
        effects: [{ type: 'damage', recipient: 'target', stat: 'str', base: 4, coefficient: 0.85, resolution: { delivery: 'melee', channel: 'physical', damageType: 'slashing', accuracyModel: 'physical', resistanceModel: 'physicalDefense', criticalEligible: false } }, { type: 'status', recipient: 'self', status: { id: 'status-rivet-guard', name: 'Rivet Guard', category: 'buff', durationSeconds: 15, stackGroup: 'rivet-guard', stackRule: 'replace', modifiers: { defense: 3 }, flags: { braced: true } } }],
    }),
    'ability-cinder-spark': ability({ id: 'ability-cinder-spark', name: 'Cinder Spark', kind: 'spell', schoolId: 'school-elemental-form', capabilityId: 'spell-cinder-spark', tags: ['magic', 'offensive', 'fire', 'universal'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 5, interruptible: true }, cooldownSeconds: 14, costs: { mp: 12 }, effects: [{ type: 'damage', recipient: 'target', stat: 'int', base: 10, coefficient: 1.5 }] }),
    'ability-tempered-ward': ability({
        id: 'ability-tempered-ward', name: 'Tempered Ward', kind: 'spell', schoolId: 'school-ward-lore', capabilityId: 'spell-tempered-ward', tags: ['magic', 'warding', 'defensive', 'universal'], contexts: ['combat', 'exploration'], target: { kind: 'self' }, activation: { durationSeconds: 5, interruptible: true }, cooldownSeconds: 24, costs: { mp: 8 },
        effects: [{ type: 'status', recipient: 'self', status: { id: 'status-tempered-ward', name: 'Tempered Ward', category: 'buff', durationSeconds: 36, stackGroup: 'ward-defense', stackRule: 'replace', modifiers: { defense: 6 }, flags: { magicalWard: true, ironbound: true } } }],
    }),
    'ability-barkboar-brace': ability({
        id: 'ability-barkboar-brace', name: 'Barkboar Brace', kind: 'technique', capabilityId: 'technique-barkboar-brace', tags: ['martial', 'weapon-technique', 'axe', 'defensive', 'elderwood'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 0, interruptible: false }, cooldownSeconds: 10, costs: { tp: 300 },
        effects: [{ type: 'damage', recipient: 'target', stat: 'str', base: 6, coefficient: 1.05 }, { type: 'status', recipient: 'self', status: { id: 'status-barkboar-brace', name: 'Barkboar Brace', category: 'buff', durationSeconds: 15, stackGroup: 'barkboar-brace', stackRule: 'replace', modifiers: { defense: 3 }, flags: { braced: true } } }],
    }),
    'ability-thicket-feint': ability({
        id: 'ability-thicket-feint', name: 'Thicket Feint', kind: 'technique', capabilityId: 'technique-thicket-feint', tags: ['martial', 'weapon-technique', 'dagger', 'mobility', 'elderwood'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 0, interruptible: false }, cooldownSeconds: 8, costs: { tp: 225 },
        effects: [{ type: 'damage', recipient: 'target', stat: 'dex', base: 5, coefficient: 1.0 }, { type: 'status', recipient: 'self', status: { id: 'status-thicket-feint', name: 'Thicket Feint', category: 'buff', durationSeconds: 10, stackGroup: 'thicket-feint', stackRule: 'replace', modifiers: { defense: 1 }, flags: { mobile: true } } }],
    }),
    'ability-barkskin-ward': ability({
        id: 'ability-barkskin-ward', name: 'Barkskin Ward', kind: 'spell', schoolId: 'school-ward-lore', capabilityId: 'spell-barkskin-ward', tags: ['magic', 'warding', 'defensive', 'universal'], contexts: ['combat', 'exploration'], target: { kind: 'self' }, activation: { durationSeconds: 5, interruptible: true }, cooldownSeconds: 22, costs: { mp: 8 },
        effects: [{ type: 'status', recipient: 'self', status: { id: 'status-barkskin-ward', name: 'Barkskin Ward', category: 'buff', durationSeconds: 36, stackGroup: 'ward-defense', stackRule: 'replace', modifiers: { defense: 5 }, flags: { magicalWard: true, barkskin: true } } }],
    }),
    'ability-elderwood-trail-read': ability({ id: 'ability-elderwood-trail-read', name: 'Elderwood Trail Read', kind: 'utility', capabilityId: 'practical-elderwood-trail-read', tags: ['fieldcraft', 'navigation', 'tracking', 'elderwood'], contexts: ['exploration'], target: { kind: 'context' }, activation: { durationSeconds: 3, interruptible: true }, cooldownSeconds: 5, costs: {}, effects: [{ type: 'context', recipient: 'context', operation: 'survey-current-place' }] }),
    'ability-wellspring-mending': ability({ id: 'ability-wellspring-mending', name: 'Wellspring Mending', kind: 'spell', schoolId: 'school-vital-weave', capabilityId: 'spell-wellspring-mending', tags: ['magic', 'restorative', 'support', 'universal'], contexts: ['combat', 'exploration'], target: { kind: 'self' }, activation: { durationSeconds: 5, interruptible: true }, cooldownSeconds: 12, costs: { mp: 10 }, effects: [{ type: 'heal', recipient: 'self', stat: 'mnd', base: 10, coefficient: 1.6 }] }),
    'ability-mistveil-ward': ability({
        id: 'ability-mistveil-ward', name: 'Mistveil Ward', kind: 'spell', schoolId: 'school-ward-lore', capabilityId: 'spell-mistveil-ward', tags: ['magic', 'warding', 'defensive', 'universal'], contexts: ['combat', 'exploration'], target: { kind: 'self' }, activation: { durationSeconds: 5, interruptible: true }, cooldownSeconds: 22, costs: { mp: 8 },
        effects: [{ type: 'status', recipient: 'self', status: { id: 'status-mistveil-ward', name: 'Mistveil Ward', category: 'buff', durationSeconds: 36, stackGroup: 'ward-defense', stackRule: 'replace', modifiers: { defense: 4 }, flags: { magicalWard: true, reedveil: true } } }],
    }),
    'ability-storm-spark': ability({ id: 'ability-storm-spark', name: 'Storm Spark', kind: 'spell', schoolId: 'school-elemental-form', capabilityId: 'spell-storm-spark', tags: ['magic', 'offensive', 'lightning', 'universal'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 5, interruptible: true }, cooldownSeconds: 14, costs: { mp: 11 }, effects: [{ type: 'damage', recipient: 'target', stat: 'int', base: 9, coefficient: 1.45 }] }),
    'ability-starfen-current-reading': ability({ id: 'ability-starfen-current-reading', name: 'Starfen Current Reading', kind: 'utility', capabilityId: 'practical-starfen-current-reading', tags: ['fieldcraft', 'navigation', 'water', 'observation', 'starfen'], contexts: ['exploration'], target: { kind: 'context' }, activation: { durationSeconds: 3, interruptible: true }, cooldownSeconds: 5, costs: {}, effects: [{ type: 'context', recipient: 'context', operation: 'survey-current-place' }] }),
    'ability-cinder-bolt': ability({ id: 'ability-cinder-bolt', name: 'Cinder Bolt', kind: 'spell', schoolId: 'school-elemental-form', capabilityId: 'spell-cinder-bolt', tags: ['magic', 'offensive', 'fire', 'novice'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 4, interruptible: true }, recoverySeconds: 2, cooldownSeconds: 9, costs: { mp: 9 }, effects: [{ type: 'damage', recipient: 'target', stat: 'int', base: 7, coefficient: 1.25, resolution: { delivery: 'projectile', channel: 'magical', damageType: 'spell', element: 'fire', elementSource: 'ability', accuracyModel: 'magic', resistanceModel: 'magicDefense', criticalEligible: false } }] }),
    'ability-stone-shards': ability({ id: 'ability-stone-shards', name: 'Stone Shards', kind: 'spell', schoolId: 'school-elemental-form', capabilityId: 'spell-stone-shards', tags: ['magic', 'offensive', 'earth', 'novice'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 4, interruptible: true }, recoverySeconds: 2, cooldownSeconds: 9, costs: { mp: 9 }, effects: [{ type: 'damage', recipient: 'target', stat: 'int', base: 7, coefficient: 1.25, resolution: { delivery: 'projectile', channel: 'magical', damageType: 'spell', element: 'earth', elementSource: 'ability', accuracyModel: 'magic', resistanceModel: 'magicDefense', criticalEligible: false } }] }),
    'ability-gale-cutter': ability({ id: 'ability-gale-cutter', name: 'Gale Cutter', kind: 'spell', schoolId: 'school-elemental-form', capabilityId: 'spell-gale-cutter', tags: ['magic', 'offensive', 'wind', 'novice'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 4, interruptible: true }, recoverySeconds: 2, cooldownSeconds: 9, costs: { mp: 9 }, effects: [{ type: 'damage', recipient: 'target', stat: 'int', base: 7, coefficient: 1.25, resolution: { delivery: 'spell', channel: 'magical', damageType: 'spell', element: 'wind', elementSource: 'ability', accuracyModel: 'magic', resistanceModel: 'magicDefense', criticalEligible: false } }] }),
    'ability-tide-needle': ability({ id: 'ability-tide-needle', name: 'Tide Needle', kind: 'spell', schoolId: 'school-elemental-form', capabilityId: 'spell-tide-needle', tags: ['magic', 'offensive', 'water', 'novice'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 4, interruptible: true }, recoverySeconds: 2, cooldownSeconds: 9, costs: { mp: 9 }, effects: [{ type: 'damage', recipient: 'target', stat: 'int', base: 7, coefficient: 1.25, resolution: { delivery: 'projectile', channel: 'magical', damageType: 'spell', element: 'water', elementSource: 'ability', accuracyModel: 'magic', resistanceModel: 'magicDefense', criticalEligible: false } }] }),
    'ability-storm-jolt': ability({ id: 'ability-storm-jolt', name: 'Storm Jolt', kind: 'spell', schoolId: 'school-elemental-form', capabilityId: 'spell-storm-jolt', tags: ['magic', 'offensive', 'lightning', 'novice'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 4, interruptible: true }, recoverySeconds: 2, cooldownSeconds: 9, costs: { mp: 9 }, effects: [{ type: 'damage', recipient: 'target', stat: 'int', base: 7, coefficient: 1.25, resolution: { delivery: 'spell', channel: 'magical', damageType: 'spell', element: 'lightning', elementSource: 'ability', accuracyModel: 'magic', resistanceModel: 'magicDefense', criticalEligible: false } }] }),
    'ability-rime-splinters': ability({ id: 'ability-rime-splinters', name: 'Rime Splinters', kind: 'spell', schoolId: 'school-elemental-form', capabilityId: 'spell-rime-splinters', tags: ['magic', 'offensive', 'ice', 'novice'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 4, interruptible: true }, recoverySeconds: 2, cooldownSeconds: 9, costs: { mp: 9 }, effects: [{ type: 'damage', recipient: 'target', stat: 'int', base: 7, coefficient: 1.25, resolution: { delivery: 'projectile', channel: 'magical', damageType: 'spell', element: 'ice', elementSource: 'ability', accuracyModel: 'magic', resistanceModel: 'magicDefense', criticalEligible: false } }] }),
    'ability-sunlance': ability({ id: 'ability-sunlance', name: 'Sunlance', kind: 'spell', schoolId: 'school-elemental-form', capabilityId: 'spell-sunlance', tags: ['magic', 'offensive', 'light', 'novice'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 4, interruptible: true }, recoverySeconds: 2, cooldownSeconds: 9, costs: { mp: 9 }, effects: [{ type: 'damage', recipient: 'target', stat: 'mnd', base: 7, coefficient: 1.25, resolution: { delivery: 'projectile', channel: 'magical', damageType: 'spell', element: 'light', elementSource: 'ability', accuracyModel: 'magic', resistanceModel: 'magicDefense', criticalEligible: false } }] }),
    'ability-gloam-spike': ability({ id: 'ability-gloam-spike', name: 'Gloam Spike', kind: 'spell', schoolId: 'school-elemental-form', capabilityId: 'spell-gloam-spike', tags: ['magic', 'offensive', 'dark', 'novice'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 4, interruptible: true }, recoverySeconds: 2, cooldownSeconds: 9, costs: { mp: 9 }, effects: [{ type: 'damage', recipient: 'target', stat: 'int', base: 7, coefficient: 1.25, resolution: { delivery: 'projectile', channel: 'magical', damageType: 'spell', element: 'dark', elementSource: 'ability', accuracyModel: 'magic', resistanceModel: 'magicDefense', criticalEligible: false } }] }),
    'ability-flare-bloom': ability({ id: 'ability-flare-bloom', name: 'Flare Bloom', kind: 'spell', schoolId: 'school-elemental-form', capabilityId: 'spell-flare-bloom', tags: ['magic', 'offensive', 'fire', 'adept'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 6, interruptible: true }, cooldownSeconds: 18, costs: { mp: 20 }, effects: [{ type: 'damage', recipient: 'target', stat: 'int', base: 16, coefficient: 1.75 }] }),
    'ability-fault-rush': ability({ id: 'ability-fault-rush', name: 'Fault Rush', kind: 'spell', schoolId: 'school-elemental-form', capabilityId: 'spell-fault-rush', tags: ['magic', 'offensive', 'earth', 'adept'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 6, interruptible: true }, cooldownSeconds: 18, costs: { mp: 20 }, effects: [{ type: 'damage', recipient: 'target', stat: 'int', base: 16, coefficient: 1.75 }] }),
    'ability-tempest-ring': ability({ id: 'ability-tempest-ring', name: 'Tempest Ring', kind: 'spell', schoolId: 'school-elemental-form', capabilityId: 'spell-tempest-ring', tags: ['magic', 'offensive', 'wind', 'adept', 'area'], contexts: ['combat'], target: { kind: 'enemy', geometry: { kind: 'ring', center: 'target', radius: 2, maximumTargets: 4 } }, activation: { durationSeconds: 6, interruptible: true }, recoverySeconds: 3, cooldownSeconds: 18, costs: { mp: 20 }, effects: [{ type: 'damage', recipient: 'target', stat: 'int', base: 16, coefficient: 1.75, resolution: { delivery: 'spell', channel: 'magical', damageType: 'spell', element: 'wind', elementSource: 'ability', accuracyModel: 'magic', resistanceModel: 'magicDefense', criticalEligible: false } }] }),
    'ability-riptide-lance': ability({ id: 'ability-riptide-lance', name: 'Riptide Lance', kind: 'spell', schoolId: 'school-elemental-form', capabilityId: 'spell-riptide-lance', tags: ['magic', 'offensive', 'water', 'adept'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 6, interruptible: true }, cooldownSeconds: 18, costs: { mp: 20 }, effects: [{ type: 'damage', recipient: 'target', stat: 'int', base: 16, coefficient: 1.75 }] }),
    'ability-thunder-cage': ability({ id: 'ability-thunder-cage', name: 'Thunder Cage', kind: 'spell', schoolId: 'school-elemental-form', capabilityId: 'spell-thunder-cage', tags: ['magic', 'offensive', 'lightning', 'adept', 'control'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 6, interruptible: true }, recoverySeconds: 3, cooldownSeconds: 18, costs: { mp: 20 }, effects: [{ type: 'damage', recipient: 'target', stat: 'int', base: 16, coefficient: 1.75, resolution: { delivery: 'spell', channel: 'magical', damageType: 'spell', element: 'lightning', elementSource: 'ability', accuracyModel: 'magic', resistanceModel: 'magicDefense', criticalEligible: false } }, { type: 'status', recipient: 'target', resolution: { delivery: 'spell', channel: 'magical', element: 'lightning', elementSource: 'ability', accuracyModel: 'magic', resistanceModel: 'magicEvasion' }, status: { id: 'status-thunder-cage', name: 'Thunder Cage', category: 'debuff', durationSeconds: 6, stackGroup: 'elemental-control-cage', stackRule: 'replace', modifiers: {}, flags: { cannotAct: true, caged: true } } }] }),
    'ability-rimefall': ability({ id: 'ability-rimefall', name: 'Rimefall', kind: 'spell', schoolId: 'school-elemental-form', capabilityId: 'spell-rimefall', tags: ['magic', 'offensive', 'ice', 'adept'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 6, interruptible: true }, cooldownSeconds: 18, costs: { mp: 20 }, effects: [{ type: 'damage', recipient: 'target', stat: 'int', base: 16, coefficient: 1.75 }] }),
    'ability-radiant-arc': ability({ id: 'ability-radiant-arc', name: 'Radiant Arc', kind: 'spell', schoolId: 'school-elemental-form', capabilityId: 'spell-radiant-arc', tags: ['magic', 'offensive', 'light', 'adept', 'area', 'propagation'], contexts: ['combat'], target: { kind: 'enemy', geometry: { kind: 'arc', jumpRange: 2, maximumTargets: 3, repeatTargets: false, ordering: 'nearest-then-encounter-order' } }, activation: { durationSeconds: 6, interruptible: true }, recoverySeconds: 3, cooldownSeconds: 18, costs: { mp: 20 }, effects: [{ type: 'damage', recipient: 'target', stat: 'mnd', base: 16, coefficient: 1.75, resolution: { delivery: 'spell', channel: 'magical', damageType: 'spell', element: 'light', elementSource: 'ability', accuracyModel: 'magic', resistanceModel: 'magicDefense', criticalEligible: false } }] }),
    'ability-umbral-well': ability({ id: 'ability-umbral-well', name: 'Umbral Well', kind: 'spell', schoolId: 'school-elemental-form', capabilityId: 'spell-umbral-well', tags: ['magic', 'offensive', 'dark', 'adept', 'field', 'area'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 6, interruptible: true }, recoverySeconds: 3, cooldownSeconds: 18, costs: { mp: 20 }, effects: [{ type: 'damage', recipient: 'target', stat: 'int', base: 16, coefficient: 1.75, resolution: { delivery: 'spell', channel: 'magical', damageType: 'spell', element: 'dark', elementSource: 'ability', accuracyModel: 'magic', resistanceModel: 'magicDefense', criticalEligible: false } }, { type: 'field', recipient: 'target', field: { durationSeconds: 12, pulseSeconds: 4, geometry: { kind: 'radius', radius: 2, maximumTargets: 4 }, effect: { type: 'damage', stat: 'int', base: 4, coefficient: 0.45, resolution: { delivery: 'spell', channel: 'magical', damageType: 'spell', element: 'dark', elementSource: 'ability', accuracyModel: 'magic', resistanceModel: 'magicDefense', criticalEligible: false } } } }] }),
    'ability-renewing-pulse': ability({ id: 'ability-renewing-pulse', name: 'Renewing Pulse', kind: 'spell', schoolId: 'school-vital-weave', capabilityId: 'spell-renewing-pulse', tags: ['magic', 'restorative', 'adept'], contexts: ['combat', 'exploration'], target: { kind: 'self' }, activation: { durationSeconds: 5, interruptible: true }, cooldownSeconds: 16, costs: { mp: 16 }, effects: [{ type: 'heal', recipient: 'self', stat: 'mnd', base: 18, coefficient: 2.2 }] }),
    'ability-steady-heart': ability({ id: 'ability-steady-heart', name: 'Steady Heart', kind: 'spell', schoolId: 'school-ward-lore', capabilityId: 'spell-steady-heart', tags: ['magic', 'support', 'focus'], contexts: ['combat', 'exploration'], target: { kind: 'self' }, activation: { durationSeconds: 4, interruptible: true }, cooldownSeconds: 22, costs: { mp: 12 }, effects: [{ type: 'status', recipient: 'self', status: { id: 'status-steady-heart', name: 'Steady Heart', category: 'buff', durationSeconds: 45, stackGroup: 'magic-focus', stackRule: 'replace', modifiers: {"attack":4,"accuracy":3}, flags: {"focused":true} } }] }),
    'ability-spellguard': ability({ id: 'ability-spellguard', name: 'Spellguard', kind: 'spell', schoolId: 'school-ward-lore', capabilityId: 'spell-spellguard', tags: ['magic', 'support', 'magic-defense'], contexts: ['combat', 'exploration'], target: { kind: 'self' }, activation: { durationSeconds: 4, interruptible: true }, cooldownSeconds: 24, costs: { mp: 13 }, effects: [{ type: 'status', recipient: 'self', status: { id: 'status-spellguard', name: 'Spellguard', category: 'buff', durationSeconds: 45, stackGroup: 'magic-defense', stackRule: 'replace', modifiers: {"magicDefense":5,"magicEvasion":3}, flags: {"spellguard":true} } }] }),
    'ability-swiftstep': ability({ id: 'ability-swiftstep', name: 'Swiftstep', kind: 'spell', schoolId: 'school-ward-lore', capabilityId: 'spell-swiftstep', tags: ['magic', 'support', 'mobility'], contexts: ['combat', 'exploration'], target: { kind: 'self' }, activation: { durationSeconds: 3, interruptible: true }, cooldownSeconds: 20, costs: { mp: 11 }, effects: [{ type: 'status', recipient: 'self', status: { id: 'status-swiftstep', name: 'Swiftstep', category: 'buff', durationSeconds: 35, stackGroup: 'magic-mobility', stackRule: 'replace', modifiers: {"haste":5,"evasion":4}, flags: {"swiftstep":true} } }] }),
    'ability-fracture-sigil': ability({ id: 'ability-fracture-sigil', name: 'Fracture Sigil', kind: 'spell', schoolId: 'school-veilscript', capabilityId: 'spell-fracture-sigil', tags: ['magic', 'veilscript', 'ninjutsu', 'debuff'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 3, interruptible: true }, recoverySeconds: 2, cooldownSeconds: 14, costs: { mp: 8 }, effects: [{ type: 'status', recipient: 'target', resolution: { delivery: 'sigil', channel: 'magical', accuracyModel: 'magic', accuracyModifier: 5, resistanceModel: 'magicEvasion' }, status: { id: 'status-fracture-sigil', name: 'Fracture Sigil', category: 'debuff', durationSeconds: 30, stackGroup: 'sigil-defense', stackRule: 'replace', modifiers: {"defense":-4}, flags: {"fractured":true} } }] }),
    'ability-haze-sigil': ability({ id: 'ability-haze-sigil', name: 'Haze Sigil', kind: 'spell', schoolId: 'school-veilscript', capabilityId: 'spell-haze-sigil', tags: ['magic', 'veilscript', 'ninjutsu', 'debuff'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 3, interruptible: true }, cooldownSeconds: 14, costs: { mp: 8 }, effects: [{ type: 'status', recipient: 'target', status: { id: 'status-haze-sigil', name: 'Haze Sigil', category: 'debuff', durationSeconds: 30, stackGroup: 'sigil-accuracy', stackRule: 'replace', modifiers: {"accuracy":-5}, flags: {"hazed":true} } }] }),
    'ability-snare-sigil': ability({ id: 'ability-snare-sigil', name: 'Snare Sigil', kind: 'spell', schoolId: 'school-veilscript', capabilityId: 'spell-snare-sigil', tags: ['magic', 'veilscript', 'ninjutsu', 'debuff'], contexts: ['combat'], target: { kind: 'enemy' }, activation: { durationSeconds: 4, interruptible: true }, cooldownSeconds: 16, costs: { mp: 10 }, effects: [{ type: 'status', recipient: 'target', status: { id: 'status-snare-sigil', name: 'Snare Sigil', category: 'debuff', durationSeconds: 30, stackGroup: 'sigil-evasion', stackRule: 'replace', modifiers: {"evasion":-4,"movementSpeed":-5}, flags: {"snared":true} } }] }),
    'ability-guardian-sigil': ability({ id: 'ability-guardian-sigil', name: 'Guardian Sigil', kind: 'spell', schoolId: 'school-veilscript', capabilityId: 'spell-guardian-sigil', tags: ['magic', 'veilscript', 'ninjutsu', 'warding'], contexts: ['combat', 'exploration'], target: { kind: 'self' }, activation: { durationSeconds: 3, interruptible: true }, cooldownSeconds: 20, costs: { mp: 10 }, effects: [{ type: 'status', recipient: 'self', status: { id: 'status-guardian-sigil', name: 'Guardian Sigil', category: 'buff', durationSeconds: 35, stackGroup: 'sigil-guard', stackRule: 'replace', modifiers: {"defense":5,"evasion":2}, flags: {"guardianSigil":true} } }] }),
});

export function getSpellSchool(schoolId) { return SPELL_SCHOOLS[String(schoolId ?? '').trim()] ?? null; }
export function listSpellSchools() { return Object.values(SPELL_SCHOOLS); }
export function getAbility(abilityId) { return ABILITIES[String(abilityId ?? '').trim()] ?? null; }
export function findAbility(query) { const normalized = normalize(query); if (!normalized) return null; return getAbility(normalized) ?? listAbilities().find((entry) => normalize(entry.name) === normalized) ?? listAbilities().find((entry) => normalize(entry.name).includes(normalized) || entry.id.includes(normalized)) ?? null; }
export function listAbilities() { return Object.values(ABILITIES); }

export function validateAbilityCatalog() {
    const issues = [];
    const schoolIds = new Set();
    for (const entry of listSpellSchools()) {
        if (!stableId(entry.id, 'school-')) issues.push(`Spell school id is invalid: ${entry.id}.`);
        if (schoolIds.has(entry.id)) issues.push(`Duplicate spell school id ${entry.id}.`);
        schoolIds.add(entry.id);
        if (!entry.name) issues.push(`${entry.id} is missing name.`);
        if (!entry.tradition) issues.push(`${entry.id} is missing tradition.`);
        if (!Array.isArray(entry.tags)) issues.push(`${entry.id} tags must be an array.`);
    }
    const abilityIds = new Set();
    for (const entry of listAbilities()) {
        if (!stableId(entry.id, 'ability-')) issues.push(`Ability id is invalid: ${entry.id}.`);
        if (abilityIds.has(entry.id)) issues.push(`Duplicate ability id ${entry.id}.`);
        abilityIds.add(entry.id);
        if (!entry.name) issues.push(`${entry.id} is missing name.`);
        if (!ABILITY_KINDS.includes(entry.kind)) issues.push(`${entry.id} has unknown kind ${entry.kind}.`);
        if (entry.kind === 'spell' && !entry.schoolId) issues.push(`${entry.id} spell is missing schoolId.`);
        if (entry.schoolId && !getSpellSchool(entry.schoolId)) issues.push(`${entry.id} references unknown school ${entry.schoolId}.`);
        if (!getCapability(entry.capabilityId)) issues.push(`${entry.id} references unknown capability ${entry.capabilityId}.`);
        if (!Array.isArray(entry.tags)) issues.push(`${entry.id} tags must be an array.`);
        if (!Array.isArray(entry.contexts) || !entry.contexts.length) issues.push(`${entry.id} contexts must be a non-empty array.`);
        for (const context of entry.contexts ?? []) if (!ABILITY_CONTEXTS.includes(context)) issues.push(`${entry.id} references unknown context ${context}.`);
        if (!ABILITY_TARGET_KINDS.includes(entry.target?.kind)) issues.push(`${entry.id} has invalid target kind ${entry.target?.kind}.`);
        validateTargetGeometry(entry, issues);
        if (!nonNegativeInteger(entry.activation?.durationSeconds)) issues.push(`${entry.id} activation duration must be a non-negative integer.`);
        if (typeof entry.activation?.interruptible !== 'boolean') issues.push(`${entry.id} activation interruptible must be boolean.`);
        if (!nonNegativeInteger(entry.recoverySeconds)) issues.push(`${entry.id} recoverySeconds must be a non-negative integer.`);
        if (!nonNegativeInteger(entry.cooldownSeconds)) issues.push(`${entry.id} cooldownSeconds must be a non-negative integer.`);
        for (const [resourceId, amount] of Object.entries(entry.costs ?? {})) { if (!ABILITY_RESOURCE_KEYS.includes(resourceId)) issues.push(`${entry.id} references unknown cost resource ${resourceId}.`); if (!nonNegativeInteger(amount)) issues.push(`${entry.id} has invalid ${resourceId} cost.`); }
        if (!Array.isArray(entry.effects) || !entry.effects.length) issues.push(`${entry.id} effects must be a non-empty array.`);
        for (const [index, effect] of (entry.effects ?? []).entries()) validateEffect(entry, effect, index, issues);
    }
    return issues;
}

function validateTargetGeometry(abilityDefinition, issues) {
    const geometry = abilityDefinition.target?.geometry;
    if (geometry === undefined) return;
    if (!geometry || typeof geometry !== 'object' || Array.isArray(geometry)) {
        issues.push(`${abilityDefinition.id}.target.geometry must be an object.`);
        return;
    }
    if (abilityDefinition.target.kind !== 'enemy') issues.push(`${abilityDefinition.id}.target.geometry currently requires enemy targeting.`);
    if (!ABILITY_GEOMETRY_KINDS.includes(geometry.kind)) issues.push(`${abilityDefinition.id}.target.geometry.kind is invalid: ${geometry.kind}.`);
    if (geometry.kind === 'ring') {
        if (geometry.center !== 'target') issues.push(`${abilityDefinition.id}.target.geometry.center must be target for ring geometry.`);
        if (!Number.isFinite(Number(geometry.radius)) || Number(geometry.radius) <= 0) issues.push(`${abilityDefinition.id}.target.geometry.radius must be positive.`);
        if (!positiveInteger(geometry.maximumTargets)) issues.push(`${abilityDefinition.id}.target.geometry.maximumTargets must be a positive integer.`);
    }
    if (geometry.kind === 'arc') {
        if (!Number.isFinite(Number(geometry.jumpRange)) || Number(geometry.jumpRange) <= 0) issues.push(`${abilityDefinition.id}.target.geometry.jumpRange must be positive.`);
        if (!positiveInteger(geometry.maximumTargets) || geometry.maximumTargets < 2) issues.push(`${abilityDefinition.id}.target.geometry.maximumTargets must be an integer of at least 2.`);
        if (geometry.repeatTargets !== false) issues.push(`${abilityDefinition.id}.target.geometry.repeatTargets must be false for arc geometry.`);
        if (geometry.ordering !== 'nearest-then-encounter-order') issues.push(`${abilityDefinition.id}.target.geometry.ordering must be nearest-then-encounter-order.`);
    }
}

function validateEffect(abilityDefinition, effect, index, issues) {
    const prefix = `${abilityDefinition.id}.effects[${index}]`;
    if (!effect || typeof effect !== 'object' || Array.isArray(effect)) { issues.push(`${prefix} must be an object.`); return; }
    if (!ABILITY_EFFECT_TYPES.includes(effect.type)) issues.push(`${prefix} has unknown type ${effect.type}.`);
    if (!['self', 'target', 'context'].includes(effect.recipient)) issues.push(`${prefix} has invalid recipient ${effect.recipient}.`);
    if (effect.type === 'damage' || effect.type === 'heal') { if (!ABILITY_SCALING_STATS.includes(effect.stat)) issues.push(`${prefix} has invalid scaling stat ${effect.stat}.`); if (!nonNegativeNumber(effect.base)) issues.push(`${prefix} base must be non-negative.`); if (!nonNegativeNumber(effect.coefficient)) issues.push(`${prefix} coefficient must be non-negative.`); }
    if (effect.type === 'status') { const status = effect.status; if (!status || typeof status !== 'object' || Array.isArray(status)) issues.push(`${prefix}.status must be an object.`); else { if (!stableId(status.id, 'status-')) issues.push(`${prefix}.status.id is invalid.`); if (!positiveInteger(status.durationSeconds)) issues.push(`${prefix}.status.durationSeconds must be positive.`); if (!status.stackGroup) issues.push(`${prefix}.status.stackGroup is required.`); if (!['replace', 'ignore', 'stack'].includes(status.stackRule)) issues.push(`${prefix}.status.stackRule is invalid.`); } }
    if (effect.type === 'field') validateFieldDefinition(abilityDefinition, effect, prefix, issues);
    if (effect.resolution !== undefined) validateResolution(effect.resolution, prefix, issues);
    if (effect.type === 'context' && !effect.operation) issues.push(`${prefix}.operation is required.`);
}

function validateFieldDefinition(abilityDefinition, effect, prefix, issues) {
    const field = effect.field;
    if (effect.recipient !== 'target') issues.push(`${prefix} field recipient must be target.`);
    if (!abilityDefinition.contexts.includes('combat')) issues.push(`${prefix} field effects require combat context.`);
    if (!field || typeof field !== 'object' || Array.isArray(field)) {
        issues.push(`${prefix}.field must be an object.`);
        return;
    }
    if (!positiveInteger(field.durationSeconds)) issues.push(`${prefix}.field.durationSeconds must be positive.`);
    if (!positiveInteger(field.pulseSeconds)) issues.push(`${prefix}.field.pulseSeconds must be positive.`);
    if (positiveInteger(field.durationSeconds) && positiveInteger(field.pulseSeconds)) {
        if (field.pulseSeconds > field.durationSeconds) issues.push(`${prefix}.field.pulseSeconds must not exceed durationSeconds.`);
        if (field.durationSeconds % field.pulseSeconds !== 0) issues.push(`${prefix}.field duration must contain a whole number of pulses.`);
    }
    if (!field.geometry || typeof field.geometry !== 'object' || Array.isArray(field.geometry)) issues.push(`${prefix}.field.geometry must be an object.`);
    else {
        if (field.geometry.kind !== 'radius') issues.push(`${prefix}.field.geometry.kind must be radius.`);
        if (!Number.isFinite(Number(field.geometry.radius)) || Number(field.geometry.radius) <= 0) issues.push(`${prefix}.field.geometry.radius must be positive.`);
        if (!positiveInteger(field.geometry.maximumTargets)) issues.push(`${prefix}.field.geometry.maximumTargets must be a positive integer.`);
    }
    const pulse = field.effect;
    if (!pulse || typeof pulse !== 'object' || Array.isArray(pulse)) {
        issues.push(`${prefix}.field.effect must be an object.`);
        return;
    }
    if (pulse.type !== 'damage') issues.push(`${prefix}.field.effect.type must be damage.`);
    if (!ABILITY_SCALING_STATS.includes(pulse.stat)) issues.push(`${prefix}.field.effect.stat is invalid.`);
    if (!nonNegativeNumber(pulse.base)) issues.push(`${prefix}.field.effect.base must be non-negative.`);
    if (!nonNegativeNumber(pulse.coefficient)) issues.push(`${prefix}.field.effect.coefficient must be non-negative.`);
    validateResolution(pulse.resolution, `${prefix}.field.effect`, issues);
}

function validateResolution(resolution, prefix, issues) {
    if (!resolution || typeof resolution !== 'object' || Array.isArray(resolution)) { issues.push(`${prefix}.resolution must be an object.`); return; }
    if (resolution.delivery !== undefined && !['melee', 'projectile', 'spell', 'sigil', 'contact'].includes(resolution.delivery)) issues.push(`${prefix}.resolution.delivery is invalid.`);
    if (resolution.channel !== undefined && !['physical', 'magical', 'hybrid'].includes(resolution.channel)) issues.push(`${prefix}.resolution.channel is invalid.`);
    if (resolution.element !== undefined && resolution.element !== null && !ELEMENT_KEYS.includes(resolution.element)) issues.push(`${prefix}.resolution.element is invalid.`);
    if (resolution.accuracyModel !== undefined && !['physical', 'magic', 'automatic'].includes(resolution.accuracyModel)) issues.push(`${prefix}.resolution.accuracyModel is invalid.`);
    if (resolution.resistanceModel !== undefined && !['physicalDefense', 'magicDefense', 'magicEvasion', 'none'].includes(resolution.resistanceModel)) issues.push(`${prefix}.resolution.resistanceModel is invalid.`);
    if (resolution.defensePenetration !== undefined && (!Number.isFinite(Number(resolution.defensePenetration)) || Number(resolution.defensePenetration) < 0 || Number(resolution.defensePenetration) > 0.9)) issues.push(`${prefix}.resolution.defensePenetration must be between 0 and 0.9.`);
    for (const key of ['accuracyModifier', 'flatPenetration', 'criticalRateModifier', 'criticalBonusPercent']) if (resolution[key] !== undefined && !Number.isFinite(Number(resolution[key]))) issues.push(`${prefix}.resolution.${key} must be numeric.`);
    if (resolution.criticalEligible !== undefined && typeof resolution.criticalEligible !== 'boolean') issues.push(`${prefix}.resolution.criticalEligible must be boolean.`);
}
function school(definition) { return deepFreeze({ id: String(definition.id), name: String(definition.name), tradition: String(definition.tradition), tags: [...(definition.tags ?? [])] }); }
function ability(definition) { return deepFreeze({ id: String(definition.id), name: String(definition.name), kind: definition.kind, schoolId: definition.schoolId ? String(definition.schoolId) : null, capabilityId: String(definition.capabilityId), tags: [...(definition.tags ?? [])], contexts: [...(definition.contexts ?? [])], target: { ...(definition.target ?? {}), ...(definition.target?.geometry ? { geometry: { ...definition.target.geometry } } : {}) }, activation: { durationSeconds: Math.max(0, Math.floor(Number(definition.activation?.durationSeconds) || 0)), interruptible: definition.activation?.interruptible === true }, recoverySeconds: Math.max(0, Math.floor(Number(definition.recoverySeconds) || 0)), cooldownSeconds: Math.max(0, Math.floor(Number(definition.cooldownSeconds) || 0)), costs: { ...(definition.costs ?? {}) }, effects: (definition.effects ?? []).map((effect) => ({ ...effect, resolution: effect.resolution ? { ...effect.resolution } : undefined, status: effect.status ? { ...effect.status, modifiers: { ...(effect.status.modifiers ?? {}) }, flags: { ...(effect.status.flags ?? {}) } } : undefined, ...(effect.field ? { field: { ...effect.field, geometry: { ...(effect.field.geometry ?? {}) }, effect: { ...(effect.field.effect ?? {}), resolution: effect.field.effect?.resolution ? { ...effect.field.effect.resolution } : undefined } } } : {}) })) }); }
function normalize(value) { return String(value ?? '').trim().toLowerCase().replace(/\s+/g, '-'); }
function stableId(value, prefix) { return typeof value === 'string' && value.startsWith(prefix) && /^[a-z][a-z0-9-]*$/.test(value); }
function positiveInteger(value) { return Number.isInteger(value) && value > 0; }
function nonNegativeInteger(value) { return Number.isInteger(value) && value >= 0; }
function nonNegativeNumber(value) { return Number.isFinite(value) && value >= 0; }
function deepFreeze(value) { if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value; for (const child of Object.values(value)) deepFreeze(child); return Object.freeze(value); }
