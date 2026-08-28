import { getPlace } from './places.js';
import { getCanonicalResourceItem } from './resourceItemRegistry.js';

export const REGIONAL_ECOLOGY_VERSION = 3;

const FAMILIES = Object.freeze({
    'family-barkboar': family('family-barkboar', 'Barkboar', ['beast', 'omnivore', 'forest']),
    'family-lantern-moth': family('family-lantern-moth', 'Lantern Moth', ['insect', 'nocturnal', 'forest']),
    'family-ridge-ibex': family('family-ridge-ibex', 'Ridge Ibex', ['beast', 'herbivore', 'upland']),
    'family-glass-shell': family('family-glass-shell', 'Glass-Shell Crawler', ['arthropod', 'scavenger', 'rocky']),
    'family-mire-heron': family('family-mire-heron', 'Mire Heron', ['bird', 'predator', 'wetland']),
    'family-reed-eel': family('family-reed-eel', 'Reed Eel', ['fish', 'wetland', 'aquatic']),
    'family-fox': family('family-fox', 'Fox', ['beast', 'carnivore', 'forest']),
    'family-otter': family('family-otter', 'River Otter', ['beast', 'carnivore', 'riverine']),
    'family-owl': family('family-owl', 'Owl', ['bird', 'predator', 'nocturnal']),
    'family-bee': family('family-bee', 'Bee', ['insect', 'pollinator', 'social']),
    'family-turtle': family('family-turtle', 'River Turtle', ['reptile', 'omnivore', 'riverine']),
    'family-marmot': family('family-marmot', 'Marmot', ['beast', 'herbivore', 'upland']),
    'family-lizard': family('family-lizard', 'Lizard', ['reptile', 'insectivore', 'arid']),
    'family-scorpion': family('family-scorpion', 'Scorpion', ['arachnid', 'predator', 'arid']),
    'family-salamander': family('family-salamander', 'Cave Salamander', ['amphibian', 'insectivore', 'subterranean']),
    'family-vulture': family('family-vulture', 'Vulture', ['bird', 'scavenger', 'upland']),
    'family-frog': family('family-frog', 'Frog', ['amphibian', 'insectivore', 'wetland']),
    'family-crab': family('family-crab', 'Reed Crab', ['crustacean', 'omnivore', 'wetland']),
    'family-waterfowl': family('family-waterfowl', 'Waterfowl', ['bird', 'omnivore', 'wetland']),
    'family-mussel': family('family-mussel', 'Freshwater Mussel', ['mollusk', 'filter-feeder', 'aquatic']),
    'family-spider': family('family-spider', 'Spider', ['arachnid', 'predator', 'ruin']),
    'family-courser': family('family-courser', 'Steppe Courser', ['beast', 'herbivore', 'steppe']),
    'family-steppe-wolf': family('family-steppe-wolf', 'Steppe Wolf', ['beast', 'carnivore', 'steppe']),
    'family-bustard': family('family-bustard', 'Bustard', ['bird', 'ground-bird', 'steppe']),
    'family-locust': family('family-locust', 'Locust', ['insect', 'herbivore', 'steppe']),
    'family-steppe-kite': family('family-steppe-kite', 'Steppe Kite', ['bird', 'predator', 'steppe']),
});

