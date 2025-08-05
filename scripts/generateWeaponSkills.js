import fs from 'fs';
import { execSync } from 'child_process';

function fetchJSON(url) {
  const output = execSync(`curl -L --silent ${JSON.stringify(url)}`);
  return JSON.parse(output.toString());
}

function getAllWeaponSkillPages() {
  let members = [];
  let cont = '';
  do {
    const url = `https://www.bg-wiki.com/api.php?action=query&list=categorymembers&cmtitle=Category:Weapon_Skills&cmlimit=500&format=json${cont ? `&cmcontinue=${encodeURIComponent(cont)}` : ''}`;
    const data = fetchJSON(url);
    const items = data.query?.categorymembers || [];
    members = members.concat(items.filter(m => m.ns === 0 && !m.title.includes('Weapon Skills')));
    cont = data.continue?.cmcontinue;
  } while (cont);
  return members;
}

function parseWSC(statmod) {
  const wsc = {};
  if (!statmod) return wsc;
  const regex = /(\d+)%\s*\[\[(\w+)\]\]/g;
  let m;
  while ((m = regex.exec(statmod)) !== null) {
    wsc[m[2].toLowerCase()] = Number(m[1]) / 100;
  }
  return wsc;
}

function parseJobLevels(text) {
  const jobs = {};
  const regex = /\{\{WS Job Level\n?\|([^}]*)\}\}/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    const body = m[1];
    const level = Number(/level=(\d+)/.exec(body)?.[1]);
    const jobsPart = /jobs=([^|]+)/.exec(body)?.[1] || '';
    const jobList = jobsPart.replace(/\[\[|\]\]|\s|'/g, '').split(',').filter(Boolean);
    for (const j of jobList) {
      jobs[j] = level;
    }
  }
  return jobs;
}

function parseTPMods(text) {
  const tp = [];
  const m100 = /\|100TP=([^\n|]+)/.exec(text);
  const m200 = /\|200TP=([^\n|]+)/.exec(text);
  const m300 = /\|300TP=([^\n|]+)/.exec(text);
  if (m100 && m200 && m300) {
    const n100 = parseFloat(m100[1]);
    const n200 = parseFloat(m200[1]);
    const n300 = parseFloat(m300[1]);
    if (!Number.isNaN(n100) && !Number.isNaN(n200) && !Number.isNaN(n300)) {
      tp.push(n100, n200, n300);
    }
  }
  return tp;
}

function getField(text, field) {
  const m = new RegExp(`\\|${field}=([^\\n|]*)`).exec(text);
  if (!m) return undefined;
  return m[1].replace(/<\!--.*?-->/g, '').trim() || undefined;
}

function parseHits(description) {
  const m = /(\d+)[- ]?hit/.exec(description.toLowerCase());
  if (m) return Number(m[1]);
  const words = { one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9 };
  const m2 = /comprised of (\w+) hits/.exec(description.toLowerCase());
  if (m2 && words[m2[1]]) return words[m2[1]];
  return 1;
}

function fetchWeaponSkill(title) {
  const page = title.replace(/ /g, '_');
  const url = `https://www.bg-wiki.com/api.php?action=parse&page=${encodeURIComponent(page)}&prop=wikitext&format=json`;
  const data = fetchJSON(url);
  const text = data.parse?.wikitext?.['*'] || '';
  const description = getField(text, 'description') || '';
  return {
    name: data.parse.title,
    type: getField(text, 'type'),
    class: getField(text, 'class'),
    element: getField(text, 'element'),
    tpMod: getField(text, 'tpmod'),
    ftp: parseTPMods(text),
    wsc: parseWSC(getField(text, 'statmod')),
    sc: [getField(text, 'sc1'), getField(text, 'sc2'), getField(text, 'sc3')].filter(Boolean),
    reqSkill: Number(getField(text, 'reqskill')) || undefined,
    quest: getField(text, 'quest'),
    jobs: parseJobLevels(text),
    hits: parseHits(description),
    description
  };
}

function main() {
  const pages = getAllWeaponSkillPages();
  const result = {};
  for (const p of pages) {
    try {
      const ws = fetchWeaponSkill(p.title);
      result[ws.name] = ws;
    } catch (e) {
      console.error('Failed', p.title, e.message);
    }
  }
  const out = 'export const weaponSkillDetails = ' + JSON.stringify(result, null, 2) + '\n';
  fs.writeFileSync('data/weaponskills.js', out);
}

main();

