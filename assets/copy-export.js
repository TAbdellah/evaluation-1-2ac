(function(root){
 'use strict';
 const encoder=new TextEncoder();
 const number=v=>Number(v).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2});
 function safePart(value,fallback='Sans_nom'){
  let s=String(value??'').normalize('NFC').replace(/[\u0000-\u001f\u007f<>:"/\\|?*\u202a-\u202e\u2066-\u2069]/g,'-').replace(/\s+/g,' ').trim().replace(/[. ]+$/g,'');
  while(encoder.encode(s).length>160)s=Array.from(s).slice(0,-1).join('');
  return s||fallback;
 }
 function filename(copy){return `${safePart(copy.student_name)}___${safePart(copy.class_name)}___${safePart(copy.group_name)}____${copy.status==='submitted'?number(copy.score):'en-cours'}.jpeg`}
 function selectCopies(rows,className='all'){
  return root.EvalStatistics.learners(rows.filter(r=>className==='all'||r.class_name===className)).filter(r=>r.hasFinal).sort((a,b)=>a.class_name.localeCompare(b.class_name,'fr',{numeric:true})||a.group_name.localeCompare(b.group_name,'fr',{numeric:true})||a.student_name.localeCompare(b.student_name,'fr'));
 }
 function assertActive(signal){if(signal?.aborted)throw new DOMException('Téléchargement annulé.','AbortError')}
 function lines(ctx,text,width){
  const result=[];
  for(const paragraph of String(text??'').split('\n')){
   let line='';
   for(const word of paragraph.split(/\s+/).filter(Boolean)){
    if(ctx.measureText(word).width>width){
     if(line){result.push(line);line=''}
     let piece='';for(const c of Array.from(word)){if(piece&&ctx.measureText(piece+c).width>width){result.push(piece);piece=''}piece+=c}line=piece;
    }else if(line&&ctx.measureText(line+' '+word).width>width){result.push(line);line=word}else line+=(line?' ':'')+word;
   }
   result.push(line);
  }
  return result.length?result:[''];
 }
 function drawLines(ctx,items,x,y,lineHeight,width,colour,weight=400,size=22){
  ctx.font=`${weight} ${size}px Manrope, NotoArabic, Arial, sans-serif`;ctx.fillStyle=colour;ctx.textBaseline='top';
  for(const item of items){const rtl=/[\u0600-\u06ff]/.test(item);ctx.direction=rtl?'rtl':'ltr';ctx.textAlign=rtl?'right':'left';ctx.fillText(item,rtl?x+width:x,y);y+=lineHeight}
  ctx.direction='ltr';ctx.textAlign='left';return y;
 }
 const stamp=s=>s?new Intl.DateTimeFormat('fr-MA',{dateStyle:'short',timeStyle:'medium',timeZone:'Africa/Casablanca'}).format(new Date(s)):'—';
 async function jpeg(copy,rubric,{signal}={}){
  assertActive(signal);
  if(copy.status!=='submitted')throw new Error('La copie JPEG sera disponible après la remise de cette tentative.');
  if(!Object.keys(rubric).length)throw new Error('Le corrigé n’est pas encore chargé. Actualisez le tableau.');
  if(document.fonts)await Promise.all([document.fonts.load('600 30px Manrope'),document.fonts.load('400 30px NotoArabic')]);
  assertActive(signal);
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
  if(!ctx)throw new Error('Votre navigateur ne permet pas de créer cette image.');
  const width=1600,margin=64,tableWidth=width-2*margin,colWidths=[426,410,486,150],lineHeight=31;
  ctx.font='400 22px Manrope, NotoArabic, Arial, sans-serif';
  const rows=Object.entries(rubric).map(([id,r])=>{
   const b=copy.breakdown?.[id];
   const text=[r.label,String(copy.answers?.[id]??'').trim()||'Sans réponse',String(r.expected??'—'),`${number(b?.earned||0)} / ${number(r.max)}`];
   const cells=text.map((s,i)=>lines(ctx,s,colWidths[i]-32));
   return {cells,height:Math.max(64,...cells.map(c=>c.length*lineHeight+30)),correct:!!b?.correct};
  });
  ctx.font='700 38px Manrope, NotoArabic, Arial, sans-serif';
  const nameLines=lines(ctx,copy.student_name,1070);
  const headerHeight=180+nameLines.length*52,tableTop=headerHeight+145;
  const height=tableTop+60+rows.reduce((sum,r)=>sum+r.height,0)+150;
  if(height>30000)throw new Error('Cette copie est trop longue pour une seule image.');
  canvas.width=width;canvas.height=height;
  try{
   ctx.fillStyle='#ffffff';ctx.fillRect(0,0,width,height);
   ctx.fillStyle='#173f35';ctx.fillRect(0,0,width,headerHeight);
   drawLines(ctx,['LAB 2AC  /  ÉVALUATION 01'],margin,40,30,1150,'#d9efb3',700,23);
   drawLines(ctx,nameLines,margin,95,52,1070,'#ffffff',700,38);
   drawLines(ctx,[`Classe ${copy.class_name}     ·     Groupe ${copy.group_name}`],margin,headerHeight-53,32,1120,'#dce9e1',500,24);
   ctx.fillStyle='#d9efb3';ctx.fillRect(1230,80,306,112);
   drawLines(ctx,[`${number(copy.score)} / 20`],1255,105,50,255,'#173f35',800,42);
   drawLines(ctx,['INFORMATION ET MATÉRIEL  ·  SÉANCES 1 ET 2'],margin,headerHeight+28,30,tableWidth,'#173f35',700,23);
   drawLines(ctx,[`Début : ${stamp(copy.started_at)}     ·     Remise : ${stamp(copy.submitted_at)}`],margin,headerHeight+70,29,tableWidth,'#66766e',400,20);
   drawLines(ctx,[copy.reason==='timeout'?'Copie clôturée à la fin des 20 minutes.':'Copie rendue par l’élève.'],margin,headerHeight+104,28,tableWidth,'#66766e',400,20);
   ctx.fillStyle='#eaf0e4';ctx.fillRect(margin,tableTop,tableWidth,60);
   let x=margin;
   ['QUESTION','RÉPONSE DE L’ÉLÈVE','RÉPONSE ATTENDUE','POINTS'].forEach((title,i)=>{drawLines(ctx,[title],x+16,tableTop+20,25,colWidths[i]-32,'#173f35',700,18);x+=colWidths[i]});
   let y=tableTop+60;
   rows.forEach((row,index)=>{
    ctx.fillStyle=index%2?'#f7f9f4':'#ffffff';ctx.fillRect(margin,y,tableWidth,row.height);
    ctx.fillStyle=row.correct?'#8ca665':'#d7a88a';ctx.fillRect(margin,y,5,row.height);
    let cx=margin;
    row.cells.forEach((cell,i)=>{drawLines(ctx,cell,cx+16,y+15,lineHeight,colWidths[i]-32,i===2?'#517246':'#243e34',i===3?600:400,22);cx+=colWidths[i]});
    y+=row.height;ctx.strokeStyle='#dde4d8';ctx.beginPath();ctx.moveTo(margin,y);ctx.lineTo(width-margin,y);ctx.stroke();
   });
   drawLines(ctx,['LAB 2AC · Abdellah TAHTOH · Copie et correction'],margin,y+32,27,tableWidth,'#66766e',600,20);
   drawLines(ctx,[`Référence : ${copy.id}`],margin,y+73,25,tableWidth,'#66766e',400,18);
   assertActive(signal);
   const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?.type==='image/jpeg'?resolve(b):reject(new Error('La génération JPEG a échoué.')),'image/jpeg',.9));
   assertActive(signal);return{blob,name:filename(copy),width,height};
  }finally{canvas.width=1;canvas.height=1}
 }
 const crcTable=Uint32Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0});
 function crc32(bytes){let n=0xffffffff;for(const b of bytes)n=crcTable[(n^b)&255]^(n>>>8);return(n^0xffffffff)>>>0}
 function header(length){const bytes=new Uint8Array(length);return{bytes,view:new DataView(bytes.buffer)}}
 class ZipWriter{
  constructor(){this.parts=[];this.central=[];this.offset=0;this.count=0;this.names=new Set()}
  async add(path,blob,date=new Date()){
   const base=path;let suffix=1;while(this.names.has(path.normalize('NFC').toLocaleLowerCase('fr')))path=base.replace(/(\.[^./]+)?$/,(_,ext)=>`__${++suffix}${ext||''}`);
   const name=encoder.encode(path);if(name.length>65535||this.count>=65535||this.offset+blob.size+name.length+30>=0xffffffff)throw new Error('Archive trop volumineuse. Téléchargez les classes séparément.');
   const bytes=new Uint8Array(await blob.arrayBuffer()),crc=crc32(bytes);
   if(!Number.isFinite(date.getTime()))date=new Date();const year=Math.max(1980,Math.min(2107,date.getFullYear()));
   const dosDate=((year-1980)<<9)|((date.getMonth()+1)<<5)|date.getDate(),dosTime=(date.getHours()<<11)|(date.getMinutes()<<5)|Math.floor(date.getSeconds()/2);
   const local=header(30),lv=local.view;lv.setUint32(0,0x04034b50,true);lv.setUint16(4,20,true);lv.setUint16(6,0x0800,true);lv.setUint16(10,dosTime,true);lv.setUint16(12,dosDate,true);lv.setUint32(14,crc,true);lv.setUint32(18,bytes.length,true);lv.setUint32(22,bytes.length,true);lv.setUint16(26,name.length,true);
   const centre=header(46),cv=centre.view;cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);cv.setUint16(8,0x0800,true);cv.setUint16(12,dosTime,true);cv.setUint16(14,dosDate,true);cv.setUint32(16,crc,true);cv.setUint32(20,bytes.length,true);cv.setUint32(24,bytes.length,true);cv.setUint16(28,name.length,true);cv.setUint32(42,this.offset,true);
   this.parts.push(local.bytes,name,blob);this.central.push(centre.bytes,name);this.offset+=30+name.length+bytes.length;this.count++;this.names.add(path.normalize('NFC').toLocaleLowerCase('fr'));return path;
  }
  finish(){
   const length=this.central.reduce((n,b)=>n+b.length,0);if(this.offset+length+22>=0xffffffff)throw new Error('Archive trop volumineuse. Téléchargez les classes séparément.');
   const end=header(22),v=end.view;v.setUint32(0,0x06054b50,true);v.setUint16(8,this.count,true);v.setUint16(10,this.count,true);v.setUint32(12,length,true);v.setUint32(16,this.offset,true);
   return new Blob([...this.parts,...this.central,end.bytes],{type:'application/zip'});
  }
 }
 async function zip(copies,rubric,{allClasses=false,signal,onProgress=()=>{}}={}){
  if(!copies.length)throw new Error('Aucune copie rendue n’est disponible pour ce téléchargement.');
  const writer=new ZipWriter();let done=0;
  for(const copy of copies){assertActive(signal);onProgress(done,copies.length,copy.student_name);await new Promise(resolve=>setTimeout(resolve,0));const file=await jpeg(copy,rubric,{signal});assertActive(signal);await writer.add((allClasses?'Classe_'+safePart(copy.class_name)+'/':'')+file.name,file.blob,new Date(copy.submitted_at));onProgress(++done,copies.length,copy.student_name)}
  assertActive(signal);return writer.finish();
 }
 root.EvalCopyExport=Object.freeze({safePart,filename,selectCopies,jpeg,zip,ZipWriter,crc32});
})(typeof window!=='undefined'?window:globalThis);
