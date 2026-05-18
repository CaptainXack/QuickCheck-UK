const seoPages = {
  budgetplanner: 'budget-planner.html',
  rent: 'rent-affordability-calculator.html',
  moving: 'moving-cost-calculator.html',
  electricity: 'electricity-running-cost-calculator.html',
  broadband: 'broadband-speed-calculator.html',
  phone: 'phone-contract-cost-calculator.html',
  caravan: 'static-caravan-cost-calculator.html',
  fuel: 'fuel-cost-calculator.html',
  subscriptions: 'subscription-cost-calculator.html',
  mortgage: 'mortgage-payment-calculator.html',
  takehome: 'take-home-pay-calculator.html',
  foodbudget: 'food-budget-calculator.html'
};

if (typeof tools !== 'undefined') {
  const budget = tools.find(t => t.id === 'budgetplanner');
  if (budget) {
    budget.title = 'Full Budget Planner vs Bills';
    budget.desc = 'Build a clearer monthly budget with income, rent, bills, food, travel, debts, subscriptions and savings.';
    budget.fields = [
      {n:'income',l:'Monthly income after tax/benefits',t:'number',v:2400,h:'Total household money coming in each month.'},
      {n:'rent',l:'Rent or mortgage',t:'number',v:900,h:'Your main housing payment.'},
      {n:'council',l:'Council tax',t:'number',v:160,h:'Monthly council tax.'},
      {n:'energy',l:'Gas and electric',t:'select',v:180,h:'Use a preset if unsure.',o:[['Low £120',120],['Average £180',180],['High £260',260],['Very high £350',350]]},
      {n:'water',l:'Water',t:'number',v:35,h:'Monthly water cost.'},
      {n:'broadband',l:'Broadband / TV / phones',t:'number',v:80,h:'Internet, TV package and mobile phones.'},
      {n:'food',l:'Food and household shopping',t:'select',v:500,h:'Groceries, toiletries and cleaning.',o:[['Tight £350',350],['Basic £500',500],['High £700',700],['Very high £900',900]]},
      {n:'travel',l:'Travel / fuel / bus',t:'number',v:180,h:'Monthly transport costs.'},
      {n:'subs',l:'Subscriptions',t:'number',v:35,h:'Streaming, music, apps, gaming etc.'},
      {n:'debt',l:'Debt / credit payments',t:'number',v:0,h:'Loans, cards, catalogues etc.'},
      {n:'savings',l:'Savings / emergency buffer',t:'number',v:50,h:'Money you want left aside.'},
      {n:'other',l:'Other regular costs',t:'number',v:100,h:'Clothes, school, pets, prescriptions, small extras.'}
    ];
  }
}

if (typeof calculate !== 'undefined') {
  const oldCalculate = calculate;
  calculate = function(id, a) {
    if (id === 'budgetplanner') {
      const income = v(a,'income');
      const housing = v(a,'rent') + v(a,'council');
      const utilities = v(a,'energy') + v(a,'water') + v(a,'broadband');
      const living = v(a,'food') + v(a,'travel') + v(a,'subs') + v(a,'other');
      const commitments = v(a,'debt') + v(a,'savings');
      const total = housing + utilities + living + commitments;
      const left = income - total;
      const pct = income ? total / income * 100 : 0;
      const weeklyLeft = left / 4.33;
      return res(
        `${money(left)} left each month`,
        [
          `Housing: ${money(housing)}`,
          `Utilities and communications: ${money(utilities)}`,
          `Food, travel and living costs: ${money(living)}`,
          `Debt and savings: ${money(commitments)}`,
          `Total planned spending: ${money(total)}`,
          `Weekly leftover: ${money(weeklyLeft)}`,
          `Spending uses ${pct.toFixed(1)}% of income`
        ],
        left < 0 ? 'This budget is short. Something needs cutting or income/support needs increasing.' : pct > 90 ? 'Very tight. A small surprise bill could break this budget.' : pct > 75 ? 'Tight but possible if spending is controlled carefully.' : 'This leaves healthier breathing room on the figures entered.'
      );
    }
    return oldCalculate(id, a);
  };
}

function getCategories() {
  const cats = ['All', ...Array.from(new Set(tools.map(t => t.cat))).sort()];
  return cats;
}

function ensureCategoryBar() {
  const grid = document.getElementById('toolGrid');
  if (!grid || document.getElementById('categoryBar')) return;
  const bar = document.createElement('div');
  bar.id = 'categoryBar';
  bar.className = 'category-bar';
  bar.innerHTML = getCategories().map(c => `<button type="button" class="category-chip ${c==='All'?'active':''}" data-cat="${c}">${c}</button>`).join('');
  grid.parentNode.insertBefore(bar, grid);
}

function cardHtml(t) {
  const href = seoPages[t.id];
  const inner = `<span>${t.icon}</span><b>${t.title}</b><em class="category">${t.cat}</em><p>${t.desc}</p>`;
  if (href) return `<a class="tool-card" href="${href}" data-id="${t.id}">${inner}</a>`;
  return `<button class="tool-card" type="button" data-id="${t.id}">${inner}</button>`;
}

if (typeof renderCards !== 'undefined') {
  renderCards = function(list = tools) {
    const grid = document.getElementById('toolGrid');
    if (!grid) return;
    const standard = `<a class="tool-card" href="standard-calculator.html"><span>🧮</span><b>Standard Calculator</b><em class="category">Math</em><p>Simple everyday calculator for quick sums.</p></a>`;
    grid.innerHTML = standard + list.map(cardHtml).join('');
    const count = document.getElementById('toolCount');
    if (count) count.textContent = `${tools.length + 1} total tools`;
  };
}

