export const proficiencyScale = {
  A: { hpScale: 9, hpBase: 19, hpScaleXXX: 1, mpScale: 6, mpBase: 16, statusScale: 0.5, statusBase: 5 },
  B: { hpScale: 8, hpBase: 17, hpScaleXXX: 1, mpScale: 5, mpBase: 14, statusScale: 0.45, statusBase: 4 },
  C: { hpScale: 7, hpBase: 16, hpScaleXXX: 1, mpScale: 4, mpBase: 12, statusScale: 0.4, statusBase: 4 },
  D: { hpScale: 6, hpBase: 14, hpScaleXXX: 0, mpScale: 3, mpBase: 10, statusScale: 0.35, statusBase: 3 },
  E: { hpScale: 5, hpBase: 13, hpScaleXXX: 0, mpScale: 2, mpBase: 8, statusScale: 0.3, statusBase: 3 },
  F: { hpScale: 4, hpBase: 11, hpScaleXXX: 0, mpScale: 1, mpBase: 6, statusScale: 0.25, statusBase: 2 },
  G: { hpScale: 3, hpBase: 10, hpScaleXXX: 0, mpScale: 0.5, mpBase: 4, statusScale: 0.2, statusBase: 2 },
  X: { hpScale: 0, hpBase: 0, hpScaleXXX: 0, mpScale: 0, mpBase: 0, statusScale: 0, statusBase: 0 },
  x: { hpScale: 0, hpBase: 0, hpScaleXXX: 0, mpScale: 0, mpBase: 0, statusScale: 0, statusBase: 0 }
};

export function getScale(grade) {
  return proficiencyScale[grade] || proficiencyScale[grade?.toUpperCase()] || proficiencyScale.X;
}
