function qcLoadMobileCss(){
  if(document.querySelector('link[href*="mobile-polish.css"]'))return;
  const l=document.createElement('link');l.rel='stylesheet';l.href='assets/mobile-polish.css?v=1';document.head.appendChild(l);
}
function qcMobileNav(){
  qcLoadMobileCss();
  if(document.querySelector('.mobile-bottom-nav'))return;
  const nav=document.createElement('nav');
  nav.className='mobile-bottom-nav';
  nav.setAttribute('aria-label','Mobile quick navigation');
  nav.innerHTML=`<a href="./"><span>🏠</span>Home</a><a href="calculator-directory.html"><span>🧭</span>Directory</a><a href="./#tools"><span>🔎</span>Search</a><button type="button" id="qcTopBtn"><span>⬆️</span>Top</button>`;
  document.body.appendChild(nav);
  document.getElementById('qcTopBtn')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  if(!document.querySelector('.skip-to-tools')&&document.getElementById('tools')){
    const a=document.createElement('a');a.className='skip-to-tools';a.href='#tools';a.textContent='Search tools';document.body.appendChild(a);
  }
}
document.addEventListener('DOMContentLoaded',qcMobileNav);