const SPECIES = Object.freeze({
    'species-elderwood-barkboar': species({
        id: 'species-elderwood-barkboar', name: 'Elderwood Barkboar', familyId: 'family-barkboar', ecosystem: 'beast',
        habitatTags: ['temperate-woodland', 'root-thicket'], behavior: behavior('territorial', ['sight', 'sound'], 'sounder', []),
        encounterTemplateId: 'enemy-elderwood-barkboar',
    }),
    'species-elderwood-lantern-moth': species({
        id: 'species-elderwood-lantern-moth', name: 'Lantern Moth', familyId: 'family-lantern-moth', ecosystem: 'insect',
        habitatTags: ['old-growth', 'flowering-glade'], behavior: behavior('passive', [], 'swarm', []), encounterTemplateId: null,
    }),
    'species-redstone-ridge-ibex': species({
        id: 'species-redstone-ridge-ibex', name: 'Redstone Ridge Ibex', familyId: 'family-ridge-ibex', ecosystem: 'beast',
        habitatTags: ['dry-upland', 'exposed-ridge'], behavior: behavior('wary', ['sight', 'sound'], 'herd', []),
        encounterTemplateId: 'enemy-redstone-ridge-ibex',
    }),
    'species-redstone-glass-shell': species({
        id: 'species-redstone-glass-shell', name: 'Glass-Shell Crawler', familyId: 'family-glass-shell', ecosystem: 'arthropod',
        habitatTags: ['scree', 'mine-tailings'], behavior: behavior('territorial', ['vibration'], 'cluster', []), encounterTemplateId: null,
    }),
    'species-starfen-mire-heron': species({
        id: 'species-starfen-mire-heron', name: 'Mirecrest Heron', familyId: 'family-mire-heron', ecosystem: 'bird',
        habitatTags: ['wetland', 'shallow-water'], behavior: behavior('wary', ['sight'], 'solitary', ['family-reed-eel']),
        encounterTemplateId: 'enemy-starfen-mire-heron',
    }),
    'species-starfen-reed-eel': species({
        id: 'species-starfen-reed-eel', name: 'Reed Eel', familyId: 'family-reed-eel', ecosystem: 'fish',
        habitatTags: ['wetland', 'reed-channel'], behavior: behavior('passive', ['vibration'], 'shoal', []), encounterTemplateId: null,
    }),
    'species-elderwood-embercoat-fox': species({
        id: 'species-elderwood-embercoat-fox', name: 'Embercoat Fox', familyId: 'family-fox', ecosystem: 'beast',
        habitatTags: ['temperate-woodland', 'forest-edge'], behavior: behavior('wary', ['sight', 'sound'], 'solitary', []), encounterTemplateId: null,
    }),
    'species-timbercross-river-otter': species({
        id: 'species-timbercross-river-otter', name: 'Timbercross River Otter', familyId: 'family-otter', ecosystem: 'beast',
        habitatTags: ['riverbank', 'timber-landing'], behavior: behavior('wary', ['sight', 'sound'], 'pair', []), encounterTemplateId: null,
    }),
    'species-elderwood-moss-owl': species({
        id: 'species-elderwood-moss-owl', name: 'Moss Owl', familyId: 'family-owl', ecosystem: 'bird',
        habitatTags: ['old-growth', 'forest-canopy'], behavior: behavior('territorial', ['sight', 'sound'], 'solitary', []), encounterTemplateId: null,
    }),
    'species-elderwood-amber-bee': species({
        id: 'species-elderwood-amber-bee', name: 'Amber Bee', familyId: 'family-bee', ecosystem: 'insect',
        habitatTags: ['flowering-glade', 'forest-edge'], behavior: behavior('passive', ['sight'], 'swarm', []), encounterTemplateId: null,
    }),
    'species-timbercross-moss-shell-turtle': species({
        id: 'species-timbercross-moss-shell-turtle', name: 'Moss-Shell River Turtle', familyId: 'family-turtle', ecosystem: 'reptile',
        habitatTags: ['riverbank', 'shallow-water'], behavior: behavior('passive', ['sight'], 'basking-group', []), encounterTemplateId: null,
    }),
    'species-redstone-crag-marmot': species({
        id: 'species-redstone-crag-marmot', name: 'Crag Marmot', familyId: 'family-marmot', ecosystem: 'beast',
        habitatTags: ['wind-scoured-ridge', 'rocky-upland'], behavior: behavior('wary', ['sight', 'sound'], 'colony', []), encounterTemplateId: null,
    }),
    'species-redstone-sunscale-lizard': species({
        id: 'species-redstone-sunscale-lizard', name: 'Sunscale Lizard', familyId: 'family-lizard', ecosystem: 'reptile',
        habitatTags: ['dry-upland', 'sun-baked-scree'], behavior: behavior('passive', ['sight'], 'solitary', []), encounterTemplateId: null,
    }),
    'species-redstone-ironclaw-scorpion': species({
        id: 'species-redstone-ironclaw-scorpion', name: 'Ironclaw Scorpion', familyId: 'family-scorpion', ecosystem: 'arachnid',
        habitatTags: ['quarry-rubble', 'dry-wash'], behavior: behavior('territorial', ['vibration'], 'solitary', []), encounterTemplateId: null,
    }),
    'species-deepvein-glass-salamander': species({
        id: 'species-deepvein-glass-salamander', name: 'Glass Salamander', familyId: 'family-salamander', ecosystem: 'amphibian',
        habitatTags: ['cave', 'seep-wall'], behavior: behavior('passive', ['vibration'], 'solitary', []), encounterTemplateId: null,
    }),
    'species-redstone-cliff-vulture': species({
        id: 'species-redstone-cliff-vulture', name: 'Cliff Vulture', familyId: 'family-vulture', ecosystem: 'bird',
        habitatTags: ['wind-scoured-ridge', 'cliff'], behavior: behavior('wary', ['sight'], 'flock', []), encounterTemplateId: null,
    }),
    'species-starfen-bellfrog': species({
        id: 'species-starfen-bellfrog', name: 'Starfen Bellfrog', familyId: 'family-frog', ecosystem: 'amphibian',
        habitatTags: ['wetland', 'reed-margin'], behavior: behavior('passive', ['sound'], 'chorus', []), encounterTemplateId: null,
    }),
    'species-starfen-reed-crab': species({
        id: 'species-starfen-reed-crab', name: 'Reed Crab', familyId: 'family-crab', ecosystem: 'crustacean',
        habitatTags: ['mudflat', 'shallow-water'], behavior: behavior('territorial', ['vibration'], 'cluster', []), encounterTemplateId: null,
    }),
    'species-starfen-fen-duck': species({
        id: 'species-starfen-fen-duck', name: 'Fen Duck', familyId: 'family-waterfowl', ecosystem: 'bird',
        habitatTags: ['grass-island', 'shallow-water'], behavior: behavior('wary', ['sight', 'sound'], 'flock', []), encounterTemplateId: null,
    }),
    'species-starfen-pearl-mussel': species({
        id: 'species-starfen-pearl-mussel', name: 'Fen Pearl Mussel', familyId: 'family-mussel', ecosystem: 'mollusk',
        habitatTags: ['shallow-water', 'mud-bed'], behavior: behavior('passive', [], 'bed', []), encounterTemplateId: null,
    }),
    'species-archive-threadspider': species({
        id: 'species-archive-threadspider', name: 'Archive Threadspider', familyId: 'family-spider', ecosystem: 'arachnid',
        habitatTags: ['ruin', 'dry-chamber'], behavior: behavior('territorial', ['vibration'], 'solitary', []), encounterTemplateId: null,
    }),
    'species-coppergrass-dun-courser': species({
        id: 'species-coppergrass-dun-courser', name: 'Dun Courser', familyId: 'family-courser', ecosystem: 'beast',
        habitatTags: ['temperate-steppe', 'open-grassland'], behavior: behavior('wary', ['sight', 'sound'], 'herd', []), encounterTemplateId: null,
    }),
    'species-coppergrass-slateback-wolf': species({
        id: 'species-coppergrass-slateback-wolf', name: 'Slateback Wolf', familyId: 'family-steppe-wolf', ecosystem: 'beast',
        habitatTags: ['temperate-steppe', 'dry-swale'], behavior: behavior('territorial', ['sight', 'sound'], 'pack', ['family-courser']), encounterTemplateId: null,
    }),
    'species-coppergrass-tallcrest-bustard': species({
        id: 'species-coppergrass-tallcrest-bustard', name: 'Tallcrest Bustard', familyId: 'family-bustard', ecosystem: 'bird',
        habitatTags: ['open-grassland', 'seasonal-basin'], behavior: behavior('wary', ['sight', 'sound'], 'flock', []), encounterTemplateId: null,
    }),
    'species-coppergrass-copperwing-locust': species({
        id: 'species-coppergrass-copperwing-locust', name: 'Copperwing Locust', familyId: 'family-locust', ecosystem: 'insect',
        habitatTags: ['temperate-steppe', 'seedgrass'], behavior: behavior('passive', ['vibration'], 'swarm', []), encounterTemplateId: null,
    }),
    'species-coppergrass-stormglass-kite': species({
        id: 'species-coppergrass-stormglass-kite', name: 'Stormglass Kite', familyId: 'family-steppe-kite', ecosystem: 'bird',
        habitatTags: ['open-grassland', 'wind-ridge'], behavior: behavior('wary', ['sight'], 'solitary', ['family-locust']), encounterTemplateId: null,
    }),
});

