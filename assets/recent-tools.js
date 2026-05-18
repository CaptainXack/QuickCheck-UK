const QC_RECENT_TOOLS_KEY='qc_recent_tools_v2';
const QC_FAV_TOOLS_KEY='qc_favourite_tools_v1';
const QC_TOOL_META=[
  {id:'profile',name:'Money Profile',url:'money-profile.html',icon:'💷',desc:'Income, outgoings and smart defaults'},
  {id:'budgetplanner',name:'Budget Planner',url:'budget-planner.html',icon:'📊',desc:'Income, bills and leftover money'},
  {id:'rent',name:'Rent Check',url:'rent-affordability-calculator.html',icon:'🏠',desc:'Check rent against income'},
  {id:'electricity',name:'Electricity Cost',url:'electricity-running-cost-calculator.html',icon:'⚡',desc:'Appliance running costs'},
  {id:'fuel',name:'Fuel Cost',url:'fuel-cost-calculator.html',icon:'⛽',desc:'Journey fuel estimate'},
  {id:'weekly',name:'Weekly Budget',url:'weekly-budget-calculator.html',icon:'📅',desc:'Monthly money into weeks'},
  {id:'dryer',name:'Tumble Dryer Cost',url:'tumble-dryer-cost-calculator.html',icon:'🧺',desc:'Laundry energy estimate'},
  {id:'school',name:'School Costs',url:'school-uniform-budget-calculator.html',icon:'🎒',desc:'Uniform and family planning'},
  {id:'deal',name:'Deal Checker',url:'multi-buy-deal-calculator.html',icon:'🛒',desc:'Check if offers are cheaper'},
  {id:'distance',name:'Distance Calculator',url:'distance-calculator.html',icon:'🗺️',desc:'Place-to-place estimates'},
  {id:'standard',name:'Standard Calculator',url:'standard-calculator.html',icon:'🧮',desc:'Quick sums'}
];
function qcReadRecent(){try{return JSON.parse(localStorage.getItem(QC_RECENT_TOOLS_KEY)||'[]')}catch{return[]}}
function qcWriteRecent(items){localStorage.setItem(QC_RECENT_TOOLS_KEY,JSON.stringify(items.slice(0,12)));window.dispatchEvent(new Event('qc-recent-tools-updated'))}
function qcReadFavs(){try{return JSON.parse(localStorage.getItem(QC_FAV_TOOLS_KEY)||'[]')}catch{return[]}}
function qcWriteFavs(items){localStorage.setItem(QC_FAV_TOOLS_KEY,JSON.stringify([...new Set(items)].slice(0,20)));window.dispatchEvent(new Event('qc-favourites-updated'))}
function qcToolByUrl(){const path=location.pathname.split('/').pop()||'index.html';return QC_TOOL_META.find(t=>t.url===path)}
function qcToolById(id){return QC_TOOL_META.find(t=>t.id===id)}
function qcTrackTool(tool){if(!tool)return;const item={id:tool.id,name:tool.name,url:tool.url,icon:tool.icon,desc:tool.desc,date:new Date().toISOString()};const items=qcReadRecent().filter(x=>x.id!==item.id);items.unshift(item);qcWriteRecent(items)}
function qcToggleFav(id){const favs=qcReadFavs();qcWriteFavs(favs.includes(id)?favs.filter(x=>x!==id):[id,...favs]);qcRenderRecentAndFavs()}
function qcRecentRow(item){const favs=qcReadFavs(),active=favs.includes(item.id);return `<div class="smart-row"><span><b>${item.icon||'🔎'} ${item.name}</b><small>${item.desc||'Recent tool'} · ${new Date(item.date||Date.now()).toLocaleDateString('en-GB')}</small></span><span class="saved-actions"><a href="${item.url}">Open</a><button type="button" data-fav-tool="${item.id}">${active?'★ Favourite':'☆ Favourite'}</button></span></div>`}
function qcFavRow(id){const t=qcToolById(id);if(!t)return '';return `<div class="smart-row"><span><b>${t.icon} ${t.name}</b><small>${t.desc}</small></span><span class="saved-actions"><a href="${t.url}">Open</a><button type="button" data-fav-tool="${t.id}">Remove</button></span></div>`}
function qcRenderRecentAndFavs(){const recentMount=document.getElementById('recentChecks');const favMount=document.getElementById('favouriteTools');if(recentMount){const recent=qcReadRecent();recentMount.innerHTML=recent.length?`<div class="smart-list">${recent.map(qcRecentRow).join('')}</div>`:'<p class="smart-empty">No recent checks yet. Open a calculator and it will appear here.</p>'}if(favMount){const favs=qcReadFavs();favMount.innerHTML=favs.length?`<div class="smart-list">${favs.map(qcFavRow).join('')}</div>`:'<p class="smart-empty">No favourites yet. Use the star button on recent checks.</p>'}document.querySelectorAll('[data-fav-tool]').forEach(btn=>btn.onclick=()=>qcToggleFav(btn.dataset.favTool))}
function qcBindOpenToolTracking(){if(typeof openTool==='function'&&!window.qcRecentWrappedOpenTool){window.qcRecentWrappedOpenTool=true;const old=openTool;openTool=function(id){const meta=qcToolById(id);if(meta)qcTrackTool(meta);old(id)}}}
document.addEventListener('DOMContentLoaded',()=>{qcBindOpenToolTracking();qcTrackTool(qcToolByUrl());qcRenderRecentAndFavs()});window.addEventListener('qc-recent-tools-updated',qcRenderRecentAndFavs);window.addEventListener('qc-favourites-updated',qcRenderRecentAndFavs);
