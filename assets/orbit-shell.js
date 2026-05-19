(() => {
  const modes = ['home','money','tracker','tools','guides'];
  const labels = {home:'Home', money:'Money', tracker:'Tracker', tools:'Tools', guides:'Guides'};
  const F = {weekly:52/12, fortnightly:26/12, fourweekly:13/12, monthly:1, yearly:1/12};
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const gbp = n => new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(Number(n)||0);
  const read = (k, f) => { try { return JSON.parse(localStorage.getItem(k) || JSON.stringify(f)); } catch { return f; } };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const today = () => { const d = new Date(); d.setHours(0,0,0,0); return d; };
  const forDay = day => {
    const n = today();
    const d = new Date(n.getFullYear(), n.getMonth(), Math.min(28, Math.max(1, Number(day)||1)));
    if (d < n) d.setMonth(d.getMonth()+1);
    return d;
  };
  const addDate = (date, f) => {
    const d = new Date(date);
    if (f === 'weekly') d.setDate(d.getDate()+7);
    else if (f === 'fortnightly') d.setDate(d.getDate()+14);
    else if (f === 'fourweekly') d.setDate(d.getDate()+28);
    else if (f === 'yearly') d.setFullYear(d.getFullYear()+1);
    else d.setMonth(d.getMonth()+1);
    return d;
  };
  const dateText = d => d.toLocaleDateString('en-GB',{day:'numeric', month:'short'});

  let current = 0, sx = 0, sy = 0, dragging = false;

  const pageTitle = {
    'money-profile.html':'Money Profile',
    'bill-calendar.html':'Money Tracker',
    'budget-planner.html':'Budget Planner',
    'weekly-budget-calculator.html':'Weekly Budget Calculator',
    'subscription-cost-calculator.html':'Subscription Calculator',
    'savings-goal-calculator.html':'Savings Goal',
    'calculator-directory.html':'All Calculators',
    'data-manager.html':'Backup and Data',
    'guides.html':'Money Guides',
    'guides/how-to-budget-when-paid-weekly.html':'Weekly Pay Guide',
    'guides/how-to-budget-when-paid-monthly.html':'Monthly Pay Guide',
    'guides/track-bills-before-payday.html':'Bills Before Payday',
    'guides/money-left-after-bills.html':'Money Left Guide',
    'guides/save-weekly-from-monthly-income.html':'Save Weekly Guide',
    'guides/reduce-subscription-costs.html':'Cut Subscriptions'
  };

  const cats = {
    home: [['Dashboard','dashboard'], ['Money Profile','page:money-profile.html'], ['Budget','page:budget-planner.html'], ['Tracker','page:bill-calendar.html']],
    money: [['Full Profile','page:money-profile.html'], ['What-if','page:money-profile.html#whatIfSimulator'], ['Left','left'], ['Backup','page:data-manager.html']],
    tracker: [['Full Tracker','page:bill-calendar.html'], ['Add bill','bill'], ['Due','due'], ['History','page:bill-calendar.html#paymentHistory']],
    tools: [['All tools','page:calculator-directory.html'], ['Budget','page:budget-planner.html'], ['Weekly','page:weekly-budget-calculator.html'], ['Subs','page:subscription-cost-calculator.html']],
    guides: [['Hub','page:guides.html'], ['Weekly','page:guides/how-to-budget-when-paid-weekly.html'], ['Monthly','page:guides/how-to-budget-when-paid-monthly.html'], ['Bills','page:guides/track-bills-before-payday.html']]
  };

  const panels = {
    payday:{title:'Payday anchor',note:'Set your normal payday. This controls due-before-payday totals.',fields:[['Payday day','number','28']],save(v,p){const t=store();t.payday=Math.min(28,Math.max(1,Number(v['Payday day'])||28));saveStore(t);note(p,'Payday saved.')}} ,
    profile:{title:'Money profile',note:'Save your monthly income and outgoings.',fields:[['Monthly income','number',''],['Monthly outgoings','number','']],save(v,p){write('qc_money_profile_v1',{income:Number(v['Monthly income'])||0,outgoings:{main:Number(v['Monthly outgoings'])||0},custom:[]});note(p,'Profile saved. Use Full Profile for the full category tracker.')}} ,
    income:{title:'Add income',note:'Add wages, benefits or repeat income.',fields:[['Name','text','Income'],['Amount','number',''],['Frequency','select','monthly']],save(v,p){const t=store();t.items=t.items||[];t.items.push({type:'income',name:v.Name||'Income',amount:Number(v.Amount)||0,frequency:v.Frequency||'monthly',day:28});saveStore(t);note(p,'Income added.')}} ,
    bill:{title:'Add bill',note:'Quick add here, or open the full tracker for dates, categories, paid/skipped history and payday planning.',fields:[['Bill name','text','Bill'],['Amount','number',''],['Frequency','select','monthly'],['Day of month','number','1']],save(v,p){const t=store();t.items=t.items||[];t.items.push({type:'bill',name:v['Bill name']||'Bill',amount:Number(v.Amount)||0,frequency:v.Frequency||'monthly',day:Math.min(28,Math.max(1,Number(v['Day of month'])||1))});saveStore(t);note(p,'Bill added. Open Full Tracker for full dates/history.')}} ,
    budget:{title:'Budget tool',note:'Check what is left, or open the full Budget Planner for profile-powered fields.',fields:[['Income','number',''],['Outgoings','number','']],save(v,p){note(p,'Budget result: '+gbp((Number(v.Income)||0)-(Number(v.Outgoings)||0))+' left.')}} ,
    weekly:{title:'Weekly tool',note:'Convert monthly to weekly, or open the full Weekly Budget Calculator.',fields:[['Monthly amount','number','']],save(v,p){note(p,'Weekly result: '+gbp((Number(v['Monthly amount'])||0)*12/52)+' per week.')}} ,
    subs:{title:'Subscriptions',note:'Check monthly and yearly repeat cost, or open the full subscription calculator.',fields:[['Cost','number',''],['Frequency','select','monthly']],save(v,p){const m=(Number(v.Cost)||0)*(F[v.Frequency]||1);note(p,'Subscription: '+gbp(m)+' monthly, '+gbp(m*12)+' yearly.')}} ,
    savings:{title:'Savings goal',note:'Plan a savings target, or open the full savings calculator.',fields:[['Target amount','number',''],['Months','number','12']],save(v,p){const m=(Number(v['Target amount'])||0)/Math.max(1,Number(v.Months)||1);note(p,'Save '+gbp(m)+' per month, about '+gbp(m*12/52)+' per week.')}} 
  };

  const notes = {
    help:'Swipe the centre bubble. Tap the centre or floating buttons to open panels.',
    left:'This shows income minus outgoings from your saved profile.',
    due:'Your next bill and before-payday total appears here.',
    tracker:'Your next money movements stay inside Orbit.',
    dashboard:'Your full QuickCheck app is still here. Orbit is the front door, not a replacement.',
    'g-weekly':'Weekly pay: essentials, bill pot, then flexible spend.',
    'g-monthly':'Monthly pay: split payday before the month spends itself.',
    'g-bills':'Track due dates before payday.',
    'g-hub':'Guides stay in Orbit.'
  };

  function profile(){
    const p = read('qc_money_profile_v1', null);
    if (!p) return null;
    const income = Array.isArray(p.incomeSources) && p.incomeSources.length
      ? p.incomeSources.reduce((a,b)=>a+(Number(b.amount)||0)*(F[b.frequency]||1),0)
      : Number(p.income)||0;
    const out = Object.values(p.outgoings||{}).reduce((a,b)=>a+(Number(b)||0),0)
      + (p.custom||[]).reduce((a,b)=>a+(Number(b.amount)||0),0);
    return {income, out, left:income-out, week:(income-out)*12/52, used:income ? out/income*100 : 0};
  }
  function store(){return read('qc_bill_calendar_v2',{payday:28,items:[]});}
  function saveStore(t){write('qc_bill_calendar_v2',t);}
  function items(){
    const t=store();
    return (t.items||[]).map(x=>{
      let d=x.nextDate?new Date(x.nextDate):forDay(x.day||1);
      while(d<today()) d=addDate(d,x.frequency||'monthly');
      return {...x,next:d};
    }).sort((a,b)=>a.next-b.next);
  }
  function state(){
    const p=profile(), all=items(), t=store(), pay=forDay(t.payday||28);
    const bills=all.filter(x=>x.type!=='income'), nextBill=bills[0]||null, before=bills.filter(x=>x.next<=pay);
    const total=before.reduce((a,b)=>a+(Number(b.amount)||0),0);
    return {p,all,bills,nextBill,before,total,pay};
  }
  function setMood(s){
    let m='neutral';
    const left=s.p?.left||0, week=s.p?.week||0;
    if(left<0||week<0)m='negative';
    else if(left>0&&(week>=75||left>=300))m='positive';
    else if(left>0)m='amber';
    document.body.classList.remove('orbit-mood-positive','orbit-mood-amber','orbit-mood-negative','orbit-mood-neutral');
    document.body.classList.add('orbit-mood-'+m);
  }
  function fill(){
    const s=state(); setMood(s);
    const next=s.nextBill;
    $('#homeValue').textContent=s.p?gbp(s.p.left):'Set up';
    $('#homePills').innerHTML='<span>'+(s.p?gbp(Math.max(0,s.p.week))+'/week':'profile needed')+'</span><span>'+(next?next.name+' '+dateText(next.next):'open tracker')+'</span><span>'+(next?gbp(next.amount):gbp(s.total)+' due')+'</span>';
    $('#moneyValue').textContent=s.p?gbp(s.p.left):'£0.00';
    $('#moneyPills').innerHTML='<span>'+gbp(s.p?.income||0)+' income</span><span>'+gbp(s.p?.out||0)+' bills</span><span>'+(s.p?Math.round(s.p.used)+'% used':'profile')+'</span>';
    $('#trackerValue').textContent=next?gbp(next.amount):gbp(s.total);
    $('#trackerPills').innerHTML='<span>'+(next?next.name:'Full tracker')+'</span><span>'+(next?dateText(next.next):dateText(s.pay))+'</span>';
  }
  function renderCats(){
    let w=$('.orbit-cats');
    if(!w){w=document.createElement('div');w.className='orbit-cats';$('.orbit-scene')?.appendChild(w);}
    w.innerHTML=(cats[modes[current]]||[]).map((c,i)=>'<button class="orbit-cat c'+(i+1)+' show" data-panel="'+c[1]+'">'+c[0]+'</button>').join('');
    $$('.orbit-cat',w).forEach(b=>b.onclick=e=>{e.stopPropagation();openPanel(b.dataset.panel);});
  }
  function render(){
    fill();
    $$('.orbit-card').forEach(card=>{
      const i=modes.indexOf(card.dataset.mode);
      card.classList.toggle('active',i===current);
      card.classList.toggle('prev',i===(current-1+modes.length)%modes.length);
      card.classList.toggle('next',i===(current+1)%modes.length);
      card.setAttribute('role','button');
      card.setAttribute('tabindex','0');
    });
    $('.orbit-scene')?.classList.remove('shift-next','shift-prev','swiping');
    $('#orbitActions').innerHTML='<button class="primary" type="button" id="openMode">Open '+labels[modes[current]]+'</button><button type="button" id="allTools">All tools</button>';
    $('#openMode')?.addEventListener('click',openCurrent);
    $('#allTools')?.addEventListener('click',()=>openFrame('calculator-directory.html','All QuickCheck tools'));
    renderCats(); ensureAd();
  }
  function shift(step){
    $('.orbit-scene')?.classList.add(step>0?'shift-next':'shift-prev');
    current=(current+step+modes.length)%modes.length;
    requestAnimationFrame(render);
  }
  function openCurrent(){
    const first=(cats[modes[current]]||[])[0];
    if(first) openPanel(first[1]);
  }
  function vals(panel){
    const o={};
    $$('label.orbit-panel-field',panel).forEach(l=>{o[l.querySelector('b')?.textContent||'Value']=l.querySelector('input,select')?.value||'';});
    return o;
  }
  function note(panel,text){panel.querySelector('.orbit-panel-note').textContent=text;fill();}
  function miniLink(label,target,sub){
    return '<button type="button" class="orbit-panel-link" data-frame="'+target+'"><b>'+label+'</b><small>'+sub+'</small></button>';
  }
  function dashboardHtml(){
    const s=state(), p=s.p;
    return '<div class="orbit-panel-grid orbit-panel-grid-rich">'
      + miniLink('Money Profile','money-profile.html',p?gbp(p.income)+' in · '+gbp(p.out)+' out':'full setup, custom categories, what-if')
      + miniLink('Budget Planner','budget-planner.html','profile-powered calculator')
      + miniLink('Bill Calendar','bill-calendar.html',s.nextBill?('next '+s.nextBill.name+' '+dateText(s.nextBill.next)):'income, bills, payday and history')
      + miniLink('All Calculators','calculator-directory.html','rent, energy, savings, debt, food, travel and more')
      + miniLink('Backup Data','data-manager.html','export, import and clear saved data')
      + miniLink('Guides','guides.html','short money guides')
      + '</div>';
  }
  function info(type){
    const s=state();
    if(type==='dashboard') return dashboardHtml();
    if(type==='left') return '<div class="orbit-panel-grid"><div class="orbit-panel-link"><b>'+gbp(s.p?.income||0)+'</b><small>Income</small></div><div class="orbit-panel-link"><b>'+gbp(s.p?.out||0)+'</b><small>Outgoings</small></div><div class="orbit-panel-link"><b>'+gbp(s.p?.left||0)+'</b><small>Left monthly</small></div><div class="orbit-panel-link"><b>'+gbp(s.p?.week||0)+'</b><small>Safe weekly</small></div></div>';
    if(type==='due'||type==='tracker') return '<div class="orbit-panel-grid">'+(s.bills.length?s.bills:[{name:'No bills yet',amount:0,next:s.pay}]).slice(0,6).map(x=>'<div class="orbit-panel-link"><b>'+x.name+'</b><small>'+gbp(x.amount)+' · '+dateText(x.next)+'</small></div>').join('')+'</div><div class="orbit-panel-actions">'+miniLink('Open full tracker','bill-calendar.html','dates, categories, paid/skipped history')+'</div>';
    return '<div class="orbit-panel-grid"><div class="orbit-panel-link"><b>Orbit view</b><small>'+(notes[type]||'This stays inside the app shell.')+'</small></div></div>';
  }
  function titleFor(src){
    const clean=src.replace(/^\.?\//,'').split('#')[0];
    return pageTitle[clean] || 'QuickCheck';
  }
  function openFrame(src,title){
    let p=$('.orbit-panel');
    if(!p){p=document.createElement('div');p.className='orbit-panel';document.body.appendChild(p);}
    p.className='orbit-panel orbit-panel-full';
    p.innerHTML='<div class="orbit-panel-head"><h2>'+ (title||titleFor(src)) +'</h2><button class="orbit-panel-close" type="button">×</button></div><iframe class="orbit-panel-frame" src="'+src+'" title="'+(title||titleFor(src))+'"></iframe><div class="orbit-panel-foot"><small>Full QuickCheck flow running inside Orbit.</small><a href="'+src+'" target="_blank" rel="noopener">Open full page</a></div>';
    p.classList.add('open');
    $$('.orbit-panel-close',p).forEach(b=>b.onclick=()=>p.classList.remove('open'));
  }
  function openPanel(type){
    if(type?.startsWith('page:')) return openFrame(type.slice(5));
    const d=panels[type];
    let p=$('.orbit-panel');
    if(!p){p=document.createElement('div');p.className='orbit-panel';document.body.appendChild(p);}
    p.className='orbit-panel';
    const title=d?.title||labels[modes[current]]||'QuickCheck';
    const msg=d?.note||notes[type]||'Same Orbit theme.';
    let body='';
    if(d?.fields?.length){
      body='<div class="orbit-panel-grid">'+d.fields.map(f=>'<label class="orbit-panel-field"><b>'+f[0]+'</b>'+(f[1]==='select'?'<select>'+['weekly','fortnightly','fourweekly','monthly','yearly'].map(o=>'<option '+(o===f[2]?'selected':'')+'>'+o+'</option>').join('')+'</select>':'<input type="'+f[1]+'" value="'+(f[2]||'')+'" placeholder="'+f[0]+'">')+'</label>').join('')+'</div>';
    } else body=info(type);
    p.innerHTML='<div class="orbit-panel-head"><h2>'+title+'</h2><button class="orbit-panel-close" type="button">×</button></div>'+body+'<p class="orbit-panel-note">'+msg+'</p><div class="orbit-buttons" style="margin-top:12px"><button class="primary" type="button" id="orbitSavePanel">'+(d?.save?'Save / calculate':'Done')+'</button><button type="button" class="orbit-panel-close">Close</button></div>';
    p.classList.add('open');
    $('#orbitSavePanel',p).onclick=()=>d?.save?d.save(vals(p),p):p.classList.remove('open');
    $$('.orbit-panel-close',p).forEach(b=>b.onclick=()=>p.classList.remove('open'));
    $$('[data-frame]',p).forEach(b=>b.onclick=()=>openFrame(b.dataset.frame,b.querySelector('b')?.textContent));
  }
  function ensureAd(){
    if(!$('.orbit-bottom-ad')){
      const ad=document.createElement('div');
      ad.className='orbit-bottom-ad';
      ad.innerHTML='<span>Advertisement</span>';
      document.body.appendChild(ad);
    }
  }
  function ignoreDragTarget(target){
    return !!target.closest('.orbit-panel,button,a,input,select,textarea,label');
  }
  function startEvent(e){
    if(ignoreDragTarget(e.target)) return;
    const t=e.touches?.[0]||e;
    sx=t.clientX; sy=t.clientY; dragging=true; $('.orbit-scene')?.classList.add('swiping');
  }
  function endEvent(e){
    if(!dragging) return;
    dragging=false;
    const t=e.changedTouches?.[0]||e;
    const dx=t.clientX-sx, dy=t.clientY-sy;
    if(Math.abs(dx)>38&&Math.abs(dx)>Math.abs(dy)*1.2) shift(dx<0?1:-1);
    else render();
  }
  document.addEventListener('DOMContentLoaded',()=>{
    render();
    $$('.orbit-card').forEach(card=>{
      card.onclick=()=>card.classList.contains('active')?openCurrent():null;
      card.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();card.click();}};
    });
    document.addEventListener('touchstart',startEvent,{passive:true});
    document.addEventListener('touchend',endEvent,{passive:true});
    document.addEventListener('pointerdown',startEvent);
    document.addEventListener('pointerup',endEvent);
    document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')shift(1);if(e.key==='ArrowLeft')shift(-1);if(e.key==='Escape')$('.orbit-panel')?.classList.remove('open');});
  });
})();
