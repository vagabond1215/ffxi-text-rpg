# Tales of Symphonia Magic / Seal-Arte Research Reference

Status: **research/reference only — not canonical Hearth & Horizon content**.

This note captures systemic spell-design patterns requested for the universal Hearth & Horizon magic catalog. It intentionally does **not** transcribe another game's full spell/arte database, descriptions, lore, characters, locations, or progression requirements. Canonical names and mechanics must remain original under `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`.

## Reference sources

- Aselia Wiki — *Magic*: https://aselia.fandom.com/wiki/Magic
- Aselia Wiki — *ToS - Genis Sage: Techs*: https://aselia.fandom.com/wiki/ToS_-_Genis_Sage:_Techs
- Aselia Wiki — *ToS - Raine Sage: Techs*: https://aselia.fandom.com/wiki/ToS_-_Raine_Sage:_Techs
- Aselia Wiki — *ToS - Sheena Fujibayashi: Techs*: https://aselia.fandom.com/wiki/ToS_-_Sheena_Fujibayashi:_Techs

## Systemic patterns worth carrying forward

### Elemental attack ladder

The reference game uses recognizable novice-to-advanced elemental attack progressions across fire, earth, wind, water, lightning, ice, light, and darkness/non-elemental space. Useful design lessons:

- low-cost, short-cast single-target basics;
- stronger mid-tier variants with more hits, reach, or control;
- expensive advanced attacks with larger payoff;
- elemental identity can be orthogonal to where the caster learned the spell.

Hearth & Horizon translation: elemental spells live in a **shared universal catalog**. Regions may have teachers, traditions, or local preferences, but the spell definition and stable ID are not owned by a region.

### Restoration and support ladder

The reference healer kit demonstrates a progression from direct healing into stronger healing, party recovery, defense/offense buffs, ailment cleansing, magical cleansing, and revival.

Hearth & Horizon translation: restorative and warding spell families remain universal. Current runtime support is strongest for direct healing and timed stat/status effects; cleanse, revival, and true multi-target effects remain future capability-engine extensions rather than inert fake implementations.

### Seal / ninjutsu pattern

Sheena's seal-oriented kit demonstrates several reusable design ideas:

- defense / accuracy / evasion pressure;
- self-protective guard seals;
- offensive burst seals;
- life/resource siphon concepts;
- elemental weapon imbuement;
- revival and pact/summon gates.

Hearth & Horizon translation: **Veilscript** is the original universal seal-magic tradition. Its executable first tranche uses the existing `ninjutsu` skill authority for debuff and guard sigils. Elemental imbuement, siphon, revival, and summons should be added only when their runtime effect contracts are real.

## Canonicalization rules for this research

1. Do not copy source-game spell names wholesale.
2. Do not copy source descriptions, lore, characters, spirits, places, or progression events.
3. Preserve only reusable mechanical/taxonomic ideas.
4. Give canonical spells original Hearth & Horizon names and stable IDs.
5. Spell ownership is shared/universal; regional packs may reference universal spells but do not own them.
6. Learning may depend on character discipline/skill/proficiency, but not on a spell's home region.
