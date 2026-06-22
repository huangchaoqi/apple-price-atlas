import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const statusFile = path.join(root, 'data-status.js');
const appFile = path.join(root, 'app.js');
const regionalPages = [
  ['美国', 'https://www.apple.com/shop/buy-iphone/iphone-17-pro'],
  ['日本', 'https://www.apple.com/jp/shop/buy-iphone/iphone-17-pro'],
  ['韩国', 'https://www.apple.com/kr/shop/buy-iphone/iphone-17-pro'],
  ['中国香港', 'https://www.apple.com/hk/shop/buy-iphone/iphone-17-pro'],
  ['中国台湾', 'https://www.apple.com/tw/shop/buy-iphone/iphone-17-pro'],
  ['新加坡', 'https://www.apple.com/sg/shop/buy-iphone/iphone-17-pro'],
  ['马来西亚', 'https://www.apple.com/my/shop/buy-iphone/iphone-17-pro'],
  ['泰国', 'https://www.apple.com/th/shop/buy-iphone/iphone-17-pro'],
  ['越南', 'https://www.apple.com/vn/shop/buy-iphone/iphone-17-pro'],
  ['澳大利亚', 'https://www.apple.com/au/shop/buy-iphone/iphone-17-pro'],
  ['阿联酋', 'https://www.apple.com/ae/shop/buy-iphone/iphone-17-pro'],
  ['瑞士', 'https://www.apple.com/ch-de/shop/buy-iphone/iphone-17-pro'],
  ['德国', 'https://www.apple.com/de/shop/buy-iphone/iphone-17-pro'],
  ['法国', 'https://www.apple.com/fr/shop/buy-iphone/iphone-17-pro'],
  ['中国大陆', 'https://www.apple.com.cn/shop/buy-iphone/iphone-17-pro'],
  ['加拿大', 'https://www.apple.com/ca/shop/buy-iphone/iphone-17-pro'],
  ['英国', 'https://www.apple.com/uk/shop/buy-iphone/iphone-17-pro']
];

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

function parseLocalizedPrice(text) {
  let value = text.replace(/[^0-9.,]/g, '');
  const comma = value.lastIndexOf(','), dot = value.lastIndexOf('.');
  if (comma >= 0 && dot >= 0) value = comma > dot ? value.replace(/\./g, '').replace(',', '.') : value.replace(/,/g, '');
  else if (comma >= 0) value = /,\d{2}$/.test(value) ? value.replace(/,/g, '.').replace(/\.(?=.*\.)/g, '') : value.replace(/,/g, '');
  else if (dot >= 0) value = /\.\d{2}$/.test(value) ? value.replace(/\.(?=.*\.)/g, '') : value.replace(/\./g, '');
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

async function fetchRegionalPrice([name, url]) {
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 ApplePriceAtlas/1.0' }, signal: AbortSignal.timeout(25000) });
    if (!response.ok) return [name, null];
    const html = await response.text();
    const prices = [...html.matchAll(/class="current_price"[^>]*>([^<]+)</g)].map(x => parseLocalizedPrice(x[1])).filter(Boolean);
    return [name, prices.length ? Math.min(...prices) : null];
  } catch { return [name, null]; }
}

const previous = parseStatus(await readFile(statusFile, 'utf8'));
const appSource = await readFile(appFile, 'utf8');
const urls = officialUrls(appSource);
const { rates, source } = await updateRates(previous.fx);
const checks = await Promise.all(urls.map(checkOfficialUrl));
const healthy = checks.filter(Boolean).length;
const regionalResults = await Promise.all(regionalPages.map(fetchRegionalPrice));
const regionalSuccessful = regionalResults.filter(([, price]) => price !== null);
const regionalPrices = { ...(previous.officialIPhone17Pro || {}) };
for (const [name, price] of regionalSuccessful) regionalPrices[name] = price;

// Apple occasionally blocks automated requests. A failed check is recorded for review,
// but never deletes a product or replaces good price data automatically.
const next = {
  updatedAt: new Date().toISOString(),
  fxSource: source,
  officialLinksHealthy: healthy,
  officialLinksChecked: urls.length,
  regionalPricesHealthy: regionalSuccessful.length,
  regionalPricesChecked: regionalPages.length,
  officialIPhone17Pro: regionalPrices,
  fx: rates
};

await writeFile(statusFile, `window.ATLAS_STATUS = ${JSON.stringify(next, null, 2)};\n`, 'utf8');
console.log(`Updated FX rates. Product links: ${healthy}/${urls.length}. Regional prices: ${regionalSuccessful.length}/${regionalPages.length}.`);
