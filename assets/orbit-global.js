(() => {
  const THEME_CLASS = 'qc-orbit-global';
  const themed = new WeakSet();
  const cardWords = ['card', 'panel', 'tile', 'box', 'row', 'item', 'summary', 'result', 'insight', 'bill', 'profile', 'tracker', 'saved', 'recent', 'calendar', 'calculator', 'tool'];
  const inputTypes = ['INPUT', 'SELECT', 'TEXTAREA'];

  function hasWord(el, words) {
    const text = `${el.className || ''} ${el.id || ''}`.toLowerCase();
    return words.some(word => text.includes(word));
  }

  function add(el, cls) {
    if (!el || !el.classList) return;
    el.classList.add(cls);
  }

  function themeElement(el) {
    if (!el || el.nodeType !== 1 || themed.has(el)) return;
    themed.add(el);

    if (el.matches('main, section, article, aside')) add(el, 'qc-orbit-zone');
    if (el.matches('button, .button, .btn, [role="button"], input[type="button"], input[type="submit"]')) add(el, 'qc-orbit-button');
    if (el.matches('a')) {
      const text = `${el.className || ''} ${el.textContent || ''}`.toLowerCase();
      if (text.includes('open') || text.includes('start') || text.includes('calculate') || text.includes('profile') || text.includes('tracker') || text.includes('budget')) add(el, 'qc-orbit-link-button');
    }
    if (inputTypes.includes(el.tagName)) add(el, 'qc-orbit-input');
    if (el.matches('label')) add(el, 'qc-orbit-label');
    if (el.matches('form, .form')) add(el, 'qc-orbit-form');
    if (hasWord(el, cardWords)) add(el, 'qc-orbit-surface');
    if (hasWord(el, ['toast', 'notice', 'alert', 'message'])) add(el, 'qc-orbit-toastish');
    if (hasWord(el, ['ad', 'adsbygoogle'])) add(el, 'qc-orbit-ad');
    if (hasWord(el, ['result', 'total', 'saving', 'left', 'income', 'outgoing', 'balance'])) add(el, 'qc-orbit-money');
    if (el.matches('table')) add(el, 'qc-orbit-table');
    if (el.matches('ul, ol')) add(el, 'qc-orbit-list');
  }

  function themeTree(root = document) {
    if (!document.body) return;
    document.documentElement.classList.add(THEME_CLASS);
    document.body.classList.add(THEME_CLASS);
    if (root.nodeType === 1) themeElement(root);
    root.querySelectorAll?.('*').forEach(themeElement);
  }

  function addBackToApp() {
    if (!document.body || document.body.classList.contains('orbit-body')) return;
    if (document.querySelector('.qc-orbit-return')) return;
    const path = location.pathname.toLowerCase();
    if (path.endsWith('/app.html') || path.includes('app-orbit-carousel')) return;
    const a = document.createElement('a');
    a.className = 'qc-orbit-return';
    a.href = 'app.html';
    a.textContent = 'Orbit';
    a.setAttribute('aria-label', 'Return to QuickCheck Orbit app');
    document.body.appendChild(a);
  }

  function watchDynamicUI() {
    const mo = new MutationObserver(records => {
      for (const record of records) {
        record.addedNodes.forEach(node => {
          if (node.nodeType === 1) themeTree(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  function markActivePage() {
    const current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.endsWith(current)) a.classList.add('qc-orbit-current-link');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    themeTree();
    addBackToApp();
    markActivePage();
    watchDynamicUI();
    setTimeout(themeTree, 250);
    setTimeout(themeTree, 900);
  });
})();
