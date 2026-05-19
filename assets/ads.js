window.QC_ADSENSE_CLIENT='ca-pub-6774225609816080';
window.QC_ADSENSE_SLOT=window.QC_ADSENSE_SLOT||'';
function qcLoadAdSenseScript(){
  if(!window.QC_ADSENSE_CLIENT)return;
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
    if(slot.dataset.adRendered==='yes')return;
    slot.dataset.adRendered='yes';
    slot.classList.add('ad-slot');
    const manualSlot=(slot.getAttribute('data-ad-slot')||window.QC_ADSENSE_SLOT||'').trim();
    slot.setAttribute('aria-label','Advertisement');
    if(window.QC_ADSENSE_CLIENT&&manualSlot){
      slot.classList.add('ads-ready');
      slot.innerHTML=`<ins class="adsbygoogle" style="display:block" data-ad-client="${window.QC_ADSENSE_CLIENT}" data-ad-slot="${manualSlot}" data-ad-format="auto" data-full-width-responsive="true"></ins>`;
      try{(adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){}
    }else{
      slot.classList.add('ads-placeholder');
      slot.innerHTML='<span>Advertisement</span>';
    }
  });
}
document.addEventListener('DOMContentLoaded',qcAdSlots);
window.addEventListener('qc-ads-refresh',qcAdSlots);
