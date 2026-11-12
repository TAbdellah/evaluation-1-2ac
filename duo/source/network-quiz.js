import {replayClubNetwork} from './network-state.js';
import {NETWORK_QUIZ_VERSION,networkQuestions,quizCableCount} from './network-quiz-state.js';
export {NETWORK_QUIZ_VERSION,quizCableCount};
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tr=(fr,ar)=>`<span${ar?` data-ar="${esc(ar)}" tabindex="0"`:''}>${esc(fr)}</span>`;
const image=name=>'./assets/net5-'+name+'.webp';
const names={pc1:'PC-1',pc2:'PC-2',ap:'Point d’accès'};
let api,selected='',message='';

export function renderQuizExercise(answers={}){
 const count=networkQuestions.filter(q=>answers[q.id]).length;
 return `<div class="question-card club-exercise club-simple"><h2>${tr('Branche le réseau, puis réponds aux questions','اربط الشبكة ثم أجب عن الأسئلة')}</h2><p class="instruction">${tr('Le club prépare une affiche : le texte est sur PC-1, les photos sur PC-2. Le portable assemble l’affiche. L’imprimante Wi-Fi imprime le résultat.','يحضّر النادي ملصقاً: النص في PC-1 والصور في PC-2. يجمع المحمول الملصق وتطبعه طابعة واي فاي.')}</p><section aria-labelledby="club-cables-title"><div class="club-section-heading"><h3 id="club-cables-title"><b>1</b>${tr('Branche les trois câbles','اربط الكابلات الثلاثة')}</h3><span class="badge">3 POINTS</span></div><p class="instruction">${tr('Clique sur PC-1, puis sur un port libre du switch. Fais la même chose pour PC-2 et le point d’accès.','انقر على PC-1 ثم على منفذ فارغ في المبدل. كرّر العملية مع PC-2 ونقطة الولوج.')}</p><div id="quiz-network">${renderQuizNetwork(answers.operations||[])}</div></section><section class="club-questions" aria-labelledby="club-qcu-title"><div class="club-section-heading"><h3 id="club-qcu-title"><b>2</b>${tr('Réponds aux cinq questions','أجب عن الأسئلة الخمسة')}</h3><span class="badge">5 POINTS</span></div><p class="instruction">${tr('Coche une seule réponse par question.','اختر جواباً واحداً لكل سؤال.')} <span id="club-qcu-count">${count}/5 réponse(s)</span></p>${networkQuestions.map((q,i)=>`<fieldset class="club-qcu"><legend><span class="club-qcu-number">${i+1}</span>${tr(q.label,q.ar)}<small>1 point</small></legend><div class="club-qcu-body"><img src="${image(q.image)}" alt="" aria-hidden="true"><div class="club-qcu-options">${q.options.map(([option,ar])=>`<label class="club-qcu-option${answers[q.id]===option?' chosen':''}"><input type="radio" name="${q.id}" data-answer="${q.id}" data-quiz-answer value="${esc(option)}"${answers[q.id]===option?' checked':''}>${tr(option,ar)}</label>`).join('')}</div></div></fieldset>`).join('')}</section></div>`;
}

