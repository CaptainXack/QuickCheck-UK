function qcAdSlots(){
  document.querySelectorAll('[data-ad-slot]').forEach((slot,i)=>{
    slot.classList.add('ad-slot');
    if(window.QC_ADSENSE_CLIENT&&window.QC_ADSENSE_SLOT){
      slot.classList.add('ads-ready');
      slot.innerHTML=`<ins class="adsbygoogle" style="display:block" data-ad-client="${window.QC_ADSENSE_CLIENT}" data-ad-slot="${window.QC_ADSENSE_SLOT}" data-ad-format="auto" data-full-width-responsive="true"></ins>`;
      try{(adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){}
    }
  });
}
document.addEventListener('DOMContentLoaded',qcAdSlots);
