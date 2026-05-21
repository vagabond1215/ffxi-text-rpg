# Stat Formula Model

The player base-stat model now uses the historical **FFXI Statistics Calculator 20050211** formula document as a structured reference.

Source: https://ffxi-stat-calc.sourceforge.net/document.html

## Scope

This model currently covers player base:

- HP
- MP
- STR
- DEX
- VIT
- AGI
- INT
- MND
- CHR

Derived combat stats such as attack, defense, accuracy, evasion, magic attack, and magic accuracy still use the local project formulas in `statEngine.js` layered on top of the FFXI-derived base stats.

## Grade Tables

The source model is grade-based rather than a direct final-stat table.

Each race has grades for HP, MP, and attributes. Each classic job also has grades for HP, MP, and attributes. Grades `A` through `G` map to scale/base rows in `FFXI_GRADE_SCALES`.

Data lives in:

- `js/text/data/ffxiStatGrades.js`
- `js/text/data/ffxiInferredJobGrades.js`

Formula logic lives in:

- `js/text/systems/ffxiStatFormula.js`
- `js/text/systems/inferredJobResourceFormula.js`

The main stat engine consumes those formulas in:

- `js/text/systems/statEngine.js`

## Classic Jobs vs Newer Jobs

Classic jobs with full HP/MP/attribute grades use the full FFXI stat formula.

Newer jobs currently use a partial resource model:

- BLU, COR, PUP, DNC, SCH, GEO, and RUN have inferred HP/MP grades.
- Their HP/MP can use the FFXI HP/MP formula through `inferredJobResourceFormula.js`.
- Their STR/DEX/VIT/AGI/INT/MND/CHR grades are still unknown.
- Until full attribute grades are sourced, their attributes use the local provisional fallback in `statEngine.js`.

This is intentional. Do not promote inferred HP/MP data into full job grades unless the missing attribute grades are sourced.

## Newer-Job HP/MP Inference

The newer-job HP/MP inference is based on comparing FFXIclopedia HP and MP ranking groups against known classic grades.

Current inferred HP/MP data:

```text
BLU: HP D, MP D, high confidence
COR: HP D, MP X, high confidence
PUP: HP D, MP X, high confidence
DNC: HP D, MP X, high confidence
SCH: HP E, MP D, high confidence
GEO: HP F, MP C, medium confidence / provisional
RUN: HP B, MP F, high confidence
```

GEO remains more provisional than the others because the HP source snapshot does not provide the same direct comparison for GEO, and the MP source marks GEO verification as needed.

## MP Grade `X`

Some jobs have MP grade `X`. This is not a weak MP grade. It means the job has **no native MP**.

Implementation rule:

- A main job with MP grade `X` contributes 0 job MP.
- If both main and support jobs have no MP source, race MP is locked out and max MP is 0.
- Race MP contributes only when the main or support job actually grants MP.
- A caster support job can therefore unlock MP contribution once support jobs are fully surfaced in gameplay.

Example:

```text
Hume WAR Lv.1, no support job -> 0 MP
Tarutaru BLM Lv.1 -> race MP + BLM job MP
```

## HP Formula

The implementation follows the source structure:

```text
MLv = main job level
SLv = support job level
MLvX = max(MLv - 10, 0)
MLvXXX = max(MLv - 30, 0)
SLvX = max(SLv - 10, 0)

RaceHP = HPScale * (MLv - 1) + HPBase + 2 * MLvX + HPScaleXXX * MLvXXX
JobHP  = HPScale * (MLv - 1) + HPBase + HPScaleXXX * MLvXXX
SJobHP = (HPScale * (SLv - 1) + HPBase + SLvX) / 2

HP = RaceHP + JobHP + SJobHP
```

The current implementation floors the final total to keep displayed values integer-safe.

## MP Formula

```text
RaceMP = MPScale * (MLv - 1) + MPBase
JobMP  = MPScale * (MLv - 1) + MPBase
SJobMP = (MPScale * (SLv - 1) + MPBase) / 2

MP = RaceMP + JobMP + SJobMP
```

The MP formula is skipped for any job grade marked `X`.

## Attribute Formula

```text
RaceStatus = StatusScale * (MLv - 1) + StatusBase
JobStatus  = StatusScale * (MLv - 1) + StatusBase
SJobStatus = (StatusScale * (SLv - 1) + StatusBase) / 2

Status = RaceStatus + JobStatus + SJobStatus
```

The current implementation floors each displayed attribute.

## Special Bonuses

The source includes job-specific HP/MP bonuses. The current implementation includes:

### Monk HP Bonus

```text
MNK Lv.15+ -> +30 HP
MNK Lv.35+ -> +60 HP
```

### Summoner MP Bonus

```text
SMN Lv.10+ -> +15 MP
SMN Lv.30+ -> +30 MP
SMN Lv.50+ -> +40 MP
SMN Lv.70+ -> +50 MP
```

Support-job versions are applied through the support-job path.

## Caveats

The source itself warns that the calculator's formula accuracy becomes less reliable above level 50, especially for HP. Treat this model as a historical FFXI-style foundation rather than a final retail-verified stat oracle.

Next high-value checks:

- Cross-check level 1, 10, 30, and 50 race/job pairs against known examples.
- Add support-job UI and tests once subjobs are selectable.
- Find reliable full attribute grades for BLU, COR, PUP, DNC, SCH, GEO, and RUN before promoting them to full formula jobs.
- Verify GEO HP/MP with stronger primary examples if possible.