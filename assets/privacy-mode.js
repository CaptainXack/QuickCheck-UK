const QC_PRIVACY_KEY='qc_privacy_mode_v1';
function qcPrivacyOn(){return localStorage.getItem(QC_PRIVACY_KEY)==='yes'}
function qcApplyPrivacy(){document.body.classList.toggle('qc-privacy',qcPrivacyOn());const btn=document.getElementById('privacyToggle');if(btn){btn.classList.toggle('active',qcPrivacyOn());btn.textContent=qcPrivacyOn()?'Show amounts':'Hide amounts'}}
function qcTogglePrivacy(){localStorage.setItem(QC_PRIVACY_KEY,qcPrivacyOn()?'no':'yes');qcApplyPrivacy()}
function qcCreatePrivacyToggle(){if(document.getElementById('privacyToggle'))return;const btn=document.createElement('button');btn.type='button';btn.id='privacyToggle';btn.className='privacy-toggle';btn.addEventListener('click',qcTogglePrivacy);document.body.appendChild(btn);qcApplyPrivacy()}
document.addEventListener('DOMContentLoaded',qcCreatePrivacyToggle);
