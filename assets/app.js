const tools = [
  {
    id: 'electricity', icon: '⚡', title: 'Appliance Running Cost', cat: 'Bills',
    desc: 'Pick a common appliance or enter watts to estimate daily, monthly and yearly cost.',
    fields: [
      { name:'watts', label:'Appliance', type:'select', value:1000, help:'Choose a rough appliance power if you do not know the watts.', options:[['Kettle / air fryer high power',3000],['Electric heater',2000],['Tumble dryer',2500],['Washing machine cycle average',700],['Fridge freezer average',150],['Games console / TV setup',250],['Laptop',65],['Custom 1000W',1000]] },
      { name:'hours', label:'Hours used each time/day', type:'number', value:1, help:'Use decimals if needed, for example 0.5 for 30 minutes.' },
      { name:'days', label:'Days used per week', type:'number', value:7, help:'Use 7 if it is used daily.' },
      { name:'price', label:'Electricity unit rate p/kWh', type:'number', value:25, help:'If unsure, leave this as a rough estimate and update later.' }
    ]
  },
  {
    id: 'rent', icon: '🏠', title: 'Rent Affordability Check', cat: 'Housing',
    desc: 'Enter income, rent and rough living costs to see how tight a move may feel.',
    fields: [
      { name:'income', label:'Monthly household income after tax/benefits', type:'number', value:2200, help:'Use the money actually coming in each month.' },
      { name:'rent', label:'Monthly rent', type:'number', value:900, help:'The advertised rent.' },
      { name:'bills', label:'Bills estimate', type:'select', value:500, help:'Use a preset if you do not know the exact bills yet.', options:[['Low estimate £350',350],['Average estimate £500',500],['High estimate £700',700],['Very high estimate £900',900]] },
      { name:'foodTravel', label:'Food and travel estimate', type:'select', value:650, help:'Rough household essentials outside rent/bills.', options:[['Low £450',450],['Average £650',650],['High £850',850],['Very high £1100',1100]] }
    ]
  },
  {
    id: 'moving', icon: '📦', title: 'Moving Money Needed', cat: 'Housing',
    desc: 'A clearer moving-cost checker that works from rent and common upfront costs.',
    fields: [
      { name:'rent', label:'Monthly rent', type:'number', value:900, help:'Used to estimate first rent and deposit.' },
      { name:'depositWeeks', label:'Deposit weeks', type:'select', value:5, help:'Many private rentals use up to five weeks rent as deposit.', options:[['No deposit',0],['2 weeks',2],['4 weeks',4],['5 weeks',5]] },
      { name:'holding', label:'Holding deposit / admin buffer', type:'number', value:150, help:'Put 0 if not needed.' },
      { name:'moveCosts', label:'Van, removals and setup', type:'select', value:400, help:'Use a preset if you do not know yet.', options:[['Very low £150',150],['Basic £400',400],['Medium £800',800],['Heavy move £1500',1500]] }
    ]
  },
  {
    id: 'broadband', icon: '📡', title: 'Broadband Speed Needed', cat: 'Tech',
    desc: 'Estimate a sensible broadband speed from actual household use.',
    fields: [
      { name:'people', label:'People using internet', type:'number', value:3, help:'Count phones, tablets, consoles and TVs too.' },
      { name:'usage', label:'Usage level', type:'select', value:20, help:'Pick the closest household style.', options:[['Light browsing',8],['Normal family use',20],['Heavy streaming/gaming',35],['Busy home / lots of devices',55]] },
      { name:'streams', label:'4K streams at once', type:'number', value:1, help:'Netflix/YouTube/Prime in 4K.' },
      { name:'workers', label:'Video calls / home workers', type:'number', value:1, help:'Teams, Zoom, remote work etc.' }
    ]
  },
  {
    id: 'phone', icon: '📱', title: 'Phone Contract Real Cost', cat: 'Tech',
    desc: 'See the full cost of a phone deal instead of only the monthly price.',
    fields: [
      { name:'upfront', label:'Upfront cost', type:'number', value:49, help:'Anything paid today.' },
      { name:'monthly', label:'Monthly payment', type:'number', value:35, help:'The advertised monthly cost.' },
      { name:'months', label:'Contract length', type:'select', value:24, help:'Most phone deals are 24 or 36 months.', options:[['12 months',12],['18 months',18],['24 months',24],['36 months',36]] },
      { name:'tradein', label:'Trade-in / cashback', type:'number', value:0, help:'Put 0 if none.' }
    ]
  },
  {
    id: 'subscriptions', icon: '🧾', title: 'Subscription Cost Check', cat: 'Money',
    desc: 'Add up streaming, apps and memberships so the yearly total is obvious.',
    fields: [
      { name:'tv', label:'TV / streaming total', type:'number', value:18, help:'Netflix, Disney, Prime, NOW etc.' },
      { name:'music', label:'Music / audio', type:'number', value:11, help:'Spotify, Apple Music, Audible etc.' },
      { name:'cloud', label:'Cloud / storage / apps', type:'number', value:5, help:'iCloud, Google, Microsoft, apps.' },
      { name:'other', label:'Other subscriptions', type:'number', value:0, help:'Gym, gaming, Patreon, extra apps.' }
    ]
  },
  {
    id: 'caravan', icon: '🏕️', title: 'Static Caravan Real Yearly Cost', cat: 'Lifestyle',
    desc: 'A fuller yearly cost estimate including site fees, finance and extras.',
    fields: [
      { name:'site', label:'Annual site fees', type:'number', value:6500, help:'Usually the biggest yearly cost.' },
      { name:'insurance', label:'Insurance and safety checks', type:'number', value:450, help:'Use a rough combined figure if unsure.' },
      { name:'utilities', label:'Gas, electric, water', type:'number', value:900, help:'Rough yearly utility estimate.' },
      { name:'finance', label:'Caravan finance per month', type:'number', value:0, help:'Put 0 if bought outright.' },
      { name:'extras', label:'Maintenance, travel and extras', type:'select', value:1000, help:'Cleaning, repairs, fuel, passes and surprise costs.', options:[['Low £500',500],['Average £1000',1000],['High £2000',2000],['Very high £3500',3500]] }
    ]
  },
  {
    id: 'fuel', icon: '⛽', title: 'Journey Fuel Cost', cat: 'Travel',
    desc: 'Estimate trip fuel cost without needing exact litres.',
    fields: [
      { name:'miles', label:'Journey miles one way', type:'number', value:50, help:'Use one-way miles then choose single or return.' },
      { name:'returnTrip', label:'Trip type', type:'select', value:2, help:'Choose return if you are coming back.', options:[['Single journey',1],['Return journey',2]] },
      { name:'mpg', label:'Car MPG', type:'select', value:45, help:'Use a rough preset if you do not know.', options:[['Poor economy 30 MPG',30],['Average 45 MPG',45],['Good 60 MPG',60]] },
      { name:'price', label:'Fuel price p/litre', type:'number', value:145, help:'Pump price in pence.' }
    ]
  },
  {
    id: 'pay', icon: '💷', title: 'Hourly Pay to Yearly Pay', cat: 'Work',
    desc: 'Convert hourly pay into weekly, monthly and yearly gross pay.',
    fields: [
      { name:'rate', label:'Hourly rate', type:'number', value:12.21, help:'Your hourly pay.' },
      { name:'hours', label:'Hours per week', type:'select', value:37.5, help:'Pick common full/part time hours.', options:[['16 hours',16],['24 hours',24],['30 hours',30],['37.5 hours',37.5],['40 hours',40]] },
      { name:'weeks', label:'Paid weeks per year', type:'select', value:52, help:'Use 52 for year-round work.', options:[['52 weeks',52],['48 weeks',48],['39 school-term weeks',39]] }
    ]
  },
  {
    id: 'loan', icon: '🏦', title: 'Loan Payment Estimate', cat: 'Money',
    desc: 'Estimate the monthly payment and total repaid on a loan.',
    fields: [
      { name:'amount', label:'Amount borrowed', type:'number', value:5000, help:'Loan amount.' },
      { name:'apr', label:'APR %', type:'number', value:9.9, help:'Use the advertised APR.' },
      { name:'years', label:'Repayment length', type:'select', value:3, help:'Longer terms lower monthly payments but usually cost more overall.', options:[['1 year',1],['2 years',2],['3 years',3],['5 years',5],['7 years',7]] }
    ]
  },
  {
    id: 'savings', icon: '🐖', title: 'Savings Goal Time', cat: 'Money',
    desc: 'See how long a savings target may take.',
    fields: [
      { name:'target', label:'Target amount', type:'number', value:1000, help:'What you want to save.' },
      { name:'saved', label:'Already saved', type:'number', value:100, help:'Current savings.' },
      { name:'monthly', label:'Can save per month', type:'number', value:50, help:'A realistic amount you can stick to.' }
    ]
  },
  {
    id: 'emergencyfund', icon: '🛟', title: 'Emergency Fund Target', cat: 'Money',
    desc: 'Work out a simple safety buffer for essential costs.',
    fields: [
      { name:'essentials', label:'Monthly essentials', type:'number', value:1200, help:'Rent, bills, food, transport.' },
      { name:'months', label:'Months of cover', type:'select', value:3, help:'Three months is a common starter target.', options:[['1 month',1],['3 months',3],['6 months',6]] }
    ]
  },
  {
    id: 'unitprice', icon:'⚖️', title:'Unit Price Compare', cat:'Shopping',
    desc:'Compare two packs when sizes are different.',
    fields:[
      {name:'priceA',label:'Item A price',type:'number',value:2.50,help:'First item price.'},
      {name:'amountA',label:'Item A amount',type:'number',value:500,help:'Size, grams, ml or count.'},
      {name:'priceB',label:'Item B price',type:'number',value:3.20,help:'Second item price.'},
      {name:'amountB',label:'Item B amount',type:'number',value:750,help:'Use the same unit as Item A.'}
    ]
  }
];

