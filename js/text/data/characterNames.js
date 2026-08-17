import { getRace } from './races.js';

export const CHARACTER_NAME_CATALOG_VERSION = 1;

const NAME_POOLS = Object.freeze({
    human: Object.freeze({
        male: Object.freeze(['Arlen','Bram','Corin','Dain','Edric','Garran','Hale','Jory','Merek','Rovan','Tavin','Wesric']),
        female: Object.freeze(['Anwen','Bryn','Celia','Dessa','Elian','Fara','Gwenna','Ilyra','Kessa','Liora','Rynne','Talia']),
    }),
    lethari: Object.freeze({
        male: Object.freeze(['Aelren','Caelor','Daerin','Erynd','Faelan','Ithar','Lethen','Maelor','Naevin','Orien','Sylvar','Theren']),
        female: Object.freeze(['Aelira','Caelis','Eiryn','Faelith','Ilyen','Letha','Maelis','Naeria','Orlenn','Saevra','Thalia','Vaelis']),
    }),
    miri: Object.freeze({
        male: Object.freeze(['Bello','Cerin','Dovo','Fennel','Hobin','Kello','Lumen','Mavin','Nilo','Perru','Tobin','Wrenno']),
        female: Object.freeze(['Amiya','Belli','Ceri','Fenna','Holli','Lumi','Mavi','Nella','Perri','Tessa','Vivi','Wrenna']),
    }),
    veyra: Object.freeze({
        female: Object.freeze(['Asha','Ceryn','Davra','Eriska','Jassa','Kaiva','Lyrra','Nayen','Raska','Seyla','Tavra','Vesha']),
    }),
    korren: Object.freeze({
        male: Object.freeze(['Barek','Dorrun','Garruk','Hadrin','Korram','Mordek','Orsun','Rhevik','Torren','Uldar','Varrun','Zorrek']),
    }),
});

export function listCharacterNames(raceId = 'human', sex = null) {
    const race = getRace(raceId);
    const resolvedSex = race.allowedSexes.includes(sex) ? sex : race.allowedSexes[0];
    return [...(NAME_POOLS[race.id]?.[resolvedSex] ?? NAME_POOLS.human.male)];
}

export function randomCharacterName(raceId = 'human', sex = null, rng = Math.random) {
    const names = listCharacterNames(raceId, sex);
    const roll = clampRoll(typeof rng === 'function' ? rng() : Math.random());
    return names[Math.min(names.length - 1, Math.floor(roll * names.length))] ?? 'Traveler';
}

function clampRoll(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.max(0, Math.min(0.999999999, number));
}
