window.QC_ADSENSE_CLIENT='ca-pub-6774225698160800';
window.QC_ADSENSE_SLOT=window.QC_ADSENSE_SLOT||'';
function qcLoadAdSenseScript(){
  if(document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'))return;
  const s=document.createElement('script');
  s.async=true;
  s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+window.QC_ADSENSE_CLIENT;
  s.crossOrigin='anonymous';
  document.head.appendChild(s);
}
function qcAdSlots(){
  qcLoadAdSenseScript();
  document.querySelectorAll('[data-ad-slot]').forEach((slot)=>{
    slot.classList.add('ad-slot');
    if(window.QC_ADSENSE_CLIENT){
      slot.classList.add('ads-ready');
      const slotAttr=window.QC_ADSENSE_SLOT?` data-ad-slot="${window.QC_ADSENSE_SLOT}"`:'';
      slot.innerHTML=`<ins class="adsbygoogle" style="display:block" data-ad-client="${window.QC_ADSENSE_CLIENT}"${slotAttr} data-ad-format="auto" data-full-width-responsive="true"></ins>`;
      try{(adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){}
    }
  });
}
document.addEventListener('DOMContentLoaded',qcAdSlots);
