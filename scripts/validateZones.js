const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '..', 'data', 'locations.js');
let code = fs.readFileSync(dataPath, 'utf8');
code = code.replace(/export const [a-zA-Z]+ =/g, m => m.replace('export const', 'var'))
  .replace(/export const locations.*\n/, '')
  .replace(/export const zoneNames.*\n/, '');
const vm = require('vm');
const context = {};
vm.createContext(context);
vm.runInContext(code + '\nvar locations = Object.values(zonesByCity).flat(); var zoneNames = locations.map(z => z.name);', context);
const { locations, zoneNames } = context;
const missing = [];
for (const loc of locations) {
  for (const a of loc.connectedAreas) {
    if (!zoneNames.includes(a)) missing.push({ from: loc.name, missing: a });
  }
}
if (missing.length) {
  console.log('Missing zones:', missing);
  process.exitCode = 1;
} else {
  console.log('No missing zone references');
}
