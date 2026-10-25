(function(root){
 'use strict';
 const number=v=>Number.isFinite(Number(v))?Number(v):0;
 const identityKey=r=>[r.class_name,r.group_name,(r.name_normalized||r.student_name||'').normalize('NFKC').trim().replace(/\s+/g,' ').toLocaleLowerCase('fr')].join('|');
 function learners(rows){
  const groups=new Map();for(const r of rows){const key=identityKey(r);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r)}
  return [...groups.values()].map(attempts=>{attempts.sort((a,b)=>Date.parse(b.started_at)-Date.parse(a.started_at)||String(b.id).localeCompare(String(a.id)));const final=attempts.find(r=>r.status==='submitted');return{...final||attempts[0],attempts,attemptCount:attempts.length,activeCount:attempts.filter(r=>r.status==='active').length,hasFinal:!!final}}).sort((a,b)=>a.student_name.localeCompare(b.student_name,'fr',{sensitivity:'base'}));
 }
 function summary(items){const finals=items.filter(r=>r.hasFinal);const scores=finals.map(r=>number(r.score));const sum=scores.reduce((a,b)=>a+b,0);const duration=finals.map(r=>Math.min(1200,Math.max(0,(Date.parse(r.submitted_at)-Date.parse(r.started_at))/1000)));
  return{students:items.length,submitted:finals.length,active:items.filter(r=>r.activeCount>0).length,copies:items.reduce((n,r)=>n+r.attemptCount,0),average:scores.length?sum/scores.length:null,min:scores.length?Math.min(...scores):null,max:scores.length?Math.max(...scores):null,passed:scores.filter(v=>v>=10).length,passRate:scores.length?scores.filter(v=>v>=10).length/scores.length*100:null,averageDuration:duration.length?duration.reduce((a,b)=>a+b,0)/duration.length:null};
 }
 function questionStats(items,rubric){const finals=items.filter(r=>r.hasFinal);const byQuestion=new Map();for(const[id,r]of Object.entries(rubric)){if(!byQuestion.has(r.question))byQuestion.set(r.question,{id:r.question,max:0,earned:0,answered:0,possible:0});const q=byQuestion.get(r.question);q.max+=number(r.max);q.possible+=number(r.max)*finals.length;for(const row of finals){q.earned+=number(row.breakdown?.[id]?.earned);if(row.breakdown?.[id]?.answered)q.answered++}}return [...byQuestion.values()].map(q=>({...q,rate:q.possible?q.earned/q.possible*100:null}));}
 const api={identityKey,learners,summary,questionStats};root.EvalStatistics=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
