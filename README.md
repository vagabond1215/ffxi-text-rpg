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
- `updateDerivedStats()` computes HP, MP and per-stat values using level-based formulas derived from race and job proficiencies. Each attribute (STR, DEX, VIT, AGI, INT, MND and CHR) scales individually.
- Characters now store numeric scaling values derived from their race and job
  proficiencies. The `proficiencyScale` table maps letter grades to HP, MP and
  status base/scale numbers. These values are kept separately for race and job
  (e.g. `raceHpScale` and `jobHpScale`) alongside level-based placeholders.
- Job data tracks verification status with a `verified` object for each job.
- Warrior, Monk, Red Mage, Black Mage and Thief have both `verified.traits = true` and `verified.abilities = true`.
- White Mage is fully verified as well, with `verified.traits = true` and `verified.abilities = true`.
- Paladin and Bard data has been confirmed, with `verified.traits = true` and `verified.abilities = true` for both jobs.
- Initial bestiary data lists low-level monsters for zones adjacent to the three starting cities.
- Experience from battles is based on the level difference between your character and the monster.
- Basic encounter simulation using `walkAcrossZone()` and `rollForEncounter()` with level-based aggro rates.
- Traveling through non-combat zones (areas without entries in the bestiary) only
  takes a single turn and never triggers encounters.
- Each city now tracks a travel-turn counter. Leaving any city sets that city's
  counter to `1/10` and increments the counters for other cities. Moving deeper
  into the wilderness increases these counters up to ten, while entering a city
  resets its counter to `0`.
- Encountering a monster now opens a battle screen showing player and enemy
  details with an initiative roll to decide who acts first.
- City vendors now sell basic weapons, armor, scrolls and consumables at
  canonical prices. Stackable items include a quantity selector when purchasing.
- Vendor inventories have been expanded with additional early-game gear and
  consumables. Previously empty shops and guilds now stock basic items.
- Map vendors now offer maps of the starting regions.
- Weapon and armor entries include damage or defense values based on
  early-game FFXI stats and now list level requirements.
- A new Explore button on area screens always triggers a battle without
  consuming travel turns.
- Each zone tracks distance from its home city to scale available monsters.
- The main menu now includes an Equipment button that lists currently
  equipped items along with empty slots.
- Battle damage now uses FFXI-style calculations including base damage,
  fSTR and pDIF formulas.
- Hit chance now factors Dexterity and Agility with weapon and evasion skill
  to compute accuracy and evasion.
- Defeating monsters with Signet now awards Conquest Points which can be spent
  at Gate Guards on special items.
- Areas with monsters now include a Hunt option to target specific enemies and
  immediately engage them.
- Attacks and taking damage now generate Tactical Points (TP) based on weapon
  delay.