function money(value){return new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(Number(value)||0)}
function byName(values,name){return Number(values[name])||0}
function result(title,lines,tip){return {title,lines,tip}}

function calculate(id,v){
  switch(id){
    case 'electricity':{const daily=(byName(v,'watts')/1000)*byName(v,'hours')*(byName(v,'price')/100);const weekly=daily*byName(v,'days');return result(`${money(daily)} per used day`,[`Weekly estimate: ${money(weekly)}`,`Monthly estimate: ${money(weekly*52/12)}`,`Yearly estimate: ${money(weekly*52)}`],'If the result looks high, reduce hours used or check the appliance wattage label.')} 
    case 'rent':{const total=byName(v,'rent')+byName(v,'bills')+byName(v,'foodTravel');const left=byName(v,'income')-total;const pct=byName(v,'income')?total/byName(v,'income')*100:0;return result(`${pct.toFixed(1)}% of income used`,[`Rent: ${money(byName(v,'rent'))}`,`Bills + essentials estimate: ${money(byName(v,'bills')+byName(v,'foodTravel'))}`,`Money left after these basics: ${money(left)}`],pct>75?'Very tight. This may be risky unless other support or income is available.':pct>60?'Tight. Build a careful monthly budget before committing.':'Looks more manageable on the figures entered.')} 
    case 'moving':{const rent=byName(v,'rent');const weekly=rent*12/52;const deposit=weekly*byName(v,'depositWeeks');const total=rent+deposit+byName(v,'holding')+byName(v,'moveCosts');return result(`${money(total)} likely upfront`,[`First month rent: ${money(rent)}`,`Estimated deposit: ${money(deposit)}`,`Holding/admin buffer: ${money(byName(v,'holding'))}`,`Move/setup costs: ${money(byName(v,'moveCosts'))}`],'Add extra buffer for food, travel and anything missing on move-in day.')} 
    case 'broadband':{const mb=Math.ceil(byName(v,'people')*byName(v,'usage')+byName(v,'streams')*35+byName(v,'workers')*20);return result(`${mb} Mbps suggested minimum`,[`For comfort, look one package above this if many devices run at once.`,`Upload speed matters for video calls and cloud backups.`],mb>180?'Gigabit or very fast fibre may be worth it.':mb>80?'Fast fibre is sensible.':'Standard fibre may be enough.')} 
    case 'phone':{const total=byName(v,'upfront')+byName(v,'monthly')*byName(v,'months')-byName(v,'tradein');return result(`${money(total)} total contract cost`,[`True monthly equivalent: ${money(total/(byName(v,'months')||1))}`,`Amount paid over contract before trade-in: ${money(byName(v,'upfront')+byName(v,'monthly')*byName(v,'months'))}`],'Compare this with buying the phone outright plus a SIM-only plan.')} 
    case 'subscriptions':{const m=byName(v,'tv')+byName(v,'music')+byName(v,'cloud')+byName(v,'other');return result(`${money(m)} per month`,[`Yearly cost: ${money(m*12)}`,`Two-year cost: ${money(m*24)}`],m>80?'This is becoming a serious monthly bill. Cancel anything unused.':'A yearly total makes small subscriptions easier to judge.')} 
    case 'caravan':{const y=byName(v,'site')+byName(v,'insurance')+byName(v,'utilities')+byName(v,'finance')*12+byName(v,'extras');return result(`${money(y)} estimated yearly cost`,[`Monthly equivalent: ${money(y/12)}`,`Finance per year: ${money(byName(v,'finance')*12)}`,`Non-finance yearly costs: ${money(y-byName(v,'finance')*12)}`],'Ask the site for written fees, selling rules, age limits and commission before buying.')} 
    case 'fuel':{const miles=byName(v,'miles')*byName(v,'returnTrip');const litres=(miles/(byName(v,'mpg')||1))*4.54609;const cost=litres*byName(v,'price')/100;return result(`${money(cost)} estimated fuel cost`,[`Total miles counted: ${miles}`,`Fuel used: ${litres.toFixed(1)} litres`],'Real cost may be higher in traffic, hills or short stop-start journeys.')} 
    case 'pay':{const yearly=byName(v,'rate')*byName(v,'hours')*byName(v,'weeks');return result(`${money(yearly)} gross yearly pay`,[`Gross weekly pay: ${money(byName(v,'rate')*byName(v,'hours'))}`,`Average gross monthly pay: ${money(yearly/12)}`],'This is gross pay before tax, NI, pension or deductions.')} 
    case 'loan':{const P=byName(v,'amount'),rate=byName(v,'apr')/100/12,months=byName(v,'years')*12;const pay=rate?P*rate/(1-Math.pow(1+rate,-months)):P/(months||1);return result(`${money(pay)} estimated monthly payment`,[`Total repaid: ${money(pay*months)}`,`Estimated interest: ${money(pay*months-P)}`],'A longer loan can look cheaper monthly but cost more overall.')} 
    case 'savings':{const left=Math.max(0,byName(v,'target')-byName(v,'saved'));const months=byName(v,'monthly')?Math.ceil(left/byName(v,'monthly')):0;return result(`${months} months to target`,[`Amount still needed: ${money(left)}`,`Monthly saving: ${money(byName(v,'monthly'))}`],months>24?'Try a smaller first target so it feels achievable.':'Keep the monthly amount realistic so you actually stick with it.')} 
    case 'emergencyfund':{const total=byName(v,'essentials')*byName(v,'months');return result(`${money(total)} emergency fund target`,[`Monthly essentials: ${money(byName(v,'essentials'))}`,`Cover length: ${byName(v,'months')} months`],'Start with one month if the full target feels impossible.')} 
    case 'unitprice':{const A=byName(v,'priceA')/(byName(v,'amountA')||1),B=byName(v,'priceB')/(byName(v,'amountB')||1);return result(A<B?'Item A is cheaper':'Item B is cheaper',[`Item A unit price: ${money(A)}`,`Item B unit price: ${money(B)}`,`Difference per unit: ${money(Math.abs(A-B))}`],'Use the same units for both items, for example grams vs grams or ml vs ml.')} 
    default:return result('Calculator ready',[],'Choose a tool and enter your numbers.');
  }
}

