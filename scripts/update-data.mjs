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
const marketSites = [
  ['美国', 'https://www.apple.com', ''], ['日本', 'https://www.apple.com', '/jp'],
  ['韩国', 'https://www.apple.com', '/kr'], ['中国香港', 'https://www.apple.com', '/hk'],
  ['中国台湾', 'https://www.apple.com', '/tw'], ['新加坡', 'https://www.apple.com', '/sg'],
  ['马来西亚', 'https://www.apple.com', '/my'], ['泰国', 'https://www.apple.com', '/th'],
  ['越南', 'https://www.apple.com', '/vn'], ['澳大利亚', 'https://www.apple.com', '/au'],
  ['阿联酋', 'https://www.apple.com', '/ae'], ['瑞士', 'https://www.apple.com', '/ch-de'],
  ['德国', 'https://www.apple.com', '/de'], ['法国', 'https://www.apple.com', '/fr'],
  ['中国大陆', 'https://www.apple.com.cn', ''], ['加拿大', 'https://www.apple.com', '/ca'],
  ['英国', 'https://www.apple.com', '/uk']
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

function catalogProducts(appSource) {
  return [...appSource.matchAll(/\{c:'([^']+)',n:'([^']+)',s:'([^']+)',usd:([0-9.]+),u:'([^']+)'\}/g)]
    .map(x => ({ category: x[1], name: x[2], spec: x[3], usd: Number(x[4]), url: x[5] }));
}

function localizedProductUrl(usUrl, base, prefix) {
  const source = new URL(usUrl);
  return `${base}${prefix}${source.pathname}`;
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length); let cursor = 0;
  async function run() { while (cursor < items.length) { const index = cursor++; results[index] = await worker(items[index], index); } }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

function structuredProducts(html) {
  return [...html.matchAll(/"sku":"([^"]+)","partNumber":"([^"]+)","price":\{"fullPrice":([0-9.]+)\},"category":"([^"]+)","name":"([^"]+)"/g)]
    .map(x => ({ sku: x[1], partNumber: x[2], price: Number(x[3]), category: x[4], name: x[5] }));
}

function dimensionPrices(html) {
  return [...html.matchAll(/"([^"]+)":\{"comparativeDisplayPrice"[\s\S]{0,260}?"amount":([0-9.]+)/g)]
    .map(x => ({ key: x[1].toLowerCase(), price: Number(x[2]) }));
}

function schemaOfferProducts(html) {
  const found = [];
  for (const match of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const parsed = JSON.parse(match[1]);
      const nodes = Array.isArray(parsed) ? parsed : parsed['@graph'] || [parsed];
      for (const node of nodes) {
        if (node?.['@type'] !== 'Product' || !node.name) continue;
        const offers = Array.isArray(node.offers) ? node.offers : node.offers ? [node.offers] : [];
        const prices = offers.map(x => Number(x.price ?? x.lowPrice)).filter(x => Number.isFinite(x) && x > 0);
        if (prices.length) found.push({ name: String(node.name), price: Math.min(...prices) });
      }
    } catch { /* Ignore unrelated or malformed metadata blocks. */ }
  }
  return found;
}

