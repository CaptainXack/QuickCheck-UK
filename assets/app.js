const tools = [
  { id:'electricity', icon:'⚡', title:'Electricity Running Cost', cat:'Energy', desc:'Estimate appliance running costs from watts, hours and unit rate.', labels:['Watts','Hours per day','pence per kWh'], defaults:[1000,1,25] },
  { id:'rent', icon:'🏠', title:'Rent Affordability', cat:'Housing', desc:'Check rent and bills against monthly income.', labels:['Monthly income','Monthly rent','Monthly bills'], defaults:[2200,900,450] },
  { id:'moving', icon:'📦', title:'Moving Cost', cat:'Housing', desc:'Estimate deposit, first rent, removals and setup costs.', labels:['Deposit','First rent','Removals','Setup costs'], defaults:[1000,900,150,250] },
  { id:'broadband', icon:'📡', title:'Broadband Speed Needs', cat:'Tech', desc:'Estimate a sensible broadband speed for your home.', labels:['People','4K streams','Gamers','Home workers'], defaults:[3,1,1,1] },
  { id:'phone', icon:'📱', title:'Phone Contract Total Cost', cat:'Tech', desc:'See the full cost of a phone contract.', labels:['Upfront cost','Monthly cost','Months','Trade-in/cashback'], defaults:[49,35,24,0] },
  { id:'subscriptions', icon:'🧾', title:'Subscription Cost', cat:'Money', desc:'Add up monthly and yearly subscriptions.', labels:['Sub 1','Sub 2','Sub 3','Other subs'], defaults:[10.99,8.99,4.99,0] },
  { id:'caravan', icon:'🏕️', title:'Static Caravan Yearly Cost', cat:'Lifestyle', desc:'Estimate annual static caravan ownership costs.', labels:['Site fees','Insurance','Utilities','Maintenance'], defaults:[6500,300,900,800] },
  { id:'tv', icon:'📺', title:'TV Upgrade Loss Checker', cat:'TV', desc:'Score whether a TV upgrade looks risky or worthwhile.', labels:['Lost features','Gained features','Monthly price change','Contract months'], defaults:[3,2,5,18] },
  { id:'fuel', icon:'⛽', title:'Fuel Trip Cost', cat:'Travel', desc:'Estimate petrol or diesel trip costs.', labels:['Miles','MPG','pence per litre'], defaults:[100,45,145] },
  { id:'pay', icon:'💷', title:'Take-home Pay Rough Estimate', cat:'Money', desc:'Very rough UK monthly take-home estimator.', labels:['Gross yearly salary','Tax-free allowance','Tax %','NI %'], defaults:[26000,12570,20,8] },
  { id:'loan', icon:'🏦', title:'Loan Repayment', cat:'Money', desc:'Estimate monthly loan payments.', labels:['Amount borrowed','APR %','Years'], defaults:[5000,9.9,3] },
  { id:'savings', icon:'🐖', title:'Savings Goal', cat:'Money', desc:'Estimate months to reach a savings target.', labels:['Target amount','Saved already','Monthly saving'], defaults:[1000,100,50] },
  { id:'mortgage', icon:'🏡', title:'Mortgage Rough Payment', cat:'Housing', desc:'Rough repayment mortgage estimate.', labels:['Loan amount','Interest %','Years'], defaults:[180000,5.5,25] },
  { id:'council', icon:'🏛️', title:'Council Tax Monthly Split', cat:'Bills', desc:'Split yearly council tax into monthly amounts.', labels:['Yearly council tax','Months paid over'], defaults:[1800,10] },
  { id:'water', icon:'🚿', title:'Water Bill Split', cat:'Bills', desc:'Split water bills monthly or weekly.', labels:['Bill amount','Months covered'], defaults:[180,6] },
  { id:'gas', icon:'🔥', title:'Gas Running Cost', cat:'Bills', desc:'Estimate gas usage cost.', labels:['kWh used','pence per kWh'], defaults:[100,7] },
  { id:'streaming', icon:'🎬', title:'Streaming Bundle Cost', cat:'Entertainment', desc:'Compare streaming bundle yearly cost.', labels:['Service 1','Service 2','Service 3','Service 4'], defaults:[10.99,8.99,6.99,0] },
  { id:'schoolrun', icon:'🎒', title:'School Run Travel Cost', cat:'Family', desc:'Estimate school run travel costs.', labels:['Miles per day','School days','MPG','pence per litre'], defaults:[6,190,45,145] },
  { id:'commute', icon:'🚆', title:'Commuting Cost', cat:'Work', desc:'Estimate monthly commuting costs.', labels:['Daily cost','Days per week','Weeks per year'], defaults:[6,5,46] },
  { id:'childcare', icon:'🧸', title:'Childcare Cost', cat:'Family', desc:'Estimate childcare monthly cost.', labels:['Hourly cost','Hours per week','Weeks per year'], defaults:[6,20,39] },
  { id:'parcel', icon:'📮', title:'Parcel Size Price Helper', cat:'Shopping', desc:'Roughly classify parcel size.', labels:['Length cm','Width cm','Height cm','Weight kg'], defaults:[30,20,10,1] },
  { id:'paint', icon:'🎨', title:'Paint Needed', cat:'DIY', desc:'Estimate paint litres needed.', labels:['Wall width m','Wall height m','Coats','Coverage m2/l'], defaults:[4,2.4,2,10] },
  { id:'flooring', icon:'🪵', title:'Flooring Area', cat:'DIY', desc:'Estimate flooring area and waste.', labels:['Room length m','Room width m','Waste %'], defaults:[4,3,10] },
  { id:'storage', icon:'💾', title:'Storage Converter', cat:'Tech', desc:'Convert GB to MB and TB.', labels:['GB amount'], defaults:[500] },
  { id:'vat', icon:'🧮', title:'VAT Calculator', cat:'Money', desc:'Add VAT to a price.', labels:['Amount','VAT %'], defaults:[100,20] },
  { id:'discount', icon:'🏷️', title:'Discount Calculator', cat:'Shopping', desc:'Calculate sale price and saving.', labels:['Original price','Discount %'], defaults:[50,20] },
  { id:'percent', icon:'％', title:'Percentage Calculator', cat:'Math', desc:'Find a percentage of a number.', labels:['Number','Percent %'], defaults:[200,15] },
  { id:'splitbill', icon:'🍽️', title:'Split Bill Calculator', cat:'Money', desc:'Split a bill between people.', labels:['Bill total','People','Tip %'], defaults:[60,4,10] },
  { id:'petrolvsdiesel', icon:'🚗', title:'Petrol vs Diesel Cost', cat:'Travel', desc:'Compare two car fuel costs.', labels:['Miles per year','Petrol MPG','Diesel MPG','Petrol ppl','Diesel ppl'], defaults:[8000,42,55,145,152] },
  { id:'appliance', icon:'🔌', title:'Appliance Yearly Cost', cat:'Bills', desc:'Estimate yearly appliance cost.', labels:['Watts','Hours/week','pence/kWh'], defaults:[1000,7,25] },
  { id:'rentdeposit', icon:'🔐', title:'Rent Deposit Helper', cat:'Housing', desc:'Estimate the 5-week deposit cap from monthly rent.', labels:['Monthly rent'], defaults:[900] },
  { id:'emergencyfund', icon:'🛟', title:'Emergency Fund Target', cat:'Money', desc:'Estimate emergency fund target.', labels:['Monthly essentials','Months cover'], defaults:[1200,3] },
  { id:'debtfree', icon:'🧹', title:'Debt Free Date', cat:'Money', desc:'Estimate months to clear debt.', labels:['Debt amount','Monthly payment','Monthly interest %'], defaults:[1000,100,2] },
  { id:'hourly', icon:'⏱️', title:'Hourly to Yearly Pay', cat:'Work', desc:'Convert hourly wage to yearly gross pay.', labels:['Hourly rate','Hours/week','Weeks/year'], defaults:[12.21,37.5,52] },
  { id:'overtime', icon:'🕒', title:'Overtime Pay', cat:'Work', desc:'Estimate overtime earnings.', labels:['Hourly rate','Overtime hours','Multiplier'], defaults:[12.21,8,1.5] },
  { id:'pricecompare', icon:'⚖️', title:'Unit Price Compare', cat:'Shopping', desc:'Compare two product unit prices.', labels:['Item A price','Item A amount','Item B price','Item B amount'], defaults:[2.5,500,3.2,750] }
];

