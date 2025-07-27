import { locations } from './locations.js';

export const regions = {
  Gustaberg: { owner: 'Bastok' }
};

export function regionOwner(region) {
  return regions[region]?.owner || null;
}

export function regionBonusApplies(character, zone) {
  const loc = locations.find(l => l.name === zone);
  if (!loc || !loc.region) return false;
  return regions[loc.region]?.owner === character.homeCity;
}
