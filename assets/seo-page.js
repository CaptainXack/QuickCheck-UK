const qcSeoCategories={
  money:{label:'Money calculators',url:'money-calculators.html',icon:'💷'},
  bills:{label:'Bills calculators',url:'bills-calculators.html',icon:'🔌'},
  travel:{label:'Travel calculators',url:'travel-calculators.html',icon:'🚗'},
  family:{label:'Family calculators',url:'family-calculators.html',icon:'👨‍👩‍👧‍👦'},
  work:{label:'Work calculators',url:'work-calculators.html',icon:'🧰'},
  shopping:{label:'Shopping calculators',url:'shopping-calculators.html',icon:'🛒'},
  diy:{label:'DIY calculators',url:'diy-calculators.html',icon:'🧱'},
  tech:{label:'Tech calculators',url:'tech-calculators.html',icon:'📱'},
  housing:{label:'Housing calculators',url:'housing-calculators.html',icon:'🏘️'}
};
const qcSeoToolCats={
  budgetplanner:'money',weeklybudget:'money',paydaybudget:'money',billpayday:'money',loan:'money',creditcard:'money',debtfree:'money',savings:'money',emergencyfund:'money',loanoverpay:'money',savingsinterest:'money',breakeven:'money',monthlytoyearly:'money',inflationimpact:'money',splitbill:'money',holiday:'money',christmas:'money',mortgage:'housing',rent:'housing',rentincrease:'housing',moving:'housing',caravan:'housing',rentsplit:'housing',
  electricity:'bills',gas:'bills',energydd:'bills',energycompare:'bills',prepaymeter:'bills',boilerrun:'bills',heating:'bills',airfryeroven:'bills',tumbledryer:'bills',washingmachine:'bills',electricblanket:'bills',standbycost:'bills',council:'bills',water:'bills',
  distance:'travel',fuel:'travel',commute:'travel',worktravelwage:'travel',busvscar:'travel',taxivbus:'travel',parkingcost:'travel',roadtripsplit:'travel',breakdown:'travel',carinscompare:'travel',motbudget:'travel',
  schooluniform:'family',packedlunch:'family',babymonthly:'family',nappycost:'family',childcare:'family',foodbudget:'family',petcost:'family',
  takehome:'work',payrise:'work',salarytohourly:'work',weeklytomonthly:'work',secondjob:'work',annualleave:'work',selfemployedtaxpot:'work',invoicevat:'work',
  discount:'shopping',percent:'shopping',unitprice:'shopping',priceper100g:'shopping',multibuy:'shopping',cashbackvalue:'shopping',deliverysplit:'shopping',parcel:'shopping',vat:'shopping',
  roomsize:'diy',flooring:'diy',wallpaper:'diy',paint:'diy',tiles:'diy',fencecost:'diy',concrete:'diy',
  broadband:'tech',phone:'tech',mobilebill:'tech',simvscontract:'tech',storage:'tech',downloadtime:'tech',tv:'tech',tvpackagecost:'tech',streamingsave:'tech'
};
const qcSeoRelatedByCat={
  money:[['Budget Planner','budget-planner.html'],['Weekly Budget','weekly-budget-calculator.html'],['Loan Payment','loan-payment-calculator.html'],['Credit Card Payoff','credit-card-payoff-calculator.html'],['Savings Goal','savings-goal-calculator.html'],['Monthly to Yearly Cost','monthly-cost-to-yearly-calculator.html']],
  bills:[['Electricity Running Cost','electricity-running-cost-calculator.html'],['Gas Bill Cost','gas-bill-cost-calculator.html'],['Council Tax Monthly','council-tax-monthly-calculator.html'],['Energy Direct Debit','energy-direct-debit-calculator.html'],['Tumble Dryer Cost','tumble-dryer-cost-calculator.html'],['Water Bill Monthly','water-bill-monthly-calculator.html']],
  travel:[['Distance Calculator','distance-calculator.html'],['Fuel Cost','fuel-cost-calculator.html'],['Commuting Cost','commuting-cost-calculator.html'],['Parking Cost','parking-cost-calculator.html'],['Taxi vs Bus','taxi-vs-bus-cost-calculator.html'],['Road Trip Splitter','road-trip-cost-splitter.html']],
  family:[['School Uniform Budget','school-uniform-budget-calculator.html'],['Packed Lunch vs School Dinner','packed-lunch-vs-school-dinner-calculator.html'],['Baby Monthly Cost','baby-monthly-cost-calculator.html'],['Childcare Monthly Cost','childcare-monthly-cost-calculator.html'],['Food Budget','food-budget-calculator.html'],['Pet Cost','pet-cost-calculator.html']],
  work:[['Take-home Pay','take-home-pay-calculator.html'],['Pay Rise','pay-rise-calculator.html'],['Salary to Hourly','salary-to-hourly-calculator.html'],['Second Job Income','second-job-income-calculator.html'],['Work Travel vs Wage','work-travel-vs-wage-calculator.html'],['Self-employed Tax Pot','self-employed-tax-pot-calculator.html']],
  shopping:[['Discount Calculator','discount-calculator.html'],['Percentage Calculator','percentage-calculator.html'],['Unit Price Calculator','unit-price-calculator.html'],['Price per 100g','price-per-100g-calculator.html'],['Multi-buy Deal','multi-buy-deal-calculator.html'],['Cashback Calculator','cashback-calculator.html']],
  diy:[['Room Size','room-size-calculator.html'],['Paint Needed','paint-needed-calculator.html'],['Wallpaper Rolls','wallpaper-roll-calculator.html'],['Flooring Area','flooring-area-calculator.html'],['Tile Amount','tile-amount-calculator.html'],['Concrete Volume','concrete-volume-calculator.html']],
  tech:[['Broadband Speed','broadband-speed-calculator.html'],['Phone Contract Cost','phone-contract-cost-calculator.html'],['Mobile Plan','mobile-plan-calculator.html'],['SIM Only vs Contract','sim-only-vs-contract-calculator.html'],['Download Time','download-time-calculator.html'],['Storage Converter','storage-converter.html']],
  housing:[['Rent Affordability','rent-affordability-calculator.html'],['Rent Increase','rent-increase-calculator.html'],['Moving Cost','moving-cost-calculator.html'],['Mortgage Payment','mortgage-payment-calculator.html'],['Static Caravan Cost','static-caravan-cost-calculator.html'],['House Share Rent Split','house-share-rent-split-calculator.html']]
};
function qcSeoLinks(items,current){return items.filter(x=>x[1]!==current).slice(0,6).map(x=>`<a href="${x[1]}">${x[0]}</a>`).join('')}
function qcSeoCurrentUrl(){return location.pathname.split('/').pop()||'index.html'}
function qcSeoToolName(){return document.title.replace(' - QuickCheck UK','').replace(' UK','')}
function qcSeoEnhancePage(){
  const body=document.body;
  const tool=body?.dataset?.openTool||body?.dataset?.seoTool||'';
  const main=document.querySelector('main');
  const hero=document.querySelector('.info-page');
  if(!main)return;
  const current=qcSeoCurrentUrl();
  const catKey=qcSeoToolCats[tool]||'money';
  const cat=qcSeoCategories[catKey];
  const pageName=qcSeoToolName();
  if(hero&&!hero.querySelector('.hub-breadcrumbs')){
    hero.insertAdjacentHTML('afterbegin',`<div class="hub-breadcrumbs"><a href="./">Home</a><span>›</span><a href="calculator-directory.html">Directory</a><span>›</span><a href="${cat.url}">${cat.label}</a><span>›</span><span>${pageName}</span></div><span class="hub-kicker">${cat.icon} ${cat.label}</span>`);
    hero.insertAdjacentHTML('beforeend',`<div class="hub-callout"><strong>Quick estimate mode</strong><p>Use the nearest preset if you do not know the exact figure. The answer is designed to help planning and comparison, not replace a formal quote or professional advice.</p></div>`);
  }
  if(!document.getElementById('seoExtraInfo')){
    const section=document.createElement('section');
    section.id='seoExtraInfo';
    section.className='info-page';
    section.innerHTML=`<h2>How to use this calculator</h2><ul><li>Enter the figures you know, or choose the nearest preset.</li><li>Press calculate to see the main result and extra breakdown lines.</li><li>Use copy or print if you want to save the answer.</li></ul><h2>Related calculators</h2><div class="guide-grid">${qcSeoLinks(qcSeoRelatedByCat[catKey]||qcSeoRelatedByCat.money,current)}</div><h2>Other useful sections</h2><div class="guide-grid"><a href="${cat.url}">${cat.label}</a><a href="calculator-directory.html">Full calculator directory</a><a href="./#tools">Search all tools</a></div><h2>Quick questions</h2><ul><li><strong>Is this exact?</strong> No, it is a practical estimate.</li><li><strong>Can I print the result?</strong> Yes, use the print button after calculating.</li><li><strong>Can I copy the result?</strong> Yes, use the copy button after calculating.</li></ul>`;
    main.appendChild(section);
  }
  try{
    const data={"@context":"https://schema.org","@type":"SoftwareApplication","name":pageName,"applicationCategory":"UtilitiesApplication","operatingSystem":"Any","isAccessibleForFree":true,"offers":{"@type":"Offer","price":"0","priceCurrency":"GBP"},"url":location.href.split('#')[0]};
    const s=document.createElement('script');s.type='application/ld+json';s.textContent=JSON.stringify(data);document.head.appendChild(s);
  }catch{}
}
document.addEventListener('DOMContentLoaded',()=>setTimeout(qcSeoEnhancePage,450));
