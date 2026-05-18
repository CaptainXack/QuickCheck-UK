const qcRouteMap=[
  [['rent','house','housing','move'], 'rent-affordability-calculator.html'],
  [['budget','money','bills','income','left'], 'budget-planner.html'],
  [['electric','energy','appliance','heater','dryer','oven'], 'electricity-running-cost-calculator.html'],
  [['fuel','petrol','diesel','journey','car'], 'fuel-cost-calculator.html'],
  [['weekly','payday','week'], 'weekly-budget-calculator.html'],
  [['school','uniform','child','kids'], 'school-uniform-budget-calculator.html'],
  [['phone','sim','mobile','contract'], 'sim-only-vs-contract-calculator.html'],
  [['discount','deal','shopping','price'], 'multi-buy-deal-calculator.html'],
  [['distance','travel','route'], 'distance-calculator.html'],
  [['calculator','standard','sum'], 'standard-calculator.html']
];
function qcHomeSearch(){const input=document.getElementById('homeSearchInput');const q=(input?.value||'').toLowerCase().trim();if(!q){location.href='calculator-directory.html';return}const found=qcRouteMap.find(([keys])=>keys.some(k=>q.includes(k)));location.href=found?found[1]:'calculator-directory.html?search='+encodeURIComponent(q)}
document.addEventListener('DOMContentLoaded',()=>{document.getElementById('homeSearchBtn')?.addEventListener('click',qcHomeSearch);document.getElementById('homeSearchInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')qcHomeSearch()});});
