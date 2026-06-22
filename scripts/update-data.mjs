import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const statusFile = path.join(root, 'data-status.js');
const appFile = path.join(root, 'app.js');

function parseStatus(source) {
  const match = source.match(/window\.ATLAS_STATUS\s*=\s*([\s\S]*);\s*$/);
  if (!match) throw new Error('data-status.js format is invalid');
  return JSON.parse(match[1]);
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'apple-price-atlas/1.0 (+GitHub Actions)' },
    signal: AbortSignal.timeout(20000)
  });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.json();
}

async function updateRates(previous) {
  try {
    const data = await fetchJson('https://open.er-api.com/v6/latest/USD');
    const next = { ...previous, USD: 1 };
    for (const code of Object.keys(next)) {
      if (Number.isFinite(data.rates?.[code]) && data.rates[code] > 0) next[code] = data.rates[code];
    }
    return { rates: next, source: 'ExchangeRate-API' };
  } catch (error) {
    console.warn(`Exchange-rate update failed; retaining prior rates. ${error.message}`);
    return { rates: previous, source: 'previous successful snapshot' };
  }
}

function officialUrls(appSource) {
  return [...new Set([...appSource.matchAll(/u:'(https:\/\/www\.apple\.com[^']+)'/g)].map(x => x[1]))];
}

async function checkOfficialUrl(url) {
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 ApplePriceAtlas/1.0' },
      signal: AbortSignal.timeout(20000)
    });
    return response.ok;
  } catch {
    return false;
  }
}

const previous = parseStatus(await readFile(statusFile, 'utf8'));
const appSource = await readFile(appFile, 'utf8');
const urls = officialUrls(appSource);
const { rates, source } = await updateRates(previous.fx);
const checks = await Promise.all(urls.map(checkOfficialUrl));
const healthy = checks.filter(Boolean).length;

// Apple occasionally blocks automated requests. A failed check is recorded for review,
// but never deletes a product or replaces good price data automatically.
const next = {
  updatedAt: new Date().toISOString(),
  fxSource: source,
  officialLinksHealthy: healthy,
  officialLinksChecked: urls.length,
  fx: rates
};

await writeFile(statusFile, `window.ATLAS_STATUS = ${JSON.stringify(next, null, 2)};\n`, 'utf8');
console.log(`Updated FX rates. Apple links healthy: ${healthy}/${urls.length}.`);
