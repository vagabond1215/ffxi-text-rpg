export const names = {
  Hume: {
    Male: ['Aldo', 'Volker', 'Lucius', 'Gryff', 'Zeid'],
    Female: ['Cornelia', 'Iroha', 'Lilisette', 'Prishe', 'Ulmia']
  },
  Elvaan: {
    Male: ['Trion', 'Rahal', 'Halver', 'Valaineral', 'Camlann'],
    Female: ['Curilla', 'Hinaree', 'Excenmille', 'Nanaa', 'Lehane']
  },
  Tarutaru: {
    Male: ['Ajido-Marujido', 'Koru-Moru', 'Kupipi', 'Kukki-Chebukki'],
    Female: ['Shantotto', 'Apururu', 'Koru-Moru', 'Kukki-Chebukki']
  },
  Mithra: {
    Male: ['Raimbroy', 'Rycharde', 'Geru Vela'],
    Female: ['Semih Lafihna', 'Ayame', 'Perih Vashai', 'Lerene']
  },
  Galka: {
    Male: ['Zied', 'Gumbah', 'Cid', 'Naji', 'Azette'],
    Female: ['Rongo-Nango', 'Kupipi'] // Galka rarely female
  }
};

export function randomName(race = 'Hume', sex = 'Male') {
  const list = (names[race] && names[race][sex]) || [];
  if (list.length === 0) {
    return `Adventurer`;
  }
  return list[Math.floor(Math.random() * list.length)];
}
