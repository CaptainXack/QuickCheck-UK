function qcStage5ApplyFixes(){
  try{
    if(typeof qcStage3SeoPages!=='undefined'){
      qcStage3SeoPages.rentsplit='house-share-rent-split-calculator.html';
      qcStage3SeoPages.monthlytoyearly='monthly-cost-to-yearly-calculator.html';
      qcStage3SeoPages.multibuy='multi-buy-deal-calculator.html';
    }
    if(typeof epicPages!=='undefined'){
      epicPages.rentsplit='house-share-rent-split-calculator.html';
      epicPages.monthlytoyearly='monthly-cost-to-yearly-calculator.html';
      epicPages.multibuy='multi-buy-deal-calculator.html';
    }
    if(typeof seoPages!=='undefined'){
      seoPages.rentsplit='house-share-rent-split-calculator.html';
      seoPages.monthlytoyearly='monthly-cost-to-yearly-calculator.html';
      seoPages.multibuy='multi-buy-deal-calculator.html';
    }
    setTimeout(()=>{
      if(typeof renderCards==='function'&&typeof tools!=='undefined'){
        renderCards(typeof qcFilteredTools==='function'?qcFilteredTools():tools);
      }
    },700);
  }catch(e){console.warn('Stage 5 link fixes skipped',e)}
}
document.addEventListener('DOMContentLoaded',qcStage5ApplyFixes);
