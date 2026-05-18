const qcExistingSeoPages = {
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

function qcToolCount() {
  return (typeof tools !== 'undefined' ? tools.length : 0) + 1;
}

function qcStandardMatches(q, activeCat) {
  if (activeCat && activeCat !== 'All' && activeCat !== 'Math') return false;
  if (!q) return true;
  return 'standard calculator simple everyday maths math sums'.includes(q.toLowerCase());
}

function qcPatchTools() {
  if (typeof tools === 'undefined') return;
  const takehome = tools.find(t => t.id === 'takehome');
  if (takehome) {
    takehome.title = 'Simple Take-home Pay Estimate';
    takehome.desc = 'Use hourly pay and weekly hours if you do not know an annual salary.';
    takehome.fields = [
      {n:'rate', l:'Hourly rate', t:'number', v:12.21, h:'Use your hourly wage.'},
      {n:'hours', l:'Hours per week', t:'select', v:37.5, h:'Pick the closest weekly hours.', o:[['16 hours',16],['24 hours',24],['30 hours',30],['37.5 hours',37.5],['40 hours',40]]},
      {n:'weeks', l:'Paid weeks per year', t:'select', v:52, h:'Use 52 for year-round work.', o:[['52 weeks',52],['48 weeks',48],['39 school-term weeks',39]]},
      {n:'tax', l:'Rough tax % above allowance', t:'number', v:20, h:'Leave as 20 if unsure.'},
      {n:'ni', l:'Rough NI % above allowance', t:'number', v:8, h:'Leave as 8 if unsure.'}
    ];
  }
}

if (typeof calculate !== 'undefined') {
  const qcPreviousCalculate = calculate;
  calculate = function(id, a) {
    try {
      if (id === 'takehome') {
        const yearlyGross = v(a,'rate') * v(a,'hours') * v(a,'weeks');
        const allowance = 12570;
        const taxable = Math.max(0, yearlyGross - allowance);
        const take = yearlyGross - taxable * v(a,'tax') / 100 - taxable * v(a,'ni') / 100;
        return res(
          `${money(take / 12)} rough monthly take-home`,
          [`Gross yearly pay: ${money(yearlyGross)}`, `Rough yearly take-home: ${money(take)}`, `Rough weekly take-home: ${money(take / 52)}`],
          'This is a simplified estimate. Real payslips can differ because of pension, tax code, benefits, student loans or deductions.'
        );
      }
      return qcPreviousCalculate(id, a);
    } catch (error) {
      return res('Something needs checking', ['This calculator hit a calculation error.'], 'Try checking the figures. I have trapped the error so the site keeps working.');
    }
  };
}

function qcCardHtml(t) {
  const inner = `<span>${t.icon}</span><b>${t.title}</b><em class="category">${t.cat}</em><p>${t.desc}</p>`;
  const href = qcExistingSeoPages[t.id];
  if (href) return `<a class="tool-card" href="${href}" data-id="${t.id}">${inner}</a>`;
  return `<button class="tool-card" type="button" data-id="${t.id}">${inner}</button>`;
}

function qcStandardCard() {
  return `<a class="tool-card" href="standard-calculator.html" data-standard="true"><span>🧮</span><b>Standard Calculator</b><em class="category">Math</em><p>Simple everyday calculator for quick sums.</p></a>`;
}

renderCards = function(list = tools) {
  const grid = document.getElementById('toolGrid');
  if (!grid || typeof tools === 'undefined') return;
  const activeCat = document.querySelector('.category-chip.active')?.dataset.cat || 'All';
  const q = (document.getElementById('searchBox')?.value || '').trim().toLowerCase();
  const showStandard = qcStandardMatches(q, activeCat);
  grid.innerHTML = (showStandard ? qcStandardCard() : '') + list.map(qcCardHtml).join('');
  qcUpdateCount();
};

openTool = function(id) {
  const tool = tools.find(t => t.id === id);
  const panel = document.getElementById('appPanel');
  const mount = document.getElementById('toolMount');
  if (!tool || !panel || !mount) return;

  try {
    const recent = JSON.parse(localStorage.getItem('qc_recent_tools') || '[]').filter(x => x !== id);
    recent.unshift(id);
    localStorage.setItem('qc_recent_tools', JSON.stringify(recent.slice(0, 6)));
  } catch {}

  mount.innerHTML = `<h2>${tool.icon} ${tool.title}</h2><p class="tool-desc">${tool.desc}</p><button id="favToolBtn" type="button" class="soft">Save to favourites</button><div class="calc-wrap"><form class="form" id="calcForm">${tool.fields.map(fieldHtml).join('')}<button class="primary" type="submit">Calculate</button></form><div class="result" id="printArea"><h3>Your result</h3><div id="resultText"><p>Fill in what you know. Use the built-in presets when you are unsure.</p></div><div class="result-actions hidden" id="resultActions"><button type="button" class="soft" id="copyResult">Copy result</button><button type="button" class="soft" id="printResult">Print result</button></div></div></div>`;

  panel.classList.remove('hidden');
  panel.scrollIntoView({behavior:'smooth', block:'start'});

  document.getElementById('favToolBtn').onclick = () => {
    try {
      const favs = JSON.parse(localStorage.getItem('qc_favs') || '[]').filter(x => x !== id);
      favs.unshift(id);
      localStorage.setItem('qc_favs', JSON.stringify(favs.slice(0, 12)));
      document.getElementById('favToolBtn').textContent = 'Saved';
      if (typeof renderEpicPanel === 'function') renderEpicPanel();
    } catch {}
  };

  const form = document.getElementById('calcForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(form).entries());
    const r = calculate(id, values);
    const resultText = `${tool.title}\n${r.title}\n${r.lines.join('\n')}\n${r.tip}`;
    document.getElementById('resultText').innerHTML = `<div class="result-main">${r.title}</div><ul class="result-lines">${r.lines.map(x => `<li>${x}</li>`).join('')}</ul><p class="result-tip">${r.tip}</p>`;
    document.getElementById('resultActions').classList.remove('hidden');
    document.getElementById('copyResult').onclick = async () => {
      try { await navigator.clipboard.writeText(resultText); document.getElementById('copyResult').textContent = 'Copied'; }
      catch { alert(resultText); }
    };
    document.getElementById('printResult').onclick = () => window.print();
    try {
      const saved = JSON.parse(localStorage.getItem('qc_results') || '[]');
      saved.unshift({ id, title: tool.title, text: resultText, date: new Date().toLocaleString() });
      localStorage.setItem('qc_results', JSON.stringify(saved.slice(0, 8)));
    } catch {}
  });
};