export function renderQuizNetwork(operations=[]){
 const s=replayClubNetwork(operations),count=Object.keys(s.ports).length;
 const wires=Object.entries(s.ports).map(([id,p])=>{const x=352.5+(p-1)*35;return id==='ap'?`<path d="M ${x} 109 V 150 H 725 V 90 H 780"/>`:`<path d="M ${x} 109 V ${id==='pc1'?175:191} H ${id==='pc1'?170:390} V 194"/>`;}).join('');
 const node=(id,x,y,photo,label,cable)=>{
  const tag=cable?'button':'div',attrs=cable?`type="button" data-quiz-node="${id}" aria-label="Brancher ${names[id]}"`:'';
  return `<${tag} ${attrs} class="club-node${selected===id?' selected':''}${cable?'':' club-static-node'}" style="left:${x}%;top:${y/340*100}%"><img src="${image(photo)}" alt="${esc(label)}" draggable="false"><strong>${esc(label)}</strong><small>${cable?s.ports[id]?'Branché · port '+s.ports[id]:'À brancher':'Sans câble'}</small>${cable?'<i class="club-jack" aria-hidden="true"></i>':''}</${tag}>`;
 };
 return `<div class="club-legend"><span><i></i>Câble Ethernet</span><span><i class="wifi"></i>Connexion sans fil</span><small>Internet est coupé · aucune clé USB</small></div><div class="club-board-scroll"><div class="club-board"><svg viewBox="0 0 1000 340" preserveAspectRatio="none" aria-hidden="true"><g class="club-wires">${wires}</g><g class="club-wireless"><path d="M 780 100 Q 720 140 660 207"/><path d="M 865 100 Q 955 132 865 207"/></g></svg><div class="club-switch"><strong>Commutateur · switch</strong><img src="${image('switch')}" alt="Switch à huit ports RJ45"><div class="club-ports">${Array.from({length:8},(_,i)=>{const id=Object.keys(s.ports).find(id=>s.ports[id]===i+1);return `<button type="button" style="left:${15+i*10}%" class="club-port${id?' occupied':''}" data-quiz-port="${i+1}" aria-label="Port ${i+1}${id?', occupé par '+names[id]:', libre'}" title="Port ${i+1}${id?' · '+names[id]:''}">${id?'<i></i>':''}</button>`;}).join('')}</div></div>${node('ap',82,15,'ap','Point d’accès Wi-Fi',true)}${node('pc1',17,190,'pc','PC-1 · texte.txt',true)}${node('pc2',39,190,'pc','PC-2 · photos.jpg',true)}${node('laptop',66,190,'laptop','Portable · affiche',false)}${node('printer',87,190,'printer','Imprimante Wi-Fi',false)}</div></div><div class="club-actionbar"><p role="status">${esc(message||(count===3?'Les trois câbles sont branchés. Réponds maintenant aux questions ci-dessous.':selected?'Clique sur un port libre pour '+names[selected]+'.':'Clique sur un appareil, puis directement sur un port du switch.'))}</p><span class="club-cable-count">${count}/3 branchés</span><button type="button" class="btn light small" data-quiz-questions>Les questions ↓</button></div>`;
}

export function setupQuizNetwork(callbacks){
 api=callbacks;
 document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||!api.active())return;
  if(b.hasAttribute('data-quiz-questions')){document.getElementById('club-qcu-title')?.scrollIntoView({behavior:'smooth',block:'start'});return;}
  if(b.dataset.quizNode){selected=selected===b.dataset.quizNode?'':b.dataset.quizNode;message='';api.redraw();return;}
  if(!b.dataset.quizPort)return;
  const p=Number(b.dataset.quizPort),s=replayClubNetwork(api.operations()),occupant=Object.keys(s.ports).find(id=>s.ports[id]===p);
  if(occupant&&selected&&occupant!==selected)message='Ce port est occupé. Clique sur un port libre.';
  else if(occupant){if(api.add({type:'club_disconnect',device:occupant}))message='Câble de '+names[occupant]+' débranché.';}
  else if(selected){if(api.add({type:'club_cable',device:selected,port:p})){message=names[selected]+' branché sur le port '+p+'.';selected='';}}
  else message='Clique d’abord sur PC-1, PC-2 ou le point d’accès.';
  api.redraw();document.querySelector(`[data-quiz-port="${p}"]`)?.focus({preventScroll:true});
 });
 document.addEventListener('change',e=>{
  const input=e.target;if(!api.active()||!input.hasAttribute('data-quiz-answer'))return;
  const count=document.getElementById('club-qcu-count');if(count)count.textContent=networkQuestions.filter(q=>api.answers()[q.id]).length+'/5 réponse(s)';
  input.closest('fieldset').querySelectorAll('.club-qcu-option').forEach(label=>label.classList.toggle('chosen',label.querySelector('input').checked));
 });
}