function renderCards(list=tools){
  const grid=document.getElementById('toolGrid');
  if(!grid)return;
  grid.innerHTML=list.map(t=>`<button class="tool-card" type="button" data-id="${t.id}"><span>${t.icon}</span><b>${t.title}</b><em class="category">${t.cat}</em><p>${t.desc}</p></button>`).join('');
}

function fieldHtml(field){
  if(field.type==='select'){
    return `<label><span>${field.label}</span><select name="${field.name}">${field.options.map(o=>`<option value="${o[1]}" ${Number(o[1])===Number(field.value)?'selected':''}>${o[0]}</option>`).join('')}</select><small>${field.help}</small></label>`;
  }
  return `<label><span>${field.label}</span><input name="${field.name}" type="number" step="any" value="${field.value}"><small>${field.help}</small></label>`;
}

function openTool(id){
  const tool=tools.find(t=>t.id===id),panel=document.getElementById('appPanel'),mount=document.getElementById('toolMount');
  if(!tool||!panel||!mount)return;
  mount.innerHTML=`<h2>${tool.icon} ${tool.title}</h2><p class="tool-desc">${tool.desc}</p><div class="calc-wrap"><form class="form" id="calcForm">${tool.fields.map(fieldHtml).join('')}<button class="primary" type="submit">Calculate</button></form><div class="result"><h3>Your result</h3><div id="resultText"><p>Fill in what you know. Use the built-in presets when you are unsure.</p></div></div></div>`;
  panel.classList.remove('hidden');
  panel.scrollIntoView({behavior:'smooth',block:'start'});
  const form=document.getElementById('calcForm');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const values=Object.fromEntries(new FormData(form).entries());
    const r=calculate(id,values);
    document.getElementById('resultText').innerHTML=`<div class="result-main">${r.title}</div><ul class="result-lines">${r.lines.map(x=>`<li>${x}</li>`).join('')}</ul><p class="result-tip">${r.tip}</p>`;
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  renderCards(tools);
  const grid=document.getElementById('toolGrid');
  if(grid)grid.addEventListener('click',e=>{const card=e.target.closest('.tool-card');if(card)openTool(card.dataset.id)});
  const close=document.getElementById('closeTool');
  if(close)close.addEventListener('click',()=>document.getElementById('appPanel').classList.add('hidden'));
  const search=document.getElementById('searchBox');
  if(search)search.addEventListener('input',e=>{const q=e.target.value.toLowerCase();renderCards(tools.filter(t=>`${t.title} ${t.cat} ${t.desc}`.toLowerCase().includes(q)))});
});
