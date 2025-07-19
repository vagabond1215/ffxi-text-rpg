# FFXI Adventures

Simple text RPG UI inspired by Final Fantasy XI. The project is organized so that additional menus and features can easily be added.

## Running
Open `index.html` in a browser. No build step is required.

## Data
- A set of data files define FFXI races and jobs. Jobs include traits, abilities and proficiency grades for all jobs through the Adoulin expansion.
- Races now list letter-graded stat proficiencies and a helper to access race names.
- Jobs also include letter-graded stat proficiencies for HP, MP and core stats.
- A randomize button on the main menu can generate a race and job combination.
- Characters can be created from the main menu and are listed with their race,
  job and level.
- Character equipment now tracks left and right rings and earrings as well as main and off-hand weapons.
- A utility function can calculate a character's current stats factoring in race, job and equipment.
- `updateDerivedStats()` computes HP, MP and status values using level-based formulas derived from race and job proficiencies.
- Characters now store numeric scaling values derived from their race and job
  proficiencies. The `proficiencyScale` table maps letter grades to HP, MP and
  status base/scale numbers. These values are kept separately for race and job
  (e.g. `raceHpScale` and `jobHpScale`) alongside level-based placeholders.
- Job traits and abilities are stored in separate `jobTraits.js` and `jobAbilities.js` modules. Each job object references these so the job list stays concise.
