import {completionSchemas} from './completion-schema.js';
import {replayClubNetwork} from './network-state.js';

export function completion(exam, answers={}) {
  const exercises=(completionSchemas[answers._schema]||completionSchemas['duo-2ac-2026-11-v1'])[exam];
  const ops=answers.operations||[], club=replayClubNetwork(ops).attempted;
  const touched={
    p_folder:ops.some(o=>o.type==='create'),
    p_rename:ops.some(o=>o.type==='rename'&&o.file==='photo'),
    p_text:ops.some(o=>o.type==='move'&&o.file==='text'),
    p_photo:ops.some(o=>o.type==='move'&&o.file==='photo'),
    ...Object.fromEntries(['pc1','pc2','ap'].map(d=>['p_'+d,ops.some(o=>['cable','disconnect'].includes(o.type)&&o.device===d)])),
    p_wifi:ops.some(o=>o.type==='wifi'),p_ip:ops.some(o=>o.type==='ip'),
    p_cmd:ops.some(o=>o.type==='command'&&String(o.value).trim().toLowerCase()==='ipconfig'),
    p_ping:ops.some(o=>o.type==='command'&&String(o.value).trim().toLowerCase().startsWith('ping ')),
    p_send:ops.some(o=>o.type==='send'),
    ...Object.fromEntries(Object.entries({club_pc1:'pc1',club_pc2:'pc2',club_ap:'ap',club_laptop:'laptop',club_printer:'printer',club_text:'texte.txt',club_photo:'photos.jpg',club_print:'print'}).map(([k,v])=>[k,!!club[v]]))
  };
  const missing=[];let total=0;
  exercises.forEach((items,exercise)=>items.forEach(item=>{
    total++;
    if(item.practical?!touched[item.id]:!String(answers[item.id]??'').trim())missing.push({...item,exercise});
  }));
  return {total,answered:total-missing.length,missing};
}
