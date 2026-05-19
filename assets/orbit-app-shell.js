(() => {
  const modes = ['home', 'money', 'tracker', 'tools', 'guides'];
  const labels = { home: 'Home', money: 'Money', tracker: 'Tracker', tools: 'Tools', guides: 'Guides' };
  const cats = {
    home: [['Payday', 'bill-calendar.html'], ['Profile', 'money-profile.html'], ['Backup', 'data-manager.html'], ['Classic', './']],
    money: [['Income', 'form:income'], ['Bills', 'form:bills'], ['Profile', 'money-profile.html'], ['Backup', 'data-manager.html']],
    tracker: [['Income', 'bill-calendar.html'], ['Bills', 'bill-calendar.html'], ['Dates', 'bill-calendar.html'], ['Full', 'bill-calendar.html']],
    tools: [['Budget', 'budget-planner.html'], ['Weekly', 'weekly-budget-calculator.html'], ['Subs', 'subscription-cost-calculator.html'], ['Savings', 'savings-goal-calculator.html']],
    guides: [['Weekly', 'guides/how-to-budget-when-paid-weekly.html'], ['Monthly', 'guides/how-to-budget-when-paid-monthly.html'], ['Bills', 'guides/track-bills-before-payday.html'], ['Hub', 'guides.html']]
  };
  const panelData = {
    income: { title: 'Income setup', note: 'This is the Orbit-style entry layer. The full Money Profile remains available while we migrate forms into this theme.', fields: [['Amount', 'number'], ['Frequency', 'select']] },
    bills: { title: 'Bills setup', note: 'Quick entry for regular bills. Full tracker opens when users need dates, repeats and overrides.', fields: [['Bill name', 'text'], ['Amount', 'number']] }
  };
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  let current = 0;
  let sx = 0, sy = 0, dragging = false;

  function renderCats() {
    const wrap = $('.orbit-cats');
    if (!wrap) return;
    const list = cats[modes[current]] || [];
    wrap.innerHTML = list.map((c, i) => `<button class="orbit-cat c${i + 1} show" data-target="${c[1]}">${c[0]}</button>`).join('');
    $$('.orbit-cat', wrap).forEach(btn => btn.addEventListener('click', e => {
      e.stopPropagation();
      const target = btn.dataset.target;
      if (target.startsWith('form:')) openPanel(target.replace('form:', ''));
      else window.location.href = target;
    }));
  }

  function render() {
    const scene = $('.orbit-scene');
    $$('.orbit-card').forEach(card => {
      const i = modes.indexOf(card.dataset.mode);
      card.classList.toggle('active', i === current);
      card.classList.toggle('prev', i === (current - 1 + modes.length) % modes.length);
      card.classList.toggle('next', i === (current + 1) % modes.length);
      card.classList.remove('expanded');
    });
    scene.classList.remove('shift-next', 'shift-prev', 'swiping');
    $('#orbitActions').innerHTML = `<button class="primary" type="button" id="openMode">Open ${labels[modes[current]]}</button>`;
    $('#openMode')?.addEventListener('click', () => openCurrent());
    renderCats();
  }

  function shift(step) {
    const scene = $('.orbit-scene');
    scene.classList.add(step > 0 ? 'shift-next' : 'shift-prev');
    current = (current + step + modes.length) % modes.length;
    window.requestAnimationFrame(render);
  }

  function go(mode) {
    const index = modes.indexOf(mode);
    if (index >= 0) { current = index; render(); }
  }

  function openCurrent() {
    const mode = modes[current];
    const first = (cats[mode] || [])[0];
    if (!first) return;
    if (first[1].startsWith('form:')) openPanel(first[1].replace('form:', ''));
    else window.location.href = first[1];
  }

  function openPanel(type) {
    const data = panelData[type];
    if (!data) return;
    let panel = $('.orbit-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'orbit-panel';
      document.body.appendChild(panel);
    }
    panel.innerHTML = `<div class="orbit-panel-head"><h2>${data.title}</h2><button class="orbit-panel-close" type="button">×</button></div><div class="orbit-panel-grid">${data.fields.map(f => `<label class="orbit-panel-field"><b>${f[0]}</b>${f[1] === 'select' ? '<select><option>Weekly</option><option>Monthly</option><option>Four-weekly</option></select>' : `<input type="${f[1]}" placeholder="${f[0]}">`}</label>`).join('')}</div><p class="orbit-panel-note">${data.note}</p><div class="orbit-buttons" style="margin-top:12px"><a class="primary" href="money-profile.html">Continue in profile</a><button type="button" class="orbit-panel-close">Close</button></div>`;
    panel.classList.add('open');
    $$('.orbit-panel-close', panel).forEach(b => b.onclick = () => panel.classList.remove('open'));
  }

  function start(x, y) { sx = x; sy = y; dragging = true; $('.orbit-scene').classList.add('swiping'); }
  function end(x, y) {
    if (!dragging) return;
    dragging = false;
    const dx = x - sx, dy = y - sy;
    if (Math.abs(dx) > 38 && Math.abs(dx) > Math.abs(dy) * 1.2) shift(dx < 0 ? 1 : -1);
    else render();
  }

  document.addEventListener('DOMContentLoaded', () => {
    render();
    const ad = document.createElement('div');
    ad.className = 'orbit-bottom-ad';
    ad.innerHTML = '<span>Advertisement</span>';
    document.body.appendChild(ad);
    const catsWrap = document.createElement('div');
    catsWrap.className = 'orbit-cats';
    $('.orbit-scene').appendChild(catsWrap);
    renderCats();
    $$('.orbit-card').forEach(card => {
      card.addEventListener('click', () => card.classList.contains('active') ? openCurrent() : go(card.dataset.mode));
    });
    document.addEventListener('touchstart', e => start(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    document.addEventListener('touchend', e => end(e.changedTouches[0].clientX, e.changedTouches[0].clientY), { passive: true });
    document.addEventListener('pointerdown', e => start(e.clientX, e.clientY));
    document.addEventListener('pointerup', e => end(e.clientX, e.clientY));
    document.addEventListener('keydown', e => { if (e.key === 'ArrowRight') shift(1); if (e.key === 'ArrowLeft') shift(-1); if (e.key === 'Enter') openCurrent(); });
  });
})();