function money(value) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(value) || 0);
}
function val(list, index) { return Number(list[index]) || 0; }
function sum(list) { return list.reduce((total, item) => total + (Number(item) || 0), 0); }

function calculate(id, a) {
  switch (id) {
    case 'electricity': { const d = (val(a,0) / 1000) * val(a,1) * (val(a,2) / 100); return `${money(d)} per day, ${money(d*30.44)} per month, ${money(d*365)} per year.`; }
    case 'rent': { const total = val(a,1) + val(a,2); const p = val(a,0) ? total / val(a,0) * 100 : 0; return `Rent + bills: ${money(total)} monthly. That is ${p.toFixed(1)}% of income. ${p > 55 ? 'High pressure.' : p > 40 ? 'Tight.' : 'Looks manageable.'}`; }
    case 'moving': return `Estimated upfront moving cost: ${money(sum(a))}.`;
    case 'broadband': { const mb = Math.ceil(val(a,0)*15 + val(a,1)*35 + val(a,2)*10 + val(a,3)*20); return `Suggested minimum: ${mb} Mbps. ${mb > 180 ? 'Consider gigabit or very fast fibre.' : mb > 80 ? 'Fast fibre recommended.' : 'Standard fibre may be enough.'}`; }
    case 'phone': { const total = val(a,0) + val(a,1)*val(a,2) - val(a,3); return `Total contract cost: ${money(total)}. True monthly equivalent: ${money(total/(val(a,2)||1))}.`; }
    case 'subscriptions': { const m = sum(a); return `${money(m)} per month, ${money(m*12)} per year.`; }
    case 'caravan': { const y = sum(a); return `Estimated yearly cost: ${money(y)}. Monthly equivalent: ${money(y/12)}.`; }
    case 'tv': { const extra = val(a,2)*val(a,3); const score = val(a,1)-val(a,0)-(val(a,2)>0?1:0); return `Contract price impact: ${money(extra)}. Verdict: ${score >= 2 ? 'Looks positive.' : score <= -2 ? 'Risky.' : 'Mixed, check losses carefully.'}`; }
    case 'fuel': { const litres = (val(a,0)/(val(a,1)||1))*4.54609; return `Fuel used about ${litres.toFixed(1)} litres. Trip cost ${money(litres*val(a,2)/100)}.`; }
    case 'pay': { const taxable = Math.max(0, val(a,0)-val(a,1)); const take = val(a,0)-taxable*val(a,2)/100-taxable*val(a,3)/100; return `Rough take-home: ${money(take/12)} per month, ${money(take)} per year.`; }
    case 'loan': { const P=val(a,0), rate=val(a,1)/100/12, months=val(a,2)*12; const pay = rate ? P*rate/(1-Math.pow(1+rate,-months)) : P/(months||1); return `Estimated monthly payment: ${money(pay)}. Total repaid about ${money(pay*months)}.`; }
    case 'savings': { const left=Math.max(0,val(a,0)-val(a,1)); const months=val(a,2)?Math.ceil(left/val(a,2)):0; return `You need ${money(left)} more. At ${money(val(a,2))}/month: about ${months} months.`; }
    case 'mortgage': { const P=val(a,0), rate=val(a,1)/100/12, months=val(a,2)*12; const pay = rate ? P*rate/(1-Math.pow(1+rate,-months)) : P/(months||1); return `Rough repayment estimate: ${money(pay)} per month.`; }
    case 'council': return `Monthly payment: ${money(val(a,0)/(val(a,1)||1))}.`;
    case 'water': return `About ${money(val(a,0)/(val(a,1)||1))} per month.`;
    case 'gas': return `Estimated gas cost: ${money(val(a,0)*val(a,1)/100)}.`;
    case 'streaming': { const m=sum(a); return `Streaming total: ${money(m)} per month, ${money(m*12)} per year.`; }
    case 'schoolrun': { const litres=(val(a,0)*val(a,1)/(val(a,2)||1))*4.54609; return `School-run yearly fuel estimate: ${money(litres*val(a,3)/100)}.`; }
    case 'commute': return `Estimated yearly commute: ${money(val(a,0)*val(a,1)*val(a,2))}. Monthly equivalent ${money(val(a,0)*val(a,1)*val(a,2)/12)}.`;
    case 'childcare': return `Estimated monthly childcare: ${money(val(a,0)*val(a,1)*val(a,2)/12)}.`;
    case 'parcel': { const volume=val(a,0)*val(a,1)*val(a,2); return `Volume ${volume.toFixed(0)} cm³, weight ${val(a,3)} kg. ${val(a,3)>2 || volume>45000 ? 'Likely medium/large parcel.' : 'Likely small parcel.'}`; }
    case 'paint': { const litres=(val(a,0)*val(a,1)*val(a,2))/(val(a,3)||1); return `Paint needed: about ${litres.toFixed(1)} litres.`; }
    case 'flooring': { const area=val(a,0)*val(a,1); const total=area*(1+val(a,2)/100); return `Room area ${area.toFixed(2)} m². Buy about ${total.toFixed(2)} m² with waste.`; }
    case 'storage': return `${val(a,0)} GB = ${(val(a,0)*1024).toFixed(0)} MB = ${(val(a,0)/1024).toFixed(2)} TB.`;
    case 'vat': return `Add VAT: ${money(val(a,0)*(1+val(a,1)/100))}. VAT portion: ${money(val(a,0)*val(a,1)/100)}.`;
    case 'discount': return `Sale price: ${money(val(a,0)*(1-val(a,1)/100))}. Saving: ${money(val(a,0)*val(a,1)/100)}.`;
    case 'percent': return `${val(a,1)}% of ${val(a,0)} is ${(val(a,0)*val(a,1)/100).toFixed(2)}.`;
    case 'splitbill': { const total=val(a,0)*(1+val(a,2)/100); return `Total with tip: ${money(total)}. Each pays ${money(total/(val(a,1)||1))}.`; }
    case 'petrolvsdiesel': { const p=(val(a,0)/(val(a,1)||1))*4.54609*val(a,3)/100; const d=(val(a,0)/(val(a,2)||1))*4.54609*val(a,4)/100; return `Petrol: ${money(p)} yearly. Diesel: ${money(d)} yearly. Difference: ${money(Math.abs(p-d))}.`; }
    case 'appliance': { const y=(val(a,0)/1000)*val(a,1)*52*val(a,2)/100; return `Estimated yearly appliance cost: ${money(y)}.`; }
    case 'rentdeposit': { const weekly=val(a,0)*12/52; return `Estimated 5-week deposit cap: ${money(weekly*5)}.`; }
    case 'emergencyfund': return `Emergency fund target: ${money(val(a,0)*val(a,1))}.`;
    case 'debtfree': { let bal=val(a,0), months=0; while(bal>0 && months<600){ bal=bal*(1+val(a,2)/100)-val(a,1); months++; } return months>=600 ? 'Payment may be too low to clear quickly.' : `Estimated debt-free time: ${months} months.`; }
    case 'hourly': return `Gross yearly pay: ${money(val(a,0)*val(a,1)*val(a,2))}.`;
    case 'overtime': return `Overtime pay estimate: ${money(val(a,0)*val(a,1)*val(a,2))}.`;
    case 'pricecompare': { const A=val(a,0)/(val(a,1)||1), B=val(a,2)/(val(a,3)||1); return `Item A unit price ${money(A)}. Item B unit price ${money(B)}. ${A < B ? 'Item A is cheaper per unit.' : 'Item B is cheaper per unit.'}`; }
    default: return 'Calculator ready.';
  }
}