const POPULATIONS = Object.freeze({
    'population-west-elderwood-barkboars': population({
        id: 'population-west-elderwood-barkboars', speciesId: 'species-elderwood-barkboar', placeId: 'west-elderwood',
        biomeTags: ['temperate-woodland', 'root-thicket'], capacity: 5, density: 'moderate', rarity: 'common', respawn: regeneration(1, 2400),
    }),
    'population-west-elderwood-lantern-moths': population({
        id: 'population-west-elderwood-lantern-moths', speciesId: 'species-elderwood-lantern-moth', placeId: 'west-elderwood',
        biomeTags: ['old-growth', 'flowering-glade'], capacity: 6, density: 'moderate', rarity: 'uncommon', respawn: regeneration(1, 1800),
        appearanceConditions: [{ type: 'timeWindow', startHour: 18, endHour: 24 }],
    }),
    'population-south-redstone-ridge-ibex': population({
        id: 'population-south-redstone-ridge-ibex', speciesId: 'species-redstone-ridge-ibex', placeId: 'south-redstone-reach',
        biomeTags: ['dry-upland', 'exposed-ridge'], capacity: 4, density: 'moderate', rarity: 'common', respawn: regeneration(1, 3000),
    }),
    'population-south-redstone-glass-shells': population({
        id: 'population-south-redstone-glass-shells', speciesId: 'species-redstone-glass-shell', placeId: 'south-redstone-reach',
        biomeTags: ['scree', 'mine-tailings'], capacity: 6, density: 'moderate', rarity: 'uncommon', respawn: regeneration(1, 2400),
    }),
    'population-west-starfen-mire-herons': population({
        id: 'population-west-starfen-mire-herons', speciesId: 'species-starfen-mire-heron', placeId: 'west-starfen',
        biomeTags: ['wetland', 'shallow-water'], capacity: 4, density: 'low', rarity: 'common', respawn: regeneration(1, 2700),
        appearanceConditions: [{ type: 'timeWindow', startHour: 5, endHour: 20 }],
    }),
    'population-west-starfen-reed-eels': population({
        id: 'population-west-starfen-reed-eels', speciesId: 'species-starfen-reed-eel', placeId: 'west-starfen',
        biomeTags: ['wetland', 'reed-channel'], capacity: 9, density: 'high', rarity: 'common', respawn: regeneration(2, 1800),
    }),
    'population-east-elderwood-embercoat-foxes': population({
        id: 'population-east-elderwood-embercoat-foxes', speciesId: 'species-elderwood-embercoat-fox', placeId: 'east-elderwood',
        biomeTags: ['temperate-woodland', 'forest-edge'], capacity: 3, density: 'low', rarity: 'uncommon', respawn: regeneration(1, 7200),
    }),
    'population-timbercross-river-otters': population({
        id: 'population-timbercross-river-otters', speciesId: 'species-timbercross-river-otter', placeId: 'timbercross-landing',
        biomeTags: ['riverbank', 'timber-landing'], capacity: 3, density: 'low', rarity: 'uncommon', respawn: regeneration(1, 7200),
    }),
    'population-west-elderwood-moss-owls': population({
        id: 'population-west-elderwood-moss-owls', speciesId: 'species-elderwood-moss-owl', placeId: 'west-elderwood',
        biomeTags: ['old-growth', 'forest-canopy'], capacity: 2, density: 'low', rarity: 'uncommon', respawn: regeneration(1, 5400),
        appearanceConditions: [{ type: 'timeWindow', startHour: 18, endHour: 24 }],
    }),
    'population-east-elderwood-amber-bees': population({
        id: 'population-east-elderwood-amber-bees', speciesId: 'species-elderwood-amber-bee', placeId: 'east-elderwood',
        biomeTags: ['flowering-glade', 'forest-edge'], capacity: 8, density: 'high', rarity: 'common', respawn: regeneration(2, 1800),
        appearanceConditions: [{ type: 'timeWindow', startHour: 6, endHour: 18 }],
    }),
    'population-timbercross-moss-shell-turtles': population({
        id: 'population-timbercross-moss-shell-turtles', speciesId: 'species-timbercross-moss-shell-turtle', placeId: 'timbercross-landing',
        biomeTags: ['riverbank', 'shallow-water'], capacity: 5, density: 'moderate', rarity: 'common', respawn: regeneration(1, 3600),
        appearanceConditions: [{ type: 'timeWindow', startHour: 8, endHour: 18 }],
    }),
    'population-north-redstone-crag-marmots': population({
        id: 'population-north-redstone-crag-marmots', speciesId: 'species-redstone-crag-marmot', placeId: 'north-redstone-reach',
        biomeTags: ['wind-scoured-ridge', 'rocky-upland'], capacity: 6, density: 'moderate', rarity: 'common', respawn: regeneration(1, 3000),
    }),
    'population-south-redstone-sunscale-lizards': population({
        id: 'population-south-redstone-sunscale-lizards', speciesId: 'species-redstone-sunscale-lizard', placeId: 'south-redstone-reach',
        biomeTags: ['dry-upland', 'sun-baked-scree'], capacity: 7, density: 'high', rarity: 'common', respawn: regeneration(2, 2400),
    }),
    'population-south-redstone-ironclaw-scorpions': population({
        id: 'population-south-redstone-ironclaw-scorpions', speciesId: 'species-redstone-ironclaw-scorpion', placeId: 'south-redstone-reach',
        biomeTags: ['quarry-rubble', 'dry-wash'], capacity: 4, density: 'low', rarity: 'uncommon', respawn: regeneration(1, 5400),
        appearanceConditions: [{ type: 'timeWindow', startHour: 18, endHour: 24 }],
    }),
    'population-deepvein-glass-salamanders': population({
        id: 'population-deepvein-glass-salamanders', speciesId: 'species-deepvein-glass-salamander', placeId: 'deepvein-mine',
        biomeTags: ['cave', 'seep-wall'], capacity: 5, density: 'moderate', rarity: 'uncommon', respawn: regeneration(1, 3600),
    }),
    'population-north-redstone-cliff-vultures': population({
        id: 'population-north-redstone-cliff-vultures', speciesId: 'species-redstone-cliff-vulture', placeId: 'north-redstone-reach',
        biomeTags: ['wind-scoured-ridge', 'cliff'], capacity: 3, density: 'low', rarity: 'uncommon', respawn: regeneration(1, 7200),
        appearanceConditions: [{ type: 'timeWindow', startHour: 6, endHour: 18 }],
    }),
    'population-east-starfen-bellfrogs': population({
        id: 'population-east-starfen-bellfrogs', speciesId: 'species-starfen-bellfrog', placeId: 'east-starfen',
        biomeTags: ['wetland', 'reed-margin'], capacity: 8, density: 'high', rarity: 'common', respawn: regeneration(2, 1800),
        appearanceConditions: [{ type: 'timeWindow', startHour: 18, endHour: 24 }],
    }),
    'population-west-starfen-reed-crabs': population({
        id: 'population-west-starfen-reed-crabs', speciesId: 'species-starfen-reed-crab', placeId: 'west-starfen',
        biomeTags: ['mudflat', 'shallow-water'], capacity: 7, density: 'high', rarity: 'common', respawn: regeneration(2, 1800),
    }),
    'population-east-starfen-fen-ducks': population({
        id: 'population-east-starfen-fen-ducks', speciesId: 'species-starfen-fen-duck', placeId: 'east-starfen',
        biomeTags: ['grass-island', 'shallow-water'], capacity: 6, density: 'moderate', rarity: 'common', respawn: regeneration(1, 2700),
        appearanceConditions: [{ type: 'timeWindow', startHour: 5, endHour: 20 }],
    }),
    'population-west-starfen-pearl-mussels': population({
        id: 'population-west-starfen-pearl-mussels', speciesId: 'species-starfen-pearl-mussel', placeId: 'west-starfen',
        biomeTags: ['shallow-water', 'mud-bed'], capacity: 10, density: 'high', rarity: 'common', respawn: regeneration(2, 3600),
    }),
    'population-sunken-archive-threadspiders': population({
        id: 'population-sunken-archive-threadspiders', speciesId: 'species-archive-threadspider', placeId: 'sunken-archive',
        biomeTags: ['ruin', 'dry-chamber'], capacity: 4, density: 'moderate', rarity: 'uncommon', respawn: regeneration(1, 3600),
    }),
    'population-coppergrass-dun-coursers': population({
        id: 'population-coppergrass-dun-coursers', speciesId: 'species-coppergrass-dun-courser', placeId: 'coppergrass-steppe',
        biomeTags: ['temperate-steppe', 'open-grassland'], capacity: 8, density: 'moderate', rarity: 'common', respawn: regeneration(1, 3600),
    }),
    'population-coppergrass-slateback-wolves': population({
        id: 'population-coppergrass-slateback-wolves', speciesId: 'species-coppergrass-slateback-wolf', placeId: 'coppergrass-steppe',
        biomeTags: ['temperate-steppe', 'dry-swale'], capacity: 3, density: 'low', rarity: 'uncommon', respawn: regeneration(1, 7200),
        appearanceConditions: [{ type: 'timeWindow', startHour: 17, endHour: 24 }],
    }),
    'population-coppergrass-tallcrest-bustards': population({
        id: 'population-coppergrass-tallcrest-bustards', speciesId: 'species-coppergrass-tallcrest-bustard', placeId: 'coppergrass-steppe',
        biomeTags: ['open-grassland', 'seasonal-basin'], capacity: 6, density: 'moderate', rarity: 'common', respawn: regeneration(1, 2700),
        appearanceConditions: [{ type: 'timeWindow', startHour: 6, endHour: 18 }],
    }),
    'population-coppergrass-copperwing-locusts': population({
        id: 'population-coppergrass-copperwing-locusts', speciesId: 'species-coppergrass-copperwing-locust', placeId: 'coppergrass-steppe',
        biomeTags: ['temperate-steppe', 'seedgrass'], capacity: 12, density: 'high', rarity: 'common', respawn: regeneration(3, 1800),
        appearanceConditions: [{ type: 'timeWindow', startHour: 8, endHour: 20 }],
    }),
    'population-coppergrass-stormglass-kites': population({
        id: 'population-coppergrass-stormglass-kites', speciesId: 'species-coppergrass-stormglass-kite', placeId: 'coppergrass-steppe',
        biomeTags: ['open-grassland', 'wind-ridge'], capacity: 3, density: 'low', rarity: 'uncommon', respawn: regeneration(1, 5400),
        appearanceConditions: [{ type: 'timeWindow', startHour: 7, endHour: 18 }],
    }),
});

