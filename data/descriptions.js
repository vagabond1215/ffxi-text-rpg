export const raceInfo = {
  Hume: {
    description: 'The most balanced and adaptable race, Humes are similar to humans. They have average stats across the board and can excel in any job, making them the most versatile choice.',
    image: 'https://via.placeholder.com/150?text=Hume'
  },
  Elvaan: {
    description: 'Tall, elegant, and noble, Elvaan hail from San d\u2019Oria. Known for their high Strength and Mind, they make excellent melee fighters or healers, but their lower Dexterity and Intelligence make them less suited for magic damage roles.',
    image: 'https://via.placeholder.com/150?text=Elvaan'
  },
  Tarutaru: {
    description: 'Small, childlike beings from Windurst, Tarutaru possess great magical talent. They have high Intelligence and MP, making them ideal for mage jobs, but their low HP and Strength mean they are physically frail.',
    image: 'https://via.placeholder.com/150?text=Tarutaru'
  },
  Mithra: {
    description: 'Agile and cat-like, Mithra are renowned for their quick reflexes and dexterity. They excel as Thieves, Rangers, and other jobs that benefit from high Agility, but their lower Vitality means less physical toughness.',
    image: 'https://via.placeholder.com/150?text=Mithra'
  },
  Galka: {
    description: 'Large, muscular, and beast-like, Galka have impressive Strength and Vitality. They are excellent tanks and damage dealers but have low MP and less aptitude for magic-based jobs.',
    image: 'https://via.placeholder.com/150?text=Galka'
  }
};

export const jobInfo = {
  'Warrior': {
    description:
      'Role: Frontline melee damage dealer and tank. ' +
      'Skills: Proficient with many weapon types (axes, swords, great axes, great swords, polearms), moderate shield use. ' +
      'Magic: None. ' +
      'Gear: Heavy armor, shields, a wide variety of weapons. ' +
      'History: Warriors are battle-hardened fighters, trained in both offense and defense. Historically, they serve as mercenaries, soldiers, and bodyguards across Vana\u2019diel. Their job abilities allow them to provoke enemies, enhance damage, and defend allies.',
    image: 'https://via.placeholder.com/150?text=Warrior'
  },
  'Monk': {
    description:
      'Role: Melee damage dealer specializing in hand-to-hand combat. ' +
      'Skills: Hand-to-hand weapons, some staff use, high evasion and counterattack skills. ' +
      'Magic: None. ' +
      'Gear: Light armor, knuckles, claws, cesti. ' +
      'History: Monks devote themselves to physical training and spiritual discipline. Drawing from ancient martial arts, they rely on raw power, relentless strikes, and endurance to overcome foes, making them formidable close-range fighters.',
    image: 'https://via.placeholder.com/150?text=Monk'
  },
  'White Mage': {
    description:
      'Role: Primary healer and support. ' +
      'Skills: Clubs and staves, healing magic, some enfeebling and enhancing spells. ' +
      'Magic: Extensive White Magic, including powerful heals, status removal, buffs, and defensive spells. ' +
      'Gear: Light armor (robes), staves, clubs. ' +
      'History: White Mages serve as clerics and priests, channeling divine magic to heal and protect. Historically found in temples and among traveling healers, they are invaluable to any party for keeping allies alive and mitigating danger.',
    image: 'https://via.placeholder.com/150?text=White+Mage'
  },
  'Black Mage': {
    description:
      'Role: Offensive caster specializing in elemental magic. ' +
      'Skills: Staves and clubs, destructive black magic. ' +
      'Magic: Extensive Black Magic, including elemental nukes, debuffs, and status effects. ' +
      'Gear: Light armor (robes), staves, clubs. ' +
      'History: Black Mages study the arcane arts to unleash fire, ice, lightning, and more upon their foes. Revered and feared for their destructive power, they come from traditions of ancient scholars and secretive magical orders.',
    image: 'https://via.placeholder.com/150?text=Black+Mage'
  },
  'Red Mage': {
    description:
      'Role: Versatile support, hybrid damage, and magic. ' +
      'Skills: Swords, daggers, staves, both white and black magic, enfeebling and enhancing spells. ' +
      'Magic: Limited White and Black Magic, excels at enfeebling (debuffing enemies) and support. ' +
      'Gear: Light armor, swords, daggers, staves, unique ability to dual wield some weapons. ' +
      'History: Red Mages are duelists and scholars, blending swordplay and spellcraft. Historically, they\u2019re adaptable adventurers and diplomats who walk both magical and martial paths, excelling in versatility.',
    image: 'https://via.placeholder.com/150?text=Red+Mage'
  },
  'Thief': {
    description:
      'Role: Stealthy melee damage dealer, treasure hunter, enmity manipulator. ' +
      'Skills: Daggers, swords, archery, evasion. ' +
      'Magic: None. ' +
      'Gear: Light armor, daggers, swords, ranged weapons. ' +
      'History: Thieves are experts in agility, subterfuge, and treasure acquisition. Often coming from less savory backgrounds, their skills in sneaking, stealing, and striking quickly make them invaluable scouts and looters in any party.',
    image: 'https://via.placeholder.com/150?text=Thief'
  }
};