function renderCards(list) {
  const grid = document.getElementById('toolGrid');
  if (!grid) return;
  grid.innerHTML = list.map(t => `
    <button class="tool-card" type="button" data-id="${t.id}">
      <span>${t.icon}</span>
      <b>${t.title}</b>
      <em class="category">${t.cat}</em>
      <p>${t.desc}</p>
    </button>`).join('');
}

function openTool(id) {
  const tool = tools.find(t => t.id === id);
  const panel = document.getElementById('appPanel');
  const mount = document.getElementById('toolMount');
  if (!tool || !panel || !mount) return;
  mount.innerHTML = `
    <h2>${tool.icon} ${tool.title}</h2>
    <p class="tool-desc">${tool.desc}</p>
    <div class="calc-wrap">
      <form class="form" id="calcForm">
        ${tool.labels.map((label, i) => `<label>${label}<input type="number" step="any" value="${tool.defaults[i] ?? 0}"></label>`).join('')}
        <button class="primary" type="submit">Calculate</button>
      </form>
      <div class="result">
        <h3>Your result</h3>
        <div id="resultText">Fill in the boxes and press calculate.</div>
        <p class="warn">These are rough estimates only. Check official sources for important decisions.</p>
      </div>
    </div>`;
  panel.classList.remove('hidden');
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const form = document.getElementById('calcForm');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const values = [...form.querySelectorAll('input')].map(input => input.value);
    document.getElementById('resultText').innerHTML = `<strong>${calculate(id, values)}</strong>`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCards(tools);
  const grid = document.getElementById('toolGrid');
  if (grid) {
    grid.addEventListener('click', event => {
      const card = event.target.closest('.tool-card');
      if (card) openTool(card.dataset.id);
    });
  }
  const close = document.getElementById('closeTool');
  if (close) close.addEventListener('click', () => document.getElementById('appPanel').classList.add('hidden'));
  const search = document.getElementById('searchBox');
  if (search) {
    search.addEventListener('input', event => {
      const q = event.target.value.toLowerCase();
      renderCards(tools.filter(t => `${t.title} ${t.cat} ${t.desc}`.toLowerCase().includes(q)));
    });
  }
});