const SOURCES = Object.freeze({
    'source-west-elderwood-amber-resin-grove': source({
        id: 'source-west-elderwood-amber-resin-grove', name: 'Amber Resin Grove', type: 'flora', placeId: 'west-elderwood',
        biomeTags: ['old-growth', 'resinous-bark'], action: 'forage', outputItemId: 'item-elderwood-amber-resin', capacity: 5,
        regeneration: regeneration(1, 3600), requiredToolTags: ['cutting'], proficiencyId: 'foraging',
    }),
    'source-west-elderwood-duskcap-ring': source({
        id: 'source-west-elderwood-duskcap-ring', name: 'Duskcap Ring', type: 'flora', placeId: 'west-elderwood',
        biomeTags: ['shaded-loam', 'old-growth'], action: 'forage', outputItemId: 'item-elderwood-duskcap', capacity: 4,
        regeneration: regeneration(1, 2700), requiredToolTags: [], proficiencyId: 'foraging',
        appearanceConditions: [{ type: 'timeWindow', startHour: 18, endHour: 24 }],
    }),
    'source-south-redstone-iron-vein': source({
        id: 'source-south-redstone-iron-vein', name: 'Red Iron Vein', type: 'mineral', placeId: 'south-redstone-reach',
        biomeTags: ['ore-bearing-rock', 'upland-cut'], action: 'mine', outputItemId: 'item-redstone-iron-ore', capacity: 4,
        regeneration: regeneration(1, 14400), requiredToolTags: ['mining'], proficiencyId: 'mining', minProficiency: 2,
    }),
    'source-south-redstone-sunstone-scree': source({
        id: 'source-south-redstone-sunstone-scree', name: 'Sunstone Scree', type: 'mineral', placeId: 'south-redstone-reach',
        biomeTags: ['sun-baked-scree', 'dry-upland'], action: 'gather', outputItemId: 'item-redstone-sunstone-grit', capacity: 6,
        regeneration: regeneration(1, 5400), requiredToolTags: ['digging'], proficiencyId: 'gathering',
    }),
    'source-west-starfen-bluekelp-pool': source({
        id: 'source-west-starfen-bluekelp-pool', name: 'Bluekelp Pool', type: 'flora', placeId: 'west-starfen',
        biomeTags: ['shallow-water', 'clear-pool'], action: 'gather', outputItemId: 'item-starfen-bluekelp', capacity: 7,
        regeneration: regeneration(2, 2700), requiredToolTags: ['cutting'], proficiencyId: 'gathering',
    }),
    'source-west-starfen-bogberry-brake': source({
        id: 'source-west-starfen-bogberry-brake', name: 'Bogberry Brake', type: 'flora', placeId: 'west-starfen',
        biomeTags: ['wetland-edge', 'peat-hummock'], action: 'forage', outputItemId: 'item-starfen-bogberry', capacity: 6,
        regeneration: regeneration(1, 2400), requiredToolTags: [], proficiencyId: 'foraging',
    }),
    'source-east-elderwood-hazel-coppice': source({
        id: 'source-east-elderwood-hazel-coppice', name: 'Hazel Coppice', type: 'flora', placeId: 'east-elderwood',
        biomeTags: ['forest-edge', 'nut-grove'], action: 'forage', outputItemId: 'item-elderwood-hazel-nut', capacity: 8,
        regeneration: regeneration(2, 3600), requiredToolTags: [], proficiencyId: 'foraging',
    }),
    'source-east-elderwood-crabapple-thicket': source({
        id: 'source-east-elderwood-crabapple-thicket', name: 'Crabapple Thicket', type: 'flora', placeId: 'east-elderwood',
        biomeTags: ['forest-edge', 'fruiting-thicket'], action: 'forage', outputItemId: 'item-elderwood-crabapple', capacity: 7,
        regeneration: regeneration(1, 2700), requiredToolTags: [], proficiencyId: 'foraging',
    }),
    'source-west-elderwood-ghost-orchid-hollow': source({
        id: 'source-west-elderwood-ghost-orchid-hollow', name: 'Ghost Orchid Hollow', type: 'flora', placeId: 'west-elderwood',
        biomeTags: ['old-growth', 'shaded-glade'], action: 'forage', outputItemId: 'item-elderwood-ghost-orchid', capacity: 2,
        regeneration: regeneration(1, 21600), requiredToolTags: [], proficiencyId: 'foraging', minProficiency: 2,
        appearanceConditions: [{ type: 'timeWindow', startHour: 4, endHour: 8 }],
    }),
    'source-west-elderwood-blackheart-windfall': source({
        id: 'source-west-elderwood-blackheart-windfall', name: 'Blackheart Windfall', type: 'flora', placeId: 'west-elderwood',
        biomeTags: ['old-growth', 'stormfall'], action: 'log', outputItemId: 'item-elderwood-blackheart-heartwood', capacity: 2,
        regeneration: regeneration(1, 21600), requiredToolTags: ['woodcutting'], proficiencyId: 'logging', minProficiency: 3,
    }),
    'source-north-redstone-ridge-millet-stand': source({
        id: 'source-north-redstone-ridge-millet-stand', name: 'Ridge Millet Stand', type: 'flora', placeId: 'north-redstone-reach',
        biomeTags: ['wind-slope', 'dry-grassland'], action: 'gather', outputItemId: 'item-redstone-ridge-millet', capacity: 8,
        regeneration: regeneration(2, 3600), requiredToolTags: ['cutting'], proficiencyId: 'gathering',
    }),
    'source-south-redstone-rock-salt-pan': source({
        id: 'source-south-redstone-rock-salt-pan', name: 'Rock Salt Pan', type: 'mineral', placeId: 'south-redstone-reach',
        biomeTags: ['dry-wash', 'salt-crust'], action: 'gather', outputItemId: 'item-redstone-rock-salt', capacity: 7,
        regeneration: regeneration(1, 5400), requiredToolTags: ['digging'], proficiencyId: 'gathering',
    }),
    'source-south-redstone-sun-crocus-terrace': source({
        id: 'source-south-redstone-sun-crocus-terrace', name: 'Sun Crocus Terrace', type: 'flora', placeId: 'south-redstone-reach',
        biomeTags: ['exposed-ridge', 'sun-baked-scree'], action: 'forage', outputItemId: 'item-redstone-sun-crocus-stigma', capacity: 2,
        regeneration: regeneration(1, 21600), requiredToolTags: [], proficiencyId: 'foraging', minProficiency: 2,
        appearanceConditions: [{ type: 'timeWindow', startHour: 6, endHour: 11 }],
    }),
    'source-north-redstone-fire-opal-pocket': source({
        id: 'source-north-redstone-fire-opal-pocket', name: 'Fire Opal Pocket', type: 'mineral', placeId: 'north-redstone-reach',
        biomeTags: ['ore-bearing-rock', 'fault-pocket'], action: 'mine', outputItemId: 'item-redstone-fire-opal', capacity: 2,
        regeneration: regeneration(1, 28800), requiredToolTags: ['mining'], proficiencyId: 'mining', minProficiency: 3,
    }),
    'source-east-starfen-reedgrain-shelf': source({
        id: 'source-east-starfen-reedgrain-shelf', name: 'Reedgrain Shelf', type: 'flora', placeId: 'east-starfen',
        biomeTags: ['grass-island', 'reed-margin'], action: 'gather', outputItemId: 'item-starfen-reedgrain', capacity: 9,
        regeneration: regeneration(2, 3600), requiredToolTags: ['cutting'], proficiencyId: 'gathering',
    }),
    'source-west-starfen-fen-mussel-bed': source({
        id: 'source-west-starfen-fen-mussel-bed', name: 'Fen Mussel Bed', type: 'fishing', placeId: 'west-starfen',
        biomeTags: ['shallow-water', 'mudflat'], action: 'fish', outputItemId: 'item-starfen-fen-mussel', capacity: 10,
        regeneration: regeneration(2, 1800), requiredToolTags: ['fishing'], proficiencyId: 'fishing',
    }),
    'source-east-starfen-indigo-iris-patch': source({
        id: 'source-east-starfen-indigo-iris-patch', name: 'Indigo Iris Patch', type: 'flora', placeId: 'east-starfen',
        biomeTags: ['wetland-edge', 'flowering-marsh'], action: 'forage', outputItemId: 'item-starfen-indigo-iris-petal', capacity: 4,
        regeneration: regeneration(1, 5400), requiredToolTags: [], proficiencyId: 'foraging', minProficiency: 1,
    }),
    'source-west-starfen-moonlotus-pool': source({
        id: 'source-west-starfen-moonlotus-pool', name: 'Moonlotus Pool', type: 'flora', placeId: 'west-starfen',
        biomeTags: ['clear-pool', 'reed-channel'], action: 'gather', outputItemId: 'item-starfen-moonlotus-blossom', capacity: 2,
        regeneration: regeneration(1, 21600), requiredToolTags: ['cutting'], proficiencyId: 'gathering', minProficiency: 2,
        appearanceConditions: [{ type: 'timeWindow', startHour: 18, endHour: 24 }],
    }),
    'source-coppergrass-groundpea-patch': source({
        id: 'source-coppergrass-groundpea-patch', name: 'Groundpea Patch', type: 'flora', placeId: 'coppergrass-steppe',
        biomeTags: ['open-grassland', 'loess-soil'], action: 'forage', outputItemId: 'item-coppergrass-groundpea', capacity: 8,
        regeneration: regeneration(2, 3600), requiredToolTags: [], proficiencyId: 'foraging',
    }),
    'source-coppergrass-prairie-flax-stand': source({
        id: 'source-coppergrass-prairie-flax-stand', name: 'Prairie Flax Stand', type: 'flora', placeId: 'coppergrass-steppe',
        biomeTags: ['temperate-steppe', 'seasonal-basin'], action: 'gather', outputItemId: 'item-coppergrass-prairie-flax', capacity: 8,
        regeneration: regeneration(2, 3600), requiredToolTags: ['cutting'], proficiencyId: 'gathering',
    }),
    'source-coppergrass-crimson-madder-bed': source({
        id: 'source-coppergrass-crimson-madder-bed', name: 'Crimson Madder Bed', type: 'flora', placeId: 'coppergrass-steppe',
        biomeTags: ['dry-swale', 'deep-loam'], action: 'forage', outputItemId: 'item-coppergrass-crimson-madder', capacity: 4,
        regeneration: regeneration(1, 7200), requiredToolTags: [], proficiencyId: 'foraging', minProficiency: 1,
    }),
    'source-coppergrass-windglass-gravel': source({
        id: 'source-coppergrass-windglass-gravel', name: 'Windglass Gravel', type: 'mineral', placeId: 'coppergrass-steppe',
        biomeTags: ['stony-fan', 'seasonal-wash'], action: 'gather', outputItemId: 'item-coppergrass-windglass-agate', capacity: 3,
        regeneration: regeneration(1, 14400), requiredToolTags: ['digging'], proficiencyId: 'gathering', minProficiency: 2,
    }),
});

