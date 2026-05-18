let deferredInstallPrompt = null;

function createInstallPanel() {
  if (document.getElementById('pwaPanel')) return;
  const panel = document.createElement('section');
  panel.id = 'pwaPanel';
  panel.className = 'pwa-panel';
  panel.innerHTML = `
    <div>
      <strong>Use QuickCheck like an app</strong>
      <p>Add it to your phone or desktop for faster access and offline use.</p>
    </div>
    <div class="pwa-actions">
      <button type="button" class="soft" id="installAppBtn">Install app</button>
      <button type="button" class="soft" id="notifyBtn">Enable result alerts</button>
    </div>`;
  const main = document.querySelector('main');
  if (main) main.insertBefore(panel, main.firstChild.nextSibling);

  const installBtn = document.getElementById('installAppBtn');
  installBtn.addEventListener('click', async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      installBtn.textContent = 'Install ready';
    } else {
      installBtn.textContent = 'Use browser menu → Install app';
    }
  });

  const notifyBtn = document.getElementById('notifyBtn');
  notifyBtn.addEventListener('click', async () => {
    if (!('Notification' in window)) {
      notifyBtn.textContent = 'Notifications unsupported';
      return;
    }
    const permission = await Notification.requestPermission();
    notifyBtn.textContent = permission === 'granted' ? 'Alerts enabled' : 'Alerts blocked';
    if (permission === 'granted') {
      new Notification('QuickCheck UK alerts enabled', {
        body: 'You can now get local result alerts while using the app.',
        icon: 'assets/icon.svg'
      });
    }
  });
}

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  const btn = document.getElementById('installAppBtn');
  if (btn) btn.textContent = 'Install app';
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/QuickCheck-UK/service-worker.js').catch(() => null);
  });
}

function notifyResult(title, body) {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  try {
    new Notification(title, { body, icon: 'assets/icon.svg' });
  } catch {}
}

document.addEventListener('DOMContentLoaded', () => {
  createInstallPanel();
  document.addEventListener('click', event => {
    if (event.target && event.target.id === 'copyResult') {
      notifyResult('QuickCheck result copied', 'Your calculation result is ready to paste or save.');
    }
  });
});
