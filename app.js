// 官网购买链接是产品进入比较的白名单。没有 Apple 官方购买入口的型号不应加入此数组。
const products=[
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
 {c:'显示器',n:'Studio Display',s:'标准玻璃',usd:1599,u:'https://www.apple.com/shop/buy-mac/studio-display'},
 {c:'显示器',n:'Studio Display XDR',s:'标准玻璃',usd:4999,u:'https://www.apple.com/shop/buy-mac/studio-display-xdr'},
 {c:'iPad',n:'iPad',s:'A16 · 128GB · Wi‑Fi',usd:349,u:'https://www.apple.com/shop/buy-ipad/ipad'},
 {c:'iPad',n:'iPad mini',s:'A17 Pro · 128GB · Wi‑Fi',usd:499,u:'https://www.apple.com/shop/buy-ipad/ipad-mini'},
 {c:'iPad',n:'iPad Air 11″',s:'M4 · 128GB · Wi‑Fi',usd:599,u:'https://www.apple.com/shop/buy-ipad/ipad-air'},
 {c:'iPad',n:'iPad Air 13″',s:'M4 · 128GB · Wi‑Fi',usd:799,u:'https://www.apple.com/shop/buy-ipad/ipad-air'},
 {c:'iPad',n:'iPad Pro 11″',s:'M5 · 256GB · Wi‑Fi',usd:999,u:'https://www.apple.com/shop/buy-ipad/ipad-pro'},
 {c:'iPad',n:'iPad Pro 13″',s:'M5 · 256GB · Wi‑Fi',usd:1299,u:'https://www.apple.com/shop/buy-ipad/ipad-pro'},
 {c:'Watch',n:'Apple Watch SE 3',s:'GPS · 40mm',usd:249,u:'https://www.apple.com/shop/buy-watch/apple-watch-se'},
 {c:'Watch',n:'Apple Watch Series 11',s:'GPS · 42mm',usd:399,u:'https://www.apple.com/shop/buy-watch/apple-watch'},
 {c:'Watch',n:'Apple Watch Ultra 3',s:'GPS + 蜂窝 · 49mm',usd:799,u:'https://www.apple.com/shop/buy-watch/apple-watch-ultra/apple-watch-ultra-3-gps-cellular-49mm-titanium-case'},
 {c:'AirPods',n:'AirPods 4',s:'标准款',usd:129,u:'https://www.apple.com/airpods-4/'},
 {c:'AirPods',n:'AirPods 4（主动降噪）',s:'主动降噪款',usd:179,u:'https://www.apple.com/airpods-4/'},
 {c:'AirPods',n:'AirPods Pro 3',s:'MagSafe 充电盒',usd:249,u:'https://www.apple.com/airpods-pro/'},
 {c:'AirPods',n:'AirPods Max 2',s:'USB‑C',usd:549,u:'https://www.apple.com/airpods-max/'},
 {c:'Vision',n:'Apple Vision Pro',s:'256GB',usd:3499,u:'https://www.apple.com/shop/buy-vision'}
];
const markets=[
 {n:'美国',en:'United States',flag:'🇺🇸',cur:'USD',rate:1,tax:0,refund:0,adj:1,note:'官网标价 · 免税州口径'},
 {n:'日本',en:'Japan',flag:'🇯🇵',cur:'JPY',rate:161.23,tax:.10,refund:.081,adj:.94,note:'游客免税估算'},
 {n:'韩国',en:'South Korea',flag:'🇰🇷',cur:'KRW',rate:1531,tax:.10,refund:.07,adj:.9814,note:'指定门店游客退税估算'},
 {n:'中国香港',en:'Hong Kong',flag:'🇭🇰',cur:'HKD',rate:7.84,tax:0,refund:0,adj:1.0861,note:'无增值税或销售税'},
 {n:'中国台湾',en:'Taiwan',flag:'🇹🇼',cur:'TWD',rate:31.65,tax:.05,refund:.041,adj:1.1003,note:'境外旅客退税净额估算'},
 {n:'新加坡',en:'Singapore',flag:'🇸🇬',cur:'SGD',rate:1.29,tax:.09,refund:.055,adj:1.1261,note:'eTRS 含手续费估算'},
 {n:'马来西亚',en:'Malaysia',flag:'🇲🇾',cur:'MYR',rate:4.13,tax:.10,refund:0,adj:1.1018,note:'目前无游客零售退税'},
 {n:'泰国',en:'Thailand',flag:'🇹🇭',cur:'THB',rate:32.88,tax:.07,refund:.05,adj:1.0866,note:'VAT Refund 含手续费估算'},
 {n:'越南',en:'Vietnam',flag:'🇻🇳',cur:'VND',rate:26421,tax:.08,refund:.063,adj:1.0531,note:'指定退税点净额估算'},
 {n:'澳大利亚',en:'Australia',flag:'🇦🇺',cur:'AUD',rate:1.51,tax:.10,refund:.091,adj:1.02,note:'TRS 估算'},
 {n:'阿联酋',en:'United Arab Emirates',flag:'🇦🇪',cur:'AED',rate:3.67,tax:.05,refund:.035,adj:1.03,note:'游客退税估算'},
 {n:'瑞士',en:'Switzerland',flag:'🇨🇭',cur:'CHF',rate:.82,tax:.081,refund:.055,adj:1.06,note:'含手续费估算'},
 {n:'德国',en:'Germany',flag:'🇩🇪',cur:'EUR',rate:.92,tax:.19,refund:.105,adj:1.06,note:'退税服务估算'},
 {n:'法国',en:'France',flag:'🇫🇷',cur:'EUR',rate:.92,tax:.20,refund:.11,adj:1.07,note:'退税服务估算'},
 {n:'中国大陆',en:'Mainland China',flag:'🇨🇳',cur:'CNY',rate:7.18,tax:.13,refund:.09,adj:1.06,note:'境外游客离境退税估算'},
 {n:'加拿大',en:'Canada',flag:'🇨🇦',cur:'CAD',rate:1.37,tax:.05,refund:0,adj:1.03,note:'按 5% GST'},
 {n:'英国',en:'United Kingdom',flag:'🇬🇧',cur:'GBP',rate:.78,tax:.20,refund:0,adj:1.08,note:'游客无零售退税'}
];
const fx=window.ATLAS_STATUS?.fx||{USD:1,CNY:7.18,HKD:7.81,AUD:1.51}; markets.forEach(m=>{if(fx[m.cur])m.rate=fx[m.cur]}); let mode='refund',expanded=false;
const $=s=>document.querySelector(s), money=(v,c)=>new Intl.NumberFormat('zh-CN',{style:'currency',currency:c,maximumFractionDigits:c==='JPY'?0:0}).format(v);
function localPrice(p,m){const pre=p.usd*m.adj*m.rate;const retail=pre*(1+m.tax);return {retail,refund:retail*(1-m.refund),usdRetail:retail/m.rate,usdRefund:retail*(1-m.refund)/m.rate}}
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
 $('#currentProduct').textContent=p.n;$('#currentSpec').textContent=config.summary;$('#officialLink').href=p.u;$('#productIcon').textContent={iPhone:'▯',Mac:'▰',显示器:'▱',iPad:'▭',Watch:'◉',AirPods:'◌',Vision:'∞'}[p.c];
 let rows=markets.map(m=>({...m,...localPrice(pricedProduct,m)})).filter(m=>(m.n+m.en).toLowerCase().includes(q)).sort((a,b)=>a['usd'+(mode==='refund'?'Refund':'Retail')]-b['usd'+(mode==='refund'?'Refund':'Retail')]);
 const best=rows[0],cn=rows.find(x=>x.n==='中国大陆')||markets.map(m=>({...m,...localPrice(pricedProduct,m)})).find(x=>x.n==='中国大陆'),key=mode==='refund'?'usdRefund':'usdRetail';
 $('#bestPrice').textContent=money(target(best[key],cur),cur);$('#bestMarket').textContent=`${best.flag} ${best.n} · ${mode==='refund'?'退税后':'含税'}`;
 const save=Math.max(0,cn[key]-best[key]);$('#savingPrice').textContent=money(target(save,cur),cur);$('#savingPercent').textContent=save?`约 ${Math.round(save/cn[key]*100)}%`:'暂无价差';
 const visible=expanded?rows:rows.slice(0,7);$('#priceList').innerHTML=visible.map((m,i)=>rowHtml(m,i,cur,key,cn[key])).join('')||'<div class="price-row">没有匹配的市场</div>';
 $('#showAll').style.display=rows.length>7?'block':'none';$('#showAll').innerHTML=expanded?'收起市场 <span>↑</span>':'显示全部市场 <span>↓</span>';
 const url=new URL(location);url.searchParams.set('product',p.n);history.replaceState({},'',url);
}
function rowHtml(m,i,cur,key,cnValue){const retail=target(m.usdRetail,cur),after=target(m.usdRefund,cur),refundable=m.usdRefund<m.usdRetail-.01,delta=target(cnValue-m[key],cur),retailLabel=m.n==='美国'?'官网价（未加销售税）':'含税价';const comparison=m.n==='中国大陆'?'中国基准':delta>0?`比中国省 ${money(delta,cur)}`:delta<0?`比中国贵 ${money(Math.abs(delta),cur)}`:'与中国相同';return `<div class="price-row"><div class="rank ${i===0?'top':''}">${i+1}</div><div class="market"><span class="flag">${m.flag}</span><div><strong>${m.n}</strong><small>${m.en}</small></div></div><div class="cell"><span class="tax-tag ${refundable?'yes':''}">${refundable?'可退税':'不可退税'}</span><small>${m.note}</small></div><div class="cell"><span>${money(retail,cur)}</span><small>${retailLabel}</small></div><div class="cell main ${i===0?'best':''}"><strong>${money(mode==='refund'?after:retail,cur)}</strong><small>${mode==='refund'?'估算退税后':'当地价格'} · ${money(mode==='refund'?m.refund:m.retail,m.cur)}</small><small class="china-compare ${delta>0?'save':delta<0?'over':''}">${comparison}</small></div></div>`}
$('#categorySelect').addEventListener('change',e=>{renderProductOptions(e.target.value);window.ATLAS_CONFIG.reset();render()});$('#productSelect').addEventListener('change',()=>{window.ATLAS_CONFIG.reset();render()});$('#currencySelect').addEventListener('change',render);$('#marketSearch').addEventListener('input',render);
$('#configOptions').addEventListener('click',e=>{const button=e.target.closest('[data-config-group]');if(!button||button.disabled)return;window.ATLAS_CONFIG.select(button.dataset.configGroup,button.dataset.configValue);render()});
document.querySelectorAll('.segmented button').forEach(b=>b.addEventListener('click',()=>{document.querySelector('.segmented .active').classList.remove('active');b.classList.add('active');mode=b.dataset.mode;render()}));
$('#showAll').addEventListener('click',()=>{expanded=!expanded;render()});$('#shareBtn').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href)}catch{}$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),1600)});init();
