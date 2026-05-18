function qcSeoRelatedLinks(currentId){
  const related = [
    ['budgetplanner','Budget Planner','budget-planner.html'],
    ['rent','Rent Affordability','rent-affordability-calculator.html'],
    ['moving','Moving Cost','moving-cost-calculator.html'],
    ['electricity','Electricity Cost','electricity-running-cost-calculator.html'],
    ['fuel','Fuel Cost','fuel-cost-calculator.html'],
    ['foodbudget','Food Budget','food-budget-calculator.html'],
    ['mortgage','Mortgage Payment','mortgage-payment-calculator.html'],
    ['phone','Phone Contract','phone-contract-cost-calculator.html'],
    ['distance','Distance Calculator','distance-calculator.html'],
    ['standard','Standard Calculator','standard-calculator.html']
  ].filter(x => x[0] !== currentId).slice(0,6);
  return related.map(x => `<a href="${x[2]}">${x[1]}</a>`).join('');
}
function qcSeoEnhancePage(){
  const body = document.body;
  const tool = body?.dataset?.openTool || body?.dataset?.seoTool || '';
  const main = document.querySelector('main');
  if(!main) return;
  if(!document.getElementById('seoExtraInfo')){
    const section=document.createElement('section');
    section.id='seoExtraInfo';
    section.className='info-page';
    section.innerHTML=`<h2>How to use this calculator</h2><p>Choose the nearest option if you do not know the exact figure. The result is a practical estimate, not professional advice.</p><h2>Related calculators</h2><div class="guide-grid">${qcSeoRelatedLinks(tool)}</div><h2>Quick questions</h2><ul><li><strong>Is this exact?</strong> No, it is a guide to help with planning.</li><li><strong>Can I print the result?</strong> Yes, use the print button after calculating.</li><li><strong>Can I copy the result?</strong> Yes, use the copy button after calculating.</li></ul>`;
    main.appendChild(section);
  }
  try{
    const data={"@context":"https://schema.org","@type":"SoftwareApplication","name":document.title.replace(' - QuickCheck UK',''),"applicationCategory":"UtilitiesApplication","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"GBP"}};
    const s=document.createElement('script');s.type='application/ld+json';s.textContent=JSON.stringify(data);document.head.appendChild(s);
  }catch{}
}
document.addEventListener('DOMContentLoaded',()=>setTimeout(qcSeoEnhancePage,450));
