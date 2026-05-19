(() => {
  const modes = ['home', 'money', 'tracker', 'tools', 'guides'];
  const labels = { home: 'Home', money: 'Money', tracker: 'Tracker', tools: 'Tools', guides: 'Guides' };
  const actions = {
    home: [['Plan payday', 'bill-calendar.html', 'primary'], ['Update profile', 'money-profile.html', '']],
    money: [['Open Money Profile', 'money-profile.html', 'primary'], ['Backup', 'data-manager.html', '']],
    tracker: [['Full tracker', 'bill-calendar.html', 'primary']],
    tools: [['Budget', 'budget-planner.html', 'primary'], ['Weekly', 'weekly-budget-calculator.html', ''], ['Subs', 'subscription-cost-calculator.html', '']],
    guides: [['Guides hub', 'guides.html', 'primary'], ['Weekly pay', 'guides/how-to-budget-when-paid-weekly.html', '']]
  };
  const detail = {
    home: 'This is your quick money checkpoint. Start with payday, then use your real tracker data everywhere.',
    money: 'Shows income, bills and what is left from your saved Money Profile.',
    tracker: 'Shows what needs covering before payday from your bill tracker.',
    tools: 'Calculators use your real figures where possible, so answers feel personal.',
    guides: 'Short guides for weekly pay, monthly pay, bills and repeat costs.'
  };
  const F = { weekly: 52 / 12, fortnightly: 26 / 12, fourweekly: 13 / 12, monthly: 1, yearly: 1 / 12 };
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const gbp = n => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(n) || 0);
  const read = (k, f) => { try { return JSON.parse(localStorage.getItem(k) || JSON.stringify(f)); } catch { return f; } };
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const add = (date, f) => { const d = new Date(date); if (f === 'weekly') d.setDate(d.getDate() + 7); else if (f === 'fortnightly') d.setDate(d.getDate() + 14); else if (f === 'fourweekly') d.setDate(d.getDate() + 28); else if (f === 'yearly') d.setFullYear(d.getFullYear() + 1); else d.setMonth(d.getMonth() + 1); return d; };
  const forDay = day => { const n = today(); const d = new Date(n.getFullYear(), n.getMonth(), Math.min(28, Math.max(1, Number(day) || 1))); if (d < n) d.setMonth(d.getMonth() + 1); return d; };
  const dateText = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  let current = 0;
  let expanded = false;
  let startX = 0;
  let startY = 0;
  let dragging = false;

  function profile() {
    const p = read('qc_money_profile_v1', null);
    if (!p) return null;
    const income = Array.isArray(p.incomeSources) && p.incomeSources.length
      ? p.incomeSources.reduce((a, b) => a + (Number(b.amount) || 0) * (F[b.frequency] || 1), 0)
      : Number(p.income) || 0;
    const out = Object.values(p.outgoings || {}).reduce((a, b) => a + (Number(b) || 0), 0) + (p.custom || []).reduce((a, b) => a + (Number(b.amount) || 0), 0);
    return { income, out, left: income - out, week: (income - out) * 12 / 52 };
  }

  function items() {
    const t = read('qc_bill_calendar_v2', { payday: 28, items: [] });
    return (t.items || []).map(x => {
      let d = x.nextDate ? new Date(x.nextDate) : forDay(x.day || 1);
      while (d < today()) d = add(d, x.frequency || 'monthly');
      return { ...x, next: d };
    }).sort((a, b) => a.next - b.next);
  }

  function fillData() {
    const p = profile();
    const all = items();
    const tracker = read('qc_bill_calendar_v2', { payday: 28 });
    const pay = forDay(tracker.payday || 28);
    const inc = all.find(x => x.type === 'income');
    const before = all.filter(x => x.type !== 'income' && x.next <= pay);
    const total = before.reduce((a, b) => a + (Number(b.amount) || 0), 0);
    $('#homeValue').textContent = p ? gbp(Math.max(0, p.week)) : 'Set up';
    $('#homePills').innerHTML = `<span>${before.length} bills</span><span>${gbp(total)} due</span>`;
    $('#moneyValue').textContent = p ? gbp(p.left) : '£0.00';
    $('#moneyPills').innerHTML = `<span>${gbp(p ? p.income : 0)} income</span><span>${gbp(p ? p.out : 0)} bills</span>`;
    $('#trackerValue').textContent = gbp(total);
    $('#trackerPills').innerHTML = `<span>${before.length} payments</span><span>${inc ? dateText(inc.next) : dateText(pay)}</span>`;
    $$('.orbit-card').forEach(card => {
      if (!$('.orbit-detail', card)) {
        const div = document.createElement('div');
        div.className = 'orbit-detail';
        div.textContent = detail[card.dataset.mode] || '';
        card.querySelector('div').appendChild(div);
      }
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
    });
  }

  function render() {
    const scene = $('.orbit-scene');
    const actionWrap = $('#orbitActions');
    $$('.orbit-card').forEach(card => {
      const i = modes.indexOf(card.dataset.mode);
      const isActive = i === current;
      card.classList.toggle('active', isActive);
      card.classList.toggle('prev', i === (current - 1 + modes.length) % modes.length);
      card.classList.toggle('next', i === (current + 1) % modes.length);
      card.classList.toggle('expanded', isActive && expanded);
      card.setAttribute('aria-expanded', String(isActive && expanded));
    });
    $$('.orbit-dock button').forEach(btn => {
      const i = modes.indexOf(btn.dataset.mode);
      const dist = Math.abs(i - current);
      btn.classList.toggle('active', i === current);
      btn.classList.toggle('near', dist === 1);
    });
    const mode = modes[current];
    $('#dockLabel').textContent = expanded ? `${labels[mode]} details` : labels[mode];
    scene.classList.remove('is-dragging');
    actionWrap.parentElement.classList.add('is-changing');
    window.setTimeout(() => {
      actionWrap.innerHTML = (actions[mode] || []).map(([text, url, cls]) => `<a class="${cls || ''}" href="${url}">${text}</a>`).join('');
      actionWrap.parentElement.classList.remove('is-changing');
    }, 110);
  }

  function go(mode) {
    const next = modes.indexOf(mode);
    if (next < 0 || next === current) {
      expanded = !expanded;
    } else {
      current = next;
      expanded = false;
    }
    render();
  }
  function shift(step) {
    current = (current + step + modes.length) % modes.length;
    expanded = false;
    render();
  }

  function onStart(x, y) {
    startX = x; startY = y; dragging = true;
    $('.orbit-scene').classList.add('is-dragging');
  }
  function onMove(x) {
    if (!dragging) return;
    const dx = x - startX;
    const active = $('.orbit-card.active');
    if (!active) return;
    active.classList.toggle('drag-left', dx < -10);
    active.classList.toggle('drag-right', dx > 10);
  }
  function onEnd(x, y) {
    if (!dragging) return;
    dragging = false;
    const dx = x - startX;
    const dy = y - startY;
    $$('.orbit-card').forEach(c => c.classList.remove('drag-left', 'drag-right'));
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.2) shift(dx < 0 ? 1 : -1);
    else render();
  }

  document.addEventListener('DOMContentLoaded', () => {
    fillData();
    render();
    $$('.orbit-dock button').forEach(b => b.addEventListener('click', () => go(b.dataset.mode)));
    $$('.orbit-card').forEach(card => {
      card.addEventListener('click', () => { if (card.classList.contains('active')) go(card.dataset.mode); else go(card.dataset.mode); });
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(card.dataset.mode); } });
    });
    document.addEventListener('touchstart', e => onStart(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    document.addEventListener('touchmove', e => onMove(e.touches[0].clientX), { passive: true });
    document.addEventListener('touchend', e => onEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY), { passive: true });
    document.addEventListener('pointerdown', e => onStart(e.clientX, e.clientY));
    document.addEventListener('pointermove', e => onMove(e.clientX));
    document.addEventListener('pointerup', e => onEnd(e.clientX, e.clientY));
    document.addEventListener('keydown', e => { if (e.key === 'ArrowRight') shift(1); if (e.key === 'ArrowLeft') shift(-1); });
  });
})();