function qcUpdateCount() {
  document.querySelectorAll('#toolCount').forEach((el, i) => { if (i > 0) el.remove(); });
  let count = document.getElementById('toolCount');
  const heading = document.querySelector('#tools .section-head div');
  if (!count && heading) {
    count = document.createElement('p');
    count.id = 'toolCount';
    count.className = 'tool-count';
    heading.appendChild(count);
  }
  if (count) count.textContent = `${qcToolCount()} total tools: ${tools.length} guided calculators plus the standard calculator`;
}

function qcFilteredTools() {
  const activeCat = document.querySelector('.category-chip.active')?.dataset.cat || 'All';
  const q = (document.getElementById('searchBox')?.value || '').trim().toLowerCase();
  let list = activeCat === 'All' ? tools : tools.filter(t => t.cat === activeCat);
  if (q) list = list.filter(t => `${t.title} ${t.cat} ${t.desc}`.toLowerCase().includes(q));
  return list;
}

function qcRewireControls() {
  const oldSearch = document.getElementById('searchBox');
  if (oldSearch) {
    const freshSearch = oldSearch.cloneNode(true);
    oldSearch.replaceWith(freshSearch);
    freshSearch.addEventListener('input', () => renderCards(qcFilteredTools()));
  }
  const oldBar = document.getElementById('categoryBar');
  if (oldBar) {
    const freshBar = oldBar.cloneNode(true);
    oldBar.replaceWith(freshBar);
    freshBar.querySelectorAll('.category-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        freshBar.querySelectorAll('.category-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderCards(qcFilteredTools());
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  qcPatchTools();
  setTimeout(() => {
    qcRewireControls();
    renderCards(qcFilteredTools());
    qcUpdateCount();
    const autoTool = document.body?.dataset?.openTool;
    if (autoTool) openTool(autoTool);
  }, 120);
});
