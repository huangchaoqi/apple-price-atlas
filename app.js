// 官网购买链接是产品进入比较的白名单。没有 Apple 官方购买入口的型号不应加入此数组。
const seedProducts=[
 {c:'iPhone',n:'iPhone 17e',s:'256GB',usd:599,u:'https://www.apple.com/shop/buy-iphone/iphone-17e'},
 {c:'iPhone',n:'iPhone 17',s:'256GB',usd:799,u:'https://www.apple.com/shop/buy-iphone/iphone-17'},
 {c:'iPhone',n:'iPhone Air',s:'256GB',usd:999,u:'https://www.apple.com/shop/buy-iphone/iphone-air'},
 {c:'iPhone',n:'iPhone 17 Pro',s:'256GB',usd:1099,u:'https://www.apple.com/shop/buy-iphone/iphone-17-pro'},
 {c:'iPhone',n:'iPhone 17 Pro Max',s:'256GB',usd:1199,u:'https://www.apple.com/shop/buy-iphone/iphone-17-pro'},
 {c:'iPhone',n:'iPhone 16',s:'128GB',usd:699,u:'https://www.apple.com/shop/buy-iphone/iphone-16'},
 {c:'Mac',n:'MacBook Neo',s:'基准配置',usd:699,u:'https://www.apple.com/shop/buy-mac/macbook-neo'},
 {c:'Mac',n:'MacBook Air 13″',s:'2026 · 基准配置',usd:1099,u:'https://www.apple.com/shop/buy-mac/macbook-air'},
 {c:'Mac',n:'MacBook Air 15″',s:'2026 · 基准配置',usd:1299,u:'https://www.apple.com/shop/buy-mac/macbook-air'},
 {c:'Mac',n:'MacBook Pro 14″',s:'基准配置',usd:1599,u:'https://www.apple.com/shop/buy-mac/macbook-pro'},
 {c:'Mac',n:'MacBook Pro 16″',s:'基准配置',usd:2499,u:'https://www.apple.com/shop/buy-mac/macbook-pro'},
 {c:'Mac',n:'iMac 24″',s:'基准配置',usd:1299,u:'https://www.apple.com/shop/buy-mac/imac'},
 {c:'Mac',n:'Mac mini',s:'基准配置',usd:599,u:'https://www.apple.com/shop/buy-mac/mac-mini'},
 {c:'Mac',n:'Mac Studio',s:'基准配置',usd:1999,u:'https://www.apple.com/shop/buy-mac/mac-studio'},
 {c:'iPad',n:'iPad',s:'A16 · 128GB · Wi‑Fi',usd:349,u:'https://www.apple.com/shop/buy-ipad/ipad'},
 {c:'iPad',n:'iPad mini',s:'A17 Pro · 128GB · Wi‑Fi',usd:499,u:'https://www.apple.com/shop/buy-ipad/ipad-mini'},
 {c:'iPad',n:'iPad Air 11″',s:'M4 · 128GB · Wi‑Fi',usd:599,u:'https://www.apple.com/shop/buy-ipad/ipad-air'},
 {c:'iPad',n:'iPad Air 13″',s:'M4 · 128GB · Wi‑Fi',usd:799,u:'https://www.apple.com/shop/buy-ipad/ipad-air'},
 {c:'iPad',n:'iPad Pro 11″',s:'M5 · 256GB · Wi‑Fi',usd:999,u:'https://www.apple.com/shop/buy-ipad/ipad-pro'},
 {c:'iPad',n:'iPad Pro 13″',s:'M5 · 256GB · Wi‑Fi',usd:1299,u:'https://www.apple.com/shop/buy-ipad/ipad-pro'}
];
const products=window.ATLAS_STATUS?.autoCatalog?.length?window.ATLAS_STATUS.autoCatalog:seedProducts;
const markets=[
 {n:'美国',en:'United States',flag:'🇺🇸',cur:'USD',rate:1,tax:0,refund:0,adj:1,note:'官网标价 · 免税州口径'},
 {n:'日本',en:'Japan',flag:'🇯🇵',cur:'JPY',rate:161.23,tax:.10,refund:.081,adj:.92251,note:'官网含税价 · 游客免税估算'},
 {n:'韩国',en:'South Korea',flag:'🇰🇷',cur:'KRW',rate:1531,tax:.10,refund:.07,adj:.96713,note:'官网含税价 · 指定门店退税估算'},
 {n:'中国香港',en:'Hong Kong',flag:'🇭🇰',cur:'HKD',rate:7.84,tax:0,refund:0,adj:1.09118,note:'官网价 · 无增值税或销售税'},
 {n:'中国台湾',en:'Taiwan',flag:'🇹🇼',cur:'TWD',rate:31.65,tax:.05,refund:.041,adj:1.0926,note:'官网含税价 · 退税净额估算'},
 {n:'新加坡',en:'Singapore',flag:'🇸🇬',cur:'SGD',rate:1.29,tax:.09,refund:.055,adj:1.13121,note:'官网含税价 · eTRS 估算'},
 {n:'马来西亚',en:'Malaysia',flag:'🇲🇾',cur:'MYR',rate:4.13,tax:.10,refund:0,adj:1.10108,note:'官网含税价 · 无游客零售退税'},
 {n:'泰国',en:'Thailand',flag:'🇹🇭',cur:'THB',rate:32.88,tax:.07,refund:.05,adj:1.1353,note:'官网含税价 · VAT Refund 估算'},
 {n:'越南',en:'Vietnam',flag:'🇻🇳',cur:'VND',rate:26421,tax:.08,refund:.063,adj:1.11606,note:'官网含税价 · 指定退税点估算'},
 {n:'澳大利亚',en:'Australia',flag:'🇦🇺',cur:'AUD',rate:1.42564,tax:.10,refund:.091,adj:1.15988,note:'官网含税价 · TRS 估算'},
 {n:'阿联酋',en:'United Arab Emirates',flag:'🇦🇪',cur:'AED',rate:3.67,tax:.05,refund:.035,adj:1.10956,note:'官网含税价 · 游客退税估算'},
 {n:'瑞士',en:'Switzerland',flag:'🇨🇭',cur:'CHF',rate:.80649,tax:.081,refund:.055,adj:1.14703,note:'官网含税价 · 含手续费估算'},
 {n:'德国',en:'Germany',flag:'🇩🇪',cur:'EUR',rate:.87198,tax:.19,refund:.105,adj:1.13909,note:'官网含税价 · 退税服务估算'},
 {n:'法国',en:'France',flag:'🇫🇷',cur:'EUR',rate:.87198,tax:.20,refund:.11,adj:1.15569,note:'官网含税价 · 退税服务估算'},
 {n:'中国大陆',en:'Mainland China',flag:'🇨🇳',cur:'CNY',rate:6.789,tax:.13,refund:.09,adj:1.06736,note:'官网含税价 · 境外游客退税估算'},
 {n:'加拿大',en:'Canada',flag:'🇨🇦',cur:'CAD',rate:1.4152,tax:0,refund:0,adj:1.02809,note:'官网税前价 · 销售税依省份另计'},
 {n:'英国',en:'United Kingdom',flag:'🇬🇧',cur:'GBP',rate:.75593,tax:.20,refund:0,adj:1.10239,note:'官网含税价 · 英国本土无游客零售退税'}
];
// 2026-06-22 逐地区 Apple 官网核对：iPhone 17 Pro 256GB 当地标价。
// 该锚点以当地货币固定保存，不会因每周汇率变化而错误漂移。
const officialIPhone17Pro=window.ATLAS_STATUS?.officialIPhone17Pro||{美国:1099,日本:179800,韩国:1790000,中国香港:9399,中国台湾:39900,新加坡:1749,马来西亚:5499,泰国:43900,越南:34999000,澳大利亚:1999,阿联酋:4699,瑞士:1099,德国:1299,法国:1329,中国大陆:8999,加拿大:1599,英国:1099};
markets.forEach(m=>m.official17Pro=officialIPhone17Pro[m.n]);
const fx=window.ATLAS_STATUS?.fx||{USD:1,CNY:7.18,HKD:7.81,AUD:1.51}; markets.forEach(m=>{if(fx[m.cur])m.rate=fx[m.cur]}); let mode='refund',expanded=false;
const $=s=>document.querySelector(s), money=(v,c)=>new Intl.NumberFormat('zh-CN',{style:'currency',currency:c,maximumFractionDigits:c==='JPY'?0:0}).format(v);
function localPrice(p,m){const modeledRetail=p.usd*m.adj*m.rate*(1+m.tax);const catalogBase=products.find(x=>x.n===p.n)?.usd??p.usd;const optionDelta=p.usd-catalogBase;const automatedBase=window.ATLAS_STATUS?.officialBasePrices?.[p.n]?.[m.n];const legacyBase=p.n==='iPhone 17 Pro'?m.official17Pro:null;const officialBase=automatedBase??legacyBase;const retail=officialBase?officialBase+optionDelta*m.adj*m.rate*(1+m.tax):modeledRetail;return {retail,refund:retail*(1-m.refund),usdRetail:retail/m.rate,usdRefund:retail*(1-m.refund)/m.rate}}
function target(v,cur){return v*fx[cur]}
function init(){
 const cats=['全部产品',...new Set(products.map(p=>p.c))]; $('#categorySelect').innerHTML=cats.map(c=>`<option>${c}</option>`).join('');
 $('#productCount').textContent=products.length; $('#marketCount').textContent=markets.length;
 const q=new URLSearchParams(location.search); renderProductOptions(q.get('category')||'全部产品'); if(q.get('product')&&products.some(p=>p.n===q.get('product')))$('#productSelect').value=q.get('product');
 const updateDate=window.ATLAS_STATUS?.updatedAt?new Date(window.ATLAS_STATUS.updatedAt):new Date(); $('#updatedAt').textContent=`${updateDate.toLocaleDateString('zh-CN',{month:'short',day:'numeric'})} 已更新`; window.ATLAS_CONFIG.reset(); render();
}
function renderProductOptions(cat){const list=cat==='全部产品'?products:products.filter(p=>p.c===cat);$('#productSelect').innerHTML=list.map(p=>`<option value="${p.n}">${p.n} · ${p.s}</option>`).join('')}
function render(){
 const p=products.find(x=>x.n===$('#productSelect').value)||products[3],cur=$('#currencySelect').value,q=$('#marketSearch').value.trim().toLowerCase();
 const config=window.ATLAS_CONFIG.ensure(p),pricedProduct={...p,usd:Math.max(1,p.usd+config.delta)};$('#configOptions').innerHTML=window.ATLAS_CONFIG.render(p);$('#configBasePrice').textContent=money(pricedProduct.usd,'USD');
 const exactMarkets=Object.keys(window.ATLAS_STATUS?.officialBasePrices?.[p.n]||{}).length;const dataLabel=config.delta===0&&exactMarkets?`${exactMarkets} 个地区官网价格自动采集`:'配置升级价按官网基准推算';$('#currentProduct').textContent=p.n;$('#currentSpec').textContent=config.summary+' · '+dataLabel;$('#officialLink').href=p.u;$('#productIcon').textContent={iPhone:'▯',Mac:'▰',显示器:'▱',iPad:'▭',Watch:'◉',AirPods:'◌',Vision:'∞'}[p.c];
 let rows=markets.map(m=>({...m,...localPrice(pricedProduct,m)})).filter(m=>(m.n+m.en).toLowerCase().includes(q)).sort((a,b)=>a['usd'+(mode==='refund'?'Refund':'Retail')]-b['usd'+(mode==='refund'?'Refund':'Retail')]);
 const best=rows[0],cn=rows.find(x=>x.n==='中国大陆')||markets.map(m=>({...m,...localPrice(pricedProduct,m)})).find(x=>x.n==='中国大陆'),key=mode==='refund'?'usdRefund':'usdRetail';
 $('#bestPrice').textContent=money(target(best[key],cur),cur);$('#bestMarket').textContent=`${best.flag} ${best.n} · ${mode==='refund'?'退税后':'含税'}`;
 const save=Math.max(0,cn[key]-best[key]);$('#savingPrice').textContent=money(target(save,cur),cur);$('#savingPercent').textContent=save?`约 ${Math.round(save/cn[key]*100)}%`:'暂无价差';
 const visible=expanded?rows:rows.slice(0,7);$('#priceList').innerHTML=visible.map((m,i)=>rowHtml(m,i,cur,key,cn[key])).join('')||'<div class="price-row">没有匹配的市场</div>';
 $('#showAll').style.display=rows.length>7?'block':'none';$('#showAll').innerHTML=expanded?'收起市场 <span>↑</span>':'显示全部市场 <span>↓</span>';
 const url=new URL(location);url.searchParams.set('product',p.n);history.replaceState({},'',url);
}
function rowHtml(m,i,cur,key,cnValue){const retail=target(m.usdRetail,cur),after=target(m.usdRefund,cur),refundable=m.usdRefund<m.usdRetail-.01,delta=target(cnValue-m[key],cur),retailLabel=['美国','加拿大'].includes(m.n)?'官网价（未加销售税）':'含税价';const comparison=m.n==='中国大陆'?'中国基准':delta>0?`比中国省 ${money(delta,cur)}`:delta<0?`比中国贵 ${money(Math.abs(delta),cur)}`:'与中国相同';return `<div class="price-row"><div class="rank ${i===0?'top':''}">${i+1}</div><div class="market"><span class="flag">${m.flag}</span><div><strong>${m.n}</strong><small>${m.en}</small></div></div><div class="cell"><span class="tax-tag ${refundable?'yes':''}">${refundable?'可退税':'不可退税'}</span><small>${m.note}</small></div><div class="cell"><span>${money(retail,cur)}</span><small>${retailLabel}</small></div><div class="cell main ${i===0?'best':''}"><strong>${money(mode==='refund'?after:retail,cur)}</strong><small>${mode==='refund'?'估算退税后':'当地价格'} · ${money(mode==='refund'?m.refund:m.retail,m.cur)}</small><small class="china-compare ${delta>0?'save':delta<0?'over':''}">${comparison}</small></div></div>`}
$('#categorySelect').addEventListener('change',e=>{renderProductOptions(e.target.value);window.ATLAS_CONFIG.reset();render()});$('#productSelect').addEventListener('change',()=>{window.ATLAS_CONFIG.reset();render()});$('#currencySelect').addEventListener('change',render);$('#marketSearch').addEventListener('input',render);
$('#configOptions').addEventListener('click',e=>{const button=e.target.closest('[data-config-group]');if(!button||button.disabled)return;window.ATLAS_CONFIG.select(button.dataset.configGroup,button.dataset.configValue);render()});
document.querySelectorAll('.segmented button').forEach(b=>b.addEventListener('click',()=>{document.querySelector('.segmented .active').classList.remove('active');b.classList.add('active');mode=b.dataset.mode;render()}));
$('#showAll').addEventListener('click',()=>{expanded=!expanded;render()});$('#shareBtn').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href)}catch{}$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),1600)});init();
