import { items } from '../data/vendors.js';
import { spawnSync } from 'child_process';

function fetchHtml(url) {
  const res = spawnSync('curl', ['-sL', '-A', 'Mozilla/5.0', url], { encoding: 'utf8' });
  if (res.status !== 0) {
    throw new Error(res.stderr.trim());
  }
  return res.stdout;
}

function parseEffects(html) {
  const addMatch = html.match(/Additional effect:\s*([^<]+?)(?:<|$)/i);
  const latentMatch = html.match(/Latent effect:\s*([^<]+?)(?:<|$)/i);
  const additional = addMatch ? addMatch[1].replace(/\s+/g, ' ').trim() : '';
  const latent = latentMatch ? latentMatch[1].replace(/\s+/g, ' ').trim() : '';
  return { additional, latent };
}

export function checkEffects() {
  const equippable = Object.entries(items).filter(([_, v]) => v.slot);
  const results = [];
  for (const [key, item] of equippable) {
    const url = 'https://www.bg-wiki.com/ffxi/' + encodeURIComponent(item.name.replace(/ /g, '_'));
    try {
      const html = fetchHtml(url);
      const { additional, latent } = parseEffects(html);
      if (additional || latent) {
        results.push({ key, name: item.name, additional, latent });
      }
    } catch (err) {
      results.push({ key, name: item.name, error: err.message });
    }
  }
  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const results = checkEffects();
  console.log(JSON.stringify(results, null, 2));
  console.log(`Checked ${Object.values(items).filter(i => i.slot).length} items.`);
}
