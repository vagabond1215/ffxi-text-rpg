import fs from 'fs';

const file = 'data/vendors.js';
const lines = fs.readFileSync(file, 'utf8').split('\n');
const output = [];
let insideItem = false;
let itemLines = [];
let hasLatent = false;
let hasAdditional = false;
let effectsValues = [];
let additionalIndex = -1;

function parseArray(str) {
  try {
    return Function(`return ${str}`)();
  } catch {
    return [];
  }
}

function isItemStart(line) {
  return /^\s*\w+:\s*\{$/.test(line.trim());
}

function isItemEnd(line) {
  const t = line.trim();
  return t === '},' || t === '}';
}

for (const line of lines) {
  if (!insideItem) {
    if (isItemStart(line)) {
      insideItem = true;
      itemLines = [line];
      hasLatent = false;
      hasAdditional = false;
      effectsValues = [];
      additionalIndex = -1;
    } else {
      output.push(line);
    }
  } else {
    itemLines.push(line);
    if (line.includes('latentEffects')) hasLatent = true;
    if (line.includes('additionalEffects')) {
      hasAdditional = true;
      additionalIndex = itemLines.length - 1;
    }
    if (line.includes('effects:')) {
      const match = line.match(/\[(.*)\]/);
      if (match) {
        effectsValues = parseArray(match[0]);
      }
      itemLines.pop(); // remove effects line
    }
    if (isItemEnd(line)) {
      if (effectsValues.length) {
        if (additionalIndex !== -1) {
          const current = itemLines[additionalIndex].match(/\[(.*)\]/)[0];
          const existing = parseArray(current);
          const combined = Array.from(new Set([...existing, ...effectsValues]));
          const arrStr = `[${combined.map(v => `\'${v}\'`).join(', ')}]`;
          itemLines[additionalIndex] = `    additionalEffects: ${arrStr},`;
        } else {
          const arrStr = `[${effectsValues.map(v => `\'${v}\'`).join(', ')}]`;
          itemLines.splice(itemLines.length - 1, 0, `    additionalEffects: ${arrStr},`);
          hasAdditional = true;
        }
      }

      const insertIndex = itemLines.length - 1; // before closing line
      const prevIndex = insertIndex - 1;
      if (prevIndex >= 0 && !itemLines[prevIndex].trim().endsWith(',')) {
        itemLines[prevIndex] = itemLines[prevIndex] + ',';
      }
      if (!hasAdditional) {
        itemLines.splice(insertIndex, 0, '    additionalEffects: [],');
      }
      if (!hasLatent) {
        itemLines.splice(insertIndex + 1, 0, '    latentEffects: [],');
      }
      output.push(...itemLines);
      insideItem = false;
      effectsValues = [];
      additionalIndex = -1;
    }
  }
}

fs.writeFileSync(file, output.join('\n'));
console.log('Normalized effects fields');
