function qcDistanceMatches(q, activeCat) {
  if (activeCat && activeCat !== 'All' && activeCat !== 'Travel') return false;
  if (!q) return true;
  return 'distance calculator route miles places postcode travel driving fuel map'.includes(q.toLowerCase());
}
function qcDistanceCard() {
  return `<a class="tool-card" href="distance-calculator.html" data-distance="true"><span>🗺️</span><b>Distance Calculator</b><em class="category">Travel</em><p>Calculate place-to-place distance, route estimate, drive time and fuel cost.</p></a>`;
}
function qcInjectDistanceCard() {
  const grid = document.getElementById('toolGrid');
  if (!grid || grid.querySelector('[data-distance="true"]')) return;
  const activeCat = document.querySelector('.category-chip.active')?.dataset.cat || 'All';
  const q = (document.getElementById('searchBox')?.value || '').trim().toLowerCase();
  if (!qcDistanceMatches(q, activeCat)) return;
  const standard = grid.querySelector('[data-standard="true"]');
  if (standard) standard.insertAdjacentHTML('afterend', qcDistanceCard());
  else grid.insertAdjacentHTML('afterbegin', qcDistanceCard());
}
function qcUpdateDistanceCount() {
  const count = document.getElementById('toolCount');
  if (count && typeof tools !== 'undefined') {
    count.textContent = `${tools.length + 2} total tools: ${tools.length} guided calculators plus the standard calculator and distance calculator`;
  }
}
setTimeout(() => {
  if (typeof renderCards === 'function') {
    const oldRenderCards = renderCards;
    renderCards = function(list) {
      oldRenderCards(list);
      qcInjectDistanceCard();
      qcUpdateDistanceCount();
    };
    renderCards(typeof qcFilteredTools === 'function' ? qcFilteredTools() : tools);
  }
  document.addEventListener('input', e => {
    if (e.target && e.target.id === 'searchBox') setTimeout(() => { qcInjectDistanceCard(); qcUpdateDistanceCount(); }, 20);
  });
  document.addEventListener('click', e => {
    if (e.target && e.target.closest('.category-chip')) setTimeout(() => { qcInjectDistanceCard(); qcUpdateDistanceCount(); }, 20);
  });
}, 350);