function extractBasePrice(product, html, allowFallback) {
  const capacity = product.spec.match(/\b(\d+(?:GB|TB))\b/i)?.[1];
  const inches = product.name.match(/(\d+)[″"]/i)?.[1];
  const family = product.name.toLowerCase().replace(/\s*\d+[″"]?.*$/, '').trim();
  const schemaMatches = ['iPad','Mac','Vision'].includes(product.category) ? schemaOfferProducts(html).filter(x => {
    const name = x.name.toLowerCase();
    return name.includes(family) && (!inches || name.includes(`${inches}-inch`) || name.includes(`${inches} inch`));
  }) : [];
  if (schemaMatches.length) return Math.min(...schemaMatches.map(x => x.price));

  const structured = structuredProducts(html);
  if (product.category === 'iPad' && capacity) {
    const ipadMatches = structured.filter(item => item.category === 'ipad' && item.name.toLowerCase().includes(capacity.toLowerCase()) && (!inches || item.name.includes(inches)));
    if (ipadMatches.length) return Math.min(...ipadMatches.map(x => x.price));
  }
  const exact = structured.filter(item => {
    const itemName = item.name.toLowerCase(), productName = product.name.toLowerCase();
    if (capacity) return itemName.startsWith(`${productName} ${capacity.toLowerCase()} `) || itemName === `${productName} ${capacity.toLowerCase()}`;
    return itemName === productName || itemName.startsWith(`${productName} `);
  });
  if (exact.length) return Math.min(...exact.map(x => x.price));

  const dimensions = dimensionPrices(html);
  // The URL already identifies the product family. Shared Mac/iPad pages are
  // disambiguated by their size key (14inch, 16inch, 11inch, etc.).
  const requireSizeKey = inches && !product.name.toLowerCase().startsWith('imac');
  const matchingDimensions = dimensions.filter(x => !requireSizeKey || x.key.includes(`${inches}inch`));
  if (matchingDimensions.length) return Math.min(...matchingDimensions.map(x => x.price));

  if (!allowFallback) return null;
  const visible = [...html.matchAll(/class="current_price"[^>]*>([^<]+)</g)].map(x => parseLocalizedPrice(x[1])).filter(Boolean);
  if (visible.length) return Math.min(...visible);
  const cardPrice = html.match(/rc-prices-currentprice[\s\S]{0,400}?class="nowrap"[^>]*>([^<]+)/i)?.[1];
  return cardPrice ? parseLocalizedPrice(cardPrice) : null;
}

async function fetchDynamicMarketingPrice(product, pageUrl, html) {
  const ids = {
    'AirPods 4': 'airpods-4',
    'AirPods 4（主动降噪）': 'airpods-4-anc',
    'AirPods Pro 3': 'airpods-pro',
    'AirPods Max 2': 'airpods-max'
  };
  const aliasName = ids[product.name]; if (!aliasName) return null;
  const aliases = [...html.matchAll(/<meta name="ac:pricing-alias" content="([^="]+)=([^"]+)"/g)];
  const part = aliases.find(x => x[1] === aliasName)?.[2];
  const endpoint = html.match(/<link rel="ac:pricing-endpoint" href="([^"]+)"/)?.[1];
  if (!part || !endpoint) return null;
  try {
    const url = new URL(endpoint, pageUrl); url.searchParams.set('parts', part);
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 ApplePriceAtlas/1.0' }, signal: AbortSignal.timeout(20000) });
    if (!response.ok) return null;
    const json = await response.json();
    const value = Number(json.items?.[part]?.price?.value);
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch { return null; }
}

async function buildOfficialBasePrices(products, previous = {}) {
  const tasks = [];
  const urlUse = new Map();
  for (const product of products) for (const [market, base, prefix] of marketSites) {
    const url = localizedProductUrl(product.url, base, prefix);
    const key = `${market}|${url}`; urlUse.set(key, (urlUse.get(key) || 0) + 1);
    tasks.push({ product, market, url, key });
  }
  const pageCache = new Map();
  async function page(url) {
    if (!pageCache.has(url)) pageCache.set(url, fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 ApplePriceAtlas/1.0' }, signal: AbortSignal.timeout(25000) }).then(r => r.ok ? r.text() : null).catch(() => null));
    return pageCache.get(url);
  }
  const results = await mapLimit(tasks, 8, async task => {
    const html = await page(task.url); if (!html) return { ...task, price: null };
    let price = extractBasePrice(task.product, html, urlUse.get(task.key) === 1);
    if (price === null && task.product.category === 'AirPods') price = await fetchDynamicMarketingPrice(task.product, task.url, html);
    return { ...task, price };
  });
  const matrix = {}; let successful = 0;
  for (const product of products) if (previous[product.name]) matrix[product.name] = JSON.parse(JSON.stringify(previous[product.name]));
  for (const result of results) if (result.price !== null) {
    matrix[result.product.name] ||= {};
    const prior = matrix[result.product.name][result.market];
    const plausible = !prior || (result.price / prior > .45 && result.price / prior < 2.2);
    if (plausible) { matrix[result.product.name][result.market] = result.price; successful++; }
  }
  return { matrix, successful, checked: tasks.length, pages: pageCache.size };
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
const products = catalogProducts(appSource);
const { rates, source } = await updateRates(previous.fx);
const checks = await Promise.all(urls.map(checkOfficialUrl));
const healthy = checks.filter(Boolean).length;
const regionalResults = await Promise.all(regionalPages.map(fetchRegionalPrice));
const regionalSuccessful = regionalResults.filter(([, price]) => price !== null);
const regionalPrices = { ...(previous.officialIPhone17Pro || {}) };
for (const [name, price] of regionalSuccessful) regionalPrices[name] = price;
const basePriceResult = await buildOfficialBasePrices(products, previous.officialBasePrices || {});

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
  officialBasePrices: basePriceResult.matrix,
  basePricesHealthy: basePriceResult.successful,
  basePricesChecked: basePriceResult.checked,
  catalogProductsChecked: products.length,
  fx: rates
};

await writeFile(statusFile, `window.ATLAS_STATUS = ${JSON.stringify(next, null, 2)};\n`, 'utf8');
console.log(`Updated FX rates. Product links: ${healthy}/${urls.length}. Regional prices: ${regionalSuccessful.length}/${regionalPages.length}. Base prices: ${basePriceResult.successful}/${basePriceResult.checked} across ${basePriceResult.pages} pages.`);