export function getRegionalEcologyFamily(id) { return FAMILIES[String(id ?? '').trim()] ?? null; }
export function listRegionalEcologyFamilies() { return Object.values(FAMILIES); }
export function getRegionalSpecies(id) { return SPECIES[String(id ?? '').trim()] ?? null; }
export function listRegionalSpecies() { return Object.values(SPECIES); }
export function getRegionalPopulation(id) { return POPULATIONS[String(id ?? '').trim()] ?? null; }
export function listRegionalPopulations() { return Object.values(POPULATIONS); }
export function getRegionalGatheringSource(id) { return SOURCES[String(id ?? '').trim()] ?? null; }
export function listRegionalGatheringSources() { return Object.values(SOURCES); }

export function validateRegionalEcologyExpansion() {
    const issues = [];
    const familyIds = new Set(listRegionalEcologyFamilies().map((entry) => entry.id));
    const speciesIds = new Set(listRegionalSpecies().map((entry) => entry.id));
    for (const entry of listRegionalSpecies()) {
        if (!familyIds.has(entry.familyId)) issues.push(`${entry.id} references unknown regional family ${entry.familyId}.`);
        for (const linked of entry.behavior.linksWithFamilyIds) {
            if (!familyIds.has(linked)) issues.push(`${entry.id} links to unknown regional family ${linked}.`);
        }
    }
    for (const entry of listRegionalPopulations()) {
        if (!speciesIds.has(entry.speciesId)) issues.push(`${entry.id} references unknown regional species ${entry.speciesId}.`);
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        if (!positive(entry.capacity) || !positive(entry.respawn.units) || !positive(entry.respawn.everySeconds)) issues.push(`${entry.id} has invalid capacity/respawn.`);
    }
    for (const entry of listRegionalGatheringSources()) {
        if (!getPlace(entry.placeId)) issues.push(`${entry.id} references unknown place ${entry.placeId}.`);
        const item = getCanonicalResourceItem(entry.outputItemId);
        if (!item) issues.push(`${entry.id} references unknown output ${entry.outputItemId}.`);
        else if (!item.provenance.some((p) => p.sourceId === entry.id && p.placeId === entry.placeId && p.action === entry.action)) issues.push(`${entry.id} output provenance does not match source.`);
        if (!positive(entry.capacity) || !positive(entry.regeneration.units) || !positive(entry.regeneration.everySeconds)) issues.push(`${entry.id} has invalid capacity/regeneration.`);
    }
    return issues;
}