if (typeof openTool !== 'undefined') {
  openTool = function(id) {
    const tool = tools.find(t => t.id === id), panel = document.getElementById('appPanel'), mount = document.getElementById('toolMount');
    if (!tool || !panel || !mount) return;
    mount.innerHTML = `<h2>${tool.icon} ${tool.title}</h2><p class="tool-desc">${tool.desc}</p><div class="calc-wrap"><form class="form" id="calcForm">${tool.fields.map(fieldHtml).join('')}<button class="primary" type="submit">Calculate</button></form><div class="result" id="printArea"><h3>Your result</h3><div id="resultText"><p>Fill in what you know. Use the built-in presets when you are unsure.</p></div><div class="result-actions hidden" id="resultActions"><button type="button" class="soft" id="copyResult">Copy result</button><button type="button" class="soft" id="printResult">Print result</button></div></div></div>`;
    panel.classList.remove('hidden');
    panel.scrollIntoView({behavior:'smooth', block:'start'});
    const form = document.getElementById('calcForm');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const values = Object.fromEntries(new FormData(form).entries());
      const r = calculate(id, values);
      const text = `${tool.title}\n${r.title}\n${r.lines.join('\n')}\n${r.tip}`;
      const profileContext = typeof qcProfileSummary === 'function' ? (() => {
        const s = qcProfileSummary();
        if (!s.income && !s.out) return '';
        return `<div class="profile-hint"><strong>Money Profile context</strong><p>Saved income: ${money(s.income)} · regular outgoings: ${money(s.out)} · left each month: ${money(s.left)}.</p><div><a href="money-profile.html">Edit Money Profile</a></div></div>`;
      })() : '';
      document.getElementById('resultText').innerHTML = `<div class="result-main">${r.title}</div><ul class="result-lines">${r.lines.map(x => `<li>${x}</li>`).join('')}</ul><p class="result-tip">${r.tip}</p>${profileContext}`;
      const actions = document.getElementById('resultActions');
      actions.classList.remove('hidden');
      document.getElementById('copyResult').onclick = async () => {
        try { await navigator.clipboard.writeText(text); document.getElementById('copyResult').textContent = 'Copied'; }
        catch { alert(text); }
      };
      document.getElementById('printResult').onclick = () => window.print();
    });
    setTimeout(() => {
      if (typeof qcProfileApplyToForm === 'function') qcProfileApplyToForm(id);
    }, 180);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  ensureCategoryBar();
  const heading = document.querySelector('#tools .section-head div');
  if (heading && !document.getElementById('toolCount')) {
    const count = document.createElement('p');
    count.id = 'toolCount';
    count.className = 'tool-count';
    count.textContent = `${tools.length + 1} total tools`;
    heading.appendChild(count);
  }
  renderCards(tools);
  document.querySelectorAll('.category-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      const q = (document.getElementById('searchBox')?.value || '').toLowerCase();
      let list = cat === 'All' ? tools : tools.filter(t => t.cat === cat);
      if (q) list = list.filter(t => `${t.title} ${t.cat} ${t.desc}`.toLowerCase().includes(q));
      renderCards(list);
    });
  });
  const search = document.getElementById('searchBox');
  if (search) {
    search.addEventListener('input', e => {
      const active = document.querySelector('.category-chip.active')?.dataset.cat || 'All';
      const q = e.target.value.toLowerCase();
      let list = active === 'All' ? tools : tools.filter(t => t.cat === active);
      if (q) list = list.filter(t => `${t.title} ${t.cat} ${t.desc}`.toLowerCase().includes(q));
      renderCards(list);
    });
  }
  const autoTool = document.body?.dataset?.openTool;
  if (autoTool) setTimeout(() => openTool(autoTool), 80);
});

function qcLoadScriptOnce(flag, src, onload) {
  if (window[flag]) return;
  window[flag] = true;
  const script = document.createElement('script');
  script.src = src;
  script.defer = true;
  if (onload) script.onload = onload;
  document.head.appendChild(script);
}
function qcLoadCssOnce(id, href) {
  if (document.getElementById(id)) return;
  const css = document.createElement('link');
  css.id = id;
  css.rel = 'stylesheet';
  css.href = href;
  document.head.appendChild(css);
}

(function qcLoadSmartModulesEverywhere(){
  qcLoadScriptOnce('qcProfileCoreRequested','assets/profile-core.js?v=2',() => {
    const autoTool = document.body?.dataset?.openTool;
    if (autoTool && typeof qcProfileApplyToForm === 'function') setTimeout(() => qcProfileApplyToForm(autoTool), 250);
  });
  qcLoadCssOnce('qcSmartResultsCss','assets/smart-results.css?v=1');
  qcLoadScriptOnce('qcSmartResultsRequested','assets/smart-results.js?v=1');
  qcLoadScriptOnce('qcSavedCalcsRequested','assets/saved-calcs.js?v=1');
  qcLoadScriptOnce('qcRecentToolsRequested','assets/recent-tools.js?v=1');
  qcLoadCssOnce('qcPrivacyModeCss','assets/privacy-mode.css?v=1');
  qcLoadScriptOnce('qcPrivacyModeRequested','assets/privacy-mode.js?v=1');
})();
