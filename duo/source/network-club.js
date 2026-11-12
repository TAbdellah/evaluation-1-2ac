import {NETWORK_VERSION,CLUB_SSID,CLUB_PRINTER,CLUB_FILES,replayClubNetwork,clubWifi,clubReachable,clubCanPrint,clubOperationLabel,clubAnsweredCount} from './network-state.js';
export {NETWORK_VERSION,clubOperationLabel,clubAnsweredCount};
export const clubPhotoCards=[{name:'PC',image:'net5-pc'},{name:'Switch',image:'net5-switch'},{name:'Point d’accès',image:'net5-ap'},{name:'Portable',image:'net5-laptop'},{name:'Imprimante Wi-Fi',image:'net5-printer'}];
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tr=(fr,ar)=>`<span${ar?` data-ar="${esc(ar)}" tabindex="0"`:''}>${esc(fr)}</span>`;
const image=name=>'./assets/net5-'+name+'.webp';
let api,step=1,selected='',panel=null,message='',clipboard=null,selectedFile='',ssidChoice='',printerChoice='';
const model=()=>replayClubNetwork(api?.operations()||[]);
const names={pc1:'PC-1',pc2:'PC-2',ap:'Point d’accès',laptop:'Portable',printer:CLUB_PRINTER};
function counts(s){return [Object.keys(s.ports).length,Number(!!clubWifi(s,'laptop'))+Number(!!clubWifi(s,'printer')),Number(s.files['texte.txt'])+Number(s.files['photos.jpg'])+Number(s.printed)];}
const instructions=[
 ['Branche PC-1, PC-2 et le point d’accès sur trois ports libres du switch.','اربط PC-1 وPC-2 ونقطة الولوج بثلاثة منافذ فارغة في المبدل.'],
 ['Connecte le portable et l’imprimante au Wi-Fi CLUB-2AC.','اربط الحاسوب المحمول والطابعة بشبكة CLUB-2AC.'],
 ['Sur le portable, récupère texte.txt depuis PC-1 et photos.jpg depuis PC-2 dans Documents. Ouvre ensuite affiche.pdf et imprime-la.','استرجع على المحمول texte.txt من PC-1 وphotos.jpg من PC-2 في Documents. ثم افتح affiche.pdf واطبع الملصق.']
];
export function renderClubExercise(operations=[]){return `<div class="question-card club-exercise"><h2>${tr('Fais fonctionner le réseau du club','شغّل شبكة النادي')}</h2><p class="instruction">${tr('Le texte est sur PC-1, les photos sur PC-2. Le portable doit récupérer les deux fichiers et imprimer l’affiche préparée.','يوجد النص في PC-1 والصور في PC-2. على المحمول استرجاع الملفين وطباعة الملصق الجاهز.')} <strong>${tr('Internet est coupé. Le portable reste sans câble.','الإنترنت مقطوع. يبقى المحمول بدون كابل.')}</strong></p><div id="club-lab">${renderClubNetwork(operations)}</div></div>`;}
export function renderClubNetwork(operations=[]){
 const s=replayClubNetwork(operations),done=counts(s);
 const portX=p=>352.5+(p-1)*35;
 const wires=Object.entries(s.ports).map(([id,p])=>{const x=portX(p);return id==='ap'?`<path d="M ${x} 109 V 160 H 815 V 135"/>`:`<path d="M ${x} 109 V ${id==='pc1'?175:191} H ${id==='pc1'?170:390} V 194"/>`;}).join('');
 const node=(id,x,y,photo,label)=>`<button type="button" class="club-node ${selected===id?'selected':''}" style="left:${x}%;top:${y/340*100}%" data-club-node="${id}" aria-label="${['pc1','pc2','ap'].includes(id)?'Prise RJ45 de '+names[id]:'Ouvrir '+names[id]}"><img src="${image(photo)}" alt="${esc(names[id])}" draggable="false"><strong>${esc(label)}</strong><small>${['pc1','pc2','ap'].includes(id)?s.ports[id]?'Port '+s.ports[id]:'RJ45 · non branché':clubWifi(s,id)?'CLUB-2AC · connecté':'Wi-Fi non connecté'}</small>${['pc1','pc2','ap'].includes(id)?'<i class="club-jack" aria-hidden="true"></i>':''}</button>`;
 return `<div class="club-step-tabs" role="tablist" aria-label="Étapes du réseau">${['Relier par câble','Ajouter le Wi-Fi','Échanger et imprimer'].map((title,i)=>`<button type="button" role="tab" aria-selected="${step===i+1}" data-club-step="${i+1}" class="${step===i+1?'active':''}"><b>${i+1}</b><span>${esc(title)}</span><small>${done[i]}/${[3,2,3][i]}</small></button>`).join('')}</div><div class="club-task"><span class="badge">${[3,2,3][step-1]} POINTS</span><p>${tr(...instructions[step-1])}</p></div><div class="club-legend"><span><i></i>Câble Ethernet</span><span><i class="wifi"></i>Connexion Wi-Fi</span><small>Réseau local · sans Internet</small></div><div class="club-board-scroll"><div class="club-board"><svg viewBox="0 0 1000 340" preserveAspectRatio="none" aria-hidden="true"><g class="club-wires">${wires}</g><g class="club-wireless">${clubWifi(s,'laptop')?'<path d="M 815 128 Q 744 156 660 234"/>':''}${clubWifi(s,'printer')?'<path d="M 840 128 Q 913 167 865 240"/>':''}</g></svg><div class="club-switch"><strong>Commutateur · switch</strong><img src="${image('switch')}" alt="Switch à huit prises RJ45"><div class="club-ports">${Array.from({length:8},(_,i)=>{const occupant=Object.keys(s.ports).find(id=>s.ports[id]===i+1);return `<button type="button" style="left:${15+i*10}%" class="club-port ${occupant?'occupied':''}" data-club-port="${i+1}" aria-label="Port ${i+1}${occupant?', occupé par '+names[occupant]:', libre'}" title="Port ${i+1}${occupant?' · '+names[occupant]:''}">${occupant?'<i></i>':''}</button>`;}).join('')}</div></div>${node('ap',82,15,'ap','Point d’accès Wi-Fi')}${node('pc1',17,190,'pc','PC-1 · texte')}${node('pc2',39,190,'pc','PC-2 · photos')}${node('laptop',66,190,'laptop','Portable · affiche')}${node('printer',87,190,'printer','Imprimante Wi-Fi')}${s.printed?'<div class="club-paper" aria-label="Affiche imprimée"><b>CLUB</b><span>INFORMATIQUE</span><i></i><small>Affiche imprimée</small></div>':''}</div></div><div class="club-actionbar"><p role="status">${esc(message||(step===1?(selected?'Clique sur un port libre pour '+names[selected]+'.':'Clique sur la prise d’un appareil, puis directement sur un port du switch.'):step===2?'Clique sur le portable ou l’imprimante pour ouvrir ses paramètres Wi-Fi.':'Ouvre l’Explorateur du portable pour récupérer les deux fichiers.'))}</p>${step===3?'<button type="button" class="btn dark small" data-club-explorer>▱ Ouvrir le portable</button>':`<button type="button" class="btn light small" data-club-step="${step+1}">Étape suivante →</button>`}</div>${panel?renderPanel(s):''}`;
}
function frame(title,body){return `<div class="club-modal-overlay"><section class="club-window" role="dialog" aria-modal="true" aria-label="${esc(title)}"><header><strong>${esc(title)}</strong><button type="button" data-club-close aria-label="Fermer la fenêtre">×</button></header>${body}<div class="club-window-status" role="status">${esc(message)}</div></section></div>`;}
function renderPanel(s){
 if(panel.kind==='wifi'){
  const {device}=panel,current=s.wifi[device];
  return frame('Wi-Fi — '+names[device],`<div class="club-wifi-body"><div class="club-wifi-title"><div><h3>Wi-Fi</h3><p>${current.enabled?'Activé':'Désactivé'}</p></div><button type="button" class="club-toggle ${current.enabled?'on':''}" data-club-wifi-power aria-label="${current.enabled?'Désactiver':'Activer'} le Wi-Fi"><i></i></button></div><p>Choisis le réseau du club.</p><div class="club-ssid-list">${[CLUB_SSID,'INVITES'].map(ssid=>`<button type="button" class="${ssidChoice===ssid?'selected':''}" data-club-ssid="${ssid}" ${!current.enabled?'disabled':''}><span>◉</span><strong>${ssid}</strong><small>${current.ssid===ssid&&current.enabled?'Connecté · réseau local':ssid==='INVITES'?'Autre réseau':'Réseau du club'}</small></button>`).join('')}</div><button type="button" class="btn dark wide" data-club-connect ${!current.enabled||!ssidChoice?'disabled':''}>Se connecter</button></div>`);
 }
 if(panel.kind==='explorer'){
  const folder=panel.folder||'network',source=['pc1','pc2'].includes(folder),file=source?CLUB_FILES[folder]:null,accessible=!source||clubReachable(s,folder);
  return frame('Explorateur de fichiers — Portable',`<nav class="club-explorer-toolbar"><button data-club-folder="network" type="button">Réseau</button><button data-club-folder="documents" type="button">Documents</button><span></span><button data-club-copy type="button" ${!source||!selectedFile||!accessible?'disabled':''}>Copier</button><button data-club-paste type="button" ${folder!=='documents'||!clipboard?'disabled':''}>Coller</button><button data-club-open type="button" ${selectedFile!=='affiche.pdf'?'disabled':''}>Ouvrir</button></nav><div class="club-path">▱ &nbsp; Portable › ${folder==='network'?'Réseau':folder==='documents'?'Documents':'Réseau › '+names[folder]+' › Partage'}</div><div class="club-file-area">${folder==='network'?['pc1','pc2'].map(id=>`<button type="button" class="club-file" data-club-folder="${id}" aria-label="Ouvrir ${names[id]} depuis le portable"><img src="${image('pc')}" alt=""><b>${names[id]}</b><small>Dossier partagé</small></button>`).join(''):source?(accessible?`<button type="button" class="club-file ${selectedFile===file?'selected':''}" data-club-file="${file}"><span class="club-file-icon">${folder==='pc1'?'TXT':'JPG'}</span><b>${file}</b></button>`:'<p class="club-file-error">Cet ordinateur n’est pas accessible. Vérifie les connexions du réseau.</p>'):`${['affiche.pdf',...Object.keys(s.files).filter(name=>s.files[name])].map(name=>`<button type="button" class="club-file ${selectedFile===name?'selected':''}" data-club-file="${name}"><span class="club-file-icon ${name.endsWith('.pdf')?'pdf':''}">${name.endsWith('.pdf')?'PDF':name.endsWith('.jpg')?'JPG':'TXT'}</span><b>${name}</b>${name==='affiche.pdf'?'<small>Affiche préparée</small>':'<small>Copié depuis le réseau</small>'}</button>`).join('')}`}</div><div class="club-explorer-tip">${source?'Sélectionne le fichier, clique sur Copier, ouvre Documents puis clique sur Coller.':folder==='documents'?'Les fichiers récupérés apparaissent ici. Sélectionne affiche.pdf puis clique sur Ouvrir.':'Ouvre PC-1 pour le texte ou PC-2 pour les photos.'}</div>`);
 }
 if(panel.kind==='preview')return frame('affiche.pdf — Portable',`<div class="club-preview-toolbar"><span>1 page · Affiche du club</span><button type="button" class="btn dark small" data-club-print-dialog>Imprimer</button></div><div class="club-preview"><article><small>COLLÈGE · 2AC</small><h2>CLUB<br>INFORMATIQUE</h2><img src="${image('pc')}" alt="Ordinateur du club"><p>Apprendre · Créer · Partager</p><div>${s.files['texte.txt']?'✓ texte.txt récupéré':'texte.txt à récupérer'}<br>${s.files['photos.jpg']?'✓ photos.jpg récupéré':'photos.jpg à récupérer'}</div></article></div>`);
 return frame('Imprimer — affiche.pdf',`<div class="club-print-body"><h3>Imprimer l’affiche</h3><label for="club-printer">Imprimante</label><select id="club-printer"><option value="">Choisir une imprimante…</option><option value="Imprimante Wi-Fi" ${printerChoice===CLUB_PRINTER?'selected':''}>${CLUB_PRINTER}</option><option ${printerChoice==='Microsoft Print to PDF'?'selected':''}>Microsoft Print to PDF</option></select><p class="club-printer-status">${clubWifi(s,'printer')?'● Imprimante Wi-Fi connectée à CLUB-2AC':'○ Imprimante Wi-Fi hors connexion'}</p><label>Copies <input type="number" value="1" min="1" max="1" readonly aria-label="Nombre de copies"></label><div class="club-print-summary">Document : <b>affiche.pdf</b><br>Format : A4 · 1 page</div><button type="button" class="btn dark wide" data-club-print ${!printerChoice?'disabled':''}>Imprimer</button></div>`);
}
function redraw(){api.redraw();}
function operation(o){if(!api.add(o))return false;return true;}
function copy(){if(panel?.kind!=='explorer'||!['pc1','pc2'].includes(panel.folder)||selectedFile!==CLUB_FILES[panel.folder])return;clipboard={source:panel.folder,file:selectedFile};message=selectedFile+' est dans le presse-papiers. Ouvre Documents puis clique sur Coller.';redraw();}
function paste(){if(panel?.kind!=='explorer'||panel.folder!=='documents'||!clipboard)return;operation({type:'club_copy',...clipboard,destination:'Portable/Documents'});const s=model();message=s.lastResult?.ok?clipboard.file+' a été copié dans Documents.':'Copie impossible. Vérifie les câbles et la connexion Wi-Fi du portable.';redraw();}
export function setupClubNetwork(callbacks){
 api=callbacks;
 document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||!api.active())return;
  if(b.dataset.clubStep){step=Number(b.dataset.clubStep);panel=null;selected='';message='';redraw();return;}
  if(b.hasAttribute('data-club-close')){panel=null;message='';redraw();return;}
  if(b.dataset.clubNode){const id=b.dataset.clubNode;
   if(['laptop','printer'].includes(id)&&step===2){panel={kind:'wifi',device:id};ssidChoice=model().wifi[id].ssid;message='';}
   else if(id==='laptop'&&step===3){panel={kind:'explorer',folder:'network'};selectedFile='';message='';}
   else if(step===1&&['pc1','pc2','ap'].includes(id)){selected=selected===id?'':id;message='';}
   else message=step===1?'Le portable et l’imprimante se connecteront sans câble.':step===2?'Ouvre les paramètres Wi-Fi du portable ou de l’imprimante.':'Ouvre le portable pour récupérer les fichiers.';
   redraw();return;
  }
  if(b.dataset.clubPort){const p=Number(b.dataset.clubPort),s=model(),occupant=Object.keys(s.ports).find(id=>s.ports[id]===p);
   if(occupant&&selected&&occupant!==selected){message='Ce port est occupé. Choisis un port libre.';}
   else if(occupant){operation({type:'club_disconnect',device:occupant});message='Câble de '+names[occupant]+' débranché.';}
   else if(selected){operation({type:'club_cable',device:selected,port:p});message=names[selected]+' branché sur le port '+p+'.';selected='';}
   else message='Clique d’abord sur la prise RJ45 de PC-1, de PC-2 ou du point d’accès.';
   redraw();return;
  }
  if(b.hasAttribute('data-club-wifi-power')){const {device}=panel,current=model().wifi[device];operation({type:'club_wifi',device,enabled:!current.enabled,ssid:''});ssidChoice='';message='';redraw();return;}
  if(b.dataset.clubSsid){ssidChoice=b.dataset.clubSsid;redraw();return;}
  if(b.hasAttribute('data-club-connect')){operation({type:'club_wifi',device:panel.device,enabled:true,ssid:ssidChoice});message=ssidChoice===CLUB_SSID?'Connexion à CLUB-2AC établie.':'Connexion à INVITES établie. Ce réseau est séparé du réseau du club.';redraw();return;}
  if(b.hasAttribute('data-club-explorer')){panel={kind:'explorer',folder:'network'};selectedFile='';message='';redraw();return;}
  if(b.dataset.clubFolder){panel={kind:'explorer',folder:b.dataset.clubFolder};selectedFile='';message='';redraw();return;}
  if(b.dataset.clubFile){selectedFile=b.dataset.clubFile;message='';redraw();return;}
  if(b.hasAttribute('data-club-copy')){copy();return;}
  if(b.hasAttribute('data-club-paste')){paste();return;}
  if(b.hasAttribute('data-club-open')){panel={kind:'preview'};message='';redraw();return;}
  if(b.hasAttribute('data-club-print-dialog')){panel={kind:'print'};printerChoice='';message='';redraw();return;}
  if(b.hasAttribute('data-club-print')){
   operation({type:'club_print',document:'affiche.pdf',printer:printerChoice});const s=model();
   if(s.lastResult?.ok){panel=null;message='L’affiche est imprimée. Les deux fichiers ont été récupérés sur le portable.';}
   else if(printerChoice!==CLUB_PRINTER)message='Pour obtenir une feuille, choisis l’imprimante Wi-Fi.';
   else if(!s.files['texte.txt']||!s.files['photos.jpg'])message='Récupère les deux fichiers du projet dans Documents avant de lancer l’impression.';
   else message='Impression impossible. Vérifie la connexion Wi-Fi du portable et de l’imprimante à CLUB-2AC.';
   redraw();
  }
 });
 document.addEventListener('change',e=>{if(e.target.id==='club-printer'&&api.active()){printerChoice=e.target.value;const submit=document.querySelector('[data-club-print]');if(submit)submit.disabled=!printerChoice;}});
 document.addEventListener('dblclick',e=>{if(!api.active()||!e.target.closest('[data-club-file="affiche.pdf"]'))return;panel={kind:'preview'};message='';redraw();});
 document.addEventListener('keydown',e=>{if(!api.active()||!panel)return;if(e.key==='Escape'){e.preventDefault();panel=null;redraw();}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='c'){e.preventDefault();copy();}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='v'){e.preventDefault();paste();}});
}
