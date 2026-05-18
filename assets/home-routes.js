const qcTools=[
  {name:'Budget Planner',url:'budget-planner.html',desc:'Income, bills and leftover money',icon:'📊',keys:['budget','money','bills','income','left','spend']},
  {name:'Rent Check',url:'rent-affordability-calculator.html',desc:'Check if rent is affordable',icon:'🏠',keys:['rent','house','housing','afford','landlord']},
  {name:'House Share Rent Split',url:'house-share-rent-split-calculator.html',desc:'Split rent between housemates',icon:'🏘️',keys:['rent','share','housemate','split']},
  {name:'Moving Cost',url:'moving-cost-calculator.html',desc:'Plan moving costs',icon:'📦',keys:['move','moving','house','van']},
  {name:'Electricity Cost',url:'electricity-running-cost-calculator.html',desc:'Appliance running costs',icon:'⚡',keys:['electric','electricity','energy','appliance','heater','dryer','oven']},
  {name:'Tumble Dryer Cost',url:'tumble-dryer-cost-calculator.html',desc:'Laundry energy cost',icon:'🧺',keys:['dryer','tumble','laundry','electric']},
  {name:'Fuel Cost',url:'fuel-cost-calculator.html',desc:'Trip fuel estimate',icon:'⛽',keys:['fuel','petrol','diesel','journey','car','mile']},
  {name:'Distance Calculator',url:'distance-calculator.html',desc:'Place-to-place estimates',icon:'🗺️',keys:['distance','travel','route','place','drive']},
  {name:'Weekly Budget',url:'weekly-budget-calculator.html',desc:'Monthly money into weeks',icon:'📅',keys:['weekly','payday','week','budget']},
  {name:'School Uniform Budget',url:'school-uniform-budget-calculator.html',desc:'Family school costs',icon:'🎒',keys:['school','uniform','child','kids','family']},
  {name:'SIM Only vs Contract',url:'sim-only-vs-contract-calculator.html',desc:'Compare phone costs',icon:'📱',keys:['phone','sim','mobile','contract']},
  {name:'Deal Checker',url:'multi-buy-deal-calculator.html',desc:'Check if offers are cheaper',icon:'🛒',keys:['discount','deal','shopping','price','multi']},
  {name:'Standard Calculator',url:'standard-calculator.html',desc:'Simple quick sums',icon:'🧮',keys:['calculator','standard','sum','maths']}
];
function qcMatches(q,tool){return !q||tool.name.toLowerCase().includes(q)||tool.desc.toLowerCase().includes(q)||tool.keys.some(k=>k.includes(q)||q.includes(k))}
function qcSuggestions(){const input=document.getElementById('homeSearchInput');const box=document.getElementById('searchSuggestions');if(!input||!box)return;const q=input.value.toLowerCase().trim();const matches=qcTools.filter(t=>qcMatches(q,t)).slice(0,6);box.innerHTML=matches.map(t=>`<a class="suggestion-item" href="${t.url}"><span class="s-icon">${t.icon}</span><span><b>${t.name}</b><small>${t.desc}</small></span><span class="arrow">›</span></a>`).join('');box.classList.toggle('active',q.length>0)}
function qcHomeSearch(){const input=document.getElementById('homeSearchInput');const q=(input?.value||'').toLowerCase().trim();if(!q){location.href='calculator-directory.html';return}const found=qcTools.find(t=>qcMatches(q,t));location.href=found?found.url:'calculator-directory.html?search='+encodeURIComponent(q)}
document.addEventListener('DOMContentLoaded',()=>{const input=document.getElementById('homeSearchInput');document.getElementById('homeSearchBtn')?.addEventListener('click',qcHomeSearch);input?.addEventListener('input',qcSuggestions);input?.addEventListener('focus',qcSuggestions);input?.addEventListener('keydown',e=>{if(e.key==='Enter')qcHomeSearch()});});