function family(id, name, tags) { return Object.freeze({ id, version: REGIONAL_ECOLOGY_VERSION, name, tags: Object.freeze([...tags]) }); }
function species({ id, name, familyId, ecosystem, habitatTags, behavior: b, encounterTemplateId }) {
    return Object.freeze({ id, version: REGIONAL_ECOLOGY_VERSION, name, familyId, ecosystem, habitatTags: Object.freeze([...habitatTags]), behavior: b, encounterTemplateId });
}
function behavior(aggression, senses, socialMode, linksWithFamilyIds) {
    return Object.freeze({ aggression, senses: Object.freeze([...senses]), socialMode, linksWithFamilyIds: Object.freeze([...linksWithFamilyIds]) });
}
function population({ id, speciesId, placeId, biomeTags, capacity, density, rarity, respawn, appearanceConditions = [] }) {
    return Object.freeze({ id, version: REGIONAL_ECOLOGY_VERSION, speciesId, placeId, biomeTags: Object.freeze([...biomeTags]), capacity, density, rarity, respawn, appearanceConditions: freezeConditions(appearanceConditions), namedVariantHooks: Object.freeze([]) });
}
function source({ id, name, type, placeId, biomeTags, action, outputItemId, capacity, regeneration: regen, requiredToolTags, proficiencyId, minProficiency = 0, appearanceConditions = [] }) {
    return Object.freeze({ id, version: REGIONAL_ECOLOGY_VERSION, name, type, placeId, biomeTags: Object.freeze([...biomeTags]), action, outputItemId, capacity, regeneration: regen, requiredToolTags: Object.freeze([...requiredToolTags]), proficiencyId, minProficiency, appearanceConditions: freezeConditions(appearanceConditions) });
}
function regeneration(units, everySeconds) { return Object.freeze({ units, everySeconds }); }
function freezeConditions(conditions) { return Object.freeze(conditions.map((condition) => Object.freeze({ ...condition }))); }
function positive(value) { return Number.isInteger(value) && value > 0; }