export const cityImages = {
  Bastok: 'https://via.placeholder.com/150?text=Bastok',
  "San d'Oria": 'https://via.placeholder.com/150?text=San+d%27Oria',
  Windurst: 'https://via.placeholder.com/150?text=Windurst'
};

export const characterImages = {
  Hume: {
    Male: {
      Warrior: ['img/Hume/Male/Male hume warrior.png'],
      Monk: ['img/Hume/Male/Male hume monk.png'],
      'White Mage': ['img/Hume/Male/Male hume white mage.png'],
      'Black Mage': ['img/Hume/Male/Male hume black mage.png'],
      'Red Mage': ['img/Hume/Male/Male hume red mage.png'],
      Thief: ['img/Hume/Male/Male hume Thief.png']
    },
    Female: {
      Warrior: ['img/Hume/Female/Female Hume Warrior.png'],
      Monk: [
        'img/Hume/Female/Female Hume Monk.png',
        'img/Hume/Female/Female Hume Monk 2.png'
      ],
      'White Mage': ['img/Hume/Female/Female Hume White Mage.png'],
      'Black Mage': ['img/Hume/Female/Female Hume Black Mage.png'],
      'Red Mage': ['img/Hume/Female/Female Hume Red Mage.png'],
      Thief: [
        'img/Hume/Female/Female Hume Thief 1.png',
        'img/Hume/Female/Female Hume Thief 2.png'
      ]
    }
  },
  Elvaan: {
    Male: {
      Warrior: ['img/Elvaan/Male/Male Elvaan Warrior.png'],
      Monk: ['img/Elvaan/Male/Male Elvaan Monk.png'],
      'White Mage': ['img/Elvaan/Male/Male Elvaan White Mage.png'],
      'Black Mage': ['img/Elvaan/Male/Male Elvaan Black Mage.png'],
      'Red Mage': ['img/Elvaan/Male/Male Elvaan Red Mage.png'],
      Thief: ['img/Elvaan/Male/Male Elvaan Thief.png']
    },
    Female: {
      Warrior: ['img/Elvaan/Female/Female elvaan warrior.png'],
      Monk: ['img/Elvaan/Female/Female elvaan monk.png'],
      'White Mage': ['img/Elvaan/Female/Female elvaan white mage.png'],
      'Black Mage': ['img/Elvaan/Female/Female elvaan black mage.png'],
      'Red Mage': ['img/Elvaan/Female/Female elvaan red mage.png'],
      Thief: [
        'img/Elvaan/Female/Female Elvaan Thief 1.png',
        'img/Elvaan/Female/Female Elvaan Thief 2.png'
      ]
    }
  },
  Tarutaru: {
    Male: {
      Warrior: ['img/Tarutaru/Male/Male Tarutaru Warrior.png'],
      Monk: ['img/Tarutaru/Male/Male Tarutaru Monk.png'],
      'White Mage': ['img/Tarutaru/Male/Male Tarutaru White Mage.png'],
      'Black Mage': ['img/Tarutaru/Male/Male Tarutaru Black Mage.png'],
      'Red Mage': ['img/Tarutaru/Male/Male Tarutaru Red Mage.png'],
      Thief: ['img/Tarutaru/Male/Male Tarutaru Thief.png']
    },
    Female: {
      Warrior: ['img/Tarutaru/Female/Female Tarutaru Warrior.png'],
      Monk: ['img/Tarutaru/Female/Female Tarutaru Monk.png'],
      'White Mage': [
        'img/Tarutaru/Female/Female Tarutaru White Mage.png',
        'img/Tarutaru/Female/Female Tarutaru White Mage 1.png'
      ],
      'Black Mage': ['img/Tarutaru/Female/Female Tarutaru Black Mage.png'],
      'Red Mage': ['img/Tarutaru/Female/Female Tarutaru Red Mage.png'],
      Thief: ['img/Tarutaru/Female/Female Tarutaru Thief.png']
    }
  },
  Mithra: {
    Female: {
      Warrior: ['img/Mithra/Female/Mithra warrior.png'],
      Monk: ['img/Mithra/Female/Mithra monk.png'],
      'White Mage': ['img/Mithra/Female/Mithra white mage.png'],
      'Black Mage': ['img/Mithra/Female/Mithra black mage.png'],
      'Red Mage': ['img/Mithra/Female/Mithra Red Mage.png'],
      Thief: ['img/Mithra/Female/Mithra thief.png']
    }
  },
  Galka: {
    Male: {
      Warrior: ['img/Galka/Male/Galka Warrior.png'],
      Monk: ['img/Galka/Male/Galka Monk.png'],
      'White Mage': ['img/Galka/Male/Galka White Mage.png'],
      'Black Mage': ['img/Galka/Male/Galka Black Mage.png'],
      'Red Mage': ['img/Galka/Male/Galka Red Mage.png'],
      Thief: ['img/Galka/Male/Galka Thief.png']
    }
  }
};
