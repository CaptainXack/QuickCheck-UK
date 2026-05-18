const QC_FEEDBACK_EMAIL='simonjhackett.sh1@outlook.com';
function qcFeedbackToast(text){const old=document.querySelector('.qc-toast');if(old)old.remove();const t=document.createElement('div');t.className='qc-toast';t.textContent=text;document.body.appendChild(t);setTimeout(()=>t.remove(),2400)}
function qcDebugData(){let recent='';try{recent=JSON.parse(localStorage.getItem('qc_recent_tools')||'[]').slice(0,8).join(', ')}catch{}return {
  app:'QuickCheck UK',
  page:location.href,
  pageTitle:document.title,
  time:new Date().toISOString(),
  timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||'unknown',
  userAgent:navigator.userAgent,
  language:navigator.language,
  platform:navigator.platform,
  online:navigator.onLine?'yes':'no',
  standalone:(window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true)?'yes':'no',
  screen:`${screen.width}x${screen.height}`,
  viewport:`${innerWidth}x${innerHeight}`,
  referrer:document.referrer||'none',
  recentTools:recent||'none'
}}
function qcDebugText(){const d=qcDebugData();return `QuickCheck UK debug report\n\nApp: ${d.app}\nPage: ${d.page}\nPage title: ${d.pageTitle}\nTime: ${d.time}\nTimezone: ${d.timezone}\nOnline: ${d.online}\nInstalled app mode: ${d.standalone}\nScreen: ${d.screen}\nViewport: ${d.viewport}\nLanguage: ${d.language}\nPlatform: ${d.platform}\nReferrer: ${d.referrer}\nRecent tools: ${d.recentTools}\nUser agent: ${d.userAgent}\n`}
function qcFeedbackBody(){const type=document.getElementById('feedbackType')?.value||'General feedback';const page=document.getElementById('feedbackPage')?.value||location.href;const message=document.getElementById('feedbackMessage')?.value||'';return `Hello QuickCheck UK,\n\nFeedback type: ${type}\nPage or calculator: ${page}\n\nPlease add your feedback, error details or improvement idea below:\n\n${message}\n\nWhat happened?\n\nWhat did you expect?\n\nAnything else that would help us improve it?\n\n---\nDebug info added automatically:\n${qcDebugText()}\nThank you. We will look into it.`}
function qcOpenFeedbackEmail(){const type=document.getElementById('feedbackType')?.value||'General feedback';const subject=encodeURIComponent(`QuickCheck UK - ${type}`);const body=encodeURIComponent(qcFeedbackBody());location.href=`mailto:${QC_FEEDBACK_EMAIL}?subject=${subject}&body=${body}`}
async function qcCopyDebug(){try{await navigator.clipboard.writeText(qcDebugText());qcFeedbackToast('Debug report copied')}catch{qcFeedbackToast('Copy failed')}}
function qcDownloadDebug(){const blob=new Blob([qcDebugText()],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='quickcheck-debug-report.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);qcFeedbackToast('Debug file downloaded')}
async function qcShareDebugFile(){try{const file=new File([qcDebugText()],'quickcheck-debug-report.txt',{type:'text/plain'});if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({title:'QuickCheck UK debug report',text:'QuickCheck UK feedback/debug report',files:[file]});return}await navigator.clipboard.writeText(qcDebugText());qcFeedbackToast('Sharing files unsupported. Debug copied instead')}catch{}}
function qcRefreshDebugPreview(){const box=document.getElementById('debugPreview');if(box)box.value=qcDebugText()}
document.addEventListener('DOMContentLoaded',()=>{document.getElementById('feedbackPage').value=location.href;qcRefreshDebugPreview();document.getElementById('openFeedbackEmail')?.addEventListener('click',qcOpenFeedbackEmail);document.getElementById('copyDebug')?.addEventListener('click',qcCopyDebug);document.getElementById('downloadDebug')?.addEventListener('click',qcDownloadDebug);document.getElementById('shareDebug')?.addEventListener('click',qcShareDebugFile);document.getElementById('refreshDebug')?.addEventListener('click',qcRefreshDebugPreview);['feedbackType','feedbackPage','feedbackMessage'].forEach(id=>document.getElementById(id)?.addEventListener('input',qcRefreshDebugPreview));});
